/**
* TestApp Module
*
* This is a test app for testing concepts before pushing into main branch of Bolt Project
*/
angular.module("testapp", ["ui.router","ngResource"])
 .config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/test_home.html',
        controller: 'HomeController'
    })
 })
  .controller('HomeController', ['$scope', function($scope){
  	$scope.message = "Here's a message.";
 }])