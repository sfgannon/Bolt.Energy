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
			if ((certData.type)&&(certData.desc)) {
				return $promise = $http({
					method: 'post',
					url: '../data/certifications',
					data: ({ type: certData.type, desc: certData.desc })
				}).success(function(response) {
					return ({ "response": response, "message": "Certification Saved Successfully." });
				}).error(function(response, status) {
					return $q.reject({ "response": response, "message": "Certification Failed to Save." });
				})
				//return $promise;
			} else {
				return $q.reject({ "message": "Certification fields are required." });
			}
		},
		put : function(certData) {
			//Save a cert, check for an ID, update if exsting
			//return "Updating a cert";
			if(certData._id) {
				///Check each field
				if ((certData.type)&&(certData.desc)) {
					return $promise = $http({
						method: 'put',
						url: '../data/certifications/' + certData._id,
						data: ({ _id: certData._id, type: certData.type, desc: certData.desc })
					}).success(function(response) {
						return "Certification Updated Successfully.";
					}).error(function(response, status) {
						return $q.reject({ "response": response, "message": "Certification Update Failed." });
					})
					//return $promise;
				} else {
					return $q.reject({ "message": "Certification Fields Are Required "});
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