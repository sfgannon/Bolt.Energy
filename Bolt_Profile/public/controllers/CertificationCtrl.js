angular.module("CertCtrl", ["CertService"]).controller("CertController", ['$scope', '$http', 'CertificationService', function($scope, $http, CertificationService) {
	var certs = CertificationService.get();
	certs.then(function (responseData) {
		console.log(responseData);
		$scope.data = responseData.data;
	})
	$scope.message = "Stored Certifications";
}])
.controller("CertDetailController", ['$scope','$http','CertificationService', function($http,$scope,CertificationService) {
	$scope.processForm = function(formData) {
		
	}
}])