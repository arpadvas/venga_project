'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	name: {
		type: String, 
		lowercase: true,
		required: true
	},
	email: {
		type: String, 
		lowercase: true, 
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
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

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);