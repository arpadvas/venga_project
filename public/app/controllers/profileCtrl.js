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

.controller('climberProfileCtrl', function() {

    console.log('hello');
});



