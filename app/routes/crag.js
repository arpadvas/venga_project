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

	crag.get('/checkcrag/:name', function(req, res) {
		Crag.findOne({ name: req.params.name }, function(err, crag) {
			if (err) throw err;
			if (!crag) {
				res.json({success: false, message: 'No crag was found!'});
			} else {
				res.json({success: true, message: 'Crag already exists!'});
			}
		});
	});

	crag.get('/allcrags', function(req, res) {
		Crag.find({ }, function(err, crags) {
			if (!crags) {
				res.json({success: false, message: 'No crag was found!'});
			} else {
				res.json({ success: true, crags: crags });
			}
		});
	});

	crag.post('/crags', function(req, res) {
		Crag.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword, $options: "i" } }).exec(function(err, crags) {
			if (err) throw err;
			if (!crags) {
				res.json({success: false, message: 'No crag was found!'});
			} else {
				res.json({ success: true, crags: crags });
			}
		});
	});

	return crag;

}
