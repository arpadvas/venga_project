var User = require('../models/user');
var Ascent = require('../models/ascent');

module.exports = function(myascents) {

	myascents.get('/myascentsCount', function(req, res) {
		User.findOne({ email: req.decoded.email }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.count({ sentBy: user.email }).exec(function(err, count) {
					if (!count) {
						res.json({success: false, message: 'No ascent was found!'});
					} else {
						res.json({ success: true, count: count });
					}
				});
			}
		});
	});

	myascents.get('/myascents/:limit/:page/:propertyname/:reverse', function(req, res) {
		var limit = Number(req.params.limit);
		var page = Number(req.params.page);
		page = page-1;
		var offset = limit * page;
		var propertyname = req.params.propertyname;
		var reverse = req.params.reverse;

		User.findOne({ email: req.decoded.email }, function(err, user) {
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
				}
			}
		});
	});


	myascents.post('/myascents', function(req, res) {	
			
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
			res.json({success: false, message: 'No user was found!'});
		} else {
			var ascent = new Ascent();
			ascent.name = req.body.name;
			ascent.style = req.body.style;
			ascent.grade = req.body.grade;
			ascent.sentBy = mainUser.email;
			ascent.date = req.body.date;
			ascent.sentByName = mainUser.name;
			ascent.crag = req.body.crag;
			ascent.country = req.body.country;
			if (req.body.name == null || req.body.name == '' || req.body.style == null || req.body.style == '' || req.body.grade == null || req.body.grade == '' || req.body.date == null || req.body.date == '' || req.body.crag == null || req.body.crag == '' || req.body.country == null || req.body.country == '') {
				res.json({success: false, message: 'Please make sure the fields are filled out properly!'});
			} else {
				ascent.normalized = ascent.name.toLowerCase();
				ascent.save(function(err) {
					if (err) {
						res.json({success: false, message: 'An error occured. Please try again later!'});
					} else {
						res.json({success: true, message: 'Ascent created.'});
					}
				});
			}
		}
		});
		
	});

	myascents.delete('/myascents/:id', function(req, res) {
		var deletedAscent = req.params.id;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.findOneAndRemove({ _id: deletedAscent}, function(err, ascent) {
					if (err) throw err;
					res.json({ success: true });
				});
			}
		});
	});

	myascents.put('/myascents', function(req, res) {
		var editedAscent = req.body._id;
		var newName = req.body.name;
		var newStyle = req.body.style;
		var newGrade = req.body.grade;
		var newDate = req.body.date;
		var newCrag = req.body.crag;
		var newCountry = req.body.country;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.findOne({ _id: editedAscent}, function(err, ascent) {
					if (err) throw err;
					if (!ascent) {
						res.json({success: false, message: 'No ascent was found!!!'});
					} else {
						ascent.name = newName;
						ascent.style = newStyle;
						ascent.grade = newGrade;
						ascent.date = newDate;
						ascent.crag = newCrag;
						ascent.country = newCountry;
						ascent.normalized = newName.toLowerCase();
						ascent.save(function(err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ success: true, message: 'Ascent has been updated.' });
							}
						});
					}
				});
			}
		});
	});

	myascents.get('/myascents/:id', function(req, res) {
		var editedAscent = req.params.id;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.findOne({ _id: editedAscent}, function(err, ascent) {
					if (err) throw err;
					if (!ascent) {
						res.json({success: false, message: 'No ascent was found!'});
					} else {
						res.json({ success: true, ascent: ascent });
					}
				});
			}
		});
	});

	return myascents;

}