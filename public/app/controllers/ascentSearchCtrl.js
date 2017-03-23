angular.module('ascentSearchController', ['ascentServices'])

.controller('ascentSearchCtrl', function(Ascent, $filter, $scope, $rootScope, $location, paginationService, $timeout) {
	
	var app = this;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];
	app.propertyName = 'grade';
	app.reverse = true;
	app.pageSize = 6;
	app.totalCount = 0;
	app.pageNo = 1;


	 app.search = function(searchByName, searchByStyle, searchByGrade, searchBySender) {
		if (searchByName || searchByStyle || searchByGrade || searchBySender) {
			app.pageNo = 1
			app.loading = true;
			app.setclear = true;
			app.errorMsg = undefined;
			paginationService.setCurrentPage('search', 1);
			$scope.keywordData = {};
			if (searchByName) {
				$scope.keywordData.nameKeyword = searchByName;
			} 
			else {
				$scope.keywordData.nameKeyword = '';
			}
			if (searchByStyle) {
				$scope.keywordData.styleKeyword = searchByStyle;
			} 
			else {
				$scope.keywordData.styleKeyword = '';
			}
			if (searchByGrade) {
				$scope.keywordData.gradeKeyword = searchByGrade;
			} 
			else {
				$scope.keywordData.gradeKeyword = '';
			}
			if (searchBySender) {
				$scope.keywordData.senderKeyword = searchBySender;
			} 
			else {
				$scope.keywordData.senderKeyword = '';
			}
			Ascent.getAscentsCount($scope.keywordData).then(function(data) {
				if (data.data.success) {
					app.totalCount = data.data.count;
					$scope.keywordData.limit = app.pageSize;
					$scope.keywordData.page = app.pageNo;
					$scope.keywordData.propertyName = app.propertyName;
					$scope.keywordData.reverse = app.reverse;
					Ascent.getAscents($scope.keywordData).then(function(result) {
						if (result.data.success) {
							app.loading = false;
							app.setclear = false;
							app.ascents = result.data.ascents;
						} else {
							app.loading = false;
							app.setclear = false;
							app.errorMsg = result.data.message;
						}
					});
				} else {
					app.errorMsg = data.data.message;
					app.loading = false;
					app.ascents = undefined;
				}
			});
		}
	};


	app.clear = function() {
		app.pageNo = 1;
		app.setclear = true;
		paginationService.setCurrentPage('search', 1);
		app.ascents = undefined;
		$scope.searchByName = undefined; 
		$scope.searchByStyle = undefined;
		$scope.searchByGrade = undefined;
		$scope.searchBySender = undefined;
		$scope.keywordData = undefined;
	};

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      $scope.keywordData.propertyName = app.propertyName;
	  $scope.keywordData.reverse = app.reverse;
      app.loading = true;
      Ascent.getAscents($scope.keywordData).then(function(result) {
			if (result.data.success) {
				app.loading = false;
				app.ascents = result.data.ascents;
				app.setclear = false;
			} else {
				app.loading = false;
				app.errorMsg = result.data.message;
				app.setclear = false;
			}
		});
    };

    app.getAscents = function(pageNo) {
		if (!app.setclear) {
			app.loading = true;
			$scope.keywordData.page = pageNo;
			Ascent.getAscents($scope.keywordData).then(function(result) {
				if (result.data.success) {
					app.loading = false;
					app.ascents = result.data.ascents;
					app.setclear = false;
					app.pageNo = pageNo;
				} else {
					app.loading = false;
					app.errorMsg = result.data.message;
					app.setclear = false;
					app.pageNo = pageNo;
				}
			});
		} else {
			app.setclear = false;
		}
		
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

    if ($rootScope.outerSearch) {
		$scope.searchByName = $rootScope.outerSearchName;
		$scope.$on('$viewContentLoaded', function() {
			app.search($rootScope.outerSearchName);
			$rootScope.outerSearch = false;
		});
	}

});