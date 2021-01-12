var express = require('express');
const Book = require('../models/book')
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
  } catch (error) {
    console.log(error)
    books = []
  }

  res.render('index', { title: 'Express', books: books });
});

module.exports = router;
