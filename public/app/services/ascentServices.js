angular.module('ascentServices', [])

.factory('Ascent', function($http) {
	ascentFactory = {};

	//Ascent.addAscent();
	ascentFactory.addAscent = function(ascentData) {
		return $http.post('/api/myascents', ascentData);
	};

	//Ascent.getMyAscents();
	ascentFactory.getMyAscents = function() {
		return $http.get('/api/myascents');
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

	ascentFactory.getClimbers = function(keyword) {
		return $http.get('/api/climbers/' + keyword);
	};

	ascentFactory.getClimber = function(name) {
		return $http.get('/api/climber/' + name);
	};

	ascentFactory.getClimberByID = function(id) {
		return $http.get('/api/climberbyid/' + id);
	};

	ascentFactory.getClimberAscents = function(id) {
		return $http.get('/api/ascentsbyid/' + id);
	};

	return ascentFactory;
});