'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
  		validator: 'matches',
  		arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
  		message: 'Name must be between 3 and 30, no special characters and numbers allowed, space must be between names!'
	}),
  validate({
  		validator: 'isLength',
  		arguments: [3, 20],
  		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters.'
	})
];

var emailValidator = [
  validate({
  		validator: 'isEmail',
  		message: 'Not valid email!'
	}),
  validate({
  		validator: 'isLength',
  		arguments: [3, 25],
  		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
	})
];

var passwordValidator = [
  validate({
  		validator: 'matches',
  		arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
  		message: 'Password must have at least one lower case, one upper case, one number, one special character, and must be between 8 and 35 characters!'
	}),
  validate({
  		validator: 'isLength',
  		arguments: [8, 35],
  		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
	})
];


var userSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
		validate: nameValidator
	},
	email: {
		type: String, 
		lowercase: true, 
		unique: true,
		required: true,
		validate: emailValidator
	},
	password: {
		type: String,
		required: true,
		validate: passwordValidator
	}
});

userSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});

userSchema.plugin(titlize, {
  paths: [ 'name' ]
});

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
