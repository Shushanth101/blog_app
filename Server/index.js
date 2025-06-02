const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const cors = require('cors');
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const {validateToken} = require('./services/authentication')
const path = require('path')

const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(()=>console.log("mongo connected"))

app.use(cors());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());

app.use("/assets",express.static(path.join(__dirname, '/assets')))

app.use("/user",userRouter)

app.use("/blog",blogRouter);

app.post("/validate/token", (req, res) => {
  const { token } = req.body;

  try {
    const user = validateToken(token); 
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});


app.get("/all-posts", async (req, res) => {
  try {
    const blogPosts = await Blog.find({});
    return res.json({ blogPosts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(9000,()=>console.log("server running on port 9000"))