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
