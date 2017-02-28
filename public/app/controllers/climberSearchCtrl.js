angular.module('climberSearchController', ['ascentServices'])

.controller('climberSearchCtrl', function(Ascent, $filter, $scope) {
	
	var app = this;
	app.pageSize = 6;
	app.propertyName = 'name';
	app.reverse = false;

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.climbers = $filter('orderBy')(app.climbers, app.propertyName, app.reverse);
    };

    app.search = function(searchByClimberName) {
		if (searchByClimberName) {
			app.loading = true;
			$scope.keyword = searchByClimberName;
			Ascent.getClimbers($scope.keyword).then(function(data) {
				if (data.data.success) {
					app.loading = false;
					app.climbers = data.data.climbers;
					app.climbers = $filter('orderBy')(data.data.climbers, app.propertyName, app.reverse);
				} else {
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});
		}
	};

	app.clear = function() {
		$scope.searchByClimberName = undefined;
		app.climbers = undefined;
	};

});