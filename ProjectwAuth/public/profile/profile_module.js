angular.module("ProducerProfileModule", ["ui.router","toastr"])
	.config(function($stateProvider,$urlRouterProvider) {
		$stateProvider.state('producer', {
			url: '/producer/:producerId/:projectId',
			resolve: {
				producerInfo: function(UserProfileFactory,$stateParams) {
					UserProfileFactory.get($stateParams.producerId).then(function(responseData) {
						var projectList = responseData.data.projects;
						var featured, projects;
						for (var i = 0; i < projectList.length; i++) {
							var formattedValue = '';
							formattedValue = projectList[i].availability.toString();
							formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
							projectList[i].availability = formattedValue;

							formattedValue = projectList[i].utilityDistricts.toString();
							formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
							projectList[i].utilityDistricts = formattedValue;
							
							if (projectList[i].featured) {
								featured = projectList[i];
							} else {
								projects.push(projectList[i]);
							}
						}
						return { producer: responseData.data, projects: projects, featured: featured };
					})
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
					templateUrl: '../templates/project/project_section.html'
				}
			}
		})
	})
	.controller('ProducerViewController', function(toastr,UserProfileFactory,UserProjectFactory,ConfigService,$stateParams,$scope,producerInfo,projectInfo) {
		$scope.profile = producerInfo.producer;
    var formattedValue = '';
    formattedValue = $scope.profile.availability.toString();
    formattedValue = formattedValue.replace('[').replace(']').replace('"').replace(/,/g, ', ');
    $scope.profile.availability = formattedValue;
	})
	.controller('ProjectViewController', function(toastr,UserProfileFactory,UserProjectFactory,ConfigService,$stateParams,$scope,producerInfo,projectInfo) {
		$scope.projects = producerInfo.projects;
		$scope.featured = producerInfo.featured;
		$scope.project = projectInfo.data;
		$scope.activeTab = 'projects';
		$scope.activateTab = function(tabName) {
			$scope.active	= tabName;
		}
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