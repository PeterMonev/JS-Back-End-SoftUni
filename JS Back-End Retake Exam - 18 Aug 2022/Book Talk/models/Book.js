const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const bookSchema = new Schema({
    title: {type: String, required: true, minlength: [2,'Title must be at least 2 character']},
    author: {type: String, required: true, minlength: [5,'Author must be at least 5 characters']},
    imageUrl: {type: String, required: true, validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: 'Image URL must valid'
    }},
    review: {type: String, required: true, minlength: [10,'Review must be at least 10 characters']},
    genre: {type: String, required: true, minlength: [3,'Genre must be at least 3 characters']},
    stars: {type: Number, required: true, min: [1,'Stars must be between 1 and 5'], max: [5,'Stars must be between 1 and 5']},
    wishingList: {type: [Types.ObjectId], ref: 'User', default: []},
    owner: {type: Types.ObjectId, ref: 'User', required: true},
});

const Book = model('Book', bookSchema);

module.exports = Book;

