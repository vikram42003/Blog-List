const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.token) {
    let error = new Error("json web token is missing");
    error.name = "MissingToken";
    throw error;
  }

  const blog = new Blog(request.body);

  const decodedToken = jwt.verify(request.body.token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  blog.user = user.id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.body.token) {
    let error = new Error("json web token is missing");
    error.name = "MissingToken";
    throw error;
  }

  const decodedToken = jwt.verify(request.body.token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(200).end();
  } else {
    let error = new Error("a blog can only be deleted by its author");
    error.name = "NotAuthorized";
    throw error;
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const newBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
