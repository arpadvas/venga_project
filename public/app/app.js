angular.module('userApp', ['appRoutes', 'ngAnimate', 'ngMaterial', 'ngMessages', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'managementController', 'ascentController', 'ascentServices'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});