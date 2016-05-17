angular.module("LoginModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('login', {
        cache: false,
        url: '/login',
        templateUrl: '/templates/profile_home.html',
        controller: 'LoginController',
        resolve: {
            "authenticate" : function() {
                if ($window.localStorage.getItem('BoltToken')) {
                    $state.go('home');
                }
            }
        }
    })
})
.service('LoginService',['$http','$q',function($http,$q) {
    return {
        login: function(username,password) {
            var $return = $q.defer;
            $return.promise = $http({
                method: 'POST',
                url: '../data/authenticate',
                data: {
                    email: username,
                    password: password
                }
            }).then(function(responseData) {
                $window.localStorage.setItem('BoltToken', responseData.token);
                $return.resolve({ token: responseData.token });
            }, function(httpError) {
                $return.reject({ status: httpError.status })
            })
        }
    }
}])
.controller('LoginController', ['$scope', '$http', 'LoginService','$state', function($scope, $http,LoginService,$state) {
    $scope.login = function() {
        var loggedIn = LoginService.login($scope.username, $scope.password, function(responseData) {
            $state.go('home');
        });
    };
}])