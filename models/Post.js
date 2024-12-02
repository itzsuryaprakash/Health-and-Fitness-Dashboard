const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },  // title is required
  content: { type: String, required: true },  // content is required
  date: { type: Date, default: Date.now }  // default to the current date
});

// Create and export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
