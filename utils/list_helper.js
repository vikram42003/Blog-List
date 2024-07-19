const dummy = blogs => {
  return blogs ? 1 : 0;
};

const totalLikes = blogs => {
  return blogs ? blogs.reduce((acc, curr) => (acc += curr.likes), 0) : 0;
};

module.exports = {
  dummy,
  totalLikes,
};
