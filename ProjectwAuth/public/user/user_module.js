angular.module("UserModule", ["ui.router", "ngResource", "ngAnimate", "toastr"])
.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('useradmin', {
		url: '/user/:userId?projectId',
		resolve: {
			profileInfo: function(UserProfileFactory,$stateParams) {
				return UserProfileFactory.findByOwner($stateParams.userId);
			},
			userInfo: function(AccountService,$stateParams) {
				return AccountService.get($stateParams.userId);
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
.directive('fileModel', ['$q', '$parse', '$compile', function ($q,$parse,$compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
          	var files = [];
          	files = element[0].files;
          	var readData = function(file) {
          		var reader = new FileReader();
          		var deferred = $q.defer();
          		reader.onload = function(e) {
          			file.dataUrl = e.target.result;
          			deferred.resolve(e.target.result);
          		}
          		reader.onerror = function(error) {
          			deferred.reject(error);
          		}
          		reader.readAsDataURL(file);
          		return deferred.promise;
          	}
          	var promises = [];
          	for (var i = 0; i < files.length; i++) {
          		var promise = readData(files[i]);
          		promises.push(promise);
          	}
          	Promise.all(promises).then(function(response) {
          		scope.$apply(function(){
	                modelSetter(scope, files);
	            });
          	});
          });
        }
    };
}])
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
.service('UtilitiesService', function() {
	return {
		pullFromArray: function(item, array, field) {
			for (var i = array.length -1; i > -1; i--) {
				if (field) {
					//Array of objects, check field value instead of item value
					if (array[i][field] == item) {
						array.splice(i,1);
					}
				} else {
					if (array[i] == item) {
						array.splice(i,1);
					}
				}
			}
			return array;
		}
	}
})
.service("AccountService", function($q,$http,ConfigService,$window,UtilitiesService) {
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
		removeUpload: function(id,user) {
			user.uploads = UtilitiesService.pullFromArray(id.id,user.uploads,'_id');
			var data = { removeImage: id.id, user: user };
			//Make http request
			var ret = $q.defer();
			ret.promise = $http({
				method: 'PUT',
				url: ConfigService.appRoot() + '/admin/account/' + user._id,
				data: { data: JSON.stringify(data) },
        headers: {
            'Authorization': $window.localStorage.getItem('BoltToken')
        }
			}).then(function(responseData) {
				ret.resolve({ data: responseData.data });
			}, function(err) {
				ret.reject({ error: err });
			});
			return ret.promise;
		},
		saveAccount: function(newUploads,user) {
			//send new uploads as part of its own body var
			var uploads = [];
			var files = [];
			// angular.forEach(newUploads, function(file) {
			// 	files.push(file);
			// })
			//Add new uploads to FormData
			var fd = new FormData();
			// fd.append('files',files);
			angular.forEach(newUploads, function(file) {
				fd.append('files', file);
			})
			//Add new uploads to User.uploads by transforming to UploadModel
			angular.forEach(newUploads, function(file) {
				var newFile = {};
				newFile.filename = file.name;
				newFile.filetype = file.type;
				newFile.description = file.description;
				newFile.filesize = file.size;
				newFile.path = '';
				uploads.push(newFile);
			})
			//Any more transformation needed?
			//JSON.stringify all of the data
			//Attach data to Form Data
			fd.append('data',JSON.stringify(user));
			fd.append('uploads',JSON.stringify(uploads));
			//Make http request
			var ret = $q.defer();
			ret.promise = $http({
				method: 'PUT',
				url: ConfigService.appRoot() + '/admin/account/' + user._id,
				data: fd,
        headers: {
            'Content-Type': undefined,
            'Authorization': $window.localStorage.getItem('BoltToken')
        }
			}).then(function(responseData) {
				ret.resolve({ data: responseData.data });
			}, function(err) {
				ret.reject({ error: err });
			});
			return ret.promise;
		}
	};
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
.controller('UserAdminController', function($scope, AccountService, $stateParams, userInfo, $http, $q, ConfigService, toastr, ImagesService, userImagesInfo) {
	//Get profile data for $scope variable from resolved injected value
	const userData = {};
	userData.firstName = userInfo.data.firstName;
	userData.lastName = userInfo.data.lastName;
	userData.email = userInfo.data.email;
	userData.accountType = userInfo.data.accountType;
	$scope.user = userInfo.data;

	$scope.saveAccount = function() {
		AccountService.saveAccount($scope.uploads, $scope.user).then(function(responseData) {
			toastr.success("User account information saved.");
			$scope.user = responseData.data.user;
			userInfo.data = responseData.data.user;
			$scope.uploads = [];
		}, function(error) {
			toastr.error("Error saving user account information.");
		})
	}

	$scope.removeUpload = function(id) {
		AccountService.removeUpload(id, $scope.user).then(function(responseData) {
			toastr.success("User upload removed.");
			$scope.user = responseData.data.user;
			userInfo.data = responseData.data.user;
			$scope.uploads = [];
		}, function(error) {
			toastr.error("Error saving user account information.");
		})
	}

	$scope.cancel = function() {
		$scope.user.firstName = userData.firstName;
		$scope.user.lastName = userData.lastName;
		$scope.user.accountType = userData.accountType;
		$scope.user.email = userData.email;
		$scope.uploads = [];
	}
})
.controller('ProfileAdminController', function($scope, $stateParams, profileInfo, userInfo, $http, $q, ConfigService, UserProfileFactory, toastr) {
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