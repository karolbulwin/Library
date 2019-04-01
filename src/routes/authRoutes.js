const express = require('express');
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
  authRouter.route('/logout')
    .get(logout);
  return authRouter;
}

module.exports = router;
