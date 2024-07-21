const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const test_helper = require("./test_helper");

describe("most likes", () => {
  test("when list has no blogs, returns null", () => {
    assert.deepStrictEqual(listHelper.mostLikes(), null);
  });

  test("when list has one blog, author with most likes is the only author in the list with that blog's likes", () => {
    assert.deepStrictEqual(listHelper.mostLikes(test_helper.listWithOneBlog), {
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has many blogs, author with most likes is returned", () => {
    assert.deepStrictEqual(listHelper.mostLikes(test_helper.blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
