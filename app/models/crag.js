'use strict';

var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');

var cragSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true
	},
	country: {
		type: String,
		required: true
	}
});

cragSchema.plugin(titlize, {
  paths: [ 'name' ]
});

module.exports = mongoose.model('Crag', cragSchema);