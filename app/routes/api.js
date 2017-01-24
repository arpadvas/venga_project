var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'cora';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router) {

	var options = {
	  auth: {
	    api_user: 'avas81',
	    api_key: 'Jennifer1981'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));

	router.post('/users', function(req, res) {
		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.password = req.body.password;
		user.temporarytoken = jwt.sign({ name: user.name, email: user.email}, secret, {expiresIn: '24h'});
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
				var email = {
				  from: 'Localhost',
				  to: user.email,
				  subject: 'Activation Link',
				  text: 'Hello' + user.name + ', Please click on the following link: http://localhost:3000/activate/' + user.temporarytoken,
				  html: 'Hello' + user.name + ', Please click on the following link: <a href="http://localhost:3000/activate/' + user.temporarytoken + '">link</a>'
				};

				client.sendMail(email, function(err, info){
				    if (err ){
				      console.log(err);
				    }
				    else {
				      console.log('Message sent: ' + info.response);
				    }
				});
				res.json({success: true, message: 'Account registered! Please check your e-mails for activation link.'});
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

	router.put('/activate/:token', function(req, res) {
		User.findOne({ temporarytoken: req.params.token }, function(err, user) {
			if (err) throw err;
			var token = req.params.token;

			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.json({success: false, message: 'Activation link has expired.'});
				} else if (!user) {
					res.json({success: false, message: 'Activation link has expired.'});
				} else {
					user.temporarytoken = false;
					user.active = true;
					user.save(function(err) {
						if (err) {
							console.log(err);
						} else {


							var email = {
							  from: 'Localhost',
							  to: user.email,
							  subject: 'Activation Activated',
							  text: 'Hello world' + user.name + ', Your account has been activated.',
							  html: 'Hello world' + user.name + ', Your account has been activated.'
							};

							client.sendMail(email, function(err, info){
							    if (err ){
							      console.log(err);
							    }
							    else {
							      console.log('Message sent: ' + info.response);
							    }
							});

							res.json({ success: true, message: 'Account activated.'});
						}
					});					
				}
			});

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