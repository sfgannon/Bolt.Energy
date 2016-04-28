angular.module("routingTest", ["ui.router"])
.config(function($stateProvider,$urlRouterProvider) {
	$urlRouterProvider.when("", "/main");
	$urlRouterProvider.when("/", "/main");	
	$urlRouterProvider.otherwise('/main');
	$stateProvider.state('home', {
		url: '/main',
		controller: 'HomeController',
		templateUrl: 'templates/home.html'
	})
	.state('detail', {
		params: { single: {} },
		url: '/project',
		templateUrl: function($stateParams) {
			if ($stateParams.single) {
				return 'templates/project_single.html';
			}
			else {
				return 'templates/project_multi.html';
			}
		},
		controller: 'ProjectController'
	})
	.state('detail.single', {})
	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginController'
	})
	.state('register', {
		url: '/register',
		templateUrl: 'templates/register.html',
		controller: 'LoginController'
	})
})
.service("UserService", ['$http','$q', function($http,$q) {
	return {
		register: function(userData) {
			//Validate that user has entered valid data for all required fields
			
		}
	}
}])
.controller('HomeController', ['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams) {
	$scope.setSingle = function() {
		$scope.single = true;
	};
	$scope.setMulti = function() {
		$scope.single = false;
	};
	$scope.alert = function() { alert("Worked"); };
}])
.controller('ProjectController', ['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams) {
	$scope.single = $stateParams.single;
}])
.controller('LoginController', ['$scope','$http','$state','$stateParams', function($scope,$http,$state,$stateParams) {
	$scope.login = function() {
		//Validate the data input: email and password must be non zero length
		$state.transitionTo('home');
	}

	$scope.register = function() {

	}
}])