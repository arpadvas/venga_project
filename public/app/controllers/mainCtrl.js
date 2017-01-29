angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $interval, $window) {
	
	var app = this;

	app.loadme = false;

	app.checkSession = function() {
  		if (Auth.isLoggedIn()) {
  			app.checkingSession = true;
  			var interval = $interval(function() {
  				var token = $window.localStorage.getItem('token');
  				if (token === null) {
  					$interval.cancel(interval);
  				} else {
  					self.parseJwt = function(token) {
  						var base64Url = token.split('.')[1];
  						var base64 = base64Url.replace('-','+').replace('_','/');
  						return JSON.parse($window.atob(base64));
  					}
  					var expireTime = self.parseJwt(token);
  					var timeStamp = Math.floor(Date.now() / 1000);
  					console.log(expireTime.exp);
  					console.log(timeStamp)
  					var timeCheck = expireTime.exp - timeStamp;
  					console.log(timeCheck);
  				}
  			}, 2000);
  		}
  	};

  	app.checkSession();

	$rootScope.$on('$routeChangeStart', function() {
		if (!app.checkingSession) app.checkSession();

		if (Auth.isLoggedIn()) {
			app.isLoggedIn = true;
			Auth.getUser().then(function(data) {
				app.name = data.data.name;
				app.email = data.data.email;
				app.loadme = true;
		});
		} else {
			app.isLoggedIn = false;
			app.name = '';
			app.loadme = true;
		}
  	});

	
	this.doLogin = function(loginData) {
		app.loading = true;
		app.errorMsg = false;
		app.expired = false;
		app.disabled = true;

		Auth.login(app.loginData).then(function(data) {
			if(data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message + ' Redirecting...';
				$timeout(function() {
					$location.path('/');
					app.loginData = '';
					app.successMsg = false;
					app.checkSession();
				}, 2000);
			} else {
				if (data.data.expired) {
					app.expired = true;
					app.loading = false;
					app.errorMsg = data.data.message;
				} else {
					app.loading = false;
					app.disabled = false;
					app.errorMsg = data.data.message;
				}
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


