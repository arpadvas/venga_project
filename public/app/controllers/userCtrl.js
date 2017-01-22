angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

	var app = this;
	
	this.regUser = function(regData, valid) {
		app.loading = true;
		app.errorMsg = false;

		if (valid) {
			User.create(app.regData).then(function(data) {
				if(data.data.success) {
					app.loading = false;
					app.successMsg = data.data.message + ' Redirecting...';
					$timeout(function() {
						$location.path('/login');
					}, 2000);
				} else {
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});
		} else {
			app.loading = false;
			app.errorMsg = 'Please make sure the form is filled out properly!';
		}

	};

});


// .controller('regCtrl', function($http, $location, $timeout, User, Auth) {

// 	var app = this;
	
// 	this.regUser = function(regData) {
// 		app.loading = true;
// 		app.errorMsg = false;

// 		User.create(app.regData).then(function(data) {
// 			console.log(data.data.success);
// 			console.log(data.data.message);
// 			Auth.login(app.regData).then(function(data) {
// 			if(data.data.success) {
// 				app.loading = false;
// 				app.successMsg = data.data.message + ' Redirecting...';
// 				$timeout(function() {
// 					$location.path('/');
// 					app.loginData = '';
// 					app.successMsg = false;
// 				}, 2000);
// 			} else {
// 				app.loading = false;
// 				app.errorMsg = data.data.message;
// 			}
// 		});
// 		});

// 	};

// });

