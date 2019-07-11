const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const validateId = (_id) => {
  return (_id < 24000 && _id > 19999);
}

const validatePhone = (phone) => {
  const regex = /^\d{10}$/;
  return regex.test(phone);
}

const StudentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  studentId: {
    type: Number,
    validate: [validateId, 'Please enter a valid student ID']
  },
  name: {
    type: String,
    required: "Name is required"
  },
  phone: {
    type: String,
    validate: [validatePhone, 'Please enter a valid phone number'];
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
  },
  clubsJoined: [{
    type: Schema.Types.ObjectId,
    ref: "Club"
  }]
});

module.exports = Student = mongoose.model("Student", StudentSchema);
