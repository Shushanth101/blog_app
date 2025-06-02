const {Router} = require("express")
const router = Router();
const multer = require('multer')
const Blog = require('../models/blog')
const requireUser = require('../middlewares/requireUser')
const path = require('path');
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`../server/assets/`));
    },
    filename:function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }
})

const upload = multer({storage:storage});


router.post(
  "/",
  requireUser,
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const { title, body } = req.body;

      if (!title || !body || !req.file) {
        return res.status(400).json({ error: "Title, body, and image are required." });
      }

      const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `http://localhost:9000/assets/${req.file.filename}` 
      });

      return res.status(201).json({ blogId: blog._id });
    } catch (error) {
      console.error("Blog creation error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);


router.post('/comment/:blogId', async (req, res) => {
  try {
    const { content, createdBy } = req.body;
    const { blogId } = req.params;

    if (!content || !createdBy) {
      return res.status(400).json({ error: "Missing content or createdBy in request body" });
    }

    const comment = await Comment.create({
      content,
      blogId,
      createdBy
    });

    return res.status(201).json({
      message: "Comment created successfully",
      comment
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/:id',async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId).populate("createdBy");
    const comments = await Comment.find({blogId:blogId}).populate("createdBy")

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    console.log("sent successfully")
    return res.status(200).json({blog:blog,comments:comments});
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
})


module.exports=router
