var User = require('../models/user');
var Ascent = require('../models/ascent');

module.exports = function(ascentsearch) {

	ascentsearch.post('/ascents', function(req, res) {
		var limit = req.body.limit;
		var page = req.body.page;
		page = page-1;
		var offset = limit * page;
		var propertyname = req.body.propertyName;
		var reverse = req.body.reverse;

		if (req.body.gradeKeyword !== '') {
			if (propertyname === 'name' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ name: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'name' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ name: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'style' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ style: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'style' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ style: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'grade' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ grade: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'grade' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ grade: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'crag' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ crag: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'crag' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ crag: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'country' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ country: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'country' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ country: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'date' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ date: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'date' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ date: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'sentByName' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ sentByName: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'sentByName' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ sentByName: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			}
		} else if (req.body.gradeKeyword === '') {
			if (propertyname === 'name' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ name: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'name' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ name: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'style' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ style: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'style' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ style: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'grade' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ grade: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'grade' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ grade: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'crag' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ crag: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'crag' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ crag: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'country' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ country: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'country' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ country: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'date' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ date: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'date' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ date: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'sentByName' && reverse === false) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ sentByName: 1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			} else if (propertyname === 'sentByName' && reverse === true) {
				Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }).sort({ sentByName: -1 }).skip(offset).limit(limit).exec(function(err, ascents) {
					if (err) throw err;
					if (!ascents) {
						res.json({success: false, message: 'No climber was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			}
		}
	});

	ascentsearch.post('/ascentscount', function(req, res) {
		if (req.body.gradeKeyword) {
			Ascent.count({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }, function(err, count) {
				if (err) throw err;
				if (!count) {
					res.json({success: false, message: 'No ascent was found!'});
				} else {
					res.json({ success: true, count: count }); 
				}
			});
		} else if (req.body.gradeKeyword === '') {
			Ascent.count({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, crag: { $regex: req.body.cragKeyword, $options: "i" }, country: { $regex: req.body.countryKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }, function(err, count) {
				if (err) throw err;
				if (!count) {
					res.json({success: false, message: 'No ascent was found!'});
				} else {
					res.json({ success: true, count: count }); 
				}
			});
		}
	});

	return ascentsearch;

}