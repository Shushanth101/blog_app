const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust path as needed

const secret ="secret@1234"

const requireUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret); 
    const user = await User.findById(decoded._id).select("-password"); 

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = requireUser;
