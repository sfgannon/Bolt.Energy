angular.module("boltprofiles", ["ui.router","ngResource","ProjectModule","ProfileModule","CertificationModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })
})
 .controller('HomeController', ['$scope','CertificationFactory','ProfileFactory','ProjectFactory', function($scope,CertificationFactory,ProfileFactory,ProjectFactory){
 	$scope.certifications = CertificationFactory.query();
 	$scope.profiles = ProfileFactory.query();
 	$scope.projects = ProjectFactory.query();
 }])