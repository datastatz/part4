const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../index')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({}) // Clear DB before each test

  const passwordHash = await bcrypt.hash('securepassword', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('creating a user with valid username and password succeeds', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})

test('creating a user with a duplicate username fails', async () => {
  const newUser = {
    username: 'root',
    name: 'Duplicate User',
    password: 'password123',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Username must be unique')
})

test('creating a user with a short username fails', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'password123',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Username and password must be at least 3 characters long')
})

test('creating a user with a short password fails', async () => {
  const newUser = {
    username: 'validUser',
    name: 'Short Password',
    password: '12',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Username and password must be at least 3 characters long')
})

afterAll(async () => {
  await mongoose.connection.close()
})
