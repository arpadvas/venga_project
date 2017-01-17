angular.module('userControllers', [])

.controller('regCtrl', function($http, $location) {

	var app = this;
	
	this.regUser = function(regData) {
		app.loading = true;
		app.errorMsg = false;
		console.log('form submitted');
		$http.post('/api/users', this.regData).then(function(data) {
			console.log(data.data.success);
			console.log(data.data.message);
			if(data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message;
				$location.path('/');
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

});
