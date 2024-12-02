const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch((err) => {
  console.error('MongoDB connection failed: ', err);
});

// Blog model
const Post = mongoose.model('Post', new mongoose.Schema({
  title: String,
  content: String
}));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Fitness Dashboard');
});

// Blogs route
app.get('/blogs', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts }); // Render index.ejs with posts data
  } catch (error) {
    res.status(500).send('Error fetching posts: ' + error);
  }
});

// Create a new blog post (for testing)
app.post('/add-post', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  try {
    await newPost.save();
    res.redirect('/blogs');
  } catch (error) {
    res.status(500).send('Error adding post: ' + error);
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
