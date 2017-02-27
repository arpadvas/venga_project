angular.module('emailController', ['userServices'])

.controller('emailCtrl', function($routeParams, User, $timeout, $location) {

	app = this;

	User.activeAccount($routeParams.token).then(function(data) {
		
		app.successMsg = false;
		app.errorMsg = false;

		if (data.data.success) {
			app.successMsg = data.data.message + ' Redirecting...';
					$timeout(function() {
						$location.path('/login');
					}, 2000);
		} else {
			app.errorMsg = data.data.message + ' Redirecting...';
					$timeout(function() {
						$location.path('/login');
					}, 2000);
		}
	});

})

.controller('resendCtrl', function(User) {

	app = this;

	this.checkCredentials = function(loginData) {

		app.errorMsg = false;
		app.successMsg = false;
		app.disabled = true;

		User.checkCredentials(app.loginData).then(function(data) {
			if (data.data.success) {
				User.resendLink(app.loginData).then(function(data) {
					app.successMsg = data.data.message;
				});
			} else {
				app.errorMsg = data.data.message;
				app.disabled = false;
			}
		});
	};

})

.controller('passwordCtrl', function(User) {

	app = this;

	this.sendPassword = function(resetData, valid) {

		app.errorMsg = false;
		app.loading = true;
		app.disabled = true;

		if (valid) {

			User.sendPassword(app.resetData).then(function(data) {
				app.loading = false;

				if (data.data.success) {
					app.successMsg = data.data.message;
				} else {
					app.disabled = false;
					app.errorMsg = data.data.message;
				}
			});

		} else {
			app.loading = false;
			app.disabled = false;
			app.errorMsg = 'Please enter a valid email!';

		}

	};

})

.controller('resetCtrl', function($routeParams, User, $scope, $timeout, $location) {

	app = this;
	app.hide = true;

	User.resetUser($routeParams.token).then(function(data) {
		if (data.data.success) {
			app.hide = false;
			app.successMsg = 'Please enter a new password.';
			$scope.email = data.data.user.email;
		} else {
			app.errorMsg = data.data.message;
		}
	});

	this.savePassword = function(regData, valid, confirmed) {

		app.errorMsg = false;
		app.disabled = true;
		app.loading = true;

		if (valid && confirmed) {
			app.regData.email = $scope.email;
			User.savePassword(app.regData).then(function(data) {
				app.loading = false;
				if (data.data.success) {
					app.successMsg = data.data.message + ' Redirecting...';
					$timeout(function() {
						$location.path('/login');
					}, 2000);
				} else {
					app.loading = false;
					app.disabled = false;
					app.errorMsg = data.data.message;
				}
			});
		} else {
			app.loading = false;
			app.disabled = false;
			app.errorMsg = 'Please make sure the form is filled out properly!';
		}

	};

});







