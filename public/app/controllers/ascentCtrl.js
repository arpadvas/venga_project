angular.module('ascentController', ['ascentServices', 'cragServices'])

.controller('ascentCtrl', function($http, $timeout, Ascent, $scope, $filter, User, $location, $rootScope, $route, Crag) {

	var app = this;

	app.loading2 = true;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];

	app.country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
		,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
		,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
		,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
		,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
		,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
		,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
		,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
		,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
		,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
		,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
		,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
		,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
		,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
		,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

 	app.pageSize = 10;
 	app.pageNo = 1;
 	app.totalCount = 0;

    app.ascentList = [];
  	
// get ascents when page load////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

	app.getMyAscents = function(pageNo) {

		app.pageSize = 10;
		app.loading2 = true;
		app.pageNo = pageNo;
		Ascent.getMyAscents(app.pageSize, pageNo, app.propertyName, app.reverse).then(function(data) {
			if (data.data.success) {
				app.loading2 = false;
				app.ascents = data.data.ascents;
			} else {
				app.loading2 = false;
				app.errorMsg = data.data.message;
			}
		});
	}

	function getMyascentsCount() {
		Ascent.getMyascentsCount().then(function(data) {
			if (data.data.success) {
				app.totalCount = data.data.count;
				app.getMyAscents(app.pageNo);
			} else {
				app.loading2 = false;
				app.errorMsg = data.data.message;
			}
		});
	}

	getMyascentsCount();


// sort ascents/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

	app.sortBy = function(propertyName) {
	  app.reverse = (propertyName !== null && app.propertyName === propertyName)
	     ? !app.reverse : false;
      app.propertyName = propertyName;
      app.loading2 = true;
      	Ascent.getMyAscents(app.pageSize, app.pageNo, app.propertyName, app.reverse).then(function(data) {
			if (data.data.success) {
				app.loading2 = false;
				app.ascents = data.data.ascents;
			} else {
				app.loading2 = false;
				app.errorMsg = data.data.message;
			}
		});
      app.updatePropertyName(app.propertyName, app.reverse);
    };


// adding ascents////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getAllAscents() {

    	Ascent.getAllAscents().then(function(data) {
    		if (data.data.success) {
    			for (var i = 0; i < data.data.ascents.length; i++) {
    				app.ascentList.push(data.data.ascents[i].name);
    			}
    		} else {
    			console.log(data.data.success);
    		}
    	});
    }

    function toTitleCase(str) {
	    return str.replace(/\w\S*/g, function(txt){
	    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}

    function addAscent() {
    	return Ascent.addAscent(app.ascentData).then(function(data) {
			if (data.data.success) {
				app.loading = false;
				app.successMsg = data.data.message;
				$timeout(function() {
					app.successMsg = false;
					$("#ascentModal").modal('hide');
					app.ascentData = undefined;
					$scope.today();
					$route.reload();
				}, 1000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
    }

    function addCrag() {
    	app.cragData = {};
		app.cragData.cragName = toTitleCase(app.ascentData.crag);
		app.cragData.country = app.ascentData.country;
		Crag.checkCrag(app.cragData.cragName).then(function(data) {
			if (data.data.success) {
				console.log(data.data.message);
			} else {
				Crag.addcrag(app.cragData).then(function(response) {
					console.log(response.data.message); 
				});
			}
		});
    }

    function reportProblems(error) {
	    app.errorMsg = error.data.message;
	}

    app.addAscent = function(ascentData) {
		app.loading = true;
		app.errorMsg = false;
		if (app.ascentData) {
			app.ascentData.date = $scope.dt;
		}

		addAscent()
			.then(addCrag)
			.catch(reportProblems);

	};

	app.showAscentModal = function() {
		app.ascentData = {};
		app.hideName = true;
		getAllAscents();
		$("#ascentModal").modal({backdrop: "static"});

	};

	app.cancelAscentModal = function() {
		$("#ascentModal").modal('hide');
		app.ascentData = undefined;
		app.errorMsg = false;
		$scope.today();

	};

// updating ascents/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

	app.deleteAscent = function(id) {
		Ascent.deleteAscent(id).then(function(data) {
			if (data.data.success) {
				//app.getMyAscents(app.pageNo);
				$route.reload();
			} else {
				app.errorMsg = data.data.message;
			}
		});
	};


	app.showEditAscentModal = function(id) {
		app.errorMsg = false;
		$("#editAscentModal").modal({backdrop: "static"});
		Ascent.getAscent(id).then(function(data) {
			if (data.data.success) {
				$scope.newName = data.data.ascent.name;
				$scope.newStyle = data.data.ascent.style;
				$scope.newGrade = data.data.ascent.grade;
				$scope.newCrag = data.data.ascent.crag;
				$scope.newCountry = data.data.ascent.country;
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
		ascentObject.crag = $scope.newCrag;
		ascentObject.country = $scope.newCountry;
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
					//app.getMyAscents(app.pageNo);
					$scope.today();
					$route.reload();
				}, 1000);
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

// helper functions////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    app.updatePropertyName = function(propertyName, reverse) {
    	var propertyObject = {};
    	propertyObject.propertyname = app.propertyName;
    	propertyObject.reverse = app.reverse;
    	User.updatePropertyName(propertyObject);
    };

     app.openSearch = function(ascentName) {
    	$location.path('/searchAscents');
    	$rootScope.outerSearch = true;
    	$rootScope.outerSearchName = ascentName;
    };


// datepicker https://angular-ui.github.io/bootstrap/#!#datepicker///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


});


