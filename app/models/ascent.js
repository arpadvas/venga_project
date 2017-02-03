'use strict';

var mongoose = require('mongoose');

var ascentSchema = new mongoose.Schema({
	name: {
		type: String
	},
	type: {
		type: String
	},
	grade: {
		type: String
	},
	sentBy: {
		type: String
	}
});

module.exports = mongoose.model('Ascent', ascentSchema);