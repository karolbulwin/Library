const express = require('express');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

const bookRouter = express.Router();

function router(nav) {
  const {
    middleware,
    getIndex,
    reserveBook,
    unreserveBook,
    getMyBooks,
    getById
  } = bookController(bookService, nav);
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);
  bookRouter.route('/reserveBook')
    .post(reserveBook);
  bookRouter.route('/unreserveBook')
    .post(unreserveBook);
  bookRouter.route('/myBooks')
    .get(getMyBooks);
  bookRouter.route('/:id')
    .get(getById);
  return bookRouter;
}

module.exports = router;
