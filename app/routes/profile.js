var User = require('../models/user');
var Ascent = require('../models/ascent');

module.exports = function(profile) {

	profile.get('/profile', function(req, res) {
		User.findOne({ email: req.decoded.email}, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				res.json({ success: true, user: user });
			}
		});
	});

	profile.put('/profile', function(req, res) {
		var picture = req.body.picture;
		var description = req.body.description;
		var gender = req.body.gender;
		var editedUser = req.body.email;
		User.findOne({ email: editedUser}, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				user.picture = picture;
				user.description = description;
				user.gender = gender;
				user.save(function(err) {
					if (err) {
						console.log(err);
					} else {
						res.json({ success: true, message: 'Account has been updated.'});
					}
				});
			}
		});
	});

	profile.get('/allascents', function(req, res) {
		Ascent.find({ }, function(err, ascents) {
			if (!ascents) {
				res.json({success: false, message: 'No ascent was found!'});
			} else {
				res.json({ success: true, ascents: ascents });
			}
		});
	});

	return profile;

}