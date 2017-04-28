angular.module('cragServices', [])

.factory('Crag', function($http) {
	cragFactory = {};

	cragFactory.addcrag = function(cragData) {
		return $http.post('/api/crag', cragData);
	};

	cragFactory.checkCrag = function(name) {
		return $http.get('/api/checkcrag/' + name)
	};

	cragFactory.getAllCrags = function() {
		return $http.get('/api/allcrags');
	};

	cragFactory.getCrags = function(keywordData) {
		return $http.post('/api/crags', keywordData);
	};

	return cragFactory;
});
