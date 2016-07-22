angular.module("ProfileModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('profile', {
        // params: { single: {}, profileid: {} },
        params: { single: {} },
        cache: false,
        url: '/profile/:profileid',
        templateUrl: function($stateParams) {
            if ($stateParams.single) {
                return '/templates/project_single.html';
            } else {
                return '/templates/project_multi.html';
            }
        },
        controller: 'ProfileDetailController'
    })
})
.factory('ProfileFactory',function($resource){
    return $resource('./data/profiles/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    })
})
.controller('ProfileDetailController', ['$scope', '$http', '$state', '$stateParams', 'ProfileFactory','ProjectFactory', 'CertificationFactory', function($scope,$http,$state,$stateParams,ProfileFactory,ProjectFactory,CertificationFactory) {
    if ($stateParams.profileid){
        //This is an existing profile
        var id = $stateParams.profileid;
        $scope.profile = ProfileFactory.get({ id: id }, function(responseData) {
        		var profile = responseData.profile;
            //Format some fields for display
            var formattedValue = '';
            formattedValue = profile.availability.toString();
            formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
            $scope.profile.availability = formattedValue;

            //Populate Project
            var project = ProjectFactory.get({ id: profile.projects[0] }, function(project) {
                var formattedValue = '';
                formattedValue = project.availability.toString();
                formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
                project.availability = formattedValue;

                formattedValue = project.utilityDistricts.toString();
                formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
                project.utilityDistricts = formattedValue;

                $scope.project = project;
            })
        });
    } else {
        //This is a new profile
        $scope.profile = new ProfileFactory();
    };
    $scope.projects = ProjectFactory.query();
    $scope.certifications = CertificationFactory.query();
    $scope.saveProfile = function() {
        if (!$scope.profile._id) {
            $scope.profile.$save(function() {
                alert('Profile successfully saved.');
                $scope.profiles = ProfileFactory.query(function() {
                    $state.go('profile', {}, { reload: true });
                });
            },
                function(error) {
                    alert(error.message);
                });
        } else {
            $scope.profile.$update(function() {
                alert('Profile successfully saved.');
                $state.go('profile', {}, { reload: true });
            },
                function(error) {
                    alert(error.message);
                    $state.go('profile');
                });
        }
    };
    $scope.cancelProfile = function() {
        $state.go('profile');
    };
    $scope.deleteProfile = function() {
        $scope.profile.$remove(
            function() {
                alert('Profile successfully deleted.');
                $scope.profiles = ProfileFactory.query(function() {
                    $state.go('profile', {}, { reload: true });
                })
            },
            function(error) {
                alert(error.message);
                $state.go('profile');
            });
    };
}])