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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
