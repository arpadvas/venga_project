angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register'
	})

	.otherwise( {redirectTo: '/'} );

	$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

});