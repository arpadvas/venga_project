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

	userFactory.sendPassword = function(resetData) {
		return $http.put('/api/resetpassword', resetData);
	}

	userFactory.resetUser = function(token) {
		return $http.get('/api/resetpassword/' + token);
	}

	userFactory.savePassword = function(regData) {
		return $http.put('/api/savepassword', regData);
	}

	userFactory.renewSession = function(email) {
		return $http.get('/api/renewToken/' + email);
	}

	userFactory.getPermission = function() {
		return $http.get('/api/permission');
	}

	return userFactory;
});
