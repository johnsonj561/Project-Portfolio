var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Project Definition
 */
var ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  tools: {
    type: String,
    required: false
  }
});


module.exports = mongoose.model('Project', ProjectSchema);
