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
      address
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
            city: address[0],
            postal: address[1]
          },
          hasRented: false,
          hasReserved: false
        });
        /*
        const checkName = await col.findOne({ username: user.username });

        if (checkName) {
          res.status(500).send('Change your username! It is occupied!').end(); // TODO
        } else {
          const results = await col.insertOne(user);
*/
        await newUser.save((err, user) => {
          if (err) {
            debug(err);
          }
          console.log('2');

          debug(user);
          // debug('User created!');
          req.logIn(user, () => {
            res.redirect('/books');
            console.log('3');
          });
        });
      } catch (err) {
        console.log('4');
        debug(err);
      }
      console.log('5');
      setTimeout(() => {
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
