const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const tempUserToAssignTheBlogTo = (await User.find({}))[0];
  blog.user = tempUserToAssignTheBlogTo.id;

  const savedBlog = await blog.save();
  tempUserToAssignTheBlogTo.blogs = tempUserToAssignTheBlogTo.blogs.concat(savedBlog._id);
  tempUserToAssignTheBlogTo.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(400).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const newBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
