angular.module("UserModule", ["ui.router", "ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('useradmin', {
		url: '/user/:userId/:edit',
		views: {
			'': {
				templateUrl: function($stateParams) {
					if ($stateParams.edit) {
						return 'templates/user_admin.html';
					} else {
						return 'templates/user_view.html';
					}
				},
				controller: 'UserAdminController'
			},
			'images': {
				templateUrl: '../templates/general/image_uploader.html',
				controller: 'ImageUploadController'
			},
			'project': {
				templateUrl: '../templates/project/project_edit.html',
				controller: 'ProjectAdminController'
			}
		}
	});
})
.factory("UserFactory", function($resource) {
	return $resource('./data/users/:id', {id: '@_id'},{
		update: {
			method: 'PUT'
		}
	})
})
.controller('UserAdminController', function($scope, UserFactory, $stateParams) {
	//Get profile data for $scope variable
	UserFactory.get(function(responseData) {
		$scope.user = responseData.data.User;
	})
	//Save, cancel methods
	$scope.saveProfile = function() {

	}
	$scope.cancel = function() {

	}


})