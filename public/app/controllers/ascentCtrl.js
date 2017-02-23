angular.module('ascentController', ['ascentServices'])

.controller('ascentCtrl', function($http, $timeout, Ascent, $scope, $filter, User) {

	var app = this;
	app.loading = true;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];

	function getPropertyName() {
		User.getPropertyName().then(function(data) {
			if (data.data.success) {
				app.propertyName = data.data.propertyname;
				app.reverse = data.data.reverse;
			} else {
				app.errorMsg = data.data.message;
			}
		});
	}

	getPropertyName();

	function getMyAscents() {

		Ascent.getMyAscents().then(function(data) {
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

	getMyAscents();

	app.showMore = function(number) {
		app.searchErrorMsg = false;
		if (number>0) {
			app.limit = number;
		} else {
			app.searchErrorMsg = 'Please enter a valid number!';
		}
	};

	app.showAll = function() {
		app.limit = undefined;
		app.errorMsg = false;
		$scope.number = undefined;
	};

	app.addAscent = function(ascentData) {
		app.loading = true;
		app.errorMsg = false;
		if (app.ascentData) {
			app.ascentData.date = $scope.dt;
		}

		Ascent.addAscent(app.ascentData).then(function(data) {
			if (data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message;
				$timeout(function() {
					app.successMsg = false;
					$("#ascentModal").modal('hide');
					app.ascentData = undefined;
					getMyAscents();
					$scope.today();
				}, 1000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	app.deleteAscent = function(id) {
		Ascent.deleteAscent(id).then(function(data) {
			if (data.data.success) {
				getMyAscents();
			} else {
				app.errorMsg = data.data.message;
			}
		});
	};

	app.showAscentModal = function() {
		$("#ascentModal").modal({backdrop: "static"});

	};

	app.cancelAscentModal = function() {
		$("#ascentModal").modal('hide');
		app.ascentData = undefined;
		app.errorMsg = false;
		$scope.today();

	};

	app.showEditAscentModal = function(id) {
		app.errorMsg = false;
		$("#editAscentModal").modal({backdrop: "static"});
		Ascent.getAscent(id).then(function(data) {
			if (data.data.success) {
				$scope.newName = data.data.ascent.name;
				$scope.newStyle = data.data.ascent.style;
				$scope.newGrade = data.data.ascent.grade;
				$scope.dt = data.data.ascent.date;
				app.currentAscent = data.data.ascent._id;
			} else {
				app.errorMsg = data.data.message;
			}
		});

	};

	app.cancelEditAscentModal = function() {
		$("#editAscentModal").modal('hide');
		app.errorMsg = false;
		$scope.today();

	};

	app.saveAscent = function(newName, newStyle, newGrade) {
		var ascentObject = {};
		ascentObject._id = app.currentAscent;
		ascentObject.name = $scope.newName;
		ascentObject.style = $scope.newStyle;
		ascentObject.grade = $scope.newGrade;
		ascentObject.date = $scope.dt;
		app.loading = true;
		app.errorMsg = false;

		Ascent.editAscent(ascentObject).then(function(data) {
			if (data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message;
				$timeout(function() {
					app.successMsg = false;
					$("#editAscentModal").modal('hide');
					getMyAscents();
					$scope.today();
				}, 1000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	app.search = function(searchByName, searchByStyle, searchByGrade) {
		if (searchByName || searchByStyle || searchByGrade) {
			$scope.searchFilter = {};
			if (searchByName) {
				$scope.searchFilter.name = searchByName;
			}
			if (searchByStyle) {
				$scope.searchFilter.style = searchByStyle;
			}
			if (searchByGrade) {
				$scope.searchFilter.grade = searchByGrade;
			}
		}
	};

	app.clear = function() {
		$scope.searchFilter = undefined;
		$scope.searchByName = undefined;
		$scope.searchByStyle = undefined;
		$scope.searchByGrade = undefined;
	};

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.ascents = $filter('orderBy')(app.ascents, app.propertyName, app.reverse);
      app.updatePropertyName(app.propertyName, app.reverse);
    };

    app.updatePropertyName = function(propertyName, reverse) {
    	var propertyObject = {};
    	propertyObject.propertyname = app.propertyName;
    	propertyObject.reverse = app.reverse;
    	User.updatePropertyName(propertyObject);
    };


	// datepicker https://angular-ui.github.io/bootstrap/#!#datepicker
	$scope.today = function() {
    	$scope.dt = new Date();
    };
  	$scope.today();

  	$scope.clear = function() {
    	$scope.dt = null;
  	};

  	$scope.options = {
    	customClass: getDayClass,
    	minDate: new Date(),
    	showWeeks: true
  	};


  	$scope.toggleMin = function() {
    	$scope.options.minDate = $scope.options.minDate ? null : new Date();
  	};

  	$scope.toggleMin();

  	$scope.setDate = function(year, month, day) {
    	$scope.dt = new Date(year, month, day);
  	};

  	var tomorrow = new Date();
  	tomorrow.setDate(tomorrow.getDate() + 1);
  	var afterTomorrow = new Date(tomorrow);
  	afterTomorrow.setDate(tomorrow.getDate() + 1);
  	$scope.events = [
	    {
	      date: tomorrow,
	      status: 'full'
	    },
	    {
	      date: afterTomorrow,
	      status: 'partially'
	    }
  	];

 	function getDayClass(data) {
    	var date = data.date,
     	mode = data.mode;
    	if (mode === 'day') {
      		var dayToCheck = new Date(date).setHours(0,0,0,0);

      		for (var i = 0; i < $scope.events.length; i++) {
        		var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        		if (dayToCheck === currentDay) {
          			return $scope.events[i].status;
        		}
      		}
    	}

    return '';
  	}
  	// end of date-picker

});


