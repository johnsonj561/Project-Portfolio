var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

/*
 * Project Definition
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    //validate: nameValidator
  },
  date: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: false
  },
  implementation: {
    type: [String],
    required: false
  },
  description: {
    type: [String],
    required: false
  },
  github: {
    type: String,
    required: false
  },
  course: {
    type: String,
    required: false
  }
});


/**
 * Project Validation
 */
var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 40],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Name can only contain letters and numbers'
  })
];


module.exports = mongoose.model('Project', ProjectSchema);
