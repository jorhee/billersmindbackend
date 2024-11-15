// models/UserProfile.js


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: [true, 'FirstName is Required']
  },
  lastName: {
    type: String,
    required: [true, 'LastName is Required']
  },
  email: {
  type: String,
  required: [true, 'Email is Required'],
  unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile no. is Required'],
  }

});

module.exports = mongoose.model('User', UserSchema);