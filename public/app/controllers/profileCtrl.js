angular.module('profileController', ['angular-filepicker', 'userServices'])

.controller('profileCtrl', function(filepickerService, User, $scope, $timeout) {

	app = this;

    User.getProfile().then(function(data) {
        $scope.currentUser = data.data.user;
    });


    app.upload = function(){ filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
            }, function(Blob){
                $scope.currentUser.picture = Blob;
                $scope.$apply();
            });
    };

    app.savePicture = function() {
        app.loading = true;
        app.errorMsg = false;
        User.editProfile($scope.currentUser).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                $timeout(function() {
                    app.successMsg = false;
                }, 1000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

})

.controller('climberProfileCtrl', function($routeParams, Ascent, $filter, $location, $rootScope) {

    app = this;
    app.loadingProfile = true;
    app.loadedProfile = false;
    app.pageSize = 6;
    app.propertyName = 'grade';
    app.reverse = true;


    function firstHandler(data) {
        if (data.data.success) {
            app.climber = {};
            app.climber.name = data.data.climber.name;
            app.climber.email = data.data.climber.email;
            app.climber.picture = data.data.climber.picture;
        } else {
            console.log(data.data.message);
        }
    }

    function secondHandler(data) {
        if (data.data.success) {
            app.loadingProfile = false;
            app.loadedProfile = true;
            app.ascents = data.data.ascents;
            app.ascents = $filter('orderBy')(data.data.ascents, app.propertyName, app.reverse);
        } else {
            console.log(data.data.message);
        }
    }


    Ascent.getClimberByID($routeParams.id)
        .then(firstHandler)
        .then(Ascent.getClimberAscents($routeParams.id)
            .then(secondHandler));
 

    

    app.sortBy = function(propertyName) {
      app.reverse = (propertyName !== null && app.propertyName === propertyName)
         ? !app.reverse : false;
      app.propertyName = propertyName;
      app.ascents = $filter('orderBy')(app.ascents, app.propertyName, app.reverse);
      app.updatePropertyName(app.propertyName, app.reverse);
    };

    app.openSearch = function(ascentName) {
        $location.path('/searchAscents');
        $rootScope.outerSearch = true;
        $rootScope.outerSearchName = ascentName;
    };


});



