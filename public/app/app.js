angular.module('userApp', ['appRoutes', 'ngAnimate', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'managementController', 'ascentController', 'ascentServices'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});