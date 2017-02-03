angular.module('ascentController', ['ascentServices'])

.controller('ascentCtrl', function($http, $timeout, Ascent) {

	var app = this;
	app.loading = true;


	function getMyAscents() {

		Ascent.getMyAscents().then(function(data) {
			if (data.data.success) {
				console.log(data.data.ascents);
				app.loading = false;
				app.ascents = data.data.ascents;
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	}

	getMyAscents();

	app.addAscent = function(ascentData) {
		app.loading = true;
		app.errorMsg = false;

		Ascent.addAscent(app.ascentData).then(function(data) {
			if (data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message;
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
			$timeout(function() {
				app.successMsg = false;
				getMyAscents();
			}, 1000);
		});
	};

	app.deleteAscent = function(id) {
		Ascent.deleteAscent(id).then(function(data) {
			if (data.data.success) {
				getMyAscents();
			} else {
				app.errorMsg = data.data.message;
			}
		});
	};


});
