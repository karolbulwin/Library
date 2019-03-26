const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  address:
    {
      city: { type: String, required: true, trim: true },
      postal: { type: String, required: true, trim: true }
    },
  reg_time: { type: Date, default: Date.now },
  hasRented: {
    type: Boolean
  },
  hasReserved: {
    type: Boolean
  },
  bookId: {
    type: Object
  }
});

userSchema.index({
  firstName: 'text',
  lastName: 'text',
  username: 'text',
  address: 'text'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
