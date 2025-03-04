const express = require('express');
const mongoose = require('mongoose'); // ✅ Import mongoose
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

// DELETE a blog by ID
router.delete('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }

        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(204).end(); // No Content (successful deletion)
    } catch (error) {
        next(error);
    }
});

// UPDATE a blog by ID
router.put('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid blog ID format' });
        }

        const { likes } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { likes },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
