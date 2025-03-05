const express = require('express')
const User = require('../models/user')

const usersRouter = express.Router()

// GET all users, including their blogs
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  res.json(users)
})

module.exports = usersRouter
