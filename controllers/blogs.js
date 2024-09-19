const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require("../utils/userExtractor");

// GET - "/api/blogs/" - get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

// POST - "/api/blogs/" - create a new blog
blogsRouter.post("/", userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;

  blog.user = user.id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  user.save();

  response.status(201).json(savedBlog);
});

// POST - "/api/blogs/:id/comments" - add a comment to the blog
blogsRouter.post("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!request.body.comment) {
    let error = new Error("cannot add an empty comment");
    error.name = "MissingData";
    throw error;
  }
  if (!blog) {
    let error = new Error(`the blog with id - ${request.params.id} was not found on the server`);
    error.name = "MissingData";
    throw error;
  }

  blog.comments = blog.comments.concat(request.body.comment);

  await blog.save();

  response.status(201).json(request.body.comment);
});

// DELETE - "/api/blogs/:id" - delete the blog
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

// PUT - "/api/blogs/:id" - update likes on the blog
blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const newBlog = request.body;
  newBlog.user = newBlog.user ? newBlog.user.id : null;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
