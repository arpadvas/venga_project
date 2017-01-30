angular.module('mainController', ['authServices', 'userServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $interval, $window, $route, User, AuthToken) {
	
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
  					var timeCheck = expireTime.exp - timeStamp;
  					if (timeCheck <= 30000) {
  						console.log('Token has expired.');
  						showModal(1);
  						$interval.cancel(interval);
  					}
  				}
  			}, 60000);
  		}
  	};

  	app.checkSession();

  	var showModal = function(option) {

  		app.choiceMade = false;
  		app.modalHeader = undefined;
	  	app.modalBody = undefined;
	  	app.hideButton = false;

  		if (option === 1) {
  			app.modalHeader = 'Timeout warning';
	  		app.modalBody = 'Your session will expire in 5 minutes. Would you like to renew your session?';
	  		$("#myModal").modal({backdrop: "static"});
  		} else if (option === 2) {
  			app.hideButton = true;
  			app.modalHeader = 'Logging out...';
  			$("#myModal").modal({backdrop: "static"});
  			$timeout(function() {
	  			Auth.logout();
	  			$location.path('/');
	  			hideModal();
	  			$route.reload();
	  		}, 2000);
  		}
  	};

  	var hideModal = function() {
  		$("#myModal").modal('hide');
  	};

  	app.renewSession = function() {
  		app.choiceMade = true;
  		User.renewSession(app.email).then(function(data) {
  			if (data.data.success) {
  				AuthToken.setToken(data.data.token);
  				app.checkSession();
  			} else {
  				app.modalBody = data.data.message;
  			}
  		});
  		hideModal();
  	};

  	app.endSession = function() {
  		app.choiceMade = true;
  		$timeout(function() {
  			showModal(2);
  		}, 1000);
  		hideModal();
  	};

	$rootScope.$on('$routeChangeStart', function() {
		if (!app.checkingSession) app.checkSession();

		if (Auth.isLoggedIn()) {
			app.isLoggedIn = true;
			Auth.getUser().then(function(data) {
				app.name = data.data.name;
				app.email = data.data.email;
        User.getPermission().then(function(data) {
          if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
              app.authorized = true;
              app.loadme = true;
          } else {
            app.loadme = true;
          }
        });
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

	app.logout = function() {
		showModal(2);
	};

});


