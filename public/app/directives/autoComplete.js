angular.module('autocompleteDirective', [])

.directive('autocomplete', function() {

	return {
		restrict: 'E',
		templateUrl: 'app/views/template.html',
		scope: {
			hide: '=',
			datasource: '=',
			action: '&'
		},
		controller: function($scope) {
			this.log = function() {
				console.log('hi');
			};
		},
		link: function(scope, element, attr, ctrl) {
			ctrl.log();
		}
	};

});