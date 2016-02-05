angular.module("CertCtrl", ["CertService"]).controller("CertController", ['$scope', '$http', 'CertificationService', function($scope, $http, CertificationService) {
	var certs = CertificationService.get();
	certs.then(function (responseData) {
		console.log(responseData);
		$scope.data = responseData.data;
	})
	$scope.message = "Stored Certifications";
}])
.controller("CertDetailController", ['$http','$scope','$stateParams','CertificationService','$state','$q', function($http,$scope,$stateParams,CertificationService,$state,$q) {
	var currentFormId = $stateParams.certid;
	console.log($stateParams);
	var cert = CertificationService.get(currentFormId);
	cert.then(function(responseData) {
		console.log(responseData);
		$scope._id = responseData.data._id;
		$scope.type = responseData.data.type;
		$scope.desc = responseData.data.desc;
	});

	$scope.cancelForm = function() {
		$state.go('cert');
	};

	$scope.deleteCertification = function() {
		if ($scope._id) {
			var promise = CertificationService.delete({ _id: $scope._id });
			promise.then(function(response) {
				alert(response.message);
				$state.go('cert');
			}, function(response) {
				alert(response.message);
			})
		}
	};

	$scope.processForm = function() {
		if ($scope._id) {
			var promise = CertificationService.put({ _id: $scope._id, type: $scope.type, desc: $scope.desc });
			promise.then(function(response) {
				alert(response.message);
				$state.go('cert');
			}, function(response) {
				alert(response.message);
			})
		} else {
			var promise = CertificationService.post({ _id: $scope._id, type: $scope.type, desc: $scope.desc });
			promise.then(function(response) {
				alert(response.message);
				$state.go('cert');
			}, function(response) {
				alert(response.message);
			})
		}
	};
}])