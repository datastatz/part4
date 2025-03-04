const express = require('express');
const Blog = require('../models/blog'); // Import model

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// POST a new blog
router.post('/', async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body;

        // Ensure title and url are required
        if (!title || !url) {
            return res.status(400).json({ error: 'Title and URL are required' });
        }

        // Ensure `likes` defaults to 0 if not provided
        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
        });

        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        next(error); // Pass error to Express middleware
    }
});

module.exports = router;
