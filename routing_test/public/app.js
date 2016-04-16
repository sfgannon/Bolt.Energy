angular.module("routingTest", ["ui.router"])
.config(function($stateProvider,$urlRouterProvider) {
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
	.state('detail.single', {
		url: '/single',
		templateUrl: 'templates/single.html'
	})
	.state('detail.multi', {
		url: '/multi',
		templateUrl: 'templates/multi.html'
	})
})
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