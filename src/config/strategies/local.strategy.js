const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useNewUrlParser: true });

          debug('Connected correctly to server - Sing in');

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({ username });

          debug(user);
          if (user) {
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
              debug('Wrong password'); // TODO
            }
          } else {
            done(null, false);
            debug('User doesnt exist'); // TODO
          }
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
  ));
}

module.exports = localStrategy;
