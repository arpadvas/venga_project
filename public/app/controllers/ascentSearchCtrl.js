angular.module('ascentSearchController', ['ascentServices'])

.controller('ascentSearchCtrl', function(Ascent, $filter, $scope, $rootScope, $location, paginationService, $timeout) {
	
	var app = this;
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

	app.propertyName = 'grade';
	app.reverse = true;
	app.pageSize = 6;
	app.totalCount = 0;
	app.pageNo = 1;


	 app.search = function(searchByName, searchByStyle, searchByGrade, searchByCrag, searchByCountry, searchBySender) {
		if (searchByName || searchByStyle || searchByGrade || searchByCrag|| searchByCountry|| searchBySender) {
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
			if (searchByCrag) {
				$scope.keywordData.cragKeyword = searchByCrag;
			} 
			else {
				$scope.keywordData.cragKeyword = '';
			}
			if (searchByCountry) {
				$scope.keywordData.countryKeyword = searchByCountry;
			} 
			else {
				$scope.keywordData.countryKeyword = '';
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
		$scope.searchByCrag = undefined;
		$scope.searchByCountry = undefined;
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