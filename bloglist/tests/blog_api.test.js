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

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await Blog.find({});
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

      const contents = blogsAtEnd.map(blog => blog.title);
      expect(contents).not.toContain(blogToDelete.title);
  });

  test('fails with status code 404 if blog does not exist', async () => {
      const nonExistingId = await new Blog({ title: 'Temp', url: 'https://temp.com' }).save();
      const id = nonExistingId._id.toString();
      await Blog.findByIdAndDelete(id); // Delete from DB first

      await api.delete(`/api/blogs/${id}`).expect(404);
  });

  test('fails with status code 400 for invalid ID', async () => {
      await api.delete('/api/blogs/invalidid').expect(400);
  });
});


describe('updating a blog', () => {
  test('succeeds in updating likes of a blog', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToUpdate = blogsAtStart[0];

      const updatedLikes = { likes: blogToUpdate.likes + 10 };

      const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedLikes)
          .expect(200)
          .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toBe(blogToUpdate.likes + 10);
  });

  test('fails with status code 404 if blog does not exist', async () => {
      const nonExistingId = await new Blog({ title: 'Temp', url: 'https://temp.com' }).save();
      const id = nonExistingId._id.toString();
      await Blog.findByIdAndDelete(id); // Delete it before updating

      await api.put(`/api/blogs/${id}`).send({ likes: 10 }).expect(404);
  });

  test('fails with status code 400 for invalid ID', async () => {
      await api.put('/api/blogs/invalidid').send({ likes: 10 }).expect(400);
  });
});
