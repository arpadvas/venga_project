angular.module('userControllers', [])

.controller('regCtrl', function($http, $location, $timeout) {

	var app = this;
	
	this.regUser = function(regData) {
		app.loading = true;
		app.errorMsg = false;
		$http.post('/api/users', this.regData).then(function(data) {
			console.log(data.data.success);
			console.log(data.data.message);
			if(data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message + ' Redirecting...';
				$timeout(function() {
					$location.path('/');
				}, 2000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

});
