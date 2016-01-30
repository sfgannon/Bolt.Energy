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
	$scope.processForm = function() {
		//var $promise = $q.deferred;
		if ($scope._id) {
			//$promise = CertificationService.put({ _id: $scope._id, type: $scope.type, desc: $scope.desc });
			// var returnVal = CertificationService.put({ _id: $scope._id, type: $scope.type, desc: $scope.desc });
			// returnVal.success(function(responseData) {
			// 	alert(responseData.data);
			// }).error(function(response, status) {
			// 	alert("Error saving certification: " + response);
			// })
			//return CertificationService.put({ _id: $scope._id, type: $scope.type, desc: $scope.desc }).then(function(responseData) { 
			CertificationService.put({ _id: $scope._id, type: $scope.type, desc: $scope.desc }).then(function(responseData) {
				//return ({ "response": responseData, "message":"Successfully saved certification." });
				alert(responseData.data.message);
			}, function(response, status) {
				return ($q.reject({ "message" : "Error saving: " + status }));
			})
		} else {
			//$promise = CertificationService.post({ type:$scope.type, desc: $scope.desc });
			//var returnVal = CertificationService.post({ type:$scope.type, desc: $scope.desc });
			//alert(returnVal.message);
			return CertificationService.post({ type:$scope.type, desc: $scope.desc }).then(function(responseData) { 
				//return ({ "response": responseData, "message": "Successfully saved certification. "});
				alert(responseData);
			}, function(response, status) { 
				$q.reject({ "message" : "Error saving certification.", "response": response });
			})
		}

		//TODO put a watcher on the onStateCHanged event and listen for updates to the state params. When the stateparams are updated trigger a navigate to the List view of the certifications page
	}
}])