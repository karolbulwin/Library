const passport = require('passport');
const { Strategy } = require('passport-local');
const mongoose = require('mongoose');
const debug = require('debug')('app:local.strategy');
const User = require('../../models/userSchema');

function localStrategy() {
  passport.use(new Strategy((username, password, done) => {
    const url = 'mongodb://localhost:27017/libraryApp';
    (async function mongo() {
      await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
      try {
        debug('Connected correctly to server - Sing in');

        await User.findOne({ username }, (err, user) => {
          if (err) { debug(err); return done(err); }
          if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
          if (user.password !== password) { return done(null, false, { message: 'Incorrect password.' }); }
          return done(null, user);
        });
      } catch (err) {
        debug(err.stack);
      }
      mongoose.disconnect();
    }());
  }));
}

module.exports = localStrategy;
