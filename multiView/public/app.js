angular.module("boltprofiles", ["ui.router","ngResource","ProjectModule","ProfileModule","CertificationModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        // templateUrl: '/templates/home.html',
        // controller: 'HomeController'
        views: {
        	// 'header': {
        	// 	templateUrl: '/templates/header.html',
        	// 	controller: 'HeaderController'
        	// },
        	'footer': {
        		templateUrl: '/templates/footer.html',
        		controller: 'FooterController'
        	},
        	'body': {
        		templateUrl: '/templates/home.html',
        		controller: 'HomeController'
        	}
        }
    })

    $stateProvider.state('login', {
        url: '/login',
        views: {
            'body': {
                templateUrl: '/templates/login.html',
                controller: 'LoginController'
            }
        }

    })
})
 .controller('HomeController', ['$scope','CertificationFactory','ProfileFactory','ProjectFactory','LoginService', function($scope,CertificationFactory,ProfileFactory,ProjectFactory,LoginService){
 	//$scope.certifications = CertificationFactory.query();
 	$scope.profiles = ProfileFactory.query();
 	//$scope.projects = ProjectFactory.query();
 }])
 // .controller('HeaderController', ['$scope','LoginService', function($scope,LoginService) {
 //    if (LoginService.authenticated()) {
 //        $scope.loggedIn = true;
 //    } else {
 //        $scope.loggedIn = false;
 //    }
 //    $scope.logout = function() {
 //        LoginService.logout();
 //    }
 // }])
 .controller('FooterController', ['$scope', function($scope) {
 	console.log("Footer Loaded.");
 }])
.service('LoginService',['$http','$q','$window',function($http,$q,$window) {
    return {
        login: function(username,password) {
            var $return = $q.defer();
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
            return $return.promise;
        },
        logout: function() {
            try {
                $window.localStorage.removeItem('BoltToken');
            } catch (e) {
                console.log(e);
            }
        },
        authenticated: function() {
        	if ($window.localStorage.getItem('BoltToken')) {
                return true;
            } else {
                return false;
            }
        }
    }
}])
.directive('headerdir', function() {
    return {
        restrict: "AE",
        replace: true,
        scope: false,
        templateUrl: '/templates/header.html',
        //controller: 'HeaderController'
        controller: 'LoginController',
        transclude: true
    }
})
.controller('LoginController', ['$scope', 'LoginService', '$state', function($scope,LoginService,$state) {

    $scope.auth = LoginService.authenticated();
    $scope.authenticate = function() {
        var login = LoginService.login($scope.username, $scope.password);
        login.then(function(data){
            $scope.auth = true;
            $state.go('home');
            $scope.test = "Not fun.";
        }, function() {
            $scope.auth = false;
            $state.go('login');
        });
    }
    $scope.cancel = function() {
        $state.go('home');
    }
    $scope.logout = function() {
        LoginService.logout();
        $scope.auth = false;
    }
    $scope.testauth = function() {
        var login = LoginService.login($scope.username, 'passwd123');
        login.then(function(data){
            $scope.auth = true;
            $state.go('home');
            $scope.test = "Not fun.";
        }, function() {
            $scope.auth = false;
            $state.go('login');
        });
    }
}])