const express = require('express');
const searchController = require('../controllers/searchController');

const searchRouter = express.Router();

function router(nav) {
  const {
    middleware,
    getSearch
  } = searchController(nav);
  searchRouter.use(middleware);
  searchRouter.route('/')
    .post(getSearch);

  return searchRouter;
}

module.exports = router;
