const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getIndex(req, res) {
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - get all books');

        const db = client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();

        res.render(
          'bookListView',
          {
            nav,
            title: 'Books list',
            books
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function reserveBook(req, res) {
    const {
      _id,
      username
    } = req.user;

    const {
      bookId,
      title,
      isReserved,
      reservedBy
    } = req.body;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - reserve book - book');

        const book = {
          bookId,
          title,
          isReserved,
          reservedBy
        };

        const db = client.db(dbName);
        const col = await db.collection('books');

        await col.updateOne(
          { _id: new ObjectID(book.bookId) },
          {
            $set: {
              isReserved: true,
              reservedBy: username
            }
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - reserve book - user');

        const db = client.db(dbName);
        const col = await db.collection('users');

        await col.updateOne(
          { _id: new ObjectID(_id) },
          { $set: { hasReserved: true, bookId: new ObjectID(bookId), bookTitle: title } }
        );

        req.session.passport.user.hasReserved = true;
        req.session.passport.user.bookId = new ObjectID(bookId);
        req.session.save();

        res.redirect('/books/myBooks');
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function unreserveBook(req, res) {
    const {
      _id
    } = req.user;

    const {
      bookId,
      title,
      isReserved,
      reservedBy
    } = req.body;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - unreserve book - book');

        const book = {
          bookId,
          title,
          isReserved,
          reservedBy
        };

        const db = client.db(dbName);
        const col = await db.collection('books');

        await col.updateOne(
          { _id: new ObjectID(book.bookId) },
          {
            $set: {
              isReserved: false,
              reservedBy: null
            }
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - unreserve book - user');

        const user = {
          _id
        };

        const db = client.db(dbName);
        const col = await db.collection('users');

        await col.updateOne(
          { _id: new ObjectID(user._id) },
          { $set: { hasReserved: false, bookId: null } }
        );

        req.session.passport.user.hasReserved = false;
        req.session.passport.user.bookId = null;
        req.session.save();

        res.redirect('/books');
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getMyBooks(req, res) {
    const {
      hasReserved,
      hasRented,
      bookId
    } = req.user;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - my book');

        const user = {
          hasReserved,
          hasRented,
          bookId
        };

        const db = client.db(dbName);
        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(user.bookId) });

        res.render(
          'myBooksView',
          {
            nav,
            title: 'My books',
            book,
            user
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    const {
      hasReserved,
      hasRented
    } = req.user;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - get one book');

        const user = {
          hasReserved,
          hasRented
        };

        const db = client.db(dbName);
        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });

        book.details = await bookService.getBookById(book.author, book.title);

        res.render(
          'bookView',
          {
            nav,
            title: book.title,
            book,
            user
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
    getIndex,
    reserveBook,
    unreserveBook,
    getMyBooks,
    getById
  };
}

module.exports = bookController;
