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

describe("in the returned blogs properties", () => {
  it.only("the '_id' property is not present", async () => {
    const response = (await api.get("/api/blogs")).body;

    assert(!Object.hasOwn(response[0], "_id"));
  });

  it.only("the 'id' property is present", async () => {
    const response = (await api.get("/api/blogs")).body;

    assert(Object.hasOwn(response[0], "id"));
  });
});

describe("POST requests to api/blogs", async () => {
  const newBlog = {
    title: "test blog",
    author: "me",
    url: "blog.com i guess",
    likes: 9999,
  };

  it.only("a new blog is created", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await test_helper.blogsInDb();

    assert.strictEqual(blogs.length, test_helper.blogs.length + 1);
  });

  it.only("contents of the new blog are correct", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await test_helper.blogsInDb();

    const isBlogPresent = blogs.some(blog => {
      if (
        blog.title === newBlog.title &&
        blog.author === newBlog.author &&
        blog.url === newBlog.url &&
        blog.likes === newBlog.likes
      ) {
        return true;
      } else {
        return false;
      }
    });

    assert(isBlogPresent);
  });
});

after(async () => {
  await mongoose.connection.close();
});
