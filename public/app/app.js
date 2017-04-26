angular.module('userApp', 
	[
	'appRoutes', 
	'ngAnimate', 
	'ngTouch', 
	'ui.bootstrap' , 
	'angular-filepicker', 
	'angularUtils.directives.dirPagination', 
	'userControllers', 
	'userServices', 
	'mainController', 
	'authServices', 
	'emailController', 
	'managementController', 
	'ascentController', 
	'ascentServices', 
	'profileController', 
	'ascentSearchController', 
	'climberSearchController',
	'autocompleteDirective',
	'cragServices',
	'cragsController'
	])

.config(function($httpProvider, filepickerProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
	filepickerProvider.setKey('Ay5j7d8n6SjWjkhUeHOHxz');
});

