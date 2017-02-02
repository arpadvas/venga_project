angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'managementController', 'ascentController'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});