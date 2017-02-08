angular.module('userApp', ['appRoutes', 'ngAnimate', 'ngTouch', 'ui.bootstrap' , 'DateController', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'managementController', 'ascentController', 'ascentServices'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});

// 'ngMaterial', 'ngMessages',