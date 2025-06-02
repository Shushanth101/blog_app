const {Router} = require("express")
const User = require('../models/user')
const router = Router();
const { createTokenForUser } = require('../services/authentication')


router.post('/signin', async (req, res) => {
  const { email, password } = req.body; 

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.json({ token });
  } catch (error) {
    return res.status(401).json({ error: "Incorrect Email or Password" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }


    // Create and save the user
    const newUser = new User({ fullName, email, password });
    await newUser.save();

    // Create token
    const token = createTokenForUser(newUser);
    console.log(token)

    return res.status(201).json({ token });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports=router
