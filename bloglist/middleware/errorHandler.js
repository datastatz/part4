const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      return response.status(400).json({ error: 'Username must be unique' })
    }
  
    next(error)
  }
  
  module.exports = errorHandler
  