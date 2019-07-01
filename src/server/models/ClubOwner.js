const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const ClubOwnerSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = ClubOwner = mongoose.model("ClubOwner", ClubOwnerSchema);
