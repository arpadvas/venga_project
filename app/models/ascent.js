'use strict';

var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');

var ascentSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true
	},
	normalized: {
		type: String,
		default: 'a'
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
	crag: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	}
});

ascentSchema.plugin(titlize, {
  paths: [ 'crag' ]
});

module.exports = mongoose.model('Ascent', ascentSchema);