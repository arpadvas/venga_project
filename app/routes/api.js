var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'cora';

module.exports = function(router) {

	router.post('/users', function(req, res) {
		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.password = req.body.password;
		if(req.body.name === null ||
			req.body.name === '' ||
			req.body.email === null ||
			req.body.email === '' ||
			req.body.password === null ||
			req.body.password === '') {
			res.json({success: false, message: 'Make sure name, email and password were provided.'});
		} else {
			user.save(function(err) {
			if(err) {
				if (err.errors != null) {
					if(err.errors.name) {
						res.json({success: false, message: err.errors.name.message});
					} else if (err.errors.email) {
						res.json({success: false, message: err.errors.email.message});
					} else if (err.errors.password) {
						res.json({success: false, message: err.errors.password.message});
					} else {
						res.json({success: false, message: err});
					}
				} else if (err) {
					if (err.code === 11000) {
						res.json({success: false, message: 'Email already exist! '});
					} else {
						res.json({success: false, message: err});
					}
				}  
			} else {
				res.json({success: true, message: 'User created!'});
			}
			});
		}
	});

	router.post('/checkemail', function(req, res) {
		User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
			if (err) throw err;

			if (user) {
				res.json({ success: false, message: 'That email is already taken!' });
			} else {
				res.json({ success: true, message: 'Valid email address.' });
			}

			
		});
	});

	router.post('/authenticate', function(req, res) {
		User.findOne({ email: req.body.email }).select('name email password').exec(function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({ success: false, message: 'Could not authenticate user!' });
			} else if (user) {
				if (req.body.password) {
					var validPassword = user.comparePassword(req.body.password);
				} else {
					return res.json({ success: false, message: 'No password provided!' });
				}
				if (!validPassword) {
					res.json({ success: false, message: 'Could not authenticate password!' });
				} else {
					var token = jwt.sign({ name: user.name, email: user.email}, secret, {expiresIn: '24h'});
					res.json({ success: true, message: 'User authenticated!', token: token });
				}
			}
		});
	});

	router.use(function(req, res, next) {
	var token = req.body.token || req.body.query || req.headers['x-access-token'];
	if(token) {
		jwt.verify(token, secret, function(err, decoded) {
			if(err) {
				res.json({success: false, message: 'Token is invalid'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.json({success: false, message: 'No token provided!'});
	}
});

	router.post('/me', function(req, res) {
	res.send(req.decoded);
});

	return router;
}