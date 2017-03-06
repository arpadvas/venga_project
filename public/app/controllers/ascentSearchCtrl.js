angular.module('ascentSearchController', ['ascentServices'])

.controller('ascentSearchCtrl', function(Ascent, $filter, $scope, $rootScope, $location) {
	
	var app = this;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];
	app.propertyName = 'grade';
	app.reverse = true;
	app.pageSize = 6;


	 app.search = function(searchByName, searchByStyle, searchByGrade, searchBySender) {
		if (searchByName || searchByStyle || searchByGrade || searchBySender) {
			app.loading = true;
			$scope.keywordData = {};
			if (searchByName) {
				$scope.keywordData.nameKeyword = searchByName;
			} else {
				$scope.keywordData.nameKeyword = '';
			}
			if (searchByStyle) {
				$scope.keywordData.styleKeyword = searchByStyle;
			} else {
				$scope.keywordData.styleKeyword = '';
			}
			if (searchByGrade) {
				$scope.keywordData.gradeKeyword = searchByGrade;
			} else {
				$scope.keywordData.gradeKeyword = '';
			}
			if (searchBySender) {
				$scope.keywordData.senderKeyword = searchBySender;
			} else {
				$scope.keywordData.senderKeyword = '';
			}
			Ascent.getAscents($scope.keywordData).then(function(data) {
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
	};

	if ($rootScope.outerSearch) {
		$scope.searchByName = $rootScope.outerSearchName;
		app.search($rootScope.outerSearchName);
		$rootScope.outerSearch = false;
	}



	app.clear = function() {
		$scope.searchByName = undefined; 
		$scope.searchByStyle = undefined;
		$scope.searchByGrade = undefined;
		$scope.searchBySender = undefined;
		$scope.keywordData = undefined;
		app.ascents = undefined;
	};

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.ascents = $filter('orderBy')(app.ascents, app.propertyName, app.reverse);
    };

    app.openProfile = function(climberEmail) {
    	Ascent.getClimber(climberEmail).then(function(data) {
    		if (data.data.success) {
    			app.climber = {};
    			app.climber.id = data.data.climber._id;
    			$location.path('/climberprofile/' + app.climber.id);
    		}
    	});
    };

});