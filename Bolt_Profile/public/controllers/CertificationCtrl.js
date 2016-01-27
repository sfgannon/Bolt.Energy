angular.module("CertCtrl", ["CertService"]).controller("CertController", ['$scope', '$http', 'CertificationService', function($scope, $http, CertificationService) {
	var certs = CertificationService.get();
	certs.then(function (responseData) {
		console.log(responseData);
		$scope.data = responseData.data;
	})
	$scope.message = "Stored Certifications";
}])
.controller("CertDetailController", ['$scope','$http','$routeParams','CertificationService', function($http,$scope,$routeParams,CertificationService) {
	var currentFormId = $routeParams.id;
	var cert = CertificationService.get(currentFormId);
	cert.then(function(responseData) {
		console.log(responseData);
	})
	$scope.processForm = function(formData) {
		
	}
}])