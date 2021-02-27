var express = require('express');
var router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
 


// GET all authors Route 
router.get('/', async function(req, res, next) {
    let searchOptions = { }
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        var authors = await Author.find(searchOptions)
        return res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        return res.redirect('/')
    }
  // res.render('authors/index');
});

// New an author View Route 
router.get('/new', function(req, res, next) {
    res.render('authors/new', { author: new Author});
});


// Create an author Route 
router.post('/', async function(req, res, next) {
    var author = new Author({
        name: req.body.name
    })
    try {
        var newAuthor = await author.save()
        // res.redirect('authors/${newAuthor.id')
        return res.redirect('authors')
    } catch {
        return res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res.redirect('authors/${newAuthor.id')
    //         res.redirect('authors')
    //     }
    // })
    // res.send(req.body.name);
});

// Show an author Route 
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: req.params.id})
        return res.render('authors/show', { author: author, booksByAuthor: books}).limit(6).exec()
    } catch (error) {
        return redirect('/')
    }

    // res.send('Show Author' + req.params.id)
})

// Edit an author Route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        return res.render('authors/edit', { author: author })
    } catch (error) {
        return redirect('/authors')
    }
    // res.send('Edit Author' + req.params.id)
})

// Edit an author Route
router.put('/:id', async (req, res) => {
    let author 
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null){
            return res.redirect('/')
        }
        return res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
        })
    }
    // res.send('Update Author' + req.params.id)
})

// Edit an author Route
router.delete('/:id', async (req, res) => {
    let author 
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch {
        if (author == null){
            return res.redirect('/')
        }
        else{
            return res.redirect(`/authors/${author.id}`)
        }
        // return res.render('authors/edit', {
        //     author: author,
        //     errorMessage: 'Error updating Author'
        // })
    }
})

module.exports = router;
