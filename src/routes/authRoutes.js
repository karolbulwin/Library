const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const authRouter = express.Router();

function router(nav) {
  const {
    signUpView,
    signUp,
    logout
  } = authController(nav);
  authRouter.route('/signUp')
    .get(signUpView)
    .post(signUp);
  authRouter.route('/signIn')
    .post(passport.authenticate('local', {
      successRedirect: '/books',
      failureRedirect: '/'
    }));
  authRouter.route('/logout')
    .get(logout);
  return authRouter;
}

module.exports = router;
