angular.module("CertService", []).service("CertificationService", ['$http', function($http) {
	return {
		get : function(id) {
			if (!id) {
				//return all certs
				var $promise = $http({
					method: 'get',
					url: '../data/certifications'
				});
				return $promise;
			} else {
				//return a specific cert
				return "Getting one cert";
			}
		},
		post : function(certData) {
			//Save a cert, check for an ID, update if exsting
			return "Updating a cert";
		},
		delete : function(id) {
			//Delete a cert
			return "deleting a cert";
		}
	}
}])