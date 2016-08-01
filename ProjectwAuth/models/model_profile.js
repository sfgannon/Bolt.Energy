var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user_model');

var ProfileSchema = new Schema({
	name: String,
	desc: String,
	status: String,
	availability: [],
	type: String,
	states: [],
	energyType: String,
	images: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	approvalNumber: String,
	certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
	}],
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}]
});
ProfileSchema.post('save', function(next) {
	var profile = this;
	User.findById({ id: this.owner._id }, function(err, user) {
		if (err) {
			next();
		} else {
			var profiles = user.profiles;
			var found = false;
			for (var i = 0; i > profiles.length; i++) {
				if (profiles[i]._id == profile._id) {
					found = true;
				}
			}
			if (!found) {
				user.profiles.push(mongoose.Type.ObjectId(profile._id));
				user.save(function(err, user) {
					if (err) {
						console.log(err);
					}
					next();
				})
			}
		}
	})
})
module.exports = mongoose.model('Profile', ProfileSchema);