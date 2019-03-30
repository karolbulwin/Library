const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const debug = require('debug')('app:adminController');
const chalk = require('chalk');
const Book = require('../models/bookSchema');
const User = require('../models/userSchema');

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
    isReserved: false,
    rentedBy: null,
    reservedBy: null
  },
  {
    title: 'Animal Farm',
    genre: 'Classics',
    author: 'George Orwell',
    isRented: false,
    isReserved: false,
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
          if (err) {
            debug(`err: ${err}`);
          }

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
  function giveTheBookToTheUser(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    const {
      _id,
      reservedBy
    } = req.body;

    (async function updateUser() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - giveTheBookToTheUser - user')}`);

        await User.findOneAndUpdate({ username: reservedBy }, {
          hasRented: true,
          hasReserved: false,
          reservedBookId: null,
          rentedBookId: new ObjectID(_id)
        }, (err, user) => {
          if (err) {
            debug(err);
          }
          debug('2');

          debug(user);
          debug('2');
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
    (async function updateBook() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - giveTheBookToTheUser - book')}`);

        await Book.findOneAndUpdate({ _id }, {
          isRented: true,
          isReserved: false,
          rentedBy: reservedBy,
          reservedBy: null
        }, (err, s) => {
          debug('1');
          if (err) {
            debug(err);
          }
          debug(s);
          debug('1');

          res.redirect('/admin'); // dont work with mongoose - use reload on client page -- need to change it!
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  function cancelReservation(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    const {
      _id,
      reservedBy
    } = req.body;

    debug(req.body);

    (async function updateBook() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - cancelReservation - book')}`);

        await Book.findOneAndUpdate({ _id }, {
          isReserved: false,
          reservedBy: null
        }, (err, book) => {
          debug('1');
          if (err) {
            debug(err);
          }
          debug(book);
          debug('1');
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
    (async function updateUser() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - cancelReservation - user')}`);

        await User.findOneAndUpdate({ username: reservedBy }, {
          hasReserved: false,
          reservedBookId: null
        }, (err, user) => {
          if (err) {
            debug(err);
          }
          debug('2');

          debug(user);
          debug('2');

          res.redirect('/admin'); // dont work with mongoose - use reload on client page -- need to change it!
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  function takeTheBookFromTheUser(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    const {
      _id
    } = req.body;

    const {
      username
    } = req.user;

    (async function updateBook() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - takeBookFromTheUser - book')}`);

        await Book.findOneAndUpdate({ _id }, {
          isRented: false,
          rentedBy: null
        }, (err, book) => {
          debug('1');
          if (err) {
            debug(err);
          }
          debug(book);
          debug('1');
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
    (async function updateUser() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - giveTheBookToTheUser - user')}`);

        await User.findOneAndUpdate({ username }, {
          hasRented: false,
          rentedBookId: null
        }, (err, user) => {
          if (err) {
            debug(err);
          }
          debug('2');

          debug(user);
          debug('2');
        });
        res.redirect('/admin'); // dont work with mongoose - use reload on client page -- need to change it!
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  function editBook(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    const {
      _id,
      title,
      author,
      genre
    } = req.body;

    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - edit book')}`);

        await Book.findOneAndUpdate({ _id }, {
          title,
          author,
          genre
        }, (err, book) => {
          if (err) {
            debug(err);
          }
          if (book) {
            debug('book changed');
            res.status(200).send({ result: 'changed' });
          }
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  function deleteBook(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';
    const {
      _id
    } = req.body;

    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - delete book')}`);

        await Book.findOneAndDelete({ _id }, (err, book) => {
          if (err) {
            debug(err);
          }
          if (book) {
            debug('book deleted');
            res.status(200).send({ result: 'deleted' });
          }
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

        await Book.collection.insertMany(booksList, (err) => {
          if (err) {
            debug(err);
          }
          res.redirect('/admin'); // dont work with mongoose - use reload on client page -- need to change it!
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  function addBook(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';

    debug(req.body);
    const {
      title,
      author,
      genre
    } = req.body;

    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug(`${chalk.green('Connected correctly to server - add book')}`);

        const newBook = new Book({
          title,
          author,
          genre,
          isReserved: false,
          isRented: false
        });

        await newBook.save((err) => {
          if (err) {
            debug(err);
          }
        });
      } catch (err) {
        debug(err.stack);
      }
      setTimeout(() => { // server instance pool was destroy ?? save?
        mongoose.disconnect();
      }, 1000);
    }());
  }
  return {
    middleware,
    adminPage,
    giveTheBookToTheUser,
    cancelReservation,
    takeTheBookFromTheUser,
    editBook,
    deleteBook,
    addBooks,
    addBook
  };
}

module.exports = adminController;
