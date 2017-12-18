var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Course Definition
 */
var CourseSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  semester: {
    type: String,
    required: true
  },
  book: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  topics: {
    type: String,
    required: false
  }
});


module.exports = mongoose.model('Course', CourseSchema);
