const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Array to store posts in memory
let posts = [];

// Routes
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// CREATE POST
app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { title, content } = req.body;
  posts.push({ title, content });
  res.redirect('/');
});

// EDIT POST
app.get('/edit/:id', (req, res) => {
  const postIndex = Number(req.params.id);  // Convert to number
  const post = posts[postIndex];
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit', { post, postIndex });
});

app.post('/edit/:id', (req, res) => {
  const postIndex = Number(req.params.id);  // Convert to number
  const post = posts[postIndex];
  if (!post) {
    return res.status(404).send('Post not found');
  }
  posts[postIndex] = { title: req.body.title, content: req.body.content };
  res.redirect('/');
});

// DELETE POST
app.post('/delete/:id', (req, res) => {
  const postIndex = Number(req.params.id);  // Convert to number
  if (postIndex >= 0 && postIndex < posts.length) {
    posts.splice(postIndex, 1);
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
