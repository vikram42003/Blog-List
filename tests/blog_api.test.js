const { it, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const test_helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogPromises = test_helper.blogs.map(blog => {
    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
    });
    return newBlog.save();
  });

  await Promise.all(blogPromises);
});

describe("GET requests to 'api/blogs'", () => {
  it.only("should return blogs as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it.only("should return all blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.equal(response.body.length, test_helper.blogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
