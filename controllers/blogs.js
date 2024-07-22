const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/api/blogs", async (request, response) => {
  const blog = new Blog(request.body);

  await blog.save();
  response.status(201).json(blog);
});

blogsRouter.delete("/api/blogs/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(400).end();
});

blogsRouter.put("/api/blogs/:id", async (request, response) => {
  const newBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
