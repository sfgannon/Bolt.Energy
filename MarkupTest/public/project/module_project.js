angular.module("ProjectModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('project', {
        cache: false,
        url: '/project',
        templateUrl: '/templates/project_home.html',
        controller: 'ProjectController'
    })
    //.state('project.detail', {
    .state('project.detail', {
        url: '/detail/:projectid',
        templateUrl: '/templates/project_detail.html',
        controller: 'ProjectDetailController'
    })
})
.factory('ProjectFactory',function($resource){
    return $resource('./data/projects/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    })
})
.controller('ProjectController', ['$scope', '$http', 'ProjectFactory', function($scope, $http,ProjectFactory) {
    $scope.projects = ProjectFactory.query();
}])
.controller('ProjectDetailController', ['$scope', '$http', '$state', '$stateParams', 'ProjectFactory', 'ProfileFactory', function($scope,$http,$state,$stateParams,ProjectFactory,ProfileFactory) {
    if ($stateParams.projectid){
        //This is an existing project
        var id = $stateParams.projectid;
        $scope.project = ProjectFactory.get({ id: id });
    } else {
        //This is a new project
        $scope.project = new ProjectFactory();
    };
    $scope.owners = ProfileFactory.query();
    $scope.saveProject = function() {
        if (!$scope.project._id) {
            $scope.project.$save(function() {
                alert('Project successfully saved.');
                $scope.projects = ProjectFactory.query(function() {
                    $state.go('project', {}, { reload: true });
                });
            },
                function(error) {
                    alert(error.message);
                });
        } else {
            $scope.project.$update(function() {
                alert('Project successfully saved.');
                $state.go('project', {}, { reload: true });
            },
                function(error) {
                    alert(error.message);
                    $state.go('project');
                });
        }
    };
    $scope.cancelProject = function() {
        $state.go('project');
    };
    $scope.deleteProject = function() {
        $scope.project.$remove(
            function() {
                alert('Project successfully deleted.');
                $scope.projects = ProjectFactory.query(function() {
                    $state.go('project', {}, { reload: true });
                })
            },
            function(error) {
                alert(error.message);
                $state.go('project');
            });
    };
}])