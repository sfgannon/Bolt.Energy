angular.module("ProfService", []).service("ProfileService", ['$http','$q', function($http,$q) {
	return {
		get : function(id) {
			if (!id) {
				var $promise = $http({
					method: 'get',
					url: '../data/profiles'
				});
				return $promise;
			} else {
				var $promise = $http({
					method: 'get',
					url: '../data/profiles/' + id
				});
				return $promise;
			}
		},
		post : function(profData) {
			var $retVal = $q.defer();
			if ((profData.name)&&(profData.desc)) {
				$retVal.promise = $http({
					method: 'post',
					url: '../data/profiles',
					data: ({
						name: profData.name,
						desc: profData.desc,
						availability: profData.availability,
						type: profData.type,
						states: profData.states,
						energyMix: profData.energyMix,
						certifications: profData.certifications,
						bannerUrl: profData.bannerUrl
					})
				}).then(function(responseData) {
					$retVal.resolve({ profile: responseData.data, message: "Profile saved successfully." });
				}, function(responseData, status) {
					$retval.reject({ error: responseData.data, message: "Profile save failed." });
				})
				return $retVal.promise;
			} else {
				$retVal.reject({ message: "Required fields missing." });
				return $retVal.promise;
			}
		},
		put : function(profData) {
			var $retVal = $q.defer();

			if(profData._id) {
				///Check each field
				if ((profData.name)&&(profData.desc)) {
					$retVal.promise = $http({
						method: 'put',
						url: '../data/profiles/' + profData._id,
					 	data: ({
					 		_id: profData._id,
							name: profData.name,
							desc: profData.desc,
							availability: profData.availability,
							type: profData.type,
							states: profData.states,
							energyMix: profData.energyMix,
							certifications: profData.certifications,
							bannerUrl: profData.bannerUrl
						})
					}).then(function(responseData) {
						$retVal.resolve({ profile: responseData.data, message: "Profile updated successfully." });
					}, function(responseData, status) {
						$retVal.reject({ error: responseData.data, message: "Profile update failed." });
					})
					return $retVal.promise;
				} else {
					$retVal.reject({ message: "Required fields missing." });
					return $retVal.promise;
				}
			}
		},
		delete : function(profData) {
			var $retVal = $q.defer();
			if(profData._id) {
				$retVal.promise = $http({
					method: 'delete',
					url: '../data/profiles/' + profData._id
				}).then(function(response) {
					$retVal.resolve({ message: "Profile deleted successfully." });
				}, function(response, status) {
					$retVal.reject({ message: "Error deleting profile.", response: response });
				})
				return $retVal.promise;
			} else {
				$retVal.reject({ message: "Missing profile ID." });
				return $retVal.promise;
			}
		}
	}
}])