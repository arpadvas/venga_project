angular.module('userServices', [])

.factory('User', function($http) {
	userFactory = {};

	userFactory.create = function(regData) {
		return $http.post('/api/users', regData);
	}

	userFactory.checkEmail = function(regData) {
		return $http.post('/api/checkemail', regData);
	}

	userFactory.activeAccount = function(token) {
		return $http.put('/api/activate/' + token);
	}

	return userFactory;
});
