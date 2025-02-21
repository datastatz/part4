const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})


// Modify how the document is converted to JSON
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // Convert _id to a string and rename it to id
      returnedObject.id = returnedObject._id.toString()
      // Remove _id and __v from the output
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = `mongodb+srv://amellouk600:${process.env.MONGO_PASSWORD}@cluster0.yq3oa.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})