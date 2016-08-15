angular.module("UserModule", ["naif.base64", "ui.router", "ngResource", "ngAnimate", "toastr"])
.constant('_',
    window._
)
.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('useradmin', {
		url: '/user/:userId?projectId',
		resolve: {
			profileInfo: function(UserProfileFactory,$stateParams) {
				return UserProfileFactory.findByOwner($stateParams.userId);
			},
			userInfo: function(UserFactory,$stateParams) {
				return UserFactory.get($stateParams.userId);
			},
			projectInfo: function(UserProjectFactory,$stateParams) {
				if ($stateParams.projectId && $stateParams.projectId != 'new') {
					return UserProjectFactory.get($stateParams.projectId);
				} else {
					return '';
				}
			},
			userImagesInfo: function($stateParams,ImagesService) {
				//TODO - this needs to be updated to reflect new image storage
				return ImagesService.getByItem($stateParams.userId);
			}
		},
		views: {
			'': {
				controller: 'AccountAdminController',
				templateUrl: 'templates/user/account_admin.html'
			},
			'user@useradmin': {
				templateUrl: 'templates/user/user_admin.html',
				controller: 'UserAdminController'
			},
			'profile@useradmin': {
				templateUrl: 'templates/producer/producer_edit.html',
				controller: 'ProfileAdminController'
			},
			'project@useradmin': {
				templateUrl: function($stateParams) {
					if ($stateParams.projectId) {
						return 'templates/project/project_edit.html';
					} else {
						return 'templates/project/project_list.html';
					}
				},
				controller: 'ProjectAdminController'
			}
		}
	});
})
.service('UserProjectFactory', function($q,$http,ConfigService) {
	return {
		get: function(id) {
			var $ret = $q.defer();
			if (id) {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/projects/' + id
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.project });
				}, function(error) {
					$ret.reject({ error: error });
				})
			} else {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/projects'
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.projects });
				}, function(err) {
					$ret.reject({ error: err });
				})
			}
			return $ret.promise;
		},
		find: function(arrayKeyValue) {
			var $ret = $q.defer();
			var queryString = '?';
			for (var i=0; i<arrayKeyValue.length; i++) {
				queryString += arrayKeyValue[i][0] + '=' + arrayKeyValue[i][1];
				if (i != arrayKeyValue.length - 1) {
					queryString += '&';
				}
			}
			$ret.promise = $http({
				method: 'GET',
				url: ConfigService.appRoot() + '/data/projects' + queryString
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data });
			}, function(err) {
				$ret.reject({ error: err });
			})
			return $ret.promise;
		},
		findByOwner: function(ownerId) {
			var $ret = $q.defer();
			$ret.promise = $http({
				method: 'GET',
				url: ConfigService.appRoot() + '/data/projects?' + 'owner=' + ownerId
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data });
			}, function(err) {
				$ret.reject({ error: err });
			})
			return $ret.promise;
		},
		save: function(project) {
			var $ret = $q.defer();
			if (project._id) {
				$ret.promise = $http({
					method: 'PUT',
					url: ConfigService.appRoot() + '/data/projects/' + project._id,
					data: {
						project: project
					}
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data });
				}, function(err) {
					$ret.reject({ error: err });
				});
			} else {
				$ret.promise = $http({
					method: 'POST',
					url: ConfigService.appRoot() + '/data/projects',
					data: {
						project: project
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
		},
		saveUploads: function(id, uploads) {
			var $ret = $q.defer();
			$ret.promise = $http({
				method: 'PUT',
				url: ConfigService.appRoot() + '/data/users/' + id,
				data: {
					uploads: uploads
				}
			}).then(function(responseData) {
				$ret.resolve({ data: responseData.data });
			}, function(err) {
				$ret.reject({ error: err });
			})
			return $ret.promise;
		}
	}
})
.service('UserProfileFactory', function($q,$http,ConfigService) {
	return {
		get: function(id) {
			var $ret = $q.defer();
			if (id) {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/profiles/' + id
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.profile });
				}, function(error) {
					$ret.reject({ error: error });
				})
			} else {
				$ret.promise = $http({
					method: 'GET',
					url: ConfigService.appRoot() + '/data/profiles'
				}).then(function(responseData) {
					$ret.resolve({ data: responseData.data.profiles });
				}, function(err) {
					$ret.reject({ error: err });
				})
			}
			return $ret.promise;
		},
		findByOwner: function(ownerId) {
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
.controller('AccountAdminController', function($scope, userInfo, profileInfo) {
	$scope.user = userInfo.data;
	$scope.profile = (profileInfo.data) ? profileInfo.data[0] : '';
})
.controller('UserAdminController', function($scope, UserFactory, $stateParams, userInfo, $http, $q, ConfigService, toastr, ImagesService, userImagesInfo) {
	//Get profile data for $scope variable from resolved injected value
	$scope.user = userInfo.data;
  // $scope.uploadedFile = function (element) {
  //     $scope.$apply(function ($scope) {
  //         $scope.files = element.files;
  //     });
  // }

  //$scope.images = (userImagesInfo)?(userImagesInfo.images):(null);

  $scope.uploads = [];
  //Image Uploader Properties:
  // file.filename
  // file.filetype
  // file.filesize
  // file.base64

  $scope.saveUploads = function() {
		UserFactory.saveUploads($scope.user._id, $scope.user.uploads).then(
			function(responseData) {
				$scope.user = responseData.data.user;
				userInfo.data = responseData.data.user;
				toastr.success("User uploads successfully saved.","Success!");
			}, function(error) {
				alert(JSON.stringify(error));
			})
  }

  $scope.onChange = function(e, fileList) {
  	//On Change event fired when new files added/removed via input
  	if (fileList.length == 0) {
  		$scope.user.uploads = userInfo.data.uploads;
  	} else {
  		var difference = _.difference(fileList, $scope.user.uploads);
  		if (difference.length > 0) {
  			//Check that no file is larger than 16MB
  			var cleanFiles = [];
  			for (var i = 0; i < difference.length; i++) {
  				if (difference[i].filesize < (16*1024*1024)) {
  					cleanFiles.push(difference[i]);
  				}
  			}
  			difference = cleanFiles;
  			//Add files to the user uploads array
  			for (var i = 0; i < difference.length; i++) {
  				$scope.user.uploads.push(difference[i]);
  			}
  		}
  	}
  }

  // $scope.root = "/temp/";

  // $scope.addFile = function () {
  // 	var primary = $scope.image.primaryImage || false;
  //   var upload = ImagesService.uploadfile($scope.files, { description: $scope.image.description, primaryImage: primary, item: $stateParams.userId });
  //   upload.then(function (response) {
  //       toastr.success("Upload successful.", "Success");
		// 		ImagesService.getByItem($stateParams.userId).then(function(responseData) {
		// 			$scope.images = responseData.images;
		// 		});
  //   }, function (response) {
  //       toastr.error("Upload failed.", "Error");
  //   })
  // }
	//Save, cancel methods
	$scope.saveAccount = function() {
		UserFactory.save($scope.user._id, $scope.user.firstName, $scope.user.lastName, $scope.user.email, $scope.user.accountType).then(
			function(responseData) {
				$scope.user = responseData.data.user;
				userInfo.data = responseData.data.user;
				toastr.success("User account information successfully saved.","Success!");
			}, function(error) {
				alert(JSON.stringify(error));
			})
	}
	$scope.cancel = function() {
		$scope.user.firstName = userInfo.data.firstName;
		$scope.user.lastName = userInfo.data.lastName;
		$scope.user.accountType = userInfo.data.accountType;
		$scope.user.email = userInfo.data.email;
	}
})
.controller('ProfileAdminController', function($scope, UserFactory, $stateParams, profileInfo, userInfo, $http, $q, ConfigService, UserProfileFactory, toastr) {
	//Get profile data for $scope variable from resolved injected value
	$scope.profile = (profileInfo.data) ? profileInfo.data[0] : '';
	$scope.saveProfile = function() {
		$scope.profile.owner = userInfo.data._id;
		UserProfileFactory.save($scope.profile).then(function(responseData) {
			$scope.profile = responseData.data.profile;
			profileInfo.data = responseData.data.profile;
			toastr.success("Producer profile information successfully saved.","Success!");
		}, function(err) {
			toastr.error(err.data.message || err.message, "Error");
		})
	}
	$scope.cancel = function() {
		$scope.profile = profileInfo.data;
	}

})
.controller('ProjectAdminController', function($scope, UserProjectFactory, $stateParams, $state, projectInfo, profileInfo, userInfo, $http, $q, ConfigService, toastr) {
	//Get profile data for $scope variable from resolved injected value
	$scope.project = projectInfo.data;
	$scope.userId = userInfo.data._id;
	$scope.saveProject = function() {
		//TODO: how do I handle this when the user hasn't saved a producer profile yet? Add an ng-disable in profileInfo?
		$scope.project.owner = profileInfo.data[0]._id;
		UserProjectFactory.save($scope.project).then(function(responseData) {
			$scope.project = responseData.data.project;
			projectInfo.data = responseData.data.project;
			$state.go('useradmin', { userId: $scope.userId, projectId: $scope.project._id});
			toastr.success("Producer project information successfully saved.","Success!");
		}, function(err) {
			toastr.error(err.data.message || err.message, "Error");
		})
	}
	$scope.cancel = function() {
		$scope.project = projectInfo.data;
		$state.go('useradmin', {userId: userInfo.data._id, projectId: null });
	}
	$scope.projects = (profileInfo.data) ? profileInfo.data[0].projects : '';
})