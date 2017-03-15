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
    app.pageNo = 1;
    app.propertyName = 'grade';
    app.reverse = true;
    app.totalCount = 0;

    function loadDetails(id) {
        return Ascent.getClimberByID(id).then(function(details) {
            app.climber = {};
            app.climber.name = details.data.climber.name;
            app.climber.email = details.data.climber.email;
            app.climber.picture = details.data.climber.picture;
        });
    }

    function loadAscentsCount() {
        return Ascent.getClimberAscentsCount($routeParams.id).then(function(result) {
                    app.totalCount = result.data.count;
                });
    }

    function loadAscents() {
        return Ascent.getClimberAscents($routeParams.id, app.pageSize, app.pageNo, app.propertyName, app.reverse).then(function(data) {
            app.ascents = data.data.ascents;
            app.loadingProfile = false;
            app.loadedProfile = true;
        });
    }

    function reportProblems(error) {
        console.log(error.data.message);
    }

    loadDetails($routeParams.id)
        .then(loadAscentsCount)
        .then(loadAscents)
        .catch(reportProblems);

 
    app.pager = function(pageNo) {
        app.loadingProfile = true;
        app.pageNo = pageNo;
        Ascent.getClimberAscents($routeParams.id, app.pageSize, pageNo, app.propertyName, app.reverse).then(function(data) {
            if (data.data.success) {
                app.loadingProfile = false;
                app.ascents = data.data.ascents;
            } else {
                console.log(data.data.message);
            }
        });
    }; 
    

    app.sortBy = function(propertyName) {
        app.reverse = (propertyName !== null && app.propertyName === propertyName)
         ? !app.reverse : false;
        app.propertyName = propertyName;
        app.loadingProfile = true;
        Ascent.getClimberAscents($routeParams.id, app.pageSize, app.pageNo, app.propertyName, app.reverse).then(function(data) {
            if (data.data.success) {
                app.loadingProfile = false;
                app.ascents = data.data.ascents;
            } else {
                console.log(data.data.message);
            }
        });
    };

    app.openSearch = function(ascentName) {
        $location.path('/searchAscents');
        $rootScope.outerSearch = true;
        $rootScope.outerSearchName = ascentName;
    };


});



