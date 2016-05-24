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
  .directive('authdirective', function(){
  	// Runs during compile
  	return {
  		//name: 'authdirective',
  		priority: 1,
  		// terminal: true,
  		scope: {}, // {} = isolate, true = child, false/undefined = no change
  		controller: function($scope, $element, $attrs, $transclude) {
  			$scope.authenticated = false;
  			$scope.login = function(username, password) {
  				console.log($scope.username + ' ' + $scope.password);
  				$scope.authenticated = true;
  			}
  			$scope.logout = function() {
  				$scope.authenticated = false;
  			}
  		},
  		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
  		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
  		// template: '',
  		templateUrl: '/authdirective/authdirective.html',
  		replace: false,
  		// transclude: true,
  		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
  		link: function($scope, iElm, iAttrs, controller) {
  			
  		}
  	};
  });