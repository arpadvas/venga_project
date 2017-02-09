angular.module('profileController', ['angular-filepicker', 'userServices'])

.controller('profileCtrl', function(Auth, filepickerService, User) {

	app = this;

	Auth.getUser().then(function(data) {
				app.name = data.data.name;
				app.email = data.data.email;
				User.getProfile(app.email).then(function(data) {
					app.currentUser = data.data.user;
					console.log(app.currentUser);
				});
			});


    app.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                app.currentUser.picture = Blob;
                console.log(app.currentUser);
            }
        );
    };

});


