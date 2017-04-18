var User = require('../models/user');
var Ascent = require('../models/ascent');
var Crag = require('../models/crag');

module.exports = function(crag) {

	crag.post('/crag', function(req, res) {
		var crag = Crag();
		crag.name = req.body.cragName;
		crag.country = req.body.country;
		crag.save(function(err) {
			if (err) {
				res.json({success: false, message: 'An error occured. Please try again later!'});
			} else {
				res.json({success: true, message: 'Crag created.'});
			}
		});
	});

	return crag;

}