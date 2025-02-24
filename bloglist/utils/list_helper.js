const dummy = (blogs) => {
    return 1; // Always returns 1
  };

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0) // Sums all likes
};
  
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null; // Edge case: no blogs

  const mostLikedBlog = blogs.reduce((maxBlog, blog) =>
    blog.likes > (maxBlog.likes || 0) ? blog : maxBlog
  , blogs[0]); // Start with the first blog

  // ✅ Return only the required properties
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes,
  };
};


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
  };
  