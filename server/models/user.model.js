var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');


/*
 * mongoose-validator middleware
 * https://github.com/leepowellcouk/mongoose-validator
 */
var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 30],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username can only contain letters and numbers'
  })
];
var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\W]).{8,35}$/,
    message: 'Password must include 1 lowercase, 1 uppercase, 1 number, and 1 symbol.'
  }),
   validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];


/*
 * User Schema
 */
var UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    validate: usernameValidator
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidator,
    select: false
  },
  token: {
    type: String,
    required: false
  }
});


/*
 * mongoose pre save middleware called prior to saving
 */
UserSchema.pre("save", function (next) {
  var user = this;
  // if no password change, continue
  if (!user.isModified('password')) return next();
  // bcrypt-nodejs
  // hash(data, salt, progress, cb)
  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});


UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
