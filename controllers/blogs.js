const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require("../utils/userExtractor");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;

  blog.user = user.id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    let error = new Error(`the blog with id - ${request.params.id} was not found on the server`);
    error.name = "MissingData";
    throw error;
  }

  //Legacy Support
  //allow blogs which dont have an assigned user to be deleted
  if (!blog.user) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(200).end();
    return;
  }

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    await User.findByIdAndUpdate(user.id, { $pull: { blogs: blog.id } }, { new: true });
    response.status(200).end();
  } else {
    let error = new Error("a blog can only be deleted by its author");
    error.name = "NotAuthorized";
    throw error;
  }
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const newBlog = request.body;
  newBlog.user = newBlog.user.id;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
