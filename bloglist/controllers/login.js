const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // Find the user in the database
  const user = await User.findOne({ username })
  if (!user) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  // Verify password
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  // Create a token payload
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // Generate a JWT token (expires in 1 hour)
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  response.status(200).json({
    token,
    username: user.username,
    name: user.name,
  })
})

module.exports = loginRouter
