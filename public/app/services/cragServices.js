angular.module('cragServices', [])

.factory('Crag', function($http) {
	cragFactory = {};

	cragFactory.addcrag = function(cragData) {
		return $http.post('/api/crag', cragData);
	};

	return cragFactory;
});