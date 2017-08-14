
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('sampleTitle1', 'sampleContent1', 'sampleAuthor1', 'publishDatedate');
BlogPosts.create('sampleTitle2', 'sampleContent2', 'sampleAuthor2', 'publishDatedate');
BlogPosts.create('sampleTitle3', 'sampleContent3', 'sampleAuthor3', 'publishDatedate');

app.get('/blog-post', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-post', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'date'];
  for (let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

app.put('/blog-post/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'date', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: req.body.date
  });
  res.status(204).end();
});

app.delete('/blog-post/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog-post item \`${req.params.id}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
