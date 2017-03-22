var User = require('../models/user');
var Ascent = require('../models/ascent');
var jwt = require('jsonwebtoken');
var secret = 'cora';
var nodemailer = require('nodemailer');

module.exports = function(router) {

	var client = nodemailer.createTransport({
	    host: 'smtp.zoho.com',
	    port: 465,
	    secure: true,
	    auth: {
	        user: 'venga.project@zoho.com',
	        pass: 'A5sG8!wt'
	    },
	    tls: {
	        rejectUnauthorized: false
	    }
	});

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
				  from: 'venga.project@zoho.com',
				  to: user.email,
				  subject: 'Activation Link',
				  text: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: http://enigmatic-earth-37786.herokuapp.com/activate/' + user.temporarytoken,
				  html: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: <a href="http://enigmatic-earth-37786.herokuapp.com/activate/' + user.temporarytoken + '">link</a>'
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
		User.findOne({ email: req.body.email }).select('name email password active picture').exec(function(err, user) {
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
				} else if (!user.active) {
					res.json({ success: false, message: 'Account is not yet activated!', expired: true });
				} else {
					var token = jwt.sign({ name: user.name, email: user.email, picture: user.picture}, secret, {expiresIn: '24h'});
					res.json({ success: true, message: 'User authenticated!', token: token });
				}
			}
		});
	});

	router.post('/resend', function(req, res) {
		User.findOne({ email: req.body.email }).select('name email password active').exec(function(err, user) {
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
				} else if (user.active) {
					res.json({ success: false, message: 'Account is already activated.'});
				} else {
					res.json({ success: true, user: user });
				}
			}
		});
	});

	router.put('/resend', function(req, res) {
		User.findOne({ email: req.body.email }).select('name email temporarytoken').exec(function(err, user) {
			if (err) throw err;

			user.temporarytoken = jwt.sign({ name: user.name, email: user.email}, secret, {expiresIn: '24h'});
			user.save(function(err) {
				if (err) {
					console.log(err);
				} else {
					var email = {
					  from: 'venga.project@zoho.com',
					  to: user.email,
					  subject: 'Activation Link Request',
					  text: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: http://enigmatic-earth-37786.herokuapp.com/activate/' + user.temporarytoken,
					  html: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: <a href="http://enigmatic-earth-37786.herokuapp.com/activate/' + user.temporarytoken + '">link</a>'
					};

					client.sendMail(email, function(err, info){
					    if (err ){
					      console.log(err);
					    }
					    else {
					      console.log('Message sent: ' + info.response);
					    }
					});
					res.json({ success: true, message: 'Link has been sent! Please check your mailbox.'});
				}
			});
		});
	});

	router.put('/activate/:token', function(req, res) {
		User.findOne({ temporarytoken: req.params.token }, function(err, user) {
			if (err) throw err;
			var token = req.params.token;

			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.json({success: false, message: 'Activation link has expired!'});
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
							  from: 'venga.project@zoho.com',
							  to: user.email,
							  subject: 'Account Activated',
							  text: 'Hello ' + user.name + ', Your account has been activated.',
							  html: 'Hello ' + user.name + ', Your account has been activated.'
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

	router.put('/resetpassword', function(req, res) {
		User.findOne({ email: req.body.email }).select('name email resettoken active').exec(function(err, user) {

			if (err) throw err;

			if (!user) {
				res.json({ success: false, message: 'User was not found with email provided!' });
			} else if (!user.active) {
					res.json({ success: false, message: 'Account is not yet activated!'});
			} else {
				user.resettoken = jwt.sign({ name: user.name, email: user.email}, secret, {expiresIn: '24h'});
				user.save(function(err) {
					if (err) {
						res.json({ success: false, message: err });
					} else {
						var email = {
						  from: 'venga.project@zoho.com',
						  to: user.email,
						  subject: 'Password Reset Link',
						  text: 'Hello ' + user.name + ', Please click on the following link to reset your password: http://enigmatic-earth-37786.herokuapp.com/reset/' + user.resettoken,
						  html: 'Hello ' + user.name + ', Please click on the following link to reset your password: <a href="http://enigmatic-earth-37786.herokuapp.com/reset/' + user.resettoken + '">link</a>'
						};

						client.sendMail(email, function(err, info){
						    if (err ){
						      console.log(err);
						    }
						    else {
						      console.log('Message sent: ' + info.response);
						    }
						});
						res.json({ success: true, message: 'Please check you mailbox for password reset link.' });
					}
				});
			}
		});	
	});

	router.get('/resetpassword/:token', function(req, res) {

		User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {

			if (err) throw err;

			var token = req.params.token;
			jwt.verify(token, secret, function(err, decoded) {
			if(err) {
				res.json({success: false, message: 'Password link has expired!'});
			} else {
				if (!user) {
					res.json({success: false, message: 'Password link has expired!'});
				} else {
					res.json({success: true, user: user});
				}
			}
		});

		});

	});

	router.put('/savepassword', function(req, res) {

		User.findOne({ email: req.body.email }).select('name email password resettoken').exec(function(err, user) {

			if (err) throw err;

			if (req.body.password == null || req.body.password == '') {
				res.json({ success: false, message: 'Password has not been provided!' });
			} else {
				user.password = req.body.password;
				user.resettoken = false;
				user.save(function(err) {
					if (err) {
						res.json({ success: false, message: err });
					} else {
						var email = {
						  from: 'venga.project@zoho.com',
						  to: user.email,
						  subject: 'Success password reset',
						  text: 'Hello ' + user.name + ', Your password has been succeccfully reset.',
						  html: 'Hello ' + user.name + ', Your password has been succeccfully reset.'
						};

						client.sendMail(email, function(err, info){
						    if (err ){
						      console.log(err);
						    }
						    else {
						      console.log('Message sent: ' + info.response);
						    }
						});
						res.json({ success: true, message: 'Password has been reset.' });
					}
				});
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

	router.get('/renewToken/:email', function(req, res) {

		User.findOne({ email: req.params.email }).select('email name picture active').exec(function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				var newToken = jwt.sign({ name: user.name, email: user.email, picture: user.picture}, secret, {expiresIn: '24h'});
				res.json({ success: true, token: newToken });
			}
		});

	});

	router.get('/permission', function(req, res) {
		User.findOne({ email: req.decoded.email }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				res.json({ success: true, permission: user.permission, picture: user.picture });
			}
		});
	});

	router.get('/propertyname', function(req, res) {
		User.findOne({ email: req.decoded.email }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				res.json({ success: true, propertyname: user.propertyname, reverse: user.reverse });
			}
		});
	});

	router.put('/propertyname', function(req, res) {
		var propertyname = req.body.propertyname;
		var reverse = req.body.reverse;
		User.findOne({ email: req.decoded.email}, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				user.propertyname = propertyname;
				user.reverse = reverse;
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

	router.get('/profilePic', function(req, res) {
		User.findOne({ email: req.decoded.email }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				res.json({ success: true, picture: user.picture, name: user.name });
			}
		});
	});

	return router;
}

