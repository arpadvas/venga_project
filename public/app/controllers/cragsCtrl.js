angular.module('cragsController', [])

.controller('cragsCtrl', function(Crag, $scope) {

	var app = this;

	app.search = function(searchByCragName) {
		if (searchByCragName) {
			app.loading = true;
			$scope.keyword = searchByCragName;
			Crag.getCrags($scope.keyword).then(function(data) {
				if (data.data.success) {
					app.loading = false;
					app.crags = data.data.crags;
					console.log(app.crags);
				} else {
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});
		}
	};
	
});