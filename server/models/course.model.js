var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Course Definition
 */
var CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  semester: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: false
  },
  book: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  topics: {
    type: [String],
    required: false
  }
});


module.exports = mongoose.model('Course', CourseSchema);
