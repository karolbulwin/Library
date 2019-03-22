const mongoose = require('mongoose');
const debug = require('debug')('app:searchController');
const Book = require('../models/bookSchema');

function searchController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getSearch(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';

    const {
      userSearch
    } = req.body;

    (async function mongo() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });

        debug('Connected correctly to server - search');

        await Book.find({ $text: { $search: userSearch } }, (err, book) => {
          debug(err);
          debug(book);

          res.render(
            'searchView',
            {
              nav,
              title: 'Search Results',
              userSearch,
              book
            }
          );
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }
  return {
    middleware,
    getSearch
  };
}

module.exports = searchController;
