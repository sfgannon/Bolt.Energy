angular.module("boltprofiles", ["ui.router","ngResource","ProjectModule","ProfileModule","CertificationModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/templates/login_template.html',
      controller: 'LoginController'
    })
})
 .controller('HeaderController', ['$rootScope','$scope','LoginService',function($rootScope,$scope,LoginService) {
  $rootScope.authenticated = LoginService.authenticated();
  $scope.logout = function() {
    LoginService.logout();
    $rootScope.authenticated = LoginService.authenticated();
  }
 }])
 .controller('HomeController', ['$scope','CertificationFactory','ProfileFactory','ProjectFactory', function($scope,CertificationFactory,ProfileFactory,ProjectFactory){
  $scope.certifications = CertificationFactory.query();
  $scope.profiles = ProfileFactory.query(function(data) {
    console.log(data);
  });
  $scope.projects = ProjectFactory.query();
}])
 .controller('LoginController', ['$rootScope','$scope','LoginService','$state',function($rootScope,$scope,LoginService,$state) {
  $scope.authenticated = LoginService.authenticated();
  $scope.login = function() {
    var result = LoginService.login($scope.username, $scope.password);
    result.then(function(responseData) {
      alert('Login Successful.');
      $rootScope.authenticated = LoginService.authenticated();
      $state.go('home');
    }, function(status) {
      alert('Login Unsuccessful.');
      $state.go('home');
    })
  }
  $scope.logout = function() {
    var result = LoginService.logout();
    $state.go('home');
  }
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
                $window.localStorage.setItem('BoltToken', responseData.data.token);
                $return.resolve({ token: responseData.data.token });
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
            if (($window.localStorage.getItem('BoltToken') != 'undefined') && ($window.localStorage.getItem('BoltToken') != null)) {
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
              $window.localStorage.setItem('BoltToken', responseData.data.token);
              $return.resolve({ token: responseData.data.token });
            }, function(status) {
              $return.reject({ status: status.status });
            })
            return $return.promise;
          }
      }
  }])