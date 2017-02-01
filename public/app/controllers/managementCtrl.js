angular.module('managementController', [])

.controller('managementCtrl', function(User, $scope) {
	var app = this;
	app.loading = true;
	app.accessDenied = true;
	app.errorMsg = false;
	app.editAccess = false;
	app.deleteAccess = false;
	app.limit = 5;

	function getUsers() {
		User.getUsers().then(function(data) {
			if (data.data.success) {
				if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
					app.users = data.data.users;
					app.loading = false;
					app.accessDenied = false;
					if (data.data.permission === 'admin') {
						app.editAccess = true;
						app.deleteAccess = true;
					} else if (data.data.permission === 'moderator') {
						app.editAccess = true;
					}
				} else {
					app.errorMsg = 'Insufficient permissions!';
					app.loading = false;
				}
			} else {
				app.errorMsg = data.data.message;
				app.loading = false;
			}
		});
	}

	getUsers();

	app.showMore = function(number) {
		app.errorMsg = false;
		if (number>0) {
			app.limit = number;
		} else {
			app.errorMsg = 'Please enter a valid number!';
		}
	};

	app.showAll = function() {
		app.limit = undefined;
		app.errorMsg = false;
		$scope.number = undefined;
	};

	app.deleteUser = function(email) {
		User.deleteUser(email).then(function(data) {
			if (data.data.success) {
				getUsers();
			} else {
				app.errorMsg = data.data.message;
			}
		});
	};

})

.controller('editUserCtrl', function($scope, $routeParams, User, $timeout) {
	var app = this;
	$scope.nameTab = 'active';
	$scope.emailTab = 'default';
	$scope.permissionTab = 'default';
	app.phase1 = true;

	User.getUser($routeParams.id).then(function(data) {
			if (data.data.success) {
				$scope.newName = data.data.user.name;
				$scope.newEmail = data.data.user.email;
				$scope.newPermission = data.data.user.permission;
				app.currentUser = data.data.user._id;
			} else {
				app.errorMsg = data.data.message;
			}
	});


	app.namePhase = function() {
		$scope.nameTab = 'active';
		$scope.emailTab = 'default';
		$scope.permissionTab = 'default';
		app.phase1 = true;
		app.phase2 = false;
		app.phase3 = false;
		app.errorMsg = false;

	};

	app.emailPhase = function() {
		$scope.nameTab = 'default';
		$scope.emailTab = 'active';
		$scope.permissionTab = 'default';
		app.phase1 = false;
		app.phase2 = true;
		app.phase3 = false;
		app.errorMsg = false;

	};

	app.permissionPhase = function() {
		$scope.nameTab = 'default';
		$scope.emailTab = 'default';
		$scope.permissionTab = 'active';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = true;
		app.disableUser = false; 
        app.disableModerator = false; 
        app.disableAdmin = false; 
        app.errorMsg = false; 
        
        if ($scope.newPermission === 'user') {
            app.disableUser = true; 
        } else if ($scope.newPermission === 'moderator') {
            app.disableModerator = true; 
        } else if ($scope.newPermission === 'admin') {
            app.disableAdmin = true; 
        }


	};

	app.updateName = function(newName, valid) {
		app.errorMsg = false;
		app.disabled = true;
		var userObject = {};

		if (valid) {
			userObject._id = app.currentUser;
			userObject.name = $scope.newName;
			User.editUser(userObject).then(function(data) {
				if (data.data.success) {
					app.successMsg = data.data.message;
					$timeout(function() {
						app.nameForm.name.$setPristine();
						app.nameForm.name.$setUntouched();
						app.successMsg = false;
						app.disabled = false;
					}, 2000);
				} else {
					app.errorMsg = data.data.message;
					app.disabled = false;
				}
			});
		} else {
				app.errorMsg = 'Please make sure the form is filled out properly!';
				app.disabled = false;
		}
	};

	app.updateEmail = function(newEmail, valid) {
		app.errorMsg = false;
		app.disabled = true;
		var userObject = {};

		if (valid) {
			userObject._id = app.currentUser;
			userObject.email = $scope.newEmail;
			User.editUser(userObject).then(function(data) {
				if (data.data.success) {
					app.successMsg = data.data.message;
					$timeout(function() {
						app.emailForm.email.$setPristine();
						app.emailForm.email.$setUntouched();
						app.successMsg = false;
						app.disabled = false;
					}, 2000);
				} else {
					app.errorMsg = data.data.message;
					app.disabled = false;
				}
			});
		} else {
				app.errorMsg = 'Please make sure the form is filled out properly!';
				app.disabled = false;
		}
	};

	app.updatePermissions = function(newPermission) {
        app.errorMsg = false; 
        app.disableUser = true; 
        app.disableModerator = true; 
        app.disableAdmin = true; 
        var userObject = {}; 
        userObject._id = app.currentUser; 
        userObject.permission = newPermission; 
       
        User.editUser(userObject).then(function(data) {
         
            if (data.data.success) {
                app.successMsg = data.data.message;
              
                $timeout(function() {
                    app.successMsg = false; 
                    $scope.newPermission = newPermission; 
                   
                    if (newPermission === 'user') {
                        app.disableUser = true; 
                        app.disableModerator = false; 
                        app.disableAdmin = false; 
                    } else if (newPermission === 'moderator') {
                        app.disableModerator = true; 
                        app.disableUser = false; 
                        app.disableAdmin = false; 
                    } else if (newPermission === 'admin') {
                        app.disableAdmin = true; 
                        app.disableModerator = false; 
                        app.disableUser = false; 
                    }
                }, 2000);
            } else {
                app.errorMsg = data.data.message; 
                app.disabled = false; 
            }
        });
	};
});
