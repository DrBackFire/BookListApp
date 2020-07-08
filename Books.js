const express = require('express');
const router = express.Router();
const Book = require('./models/Model');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
  });

  try {
    await newBook.save();
    res.redirect('/');
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
