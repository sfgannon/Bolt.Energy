angular.module("ProfCtrl", ["ProfService", "CertService"]).controller("ProfController", ['$scope', '$http', 'ProfileService', 'CertificationService', function($scope, $http, ProfileService, CertificationService) {
	var profs = ProfileService.get();
	profs.then(function (responseData) {
		console.log(responseData);
		$scope.data = responseData.data;
	})
	$scope.message = "Stored Profiles";
}])
.controller("ProfDetailController", ['$http','$scope','$stateParams','ProfileService','CertificationService','$state','$q', function($http,$scope,$stateParams,ProfileService,CertificationService,$state,$q) {
	if ($stateParams.profid) {
		var currentFormId = $stateParams.profid;
		var prof = ProfileService.get(currentFormId);
		prof.then(function(responseData) {
			//All profile detail views will need a list of their certifications as well as certs saved in the DB
			var certs = CertificationService.get();
			$scope.allCerts = [];
			certs.then(function(certData) {
				angular.forEach(certData.data, function(value, key){
					if (responseData.data.certifications.indexOf(value._id) != -1) {
						$scope.allCerts.push({ _id: value._id, type: value.type, selected: true });
					} else {
						$scope.allCerts.push({ _id: value._id, type: value.type, selected: false });
					}
				})
			});
			$scope.name = responseData.data.name;
			$scope._id = responseData.data._id;
			$scope.type = responseData.data.type;
			$scope.desc = responseData.data.desc;
			$scope.availability = responseData.data.availability;
			$scope.states = responseData.data.states;
			$scope.energyMix = responseData.data.energyMix;
			$scope.certifications = responseData.data.certifications;
			$scope.bannerUrl = responseData.data.bannerUrl;
		});
	} else {
		var certs = CertificationService.get();
		certs.then(function(certData) {
			$scope.allCerts = [];
			angular.forEach(certData.data, function(value, key) {
				$scope.allCerts.push({ _id: value._id, type: value.type,selected: false });
			});
		});
	}

	$scope.cancelForm = function() {
		$state.go('prof');
	};

	$scope.deleteprofile = function() {
		if ($scope._id) {
			var promise = ProfileService.delete({ _id: $scope._id });
			promise.then(function(response) {
				alert(response.message);
				$state.go('prof');
			}, function(response) {
				alert(response.message);
			})
		}
	};

	$scope.processForm = function() {
		if ($scope._id) {
			var promise = ProfileService.put({
				//TO DO - UPDATE MODELREFS
				_id: $scope._id,
				type: $scope.type,
				desc: $scope.desc,
				name: $scope.name,
				availability: $scope.availability,
				states: $scope.states,
				energyMix: $scope.energyMix,
				certifications: $scope.certifications,
				bannerUrl: $scope.bannerUrl
			});
			promise.then(function(response) {
				alert(response.message);
				$state.go('prof');
			}, function(response) {
				alert(response.message);
			})
		} else {
			var promise = ProfileService.post({
				//TO DO - UPDATE MODELREFS
				type: $scope.type,
				desc: $scope.desc,
				name: $scope.name,
				availability: $scope.availability,
				states: $scope.states,
				energyMix: $scope.energyMix,
				certifications: $scope.certifications,
				bannerUrl: $scope.bannerUrl
			});
			promise.then(function(response) {
				alert(response.message);
				$state.go('prof');
			}, function(response) {
				alert(response.message);
			})
		}
	};
}])