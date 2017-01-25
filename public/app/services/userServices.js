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

	userFactory.checkCredentials = function(loginData) {
		return $http.post('/api/resend', loginData);
	}

	userFactory.resendLink = function(email) {
		return $http.put('/api/resend', email);
	}

	return userFactory;
});
