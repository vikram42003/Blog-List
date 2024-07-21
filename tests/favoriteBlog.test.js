const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const test_helper = require("./test_helper");

describe("favourite blog", () => {
  test("when list has no blogs, returns null", () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(), null);
  });

  test("when list has one blog, favourite blog is the only blog in the list", () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(test_helper.listWithOneBlog), {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has many blogs, favourite blog is the blog with most likes", () => {
    assert.deepStrictEqual(listHelper.favouriteBlog(test_helper.blogs), {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
