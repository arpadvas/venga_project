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
	        pass: 'xxxxxxx'
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
				  text: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: http://localhost:3000/activate/' + user.temporarytoken,
				  html: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: <a href="http://localhost:3000/activate/' + user.temporarytoken + '">link</a>'
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
					  text: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: http://localhost:3000/activate/' + user.temporarytoken,
					  html: 'Hello ' + user.name + ', Please click on the following link in order to activate your account: <a href="http://localhost:3000/activate/' + user.temporarytoken + '">link</a>'
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
						  text: 'Hello ' + user.name + ', Please click on the following link to reset your password: http://localhost:3000/reset/' + user.resettoken,
						  html: 'Hello ' + user.name + ', Please click on the following link to reset your password: <a href="http://localhost:3000/reset/' + user.resettoken + '">link</a>'
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

	router.get('/management', function(req, res) {
		User.find({}, function(err, users) {
			if (err) throw err;
			User.findOne({ email: req.decoded.email }, function(err, mainUser) {
				if (err) throw err;
				if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
					if (!users) {
						res.json({success: false, message: 'No users was found!'});
					} else {
						res.json({ success: true, users: users, permission: mainUser.permission });
					}
				} else {
					res.json({success: false, message: 'Insufficient permissions!'});
				}
			}
			});
		});
	});


	router.delete('/management/:email', function(req, res) {
		var deletedUser = req.params.email;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				if (mainUser.permission !== 'admin') {
					res.json({success: false, message: 'Insufficient permissions!'});
				} else {
					User.findOneAndRemove({ email: deletedUser}, function(err, user) {
						if (err) throw err;
						res.json({ success: true });
					});
				}
			}
		});
	});

	router.get('/edituser/:id', function(req, res) {
		var editUser = req.params.id;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
					User.findOne({ _id: editUser}, function(err, user) {
						if (err) throw err;
						if (!user) {
							res.json({success: false, message: 'No user was found!'});
						} else {
							res.json({ success: true, user: user });
						}
					});
				} else {
					res.json({success: false, message: 'Insufficient permissions!'});
				}
			}
		});
	});

	router.put('/edituser', function(req, res) {
		var editUser = req.body._id;
		if (req.body.name) var newName = req.body.name;
		if (req.body.email) var newEmail = req.body.email;
		if (req.body.permission) var newPermission = req.body.permission;
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				if (newName) {
					if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
						User.findOne({ _id: editUser}, function(err, user) {
							if (err) throw err;
							if (!user) {
							res.json({success: false, message: 'No user was found!!!'});
							} else {
								user.name = newName;
								user.save(function(err) {
									if (err) {
										console.log(err);
									} else {
										res.json({ success: true, message: 'Name has been updated.' });
									}
								});
							}
						});
					} else {
						res.json({success: false, message: 'Insufficient permissions!'});
					}
				}
				if (newEmail) {
					if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
						User.findOne({ _id: editUser}, function(err, user) {
							if (err) throw err;
							if (!user) {
							res.json({success: false, message: 'No user was found!'});
							} else {
								user.email = newEmail;
								user.save(function(err) {
									if (err) {
										console.log(err);
									} else {
										res.json({ success: true, message: 'Email has been updated.' });
									}
								});
							}
						});
					} else {
						res.json({success: false, message: 'Insufficient permissions!'});
					}
				}
				if (newPermission) {
					if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
						User.findOne({ _id: editUser}, function(err, user) {
							if (err) throw err;
							if (!user) {
							res.json({success: false, message: 'No user was found!'});
							} else {
								if (newPermission === 'user') {
									if (user.permission === 'admin') {
										if (mainUser.permission !== 'admin') {
											res.json({success: false, message: 'Insufficient permissions!'});
										} else {
											user.permission = newPermission;
											user.save(function(err) {
												if (err) {
													console.log(err);
												} else {
													res.json({ success: true, message: 'Permission has been updated.' });
												}
											});
										}
									} else {
										user.permission = newPermission;
										user.save(function(err) {
											if (err) {
												console.log(err);
											} else {
												res.json({ success: true, message: 'Permission has been updated.' });
											}
										});
									}
								}
								if (newPermission === 'moderator') {
									if (user.permission === 'admin') {
										if (mainUser.permission !== 'admin') {
											res.json({success: false, message: 'Insufficient permissions!'});
										} else {
											user.permission = newPermission;
											user.save(function(err) {
												if (err) {
													console.log(err);
												} else {
													res.json({ success: true, message: 'Permission has been updated.' });
												}
											});
										}
									} else {
										user.permission = newPermission;
										user.save(function(err) {
											if (err) {
												console.log(err);
											} else {
												res.json({ success: true, message: 'Permission has been updated.' });
											}
										});
									}
								}
								if (newPermission === 'admin') {
									if (mainUser.permission === 'admin') {
										user.permission = newPermission;
										user.save(function(err) {
											if (err) {
												console.log(err);
											} else {
												res.json({ success: true, message: 'Permission has been updated.' });
											}
										});
									} else {
										res.json({success: false, message: 'Insufficient permissions!'});
									}
								}
							}
						});
					} else {
						res.json({success: false, message: 'Insufficient permissions!'});
					}
				}
			}
		});
	});

	router.get('/myascentsCount', function(req, res) {
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

	router.get('/myascents/:limit/:page/:propertyname/:reverse', function(req, res) {
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
				}
			}
		});
	});


	router.post('/myascents', function(req, res) {	
			
		User.findOne({ email: req.decoded.email }, function(err, mainUser) {
			if (err) throw err;
			if (!mainUser) {
			res.json({success: false, message: 'No user was found!'});
		} else {
			var ascent = new Ascent();
			ascent.name = req.body.name;
			ascent.normalized = ascent.name.toLowerCase();
			ascent.style = req.body.style;
			ascent.grade = req.body.grade;
			ascent.sentBy = mainUser.email;
			ascent.date = req.body.date;
			ascent.sentByName = mainUser.name;
			if (req.body.name == null || req.body.name == '' || req.body.style == null || req.body.style == '' || req.body.grade == null || req.body.grade == '' || req.body.date == null || req.body.date == '') {
				res.json({success: false, message: 'Please make sure the fields are filled out properly!'});
			} else {
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

	router.delete('/myascents/:id', function(req, res) {
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

	router.put('/myascents', function(req, res) {
		var editedAscent = req.body._id;
		var newName = req.body.name;
		var newStyle = req.body.style;
		var newGrade = req.body.grade;
		var newDate = req.body.date;
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

	router.get('/myascents/:id', function(req, res) {
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

	router.get('/profile', function(req, res) {
		User.findOne({ email: req.decoded.email}, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				res.json({ success: true, user: user });
			}
		});
	});

	router.put('/profile', function(req, res) {
		var picture = req.body.picture;
		var editedUser = req.body.email;
		User.findOne({ email: editedUser}, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				user.picture = picture;
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

	router.get('/allascents', function(req, res) {
		Ascent.find({ }, function(err, ascents) {
			if (!ascents) {
				res.json({success: false, message: 'No ascent was found!'});
			} else {
				res.json({ success: true, ascents: ascents });
			}
		});
	});

	router.post('/ascents/', function(req, res) {
		if (req.body.gradeKeyword) {
			Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $eq: req.body.gradeKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }, function(err, ascents) {
				if (err) throw err;
				if (!ascents) {
					res.json({success: false, message: 'No ascent was found!'});
				} else {
					res.json({ success: true, ascents: ascents }); 
				}
			});
		} else if (req.body.gradeKeyword === '') {
			Ascent.find({ name: { $regex: req.body.nameKeyword, $options: "i" }, style: { $regex: req.body.styleKeyword, $options: "i" }, grade: { $regex: req.body.gradeKeyword }, sentByName: { $regex: req.body.senderKeyword, $options: "i" } }, function(err, ascents) {
				if (err) throw err;
				if (!ascents) {
					res.json({success: false, message: 'No ascent was found!'});
				} else {
					res.json({ success: true, ascents: ascents }); 
				}
			});
		}
	});

	router.get('/climbers/:keyword', function(req, res) {
		User.find({ name: { $regex: req.params.keyword, $options: "i" } }, function(err, climbers) {
			if (err) throw err;
			if (!climbers) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, climbers: climbers });
			}
		});
	});

	router.get('/climber/:email', function(req, res) {
		User.findOne({ email: req.params.email }, function(err, climber) {
			if (err) throw err;
			if (!climber) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, climber: climber });
			}
		});
	});

	router.get('/climberbyid/:id', function(req, res) {
		User.findOne({ _id: req.params.id }, function(err, climber) {
			if (err) throw err;
			if (!climber) {
				res.json({success: false, message: 'No climber was found!'});
			} else {
				res.json({ success: true, climber: climber });
			}
		});
	});

	router.get('/ascentsbyid/:id', function(req, res) {
		User.findOne({ _id: req.params.id }, function(err, user) {
			if (err) throw err;
			if (!user) {
				res.json({success: false, message: 'No user was found!'});
			} else {
				Ascent.find({ sentBy: user.email }, function(err, ascents) {
					if (!ascents) {
						res.json({success: false, message: 'No ascent was found!'});
					} else {
						res.json({ success: true, ascents: ascents });
					}
				});
			}
		});
	});





	return router;
}
