/**
* TestApp Module
*
* This is a test app for testing concepts before pushing into main branch of Bolt Project
*/
angular.module("testapp", ["ui.router","ngResource"])
 .config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/test_home.html',
        controller: 'HomeController'
    })
 })
  .controller('HomeController', ['$scope','LoginService', function($scope,LoginService){
  	$scope.message = "Here's a message.";
    $scope.register = function() {
      var register = LoginService.register($scope.username, $scope.password);
      register.then(function(response) {
        $scope.message = "Registration Successful.";
      }, function(status) {
        $scope.message = "Registration failed: " + status;
      })
    }
 }])
  .directive('authdirective', ['LoginService', function(){
  	// Runs during compile
  	return {
  		//name: 'authdirective',
  		priority: 1,
  		// terminal: true,
  		scope: {}, // {} = isolate, true = child, false/undefined = no change
  		controller: function($scope, $element, $attrs, $transclude, LoginService) {
  			$scope.authenticated = LoginService.authenticated();
  			$scope.login = function(username, password) {
  				console.log($scope.username + ' ' + $scope.password);
  				$scope.authenticated = true;
  			}
  			$scope.logout = function() {
  				$scope.authenticated = false;
  			}
        $scope.authenticate = function() {
            var login = LoginService.login($scope.username, $scope.password);
            login.then(function(data){
                $scope.authenticated = true;
                $state.go('home');
                $scope.test = "Not fun.";
            }, function() {
                $scope.authenticated = false;
                $state.go('login');
            });
        }
  		},
  		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
  		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
  		// template: '',
  		templateUrl: '/authdirective/authdirective.html',
  		replace: false,
  		// transclude: true,
  		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
  		link: function($scope, iElm, iAttrs, controller) {
  			
  		}
  	};
  }])
  .service('ConfigService', ['$http', '$q', function($http,$q) {
    return {
      appRoot: function() {
        var url = 'http://localhost:3002';
        return url;
      },
      appPort: function() {
        var port = 3002;
        return port;
      }
    }
  }])
  .service('LoginService',['$http','$q','$window','ConfigService',function($http,$q,$window,ConfigService) {
      return {
          login: function(username,password) {
              var $return = $q.defer();
              $return.promise = $http({
                method: 'POST',
                url: ConfigService.appRoot() + '/data/authenticate',
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
          },
          register: function(username, password) {
            //Register a new user account
            var $return = $q.defer();
            $return.promise = $http({
              method: 'POST',
              url: ConfigService.appRoot() + '/data/authenticate',
              data: {
                email: username,
                password: password
              }
            }).then(function(responseData) {
              $window.localStorage.setItem('BoltToken', responseData.token);
              $return.resolve({ token: responseData.token });
            }, function(status) {
              $return.reject({ status: status.status });
            })
            return $return.promise;
          }
      }
  }])