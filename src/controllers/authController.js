const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authController');

function authController(nav) {
  function signUpView(req, res) {
    res.render('signUpView', {
      nav,
      title: 'Sign Up'
    });
  }
  function signUp(req, res) {
    const {
      firstName,
      lastName,
      username,
      password,
      address
    } = req.body;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('Connected correctly to server - SignUp');

        const db = client.db(dbName);
        const col = db.collection('users');
        const user = {
          firstName,
          lastName,
          username,
          password,
          address,
          hasRented: false,
          hasReserved: false
        };

        const results = await col.insertOne(user);

        req.logIn(results.ops[0], () => {
          res.redirect('/books');
        });
      } catch (err) {
        debug(err);
      }
    }());
  }
  function logout(req, res) {
    req.logOut();
    res.redirect('/');
  }
  return {
    signUpView,
    signUp,
    logout
  };
}

module.exports = authController;
