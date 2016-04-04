angular.module("ProfileModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('profile', {
        cache: false,
        url: '/profile',
        templateUrl: '/templates/profile_home.html',
        controller: 'ProfileController'
    })
    .state('profile.detail', {
        url: '/detail/:profileid',
        templateUrl: '/templates/profile_detail.html',
        controller: 'ProfileDetailController'
    })
})
.factory('ProfileFactory',function($resource){
    return $resource('http://localhost:3002/data/profiles/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    })
})
.controller('ProfileController', ['$scope', '$http', 'ProfileFactory', function($scope, $http,ProfileFactory) {
    $scope.profiles = ProfileFactory.query();
}])
.controller('ProfileDetailController', ['$scope', '$http', '$state', '$stateParams', 'ProfileFactory','ProjectFactory', function($scope,$http,$state,$stateParams,ProfileFactory,ProjectFactory) {
    if ($stateParams.profileid){
        //This is an existing profile
        var id = $stateParams.profileid;
        $scope.profile = ProfileFactory.get({ id: id });
    } else {
        //This is a new profile
        $scope.profile = new ProfileFactory();
    };
    $scope.projects = ProjectFactory.query();    
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