var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/landing.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authenticated: false
	})

	.when('/home', {
		templateUrl: 'app/views/pages/home.html',
		authenticated: true
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authenticated: false
	})

	.when('/login', {
		templateUrl: 'app/views/pages/users/login.html',
		authenticated: false
	})

	.when('/facebook/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		authenticated: false,
		controller: 'facebookCtrl',
        controllerAs: 'facebook'
	})

	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html'
		// authenticated: true
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html',
		authenticated: true,
		controller: 'profileCtrl',
        controllerAs: 'profile'
	})

	.when('/myAscents', {
		templateUrl: 'app/views/pages/ascents/my_ascents.html',
		controller: 'ascentCtrl',
        controllerAs: 'ascent',
		authenticated: true
	})

	.when('/activate/:token', {
        templateUrl: 'app/views/pages/users/activation/activate.html',
        controller: 'emailCtrl',
        controllerAs: 'email',
        authenticated: false
    })

    .when('/resend', {
        templateUrl: 'app/views/pages/users/activation/resend.html',
        controller: 'resendCtrl',
        controllerAs: 'resend',
        authenticated: false
    })

    .when('/resetpassword', {
        templateUrl: 'app/views/pages/users/reset/password.html',
        controller: 'passwordCtrl',
        controllerAs: 'password',
        authenticated: false
    })

    .when('/reset/:token', {
        templateUrl: 'app/views/pages/users/reset/newpassword.html',
        controller: 'resetCtrl',
        controllerAs: 'reset',
        authenticated: false
    })

    .when('/management', {
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'moderator']
    })

    .when('/edituser/:id', {
        templateUrl: 'app/views/pages/management/edituser.html',
        controller: 'editUserCtrl',
        controllerAs: 'edituser',
        authenticated: true,
        permission: ['admin', 'moderator']
    })

    .when('/searchAscents', {
		templateUrl: 'app/views/pages/ascents/searchascents.html',
		controller: 'ascentSearchCtrl',
        controllerAs: 'ascentSearch',
		authenticated: true
	})

	.when('/searchClimbers', {
		templateUrl: 'app/views/pages/climbers/searchclimbers.html',
		controller: 'climberSearchCtrl',
        controllerAs: 'climberSearch',
		authenticated: true
	})

	.when('/climberprofile/:id', {
		templateUrl: 'app/views/pages/climbers/climberprofile.html',
		controller: 'climberProfileCtrl',
        controllerAs: 'climberProfile',
		authenticated: true
	})

	.otherwise( {redirectTo: '/'} );

	$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

});

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

	$rootScope.$on('$routeChangeStart', function(event, next, current) {

		if (next.$$route !== undefined) {

			if (next.$$route.authenticated == true) {
				if (!Auth.isLoggedIn()) {
					event.preventDefault();
					$location.path('/');
				} else if (next.$$route.permission) {
					User.getPermission().then(function(data) {
						if (next.$$route.permission[0] !== data.data.permission) {
							if (next.$$route.permission[1] !== data.data.permission) {
								event.preventDefault();
								$location.path('/');
							}
						}
					});
				}

			} else if (next.$$route.authenticated == false) {
				if (Auth.isLoggedIn()) {
					event.preventDefault();
					$location.path('/profile');
				}
			}
		}

  	});

}]);

