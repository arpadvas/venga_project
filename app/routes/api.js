var User = require('../models/user');

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
			res.json({success: false, message: 'Email alredy exist!'});
		} else {
			res.json({success: true, message: 'User created!'});
		}
		});
	}
	});
	return router;
}