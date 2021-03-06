angular.module('ascentServices', [])

.factory('Ascent', function($http) {
	ascentFactory = {};

	ascentFactory.addAscent = function(ascentData) {
		return $http.post('/api/myascents', ascentData);
	};

	ascentFactory.getMyAscents = function(limit, page, propertyName, reverse) {
		return $http.get('/api/myascents/' + limit + '/' + page + '/' + propertyName + '/' + reverse);
	};

	ascentFactory.getMyascentsCount = function() {
		return $http.get('/api/myascentsCount/');
	};

	ascentFactory.deleteAscent = function(id) {
		return $http.delete('/api/myascents/' + id);
	};

	ascentFactory.getAscent = function(id) {
		return $http.get('/api/myascents/' + id);
	}

	ascentFactory.editAscent = function(id) {
		return $http.put('/api/myascents', id);
	};

	ascentFactory.getAllAscents = function() {
		return $http.get('/api/allascents');
	};

	ascentFactory.getAscents = function(keywordData) {
		return $http.post('/api/ascents', keywordData);
	};

	ascentFactory.getAscentsCount = function(keywordData) {
		return $http.post('/api/ascentscount', keywordData);
	};

	ascentFactory.getClimbers = function(keyword, limit, page, propertyName, reverse) {
		return $http.get('/api/climbers/' + keyword + '/' + limit + '/' + page + '/' + propertyName + '/' + reverse);
	};

	ascentFactory.getClimbersCount = function(keyword) {
		return $http.get('/api/climberscount/' + keyword);
	};

	ascentFactory.getClimber = function(name) {
		return $http.get('/api/climber/' + name);
	};

	ascentFactory.getClimberByID = function(id) {
		return $http.get('/api/climberbyid/' + id);
	};

	ascentFactory.getClimberAscentsCount = function(id) {
		return $http.get('/api/ascentscountbyid/' + id);
	};

	ascentFactory.getClimberAscents = function(id, limit, page, propertyName, reverse) {
		return $http.get('/api/ascentsbyid/' + id + '/' + limit + '/' + page + '/' + propertyName + '/' + reverse);
	};

	return ascentFactory;
});