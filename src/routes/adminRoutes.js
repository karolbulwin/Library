const express = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = express.Router();

function router(nav) {
  const {
    middleware,
    adminPage,
    giveTheBookToTheUser,
    cancelReservation,
    takeTheBookFromTheUser,
    addBooks,
    addBook,
    editBook,
    deleteBook
  } = adminController(nav);
  adminRouter.use(middleware);
  adminRouter.route('/')
    .get(adminPage);
  adminRouter.route('/giveBookToTheUser')
    .post(giveTheBookToTheUser);
  adminRouter.route('/cancelReservation')
    .post(cancelReservation);
  adminRouter.route('/takeTheBookFromTheUser')
    .post(takeTheBookFromTheUser);
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
