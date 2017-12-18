var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Project Definition
 */
var CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});


module.exports = mongoose.model('Category', CategorySchema);
