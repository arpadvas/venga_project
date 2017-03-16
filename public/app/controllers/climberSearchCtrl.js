angular.module('climberSearchController', ['ascentServices'])

.controller('climberSearchCtrl', function(Ascent, $filter, $scope, $location, $rootScope, paginationService) {
	
	var app = this;

	app.pageSize = 6;
	app.propertyName = 'name';
	app.reverse = false;
	app.totalCount = 0;
	app.pageNo = 1;

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.loading = true;
      Ascent.getClimbers($scope.keyword, app.pageSize, app.pageNo, app.propertyName, app.reverse).then(function(result) {
			if (result.data.success) {
				app.loading = false;
				app.climbers = result.data.climbers;
				app.setclear = false;
			} else {
				app.loading = false;
				app.errorMsg = result.data.message;
				app.setclear = false;
			}
		});
    };

	app.getClimbers = function(pageNo) {
		if (!app.setclear) {
			app.loading = true;
			Ascent.getClimbers($scope.keyword, app.pageSize, pageNo, app.propertyName, app.reverse).then(function(result) {
				if (result.data.success) {
					app.loading = false;
					app.climbers = result.data.climbers;
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

	app.search = function(searchByClimberName) {
		if (searchByClimberName) {
			app.pageNo = 1
			app.loading = true;
			app.setclear = true;
			paginationService.setCurrentPage('search', 1);
			
			$scope.keyword = searchByClimberName;
			Ascent.getClimbersCount($scope.keyword).then(function(data) {
				if (data.data.success) {
					app.totalCount = data.data.count;
					Ascent.getClimbers($scope.keyword, app.pageSize, app.pageNo, app.propertyName, app.reverse).then(function(result) {
						if (result.data.success) {
							app.loading = false;
							app.setclear = false;
							app.climbers = result.data.climbers;
						} else {
							app.loading = false;
							app.setclear = false;
							app.errorMsg = data.data.message;
						}
					});
				} else {
					app.errorMsg = result.data.message;
				}
			});
		}
	};

	app.clear = function() {
		app.pageNo = 1;
		app.setclear = true;
		paginationService.setCurrentPage('search', 1);
		app.climbers = undefined;
		$scope.searchByClimberName = undefined;
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