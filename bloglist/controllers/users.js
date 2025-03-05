const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');

const usersRouter = express.Router();

// Fetch all users
usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    res.json(users);
});

usersRouter.post('/', async (request, response, next) => {
    try {
      const { username, name, password } = request.body
  
      // Check if username and password are provided
      if (!username || !password) {
        return response.status(400).json({ error: 'Username and password are required' })
      }
  
      // Check if username and password are at least 3 characters long
      if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'Username and password must be at least 3 characters long' })
      }
  
      // Check if username is unique
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return response.status(400).json({ error: 'Username must be unique' })
      }
  
      // Hash the password before saving it
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
  
      const user = new User({
        username,
        name,
        passwordHash,
      })
  
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    } catch (error) {
      next(error) // Pass any errors to the error handler middleware
    }
  })
  
  usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
  })
  
  module.exports = usersRouter