angular.module("UserModule", ["ui.router", "ngResource", "ConfigService"])
.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('useradmin', {
		url: '/user/:userId',
		resolve: {
			userInfo: function(UserFactory,$stateParams) {
				return UserFactory.get($stateParams.userId);
			}
		},
		views: {
			'': {
				templateUrl: 'user/templates/account_admin.html'
			},
			'userInfo': {
				templateUrl: 'user/templates/user_admin.html',
				controller: 'UserAdminController'
			// },
			// 'profile': {
			// 	templateUrl: 'templates/profile_admin.html',
			// 	controller: 'ProfileAdminController'
			// },
			// 'project': {
			// 	templateUrl: 'templates/project_admin.html',
			// 	controller: 'ProjectAdminController'
			}
		}
	});
})
// .factory("UserFactory", function($resource) {
// 	return $resource('./data/users/:id', {id: '@_id'},{
// 		'update': {
// 			method: 'PUT'
// 		}
// 	})
// })
.service("UserFactory", function($q, $http, ConfigService) {
	return {
		get: function(id) {
			var $ret = $q.defer();
			if (!id) {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/users/' + id
				}).then(function(responseData) {
					$ret.resolve({ data: responseData });
				}, function(error) {
					$ret.reject({ error: error });
				})
			}
		}
	}
})
.controller('UserAdminController', function($scope, UserFactory, $stateParams, userInfo) {
	//Get profile data for $scope variable from resolved injected value
	$scope.user = userInfo.data.user;
	//Save, cancel methods
})