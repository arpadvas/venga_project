'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost/venga', function(err) {
	if (err) {
		console.log('There is error while connecting to NongoDB: ' + err);
	} else {
		console.log('Successfully connected to MongoDB!');
	}
});

app.get('/', function(req, res) {
	res.send('hello world!')
});

app.listen(process.env.PORT || 3000, function() {
	console.log('The server is running on port 3000!');
});