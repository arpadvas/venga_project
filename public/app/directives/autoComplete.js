angular.module('autocompleteDirective', [])

.directive('autocomplete', function() {

	return {
		restrict: 'E',
		templateUrl: 'app/views/template.html',
		scope: {
			input: '=',
			datasource: '=',
			hide: '='
		},
		controller: function($scope) {

			$scope.hide = true;

			$scope.complete = function(inputString){  
		        if (inputString.length > 1) {  
		            var output = [];  
		            for (var i=0; i < $scope.datasource.length; i++) {
		            	if($scope.datasource[i].name.toLowerCase().indexOf(inputString.toLowerCase()) >= 0) {  
		                    output.push($scope.datasource[i].name);  
		                }  
		              
		            } 
		            $scope.filteredList = [];
		            $.each(output, function(i, el){
					    if($.inArray(el, $scope.filteredList) === -1) $scope.filteredList.push(el);
					});
					if ($scope.filteredList.length > 0) {
		            	$scope.hide = false;
		            } else {
		            	$scope.hide = true;
		            }

		        } else {
		            $scope.hide = true;
		        }
		    };

		    $scope.fillTextbox = function(string){  
		        $scope.input = string;
		        $scope.hide = true;
		    }
		}
	};

});