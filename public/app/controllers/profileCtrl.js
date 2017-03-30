angular.module('profileController', ['angular-filepicker', 'userServices'])

.controller('profileCtrl', function(filepickerService, User, $scope, $timeout) {

	app = this;
    app.editDescription = false;
    app.genders = ['male', 'female'];
    app.country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    app.hidethis = true;

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
                app.saveUser();
            });
    };

    app.uploadBgrPhoto = function(){ filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
            }, function(Blob){
                $scope.currentUser.bgrpicture = Blob;
                $scope.$apply();
                app.saveUser();
            });
    };

    app.saveUser = function() {
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

    app.showUploadButton = function() {
        app.uploadButtonVisible = true;
    };

    app.hideUploadButton = function() {
        app.uploadButtonVisible = false;
    };

    app.showUploadBgrButton = function() {
        app.uploadBgrButtonVisible = true;
    };

    app.hideUploadBgrButton = function() {
        app.uploadBgrButtonVisible = false;
    };

    app.showEditDescription = function() {
        app.editDescription = true;
        app.descriptionEdited = $scope.currentUser.description;
    };

    app.saveDescription = function() {
        app.editDescription = false;
        $scope.currentUser.description = app.descriptionEdited;
        app.saveUser();
    };

    app.showEditGender = function() {
        app.editGender = true;
        app.genderEdited = $scope.currentUser.gender;
    };

    app.saveGender = function() {
        app.editGender = false;
        $scope.currentUser.gender = app.genderEdited;
        app.saveUser();
    };

    app.showEditCountry = function() {
        app.editCountry = true;
        app.countryEdited = $scope.currentUser.country;
    };

    app.saveCountry = function() {
        app.editCountry = false;
        $scope.currentUser.country = app.countryEdited;
        app.saveUser();
    }

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
            app.climber.bgrpicture = details.data.climber.bgrpicture;
            app.climber.description = details.data.climber.description;
            app.climber.gender = details.data.climber.gender;
            app.climber.country = details.data.climber.country;
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



