angular.module("ProfService", []).service("ProfileService", ['$http', function($http) {
	return {
		get : function(id) {
			if (!id) {
				//return all profiles
				return "Getting all profiles";
			} else {
				//return a specific profile
				return "Getting one profile";
			}
		},
		post : function(profData) {
			//Save a Prof, check for an ID, update if exsting
			return "Updating a profile";
		},
		delete : function(id) {
			//Delete a profile
			return "deleting a profile";
		}
	}
}])