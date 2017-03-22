'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var profile = express.Router();
var userMgmt = express.Router();
var myascents = express.Router();
var ascentsearch = express.Router();
var climbersearch = express.Router();
var climberprofile = express.Router();
var appRoutes = require('./app/routes/api')(router);
var profileRoutes = require('./app/routes/profile')(profile);
var userMgmtRoutes = require('./app/routes/usermgmt')(userMgmt);
var myascentsRoutes = require('./app/routes/myascents')(myascents);
var ascentSearchRoutes = require('./app/routes/ascentsearch')(ascentsearch);
var climberSearchRoutes = require('./app/routes/climbersearch')(climbersearch);
var climberProfileRoutes = require('./app/routes/climberprofile')(climberprofile);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
app.use('/api', profileRoutes);
app.use('/api', userMgmtRoutes);
app.use('/api', myascentsRoutes);
app.use('/api', ascentSearchRoutes);
app.use('/api', climberSearchRoutes);
app.use('/api', climberProfileRoutes);

mongoose.connect('mongodb://avas:123456@ds145359.mlab.com:45359/venga', function(err) {
	if (err) {
		console.log('There is error while connecting to NongoDB: ' + err);
	} else {
		console.log('Successfully connected to MongoDB!');
	}
});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(process.env.PORT || 3000, function() {
	console.log('The server is running on port 3000!');
});