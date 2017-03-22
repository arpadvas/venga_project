var User = require('../models/user');
var Ascent = require('../models/ascent');

module.exports = function(climbersearch) {

	climbersearch.get('/climberscount/:keyword', function(req, res) {
		User.count({ name: { $regex: req.params.keyword, $options: "i" } }, function(err, count) {
			if (err) throw err;
			if (!count) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, count: count });
			}
		});
	});

	climbersearch.get('/climbers/:keyword/:limit/:page/:propertyname/:reverse', function(req, res) {
		var limit = Number(req.params.limit);
		var page = Number(req.params.page);
		page = page-1;
		var offset = limit * page;
		var propertyname = req.params.propertyname;
		var reverse = req.params.reverse;

		if (propertyname === 'name' && reverse === 'false') {
			User.find({ name: { $regex: req.params.keyword, $options: "i" } }).sort({ name: 1 }).skip(offset).limit(limit).exec(function(err, climbers) {
				if (err) throw err;
				if (!climbers) {
					res.json({success: false, message: 'No climber was found!'});
				} else {
					res.json({ success: true, climbers: climbers });
				}
			});
		} else if (propertyname === 'name' && reverse === 'true') {
			User.find({ name: { $regex: req.params.keyword, $options: "i" } }).sort({ name: -1 }).skip(offset).limit(limit).exec(function(err, climbers) {
				if (err) throw err;
				if (!climbers) {
					res.json({success: false, message: 'No climber was found!'});
				} else {
					res.json({ success: true, climbers: climbers });
				}
			});
		} else if (propertyname === 'score' && reverse === 'false') {
			User.find({ name: { $regex: req.params.keyword, $options: "i" } }).sort({ name: 1 }).skip(offset).limit(limit).exec(function(err, climbers) {
				if (err) throw err;
				if (!climbers) {
					res.json({success: false, message: 'No climber was found!'});
				} else {
					res.json({ success: true, climbers: climbers });
				}
			});
		} else if (propertyname === 'score' && reverse === 'true') {
			User.find({ name: { $regex: req.params.keyword, $options: "i" } }).sort({ name: -1 }).skip(offset).limit(limit).exec(function(err, climbers) {
				if (err) throw err;
				if (!climbers) {
					res.json({success: false, message: 'No climber was found!'});
				} else {
					res.json({ success: true, climbers: climbers });
				}
			});
		}
	});

	return climbersearch;

}