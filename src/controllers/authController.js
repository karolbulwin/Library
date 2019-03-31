const mongoose = require('mongoose');
const debug = require('debug')('app:authController');
const User = require('../models/userSchema');


function authController(nav) {
  function signUpView(req, res) {
    res.render('signUpView', {
      nav,
      title: 'Sign Up'
    });
  }
  function signUp(req, res) {
    const url = 'mongodb://localhost:27017/libraryApp';

    const {
      firstName,
      lastName,
      username,
      password,
      city,
      postal
    } = req.body;
    console.log('1');

    (async function addUser() {
      try {
        await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
        debug('Connected correctly to server - SignUp');

        const newUser = new User({
          firstName,
          lastName,
          username,
          password,
          address: {
            city,
            postal
          },
          hasRented: false,
          hasReserved: false
        });

        await newUser.save((err, user) => {
          if (err) {
            debug(err);
            if (err.name === 'MongoError' && err.code === 11000) {
              res.status(409).send({ msg: 'dup key' });
            }
          }
          console.log('2');
          if (user) {
            debug('User created!');
            req.logIn(user, () => {
              res.status(200).send({ msg: 'created', url: '/books' });
              console.log('3');
            });
          }
        });
      } catch (err) {
        console.log('4');
        debug(err);
      }
      console.log('5');
      setTimeout(() => { // dont wait for save?
        console.log('6');
        mongoose.disconnect();
      }, 1000);
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
