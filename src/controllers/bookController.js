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
      username
    } = req.user;

    const book = {
      _id: req.body._id,
      title: req.body.title,
      isReserved: req.body.isReserved,
      reservedBy: req.body.reservedBy
    };

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - reserve book - book');

        const db = client.db(dbName);
        const col = await db.collection('books');

        debug('Connected correctly to server - check if the book is reserved');
        const bookToCheck = await col.findOne({ _id: new ObjectID(book._id) });
        if (!bookToCheck.isReserved) {
          await col.updateOne(
            { _id: new ObjectID(book._id) },
            {
              $set: {
                isReserved: true,
                reservedBy: username
              }
            }
          );
          try {
            debug('Connected correctly to server - reserve book - user');
            const colUsers = await db.collection('users');
            await colUsers.updateOne(
              { username },
              { $set: { hasReserved: true, reservedBookId: new ObjectID(book._id) } }
            );

            req.session.passport.user.hasReserved = true;
            req.session.passport.user.reservedBookId = new ObjectID(book._id);
            req.session.save();

            res.status(200).send({ result: 'redirect', url: '/books/myBooks' });
          } catch (err) {
            debug(err.stack);
          }
        } else {
          res.status(404).send({ result: 'too late' });
        }
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function unreserveBook(req, res) {
    const {
      username
    } = req.user;

    const book = {
      _id: req.body._id,
      title: req.body.title,
      isReserved: req.body.isReserved,
      reservedBy: req.body.reservedBy
    };

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - unreserve book - book');

        const db = client.db(dbName);
        const col = await db.collection('books');

        await col.updateOne(
          { _id: new ObjectID(book._id) },
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

        const db = client.db(dbName);
        const col = await db.collection('users');

        await col.updateOne(
          { username },
          { $set: { hasReserved: false, reservedBookId: null } }
        );

        req.session.passport.user.hasReserved = false;
        req.session.passport.user.reservedBookId = null;
        req.session.save();

        res.status(200).send({ result: 'redirect', url: '/books' });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getMyBooks(req, res) {
    const user = {
      hasReserved: req.user.hasReserved,
      hasRented: req.user.hasRented,
      reservedBookId: req.user.reservedBookId,
      rentedBookId: req.user.rentedBookId
    };

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - my book');

        const db = client.db(dbName);
        const col = await db.collection('books');
        let book;
        if (user.reservedBookId !== null) {
          book = await col.findOne({ _id: new ObjectID(user.reservedBookId) });
        } else {
          book = await col.findOne({ _id: new ObjectID(user.rentedBookId) });
        }

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
    const user = {
      hasReserved: req.user.hasReserved,
      hasRented: req.user.hasRented
    };

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - get one book');

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
