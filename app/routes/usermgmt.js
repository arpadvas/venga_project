var User = require('../models/user');

module.exports = function(usermgmt) {

	usermgmt.get('/management', function(req, res) {
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


	usermgmt.delete('/management/:email', function(req, res) {
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

	usermgmt.get('/edituser/:id', function(req, res) {
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

	usermgmt.put('/edituser', function(req, res) {
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

	return usermgmt;

}



