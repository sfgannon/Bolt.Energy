angular.module("CertService", []).service("CertificationService", ['$http','$q', function($http,$q) {
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
				// return "Test";
				var $promise = $http({
					method: 'get',
					url: '../data/certifications/' + id
				});
				return $promise;
			}
		},
		post : function(certData) {
			//Save a new cert
			//return "Updating a cert";
			///Check each field
			var $retVal = $q.defer();
			if ((certData.type)&&(certData.desc)) {
				// return $promise = $http({
				// 	method: 'put',
				// 	url: '../data/certifications/' + certData._id,
				// 	data: ({ _id: certData._id, type: certData.type, desc: certData.desc })
				// }).success(function(response) {
				// 	return "Certification Updated Successfully.";
				// }).error(function(response, status) {
				// 	return $q.reject({ "response": response, "message": "Certification Update Failed." });
				// })
				//return $promise;
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
				//return $q.reject({ "message": "Certification Fields Are Required "});
				$retVal.reject({ message: "Required fields missing." });
				return $retVal.promise;
			}
		},
		put : function(certData) {
			//Save a cert, check for an ID, update if exsting
			//return "Updating a cert";
			var $retVal = $q.defer();

			if(certData._id) {
				///Check each field
				if ((certData.type)&&(certData.desc)) {
					// return $promise = $http({
					// 	method: 'put',
					// 	url: '../data/certifications/' + certData._id,
					// 	data: ({ _id: certData._id, type: certData.type, desc: certData.desc })
					// }).success(function(response) {
					// 	return "Certification Updated Successfully.";
					// }).error(function(response, status) {
					// 	return $q.reject({ "response": response, "message": "Certification Update Failed." });
					// })
					//return $promise;
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
					//return $q.reject({ "message": "Certification Fields Are Required "});
					$retVal.reject({ message: "Required fields missing." });
					return $retVal.promise;
				}
			}
		},
		delete : function(id) {
			//Delete a cert
			//return "deleting a cert";
			if(certData.id) {
				var $promise = $http({
					method: 'delete',
					url: '../data/certifications/' + id
				});
				return $promise;
			} else {
				return "No certification specified for delete";
			}
		}
	}
}])