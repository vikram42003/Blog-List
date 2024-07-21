const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const test_helper = require("./test_helper");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(test_helper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has no blogs, equals 0 likes", () => {
    const result = listHelper.totalLikes();
    assert.strictEqual(result, 0);
  });

  test("when list has many blogs, equals the likes of that", () => {
    const result = listHelper.totalLikes(test_helper.blogs);
    assert.strictEqual(result, 36);
  });
});
