angular.module('ascentSearchController', ['ascentServices'])

.controller('ascentSearchCtrl', function(Ascent, $filter, $scope, $rootScope, $location) {
	
	var app = this;
	app.loading = true;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];
	app.propertyName = 'grade';
	app.reverse = true;
	app.pageSize = 6;

	function getAscents() {

		Ascent.getAscents().then(function(data) {
			if (data.data.success) {
				app.loading = false;
				app.ascents = data.data.ascents;
				app.ascents = $filter('orderBy')(data.data.ascents, app.propertyName, app.reverse);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	}

	getAscents();

	app.search = function(searchByName, searchByStyle, searchByGrade, searchBySender) {
		if (searchByName || searchByStyle || searchByGrade || searchBySender) {
			$rootScope.searchFilter2 = {};
			$rootScope.limit = undefined;
			if (searchByName) {
				$rootScope.searchFilter2.name = searchByName;
			}
			if (searchByStyle) {
				$scope.searchFilter2.style = searchByStyle;
			}
			if (searchByGrade) {
				$scope.searchFilter2.grade = searchByGrade;
			}
			if (searchBySender) {
				$scope.searchFilter2.sentByName = searchBySender;
			}
		}
	};

	app.clear = function() {
		$rootScope.searchFilter2 = undefined;
		$rootScope.searchByName = undefined;
		$scope.searchByName = undefined;
		$scope.searchByStyle = undefined;
		$scope.searchByGrade = undefined;
		$scope.searchBySender = undefined;
		$rootScope.limit = 0;
	};

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.ascents = $filter('orderBy')(app.ascents, app.propertyName, app.reverse);
    };

    app.openProfile = function(climberName) {
    	$rootScope.loadingProfile = true;
    	$rootScope.loadedProfile = false;
    	$location.path('/climberprofile');
    	Ascent.getClimber(climberName).then(function(data) {
    		if (data.data.success) {
    			$rootScope.loadingProfile = false;
    			$rootScope.loadedProfile = true;
    			$rootScope.climber = {};
    			$rootScope.climber.name = data.data.climber.name;
    			$rootScope.climber.email = data.data.climber.email;
    			$rootScope.climber.picture = data.data.climber.picture;
    		} else {
				$rootScope.loadingProfile = false;
			}
    	});
    };

});