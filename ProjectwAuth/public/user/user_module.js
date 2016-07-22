angular.module("UserModule", ["ui.router", "ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('useradmin', {
		url: '/user/:userId',
		resolve: {
			profileInfo: function(UserProfileFactory,$stateParams) {
				return UserProfileFactory.find($stateParams.userId);
			},
			userInfo: function(UserFactory,$stateParams) {
				return UserFactory.get($stateParams.userId);
			}
		},
		views: {
			'': {
				templateUrl: 'templates/user/account_admin.html'
			},
			'user@useradmin': {
				templateUrl: 'templates/user/user_admin.html',
				controller: 'UserAdminController'
			},
			'profile@useradmin': {
				templateUrl: 'templates/producer/producer_edit.html',
				controller: 'ProfileAdminController'
			// },
			// 'project@useradmin': {
			// 	templateUrl: 'templates/user/project_admin.html',
			// 	controller: 'ProjectAdminController'
			}
		}
	});
})
.service("UserFactory", function($q, $http, ConfigService) {
	return {
		get: function(id) {
			var $ret = $q.defer();
			if (id) {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/users/' + id
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.user });
				}, function(error) {
					$ret.reject({ error: error });
				})
			} else {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/users'
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.users });
				}, function(err) {
					$ret.reject({ error: err });
				})
			}
			return $ret.promise;
		},
		save: function(id, first, last, email, type) {
			var $ret = $q.defer();
			$ret.promise = $http({
				method: 'PUT',
				url: ConfigService.appRoot() + '/data/users/' + id,
				data: {
					firstName: first,
					lastName: last,
					accountType: type,
					email: email
				}
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data.user, message: responseData.data.message });
			}, function(err) {
				$ret.reject({ error: err });
			})
			return $ret.promise;
		}
	}
})
.service('UserProfileFactory', function($q,$http,ConfigService) {
	return {
		find: function(ownerId) {
			var $ret = $q.defer();
			$ret.promise = $http({
				method: 'GET',
				url: ConfigService.appRoot() + '/data/profiles?' + 'owner=' + ownerId
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data.profiles });
			}, function(err) {
				$ret.reject({ error: err });
			})
			return $ret.promise;
		}
	}
})
.controller('UserAdminController', function($scope, UserFactory, $stateParams, userInfo, $http, $q, ConfigService) {
	//Get profile data for $scope variable from resolved injected value
	$scope.user = userInfo.data;
	//Save, cancel methods
	$scope.saveAccount = function() {
		var $ret = $q.defer();
		$ret.promise = $http({
			method: 'PUT',
			url: ConfigService.appRoot() + '/data/users/' + userInfo.data._id,
			data: {
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
				accountType: $scope.user.accountType,
				email: $scope.user.email
			}
		}).then(function(responseData) {
			$ret.resolve({ data: responseData.data });
		}, function(err) {
			$ret.reject({ error: err });
		})
	}
	$scope.cancel = function() {
		$scope.user.firstName = $stateParams.user.firstName;
		$scope.user.lastName = $stateParams.user.lastName;
		$scope.user.accountType = $stateParams.user.accountType;
		$scope.user.email = $stateParams.user.email;
	}
})
.controller('ProfileAdminController', function($scope, UserFactory, $stateParams, profileInfo, userInfo, $http, $q, ConfigService) {
	//Get profile data for $scope variable from resolved injected value
	$scope.profile = profileInfo.data;
	$scope.saveProfile = function() {
		$scope.profile.owner = userInfo.data._id;
		var $ret = $q.defer();
		if ($scope.profile._id) {
			$ret.promise = $http({
				method: 'PUT',
				url: ConfigService.appRoot() + '/data/profiles/' + profileInfo.data._id,
				data: {
					profile: $scope.profile
				}
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data });
			}, function(err) {
				$ret.reject({ error: err });
			})
		} else {
			$ret.promise = $http({
				method: 'POST',
				url: ConfigService.appRoot() + '/data/profiles',
				data: {
					profile: $scope.profile
				}
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data });
			}, function(err) {
				$ret.reject({ error: err });
			})
		}
	}
	$scope.cancel = function() {

	}

})
.controller('ProjectAdminController', function($scope, UserFactory, $stateParams, userInfo, $http, $q, ConfigService) {
	//Get profile data for $scope variable from resolved injected value

})