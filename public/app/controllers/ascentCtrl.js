angular.module('ascentController', [])

.controller('ascentCtrl', function($http) {

	var app = this;

	app.addAscent = function(ascentData) {
		console.log(app.ascentData);
		$http.post('/api/myascents', app.ascentData);
	};

});
