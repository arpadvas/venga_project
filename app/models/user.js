'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
  		validator: 'matches',
  		//arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
  		arguments: /^(([A-Za-z\u00C0-\u017F]{3,40})+[ ]+([A-Za-z\u00C0-\u017F]{3,40})+)+$/,
  		message: 'Name must be between 3 and 30, no special characters and numbers allowed, space must be between names!'
	}),
  validate({
  		validator: 'isLength',
  		arguments: [3, 40],
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
  		arguments: [3, 40],
  		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
	})
];

var passwordValidator = [
  validate({
  		validator: 'matches',
  		arguments: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  		message: 'Password must have at least one lower case, one upper case, one number, one special character, and must be between 6 and 20 characters!'
	}),
  validate({
  		validator: 'isLength',
  		arguments: [6, 20],
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
		//required: true,
		validate: passwordValidator,
		select: false
	},
	active: {
		type: Boolean,
		required: true,
		default: false
	},
	temporarytoken: {
		type: String
		//required: true
	}
	,
	resettoken: {
		type: String,
		required: false
	},
	permission: {
		type: String,
		required: true,
		default: 'user'
	},
	picture: {
		type: mongoose.Schema.Types.Mixed,
		default: {url: 'https://s17.postimg.org/6oc9lqm0f/no-avatar.png'}
	},
	bgrpicture: {
		type: mongoose.Schema.Types.Mixed,
		default: {url: 'https://s7.postimg.org/3t905fn4r/sng.png'}
	},
	propertyname: {
		type: String,
		required: true,
		default: 'grade'
	},
	reverse: {
		type: Boolean,
		required: true,
		default: true
	},
	description: {
		type: String,
		default: 'No description added'
	},
	gender: {
		type: String,
		default: 'No gender added'
	},
	country: {
		type: String,
		default: 'No place added'
	}
});

userSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

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
