const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  _id : {
    type: Schema.Types.ObjectId,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: "Student"
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Club = mongoose.model("Club", ClubSchema);
