angular.module("ProfCtrl", ["ProfService"]).controller("ProfController", ['$scope', '$http', 'ProfileService', function($scope, $http, ProfileService) {
	var profs = ProfileService.get();
	profs.then(function (responseData) {
		console.log(responseData);
		$scope.data = responseData.data;
	})
	$scope.message = "Stored Profiles";
}])
.controller("ProfDetailController", ['$http','$scope','$stateParams','ProfileService','$state','$q', function($http,$scope,$stateParams,ProfileService,$state,$q) {
	var currentFormId = $stateParams.profid;
	console.log($stateParams);
	var prof = ProfileService.get(currentFormId);
	prof.then(function(responseData) {
		console.log(responseData);
		//TO DO - UPDATE MODELREFS
		$scope._id = responseData.data._id;
		$scope.type = responseData.data.type;
		$scope.desc = responseData.data.desc;
	});

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
				desc: $scope.desc
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
				_id: $scope._id,
				type: $scope.type,
				desc: $scope.desc
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