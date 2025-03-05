const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose'); //  Import mongoose
const Blog = require('../models/blog'); // Import model
const User = require('../models/user'); // Import User model


const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// POST a new blog
router.post('/', async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Token missing' }) // Ensure tokenExtractor is working
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
      user: user._id, // Assign blog to authenticated user
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

 

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
