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
	}

	return ascentFactory;
});