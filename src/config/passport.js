const passport = require('passport');
require('./strategies/local.strategy')();
const debug = require('debug')('app:passport');
const chalk = require('chalk');

function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
    debug(`${chalk.green('stored')}`);
  });

  // Retrieves user form session
  passport.deserializeUser((user, done) => {
    done(null, user);
    debug(`${chalk.green('retrieved')}`);
  });
}

module.exports = passportConfig;
