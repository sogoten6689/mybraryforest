var express = require('express');
const Author = require('../models/author');
var router = express.Router();
const Book = require('../models/book');
const fs = require('fs')
const path = require('path');
// const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'images/gif']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })
 


// GET all books Route 
router.get('/', async function(req, res, next) {
    let query = Book.find()
    if (req.query.title != null && req.query.title !== '') {
        query.regex('title', RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        var books = await query.exec()
        return res.render('books/index', { 
            books: books,
            searchOptions: req.query
        })
    } catch {
        return res.redirect('/')
    }
});

// New an book View Route 
router.get('/new', async function(req, res, next) {
    renderNewbookPage(res, new Book())
});


// Create an book Route 
// router.post('/', upload.single('cover'), async function(req, res, next) {

router.post('/', async function(req, res, next) {
    // var fileName = req.file != null ? req.file.filename : null;
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
        // coverImageName: fileName
    })
    saveBookCover(book, req.body.cover)

    try {
        var newBook = await book.save()
        // res.redirect('books/${newBook.id')
        res.redirect('books')
    } catch(e) {
        // removeBookCover(book.coverImageName)
        renderNewbookPage(res, book, true)
    }
    
});

async function renderNewbookPage(res, book, hasError = false) {
    var params = {
        authors: await Author.find({}),
        book: book
    }

    if (hasError){
        params.errorMessage = 'Error creating book';
    }

    try {
        res.render('books/new', params);
    } catch {
        res.redirect('books');
    }
}

// function removeBookCover(filename) {
//     fs.unlink(path.join(uploadPath, filename), err => {
//         if(err) console.log(err)
//     })
// }

function saveBookCover (book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, `base64`)
        book.coverImageType = cover.type
    }
    
}

module.exports = router;
