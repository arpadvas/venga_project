var User = require('../models/user');
var Ascent = require('../models/ascent');

module.exports = function(climberprofile) {

	climberprofile.get('/climber/:email', function(req, res) {
		User.findOne({ email: req.params.email }, function(err, climber) {
			if (err) throw err;
			if (!climber) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, climber: climber });
			}
		});
	});

	climberprofile.get('/climberbyid/:id', function(req, res) {
		User.findOne({ _id: req.params.id }, function(err, climber) {
			if (err) throw err;
			if (!climber) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, climber: climber });
			}
		});
	});

	climberprofile.get('/ascentscountbyid/:id', function(req, res) {
		User.findOne({ _id: req.params.id }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.count({ sentBy: user.email }, function(err, count) {
					if (!count) {
						res.json({success: false, message: 'No ascent was found!'});
					} else {
						res.json({ success: true, count: count });
					}
				});
			}
		});
	});

	climberprofile.get('/ascentsbyid/:id/:limit/:page/:propertyname/:reverse', function(req, res) {
		var limit = Number(req.params.limit);
		var page = Number(req.params.page);
		page = page-1;
		var offset = limit * page;
		var propertyname = req.params.propertyname;
		var reverse = req.params.reverse;

		User.findOne({ _id: req.params.id }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				if (propertyname === 'grade' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ grade: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'grade' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ grade: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'name' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ normalized: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'name' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ normalized: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'style' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ style: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'style' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ style: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'crag' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ crag: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'crag' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ crag: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'country' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ country: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'country' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ country: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'date' && reverse === 'false') {
					Ascent.find({ sentBy: user.email }).sort({ date: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				} else if (propertyname === 'date' && reverse === 'true') {
					Ascent.find({ sentBy: user.email }).sort({ date: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
						if (!ascents) {
							res.json({success: false, message: 'No ascent was found!'});
						} else {
							res.json({ success: true, ascents: ascents });
						}
					});
				}
			}
		});
	});

	return climberprofile;

}