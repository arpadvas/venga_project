angular.module('ascentController', ['ascentServices'])

.controller('ascentCtrl', function($http, $timeout, Ascent, $scope, $filter, User, $location, $rootScope) {

	var app = this;
	app.loading2 = true;
	app.grades = ['3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', 
				'7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+'];
	app.styles = ['Redpoint', 'On-sight', 'Flash', 'Top-rope'];
 	app.pageSize = 6;

 	app.nameList = [  
           "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"  
      ];  
    app.hidethis = true;

    app.complete = function(string){  
        if (string.length > 1) {
         	app.hidethis = false;  
             var output = [];  
             angular.forEach(app.nameList, function(name){  
                if(name.toLowerCase().indexOf(string.toLowerCase()) >= 0) {  
                    output.push(name);  
                }  
            });  
            app.filterName = output;
        } else {
            app.hidethis = true;
        }
    } 

    app.fillTextbox = function(string){  
        app.name = string; 
        app.ascentData.name = app.name; 
        app.hidethis = true;   
    }


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
				app.loading2 = false;
				app.ascents = data.data.ascents;
				app.ascents = $filter('orderBy')(data.data.ascents, app.propertyName, app.reverse);
			} else {
				app.loading2 = false;
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
		app.ascentData = {};
		app.name = undefined;
		app.hidethis = true;
		$("#ascentModal").modal({backdrop: "static"});

	};

	app.cancelAscentModal = function() {
		$("#ascentModal").modal('hide');
		app.ascentData = undefined;
		app.name = undefined;
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

	app.search = function(searchByAscent, searchByStyle, searchByGrade) {
		if (searchByAscent || searchByStyle || searchByGrade) {
			$scope.searchFilter = {};
			if (searchByAscent) {
				$scope.searchFilter.name = searchByAscent;
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
		$scope.searchByAscent = undefined;
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

     app.openSearch = function(ascentName) {
    	$location.path('/searchAscents');
    	$rootScope.outerSearch = true;
    	$rootScope.outerSearchName = ascentName;
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


