angular.module("HomeCtrl", []).controller("HomeController", ['$scope', '$http', function($scope, $http) {
	$scope.welcome = "Bolt Profile Mockup.";
	$scope.paragraph = "Select the certifications tab to add certifications to associate with profiles. Select the Profiles tab to view, add and edit profiles.";
}]);