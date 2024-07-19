const _ = require("lodash");

const dummy = blogs => {
  return blogs ? 1 : 0;
};

const totalLikes = blogs => {
  return blogs ? blogs.reduce((acc, curr) => (acc += curr.likes), 0) : 0;
};

const favouriteBlog = blogs => {
  if (!blogs) return null;

  let fav = blogs[0];
  blogs.forEach(blog => {
    if (blog.likes > fav.likes) fav = blog;
  });

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  };
};

const mostBlogs = blogs => {
  if (!blogs) return null;

  const authorCount = _.countBy(blogs, "author");
  const authorsArray = _.keys(authorCount);
  const maxAuthor = _.maxBy(authorsArray, author => authorCount[author]);

  return {
    author: maxAuthor,
    blogs: authorCount[maxAuthor],
  };
};

const mostLikes = blogs => {
  if (!blogs) return null;

  const maxLikesAuthorsObj = _.groupBy(blogs, "author");
  const maxLikesAuthor = _.mapValues(maxLikesAuthorsObj, a => _.sumBy(a, "likes"));
  const author = _.maxBy(_.keys(maxLikesAuthor), a => maxLikesAuthor[a]);

  return {
    author,
    likes: maxLikesAuthor[author],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
