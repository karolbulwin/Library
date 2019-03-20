const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');
const chalk = require('chalk');

const books = [
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

const adminRouter = express.Router();

function router() {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`${chalk.green('Connected correctly to server - add books')}`);

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;
