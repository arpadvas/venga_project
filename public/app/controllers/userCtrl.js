angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User, $rootScope, $scope) {

	var app = this;
	
	this.regUser = function(regData, valid, confirmed) {
		app.loading = true;
		app.errorMsg = false;
		app.disabled = true;

		if (valid && confirmed) {
			User.create(app.regData).then(function(data) {
				if(data.data.success) {
					app.loading = false;
					app.successMsg = data.data.message + ' Redirecting...';
					$timeout(function() {
						$scope.$parent.login = true;
						$location.path('/');
					}, 2000);
				} else {
					app.loading = false;
					app.disabled = false;
					app.errorMsg = data.data.message;
				}
			});
		} else {
			app.loading = false;
			app.disabled = false;
			app.errorMsg = 'Please make sure the form is filled out properly!';
		}

	};

	this.checkEmail = function(regData) {

		app.checkingEmail = true;
		app.emailMsg = false;
		app.emailInvalid = false;

		User.checkEmail(app.regData).then(function(data) {
			if (data.data.success) {
				app.checkingEmail = false;
				app.emailInvalid = false;
				app.emailMsg = data.data.message;
			} else {
				app.checkingEmail = false;
				app.emailInvalid = true;
				app.emailMsg = data.data.message;
			}
		});	
	}

})

.controller('facebookCtrl', function($routeParams, Auth, $location) {
	Auth.facebook($routeParams.token);
	$location.path('/home');
})

.directive('match', function() {
  		return {
  			restrict: 'A',
  			controller: function($scope) {

  				$scope.confirmed = false;

  				$scope.doConfirm = function(values) {
  					values.forEach(function(ele) {

						if ($scope.confirm == ele) {
							$scope.confirmed = true;
						} else {
							$scope.confirmed = false;
						}	
  					});
  					
  				}
  			},
  			link: function(scope, element, attrs) {

  				attrs.$observe('match', function() {
  					scope.matches = JSON.parse(attrs.match);
  					scope.doConfirm(scope.matches);
  				});

  				scope.$watch('confirm', function() {
  					scope.matches = JSON.parse(attrs.match);
  					scope.doConfirm(scope.matches);
  				});
  			}
  		};
});


// .controller('regCtrl', function($http, $location, $timeout, User, Auth) {

// 	var app = this;
	
// 	this.regUser = function(regData) {
// 		app.loading = true;
// 		app.errorMsg = false;

// 		User.create(app.regData).then(function(data) {
// 			console.log(data.data.success);
// 			console.log(data.data.message);
// 			Auth.login(app.regData).then(function(data) {
// 			if(data.data.success) {
// 				app.loading = false;
// 				app.successMsg = data.data.message + ' Redirecting...';
// 				$timeout(function() {
// 					$location.path('/');
// 					app.loginData = '';
// 					app.successMsg = false;
// 				}, 2000);
// 			} else {
// 				app.loading = false;
// 				app.errorMsg = data.data.message;
// 			}
// 		});
// 		});

// 	};

// });

