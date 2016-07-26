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
			if (id) {
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
					$ret.resolve({ data: responseData.data });
				}, function(err) {
					$ret.reject({ error: err });
				})
			} else {
				$ret.promise = $http({
					method: 'POST',
					url: ConfigService.appRoot() + '/data/users',
					data: {
						firstName: first,
						lastName: last,
						email: email,
						accountType: type
					}
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data });
				}, function(err) {
					$ret.reject({ error: err });
				})
			}
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
		},
		save: function(profile) {
			var $ret = $q.defer();
			if (profile._id) {
				$ret.promise = $http({
					method: 'PUT',
					url: ConfigService.appRoot() + '/data/profiles/' + profile._id,
					data: {
						profile: profile
					}
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data });
				}, function(err) {
					$ret.reject({ error: err });
				});
			} else {
				$ret.promise = $http({
					method: 'POST',
					url: ConfigService.appRoot() + '/data/profiles',
					data: {
						profile: profile
					}
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data });
				}, function(err) {
					$ret.reject({ error: err });
				});
			}
			return $ret.promise;
		}
	}
})
.controller('UserAdminController', function($scope, UserFactory, $stateParams, userInfo, $http, $q, ConfigService) {
	//Get profile data for $scope variable from resolved injected value
	$scope.user = userInfo.data;
	//Save, cancel methods
	$scope.saveAccount = function() {
		UserFactory.save($scope.user._id, $scope.user.firstName, $scope.user.lastName, $scope.user.email, $scope.user.accountType).then(
			function(responseData) {
				$scope.user = responseData.user;
				userInfo.data = responseData.user;
			}, function(error) {
				alert(JSON.stringify(error));
			})
	}
	$scope.cancel = function() {
		$scope.user.firstName = $stateParams.user.firstName;
		$scope.user.lastName = $stateParams.user.lastName;
		$scope.user.accountType = $stateParams.user.accountType;
		$scope.user.email = $stateParams.user.email;
	}
})
.controller('ProfileAdminController', function($scope, UserFactory, $stateParams, profileInfo, userInfo, $http, $q, ConfigService, UserProfileFactory) {
	//Get profile data for $scope variable from resolved injected value
	$scope.profile = profileInfo.data[0];
	$scope.saveProfile = function() {
		$scope.profile.owner = userInfo.data._id;
		UserProfileFactory.save($scope.profile).then(function(responseData) {
			$scope.profile = responseData.data.profile;
			profileInfo.data = responseData.data.profile;
		}, function(err) {
			alert(JSON.stringify(err));
		})
	}
	$scope.cancel = function() {
		$scope.profile = profileInfo.data;
	}

})
.controller('ProjectAdminController', function($scope, UserFactory, $stateParams, userInfo, $http, $q, ConfigService) {
	//Get profile data for $scope variable from resolved injected value

})