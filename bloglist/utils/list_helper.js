const dummy = (blogs) => {
    return 1; // Always returns 1
  };

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0) // Sums all likes
};
  
  module.exports = {
    dummy,
    totalLikes,
  };
  