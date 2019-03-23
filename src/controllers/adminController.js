const mongoose = require('mongoose');
const debug = require('debug')('app:adminController');
const chalk = require('chalk');
const Book = require('../models/bookSchema');

const booksList = [
  {
    title: 'The Hunger Games',
    genre: 'Fantasy',
    author: 'Suzanne Collins',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'Harry Potter and Order of the Phoenix',
    genre: 'Fantasy',
    author: 'J. K. Rowling',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'To Kill Mockingbird',
    genre: 'Classics',
    author: 'Harper Lee',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'Pride and Prejudice',
    genre: 'Classics',
    author: 'Jane Austen',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'Twilight',
    genre: 'Fantasy',
    author: 'Stephenie Meyer',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'The Book Thief',
    genre: 'Historical Fiction',
    author: 'Mark Zusak',
    isRented: false,
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'The Chronicles of Narnia',
    genre: 'Fantasy',
    author: 'C. S. Lewis',
    isRented: false,
    isReserved: 3,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'Animal Farm',
    genre: 'Classics',
    author: 'George Orwell',
    isRented: 1,
    isReserved: 3,
    rentedBy: null,
    reservedBy: null
  }];

function adminController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      if (req.user.username === 'admin') {
        next();
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  }
  function adminPage(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';

    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug('Connected correctly to server - get all books for admin');

        await Book.find({}, (err, books) => {
          debug(err);
          debug(books);

          res.render('adminView', {
            nav,
            title: 'Book management',
            books
          });
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }

  function addBooks(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - add books')}`);

        Book.collection.insertMany(booksList, (err) => {
          if (err) {
            debug(err);
          }
          res.json(booksList);
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  return {
    middleware,
    adminPage,
    addBooks
  };
}

module.exports = adminController;
