'use strict';

var mongoose = require('mongoose');

var ascentSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true
	},
	style: {
		type: String, 
		required: true
	},
	grade: {
		type: String, 
		required: true
	},
	sentBy: {
		type: String, 
		required: true
	},
	date: {
		type: Date, 
		required: true,
	},
	sentByName: {
		type: String, 
		required: true
	},
});

module.exports = mongoose.model('Ascent', ascentSchema);