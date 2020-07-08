const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

  isbn: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BooksList ', BookSchema);
