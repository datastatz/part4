const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');

const usersRouter = express.Router();

// Fetch all users
usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    res.json(users);
});

// Create a new user
usersRouter.post('/', async (req, res) => {
    try {
        const { username, name, password } = req.body;

        // Validate username & password length
        if (!username || !password || username.length < 3 || password.length < 3) {
            return res.status(400).json({ error: 'Username and password must be at least 3 characters long' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({ username, name, passwordHash });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = usersRouter;
