const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index') // Import the Express app
const Blog = require('../models/blog') // Import the Blog model

const api = supertest(app) // Wrap the app with supertest

// Sample blog data for testing
const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'https://example.com/first',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Jane Doe',
    url: 'https://example.com/second',
    likes: 10,
  }
]

// Before each test, we reset the database and add test blogs
beforeEach(async () => {
  await Blog.deleteMany({}) // Clear database
  await Blog.insertMany(initialBlogs) // Insert test blogs
})

// Test: Check if blogs are returned as JSON and contain the correct amount
test('blogs are returned as JSON and contain the correct amount', async () => {
  const response = await api
    .get('/api/blogs') // Make GET request
    .expect(200) // Expect HTTP 200 status
    .expect('Content-Type', /application\/json/) // Expect JSON response

  expect(response.body).toHaveLength(initialBlogs.length) // Check correct count
})

// After all tests, close the database connection
afterAll(async () => {
  await mongoose.connection.close()
})

test('blogs have an id field instead of _id', async () => {
  const response = await api.get('/api/blogs'); // Fetch all blogs
  
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined();  // Ensure `id` exists
    expect(blog._id).toBeUndefined(); // Ensure `_id` is removed
  });
});


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Test Author',
    url: 'https://example.com/new',
    likes: 7,
  };

  // Send POST request to create new blog
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201) // Expect HTTP 201 Created
    .expect('Content-Type', /application\/json/); // Expect JSON response

  // Fetch all blogs after posting
  const response = await api.get('/api/blogs');
  const contents = response.body.map(blog => blog.title);

  // Verify blog count increased by 1
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  // Verify new blog is saved
  expect(contents).toContain('New Blog Post');
});


test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
      title: 'No Likes Blog',
      author: 'Author Zero',
      url: 'https://example.com/nolikes',
  };

  const response = await api.post('/api/blogs').send(newBlog).expect(201);
  
  // Ensure likes is 0 when not provided
  expect(response.body.likes).toBe(0);
});

test('blog without title is not added', async () => {
  const newBlog = {
      author: 'No Title Author',
      url: 'https://example.com/notitle',
      likes: 3,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('blog without url is not added', async () => {
  const newBlog = {
      title: 'No URL Blog',
      author: 'No URL Author',
      likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});