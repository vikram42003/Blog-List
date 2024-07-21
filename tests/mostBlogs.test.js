const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const test_helper = require("./test_helper");

describe("favourite blog", () => {
  test("when list has no blogs, returns null", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(), null);
  });

  test("when list has one blog, author with most blogs is the only author in the list", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(test_helper.listWithOneBlog), {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list has many blogs, author with most blogs is returned", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(test_helper.blogs), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
