angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
	
	var app = this;

	$rootScope.$on('$routeChangeStart', function() {
		if (Auth.isLoggedIn()) {
			console.log('Succes: User is logged in.');
			app.isLoggedIn = true;
			Auth.getUser().then(function(data) {
				console.log(data.data.name);
				app.name = data.data.name;
				app.email = data.data.email;
		});
		} else {
			console.log('Succes: User is not logged in.');
			app.isLoggedIn = false;
			app.name = '';
		}
  	});
	
	this.doLogin = function(loginData) {
		app.loading = true;
		app.errorMsg = false;

		Auth.login(app.loginData).then(function(data) {
			console.log(data.data.success);
			console.log(data.data.message);
			if(data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message + ' Redirecting...';
				$timeout(function() {
					$location.path('/');
					app.loginData = '';
					app.successMsg = false;
				}, 2000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	this.logout = function() {
		Auth.logout();
		$location.path('/logout');
		$timeout(function() {
					$location.path('/');
				}, 2000);
	};

});


