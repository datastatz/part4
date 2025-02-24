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

  
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null; // Edge case: no blogs

  const authorCounts = {}; // Object to store author counts

  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1;
  });

  // Find the author with the max blogs
  const topAuthor = Object.keys(authorCounts).reduce((max, author) =>
    authorCounts[author] > authorCounts[max] ? author : max
  );

  return { author: topAuthor, blogs: authorCounts[topAuthor] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null; // Edge case: no blogs

  const authorLikes = {}; // Object to store likes per author

  blogs.forEach((blog) => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes;
  });

  // Find the author with the max likes
  const topAuthor = Object.keys(authorLikes).reduce((max, author) =>
    authorLikes[author] > authorLikes[max] ? author : max
  );

  return { author: topAuthor, likes: authorLikes[topAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes, //
};
