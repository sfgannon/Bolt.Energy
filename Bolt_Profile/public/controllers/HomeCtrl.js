angular.module("HomeCtrl", []).controller("HomeController", ['$scope', '$http', function($scope, $http) {
	$scope.welcome = "Bolt Profile Mockup.";
	$scope.paragraph = "Select the certifications tab to add certifications to associate with profiles. Select the Profiles tab to view, add and edit profiles.";
    // $http({
    //   method: 'GET',
    //   url: 'http://api.eia.gov/series/?series_id=SEDS.TEPRB.US.A;SEDS.REPRB.US.A&api_key=391D53503414935F30997F6DDC1CD474'
    // }).then(function(responseData) {
    // 	console.log(responseData);
    // })
}]);