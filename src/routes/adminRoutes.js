const express = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = express.Router();

function router(nav) {
  const {
    middleware,
    adminPage,
    addBooks,
    addBook,
    editBook,
    deleteBook
  } = adminController(nav);
  adminRouter.use(middleware);
  adminRouter.route('/')
    .get(adminPage);
  adminRouter.route('/addBooks')
    .get(addBooks);
  adminRouter.route('/addBook')
    .post(addBook);
  adminRouter.route('/editBook')
    .post(editBook);
  adminRouter.route('/deleteBook')
    .post(deleteBook);

  return adminRouter;
}

module.exports = router;
