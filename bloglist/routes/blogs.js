const express = require('express');
const Blog = require('../models/blog'); // Import model

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// POST a new blog
router.post('/', async (req, res) => {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
});

module.exports = router;
