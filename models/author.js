const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            console.log('err1')
            next(err)
        }
        else if (books.length > 0 ){
            console.log('ths author has books still')
            next(new Error('This author has books still'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)
