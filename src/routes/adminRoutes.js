const express = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = express.Router();

function router(nav) {
  const {
    middleware,
    adminPage,
    addBooks
  } = adminController(nav);
  adminRouter.use(middleware);
  adminRouter.route('/')
    .get(adminPage);
  adminRouter.route('/addBooks')
    .get(addBooks);

  return adminRouter;
}

module.exports = router;
