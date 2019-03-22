const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isRented: {
    type: Boolean,
    required: true
  },
  isReserved: {
    type: Boolean,
    required: true
  },
  rentedBy: {
    type: String
  },
  reservedBy: {
    type: String
  }
});

bookSchema.index({
  title: 'text',
  author: 'text',
  genre: 'text'
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
