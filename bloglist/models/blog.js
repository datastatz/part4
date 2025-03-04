const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

// Modify `toJSON` to rename `_id` to `id` and remove `__v`
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convert `_id` to string
    delete returnedObject._id; // Remove `_id`
    delete returnedObject.__v; // Remove `__v` (Mongo version key)
  }
});

module.exports = mongoose.model('Blog', blogSchema);
