var express = require('express');
const Author = require('../models/author');
var router = express.Router();
const Book = require('../models/book');
const fs = require('fs')
const path = require('path');
const { render } = require('ejs');
const author = require('../models/author');
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
    renderNewPage(res, new Book())
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

// show book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book})
    } catch (error) {
        console.log("12 loi")   
    }
})

// New an book View Route 
router.get('/:id/edit', async function(req, res, next) {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        
    }
});

// Update an book Route 
router.put('/:id', async function(req, res, next) {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== ''){
            saveBookCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        if (book != null){
            renderEditPage(res, book, true)
        }
        else {
            res.redirect('/')

        }
    }
});

// Delete an book route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch (error) {
        if (book != null){
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
        
    }
});

async function renderNewPage(res, book, hasError = false){
    renderFormbookPage(res, book, 'new')
}

async function renderEditPage(res, book, hasError = false){
    renderFormbookPage(res, book, 'edit')
}

async function renderFormbookPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        var params = {
            authors: authors,
            book: book
        }
        if (hasError){
            if(form == 'edit'){
                params.errorMessage = 'Error updating book';
            }
            else if (form == 'new'){
                params.errorMessage = 'Error creating book';
            }
            else {
                params.errorMessage = 'Error book';
            }
        }
        res.render(`books/${form}`, params);
    } catch {
        res.redirect('books');
    }
}

module.exports = router;
