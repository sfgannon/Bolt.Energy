angular.module("ProducerProfileModule", ["ui.router","toastr"])
	.config(function($stateProvider,$urlRouterProvider) {
		$stateProvider.state('producer', {
			url: '/producer/:producerId/:projectId',
			resolve: {
				producerInfo: function(UserProfileFactory,$stateParams) {
					return UserProfileFactory.get($stateParams.producerId);
				},
				projectInfo: function(UserProjectFactory,$stateParams) {
					if ($stateParams.projectId) {
						return UserProjectFactory.get($stateParams.projectId);
					} else {
						return '';
					}
				}
			},
			views: {
				'': {
					controller: 'ProducerViewController',
					templateUrl: '../templates/producer/producer_view.html'
				},
				'projects@producer': {
					controller: 'ProjectViewController',
					templateUrl: function($stateParams) {
						if ($stateParams.projectId) {
							return '../templates/project/project_single.html';
						} else {
							return '../templates/project/project_multiple.html';
						}
					}
				}
			}
		})
	})
	.controller('ProducerViewController', function(toastr,UserProfileFactory,UserProjectFactory,ConfigService,$stateParams,$scope,producerInfo,projectInfo) {
		$scope.profile = producerInfo.data;
    var formattedValue = '';
    formattedValue = $scope.profile.availability.toString();
    formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
    $scope.profile.availability = formattedValue;
	})
	.controller('ProjectViewController', function(toastr,UserProfileFactory,UserProjectFactory,ConfigService,$stateParams,$scope,producerInfo,projectInfo) {
		$scope.projects = producerInfo.data.projects;
		$scope.project = projectInfo.data;
		if ($scope.project) {
	    var formattedValue = '';
	    formattedValue = $scope.project.availability.toString();
	    formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
	    $scope.project.availability = formattedValue;

	    formattedValue = $scope.project.utilityDistricts.toString();
	    formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
	    $scope.project.utilityDistricts = formattedValue;
		}
	})