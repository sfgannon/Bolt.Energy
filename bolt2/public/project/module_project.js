angular.module("ProjectModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('project', {
        url: '/project',
        templateUrl: '/templates/project_home.html',
        controller: 'ProjectController'
    })

    // .state('project.list', {
    //     url: '/list',
    //     templateUrl: '/templates/project_list.html',
    //     controller: 'ProjectController'
    // })

    .state('project.detail', {
        url: '/detail/:projectid',
        templateUrl: '/templates/project_detail.html',
        controller: 'ProjectDetailController'
    })
})
.factory('ProjectFactory',function($resource){
    return $resource('http://localhost:3002/data/projects/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    })
})
.controller('ProjectController', ['$scope', '$http', 'ProjectFactory', function($scope,$http,ProjectFactory) {
    $scope.projects = ProjectFactory.query(function() {
        console.log("Within Callback");
        console.log($scope.projects);
    });
    console.log("Outside callback");
    console.log($scope.projects)
}])
.controller('ProjectDetailController', ['$scope', '$http', '$stateParams', 'ProjectFactory', function($scope,$http,$stateParams,ProjectFactory) {
    

}])





// .service("ProjectService", ['$http','$q',function($http,$q) {
//     return {
//         get: function(id) {
//             var $retVal = $q.defer;
//             if (!id) {
//                 $retVal.promise = $http({
//                     method: 'get',
//                     url: '../data/projects'
//                 });
//             } else {
//                 $retVal.promise = $http({
//                     method: 'get',
//                     url: '../data/projects/' + id
//                 });
//             }
//             return $retVal.promise;
//         },
//         post: function(project) {

//         },
//         put: function(project) {

//         },
//         delete: function(id) {

//         }
//     }
// }])