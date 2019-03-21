const { MongoClient } = require('mongodb');
const debug = require('debug')('app:searchController');

function searchController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getSearch(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    const {
      userSearch
    } = req.body;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - search');

        const search = {
          userSearch
        };

        const db = client.db(dbName);
        const col = await db.collection('books');
        let book = await col.findOne({ title: search.userSearch });

        if (!book) {
          book = await col.findOne({ author: search.userSearch });
        }

        debug(book);
        debug(search);

        res.render(
          'searchView',
          {
            nav,
            title: 'Search',
            search,
            book
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  return {
    middleware,
    getSearch
  };
}

module.exports = searchController;
