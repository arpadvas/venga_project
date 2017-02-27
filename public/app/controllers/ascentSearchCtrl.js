angular.module('ascentSearchController', ['ascentServices'])

.controller('ascentSearchCtrl', function(Ascent, $filter, $scope, $rootScope) {
	
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

});