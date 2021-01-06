var express = require('express');
var router = express.Router();
const Author = require('../models/author');
 


// GET all authors Route 
router.get('/', async function(req, res, next) {
    let searchOptions = { }
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        var authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
  res.render('authors/index');
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
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
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
    res.send(req.body.name);
});


module.exports = router;
