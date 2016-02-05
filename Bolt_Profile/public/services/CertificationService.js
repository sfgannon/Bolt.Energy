angular.module("CertService", []).service("CertificationService", ['$http','$q', function($http,$q) {
	return {
		get : function(id) {
			if (!id) {
				var $promise = $http({
					method: 'get',
					url: '../data/certifications'
				});
				return $promise;
			} else {
				var $promise = $http({
					method: 'get',
					url: '../data/certifications/' + id
				});
				return $promise;
			}
		},
		post : function(certData) {
			var $retVal = $q.defer();
			if ((certData.type)&&(certData.desc)) {
				$retVal.promise = $http({
					method: 'post',
					url: '../data/certifications',
					data: ({ type: certData.type, desc: certData.desc })
				}).then(function(responseData) {
					$retVal.resolve({ certification: responseData.data, message: "Certification saved successfully." });
				}, function(responseData, status) {
					$retval.reject({ error: responseData.data, message: "Certification save failed." });
				})
				return $retVal.promise;
			} else {
				$retVal.reject({ message: "Required fields missing." });
				return $retVal.promise;
			}
		},
		put : function(certData) {
			var $retVal = $q.defer();

			if(certData._id) {
				///Check each field
				if ((certData.type)&&(certData.desc)) {
					$retVal.promise = $http({
						method: 'put',
						url: '../data/certifications/' + certData._id,
					 	data: ({ _id: certData._id, type: certData.type, desc: certData.desc })
					}).then(function(responseData) {
						$retVal.resolve({ certification: responseData.data, message: "Certification updated successfully." });
					}, function(responseData, status) {
						$retval.reject({ error: responseData.data, message: "Certification update failed." });
					})
					return $retVal.promise;
				} else {
					$retVal.reject({ message: "Required fields missing." });
					return $retVal.promise;
				}
			}
		},
		delete : function(certData) {
			var $retVal = $q.defer();
			if(certData._id) {
				$retVal.promise = $http({
					method: 'delete',
					url: '../data/certifications/' + certData._id
				}).then(function(response) {
					$retVal.resolve({ message: "Certification deleted successfully." });
				}, function(response, status) {
					$retVal.reject({ message: "Error deleting certification.", response: response });
				})
				return $retVal.promise;
			} else {
				$retVal.reject({ message: "Missing certification ID." });
				return $retVal.promise;
			}
		}
	}
}])