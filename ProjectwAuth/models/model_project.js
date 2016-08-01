var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Profile = require('../models/model_profile');

var ProjectSchema = new Schema({
	name: {
		type:String,
		required: true
	},
	desc: {
		type:String,
		required: true
	},
	status: String,
	availability: [{
		type:String,
		required: true
	}],
	projectType: {
		type: String,
		required: true
	},
	images: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	}],
	energyMix: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	programCategory: String,
	capacity: String,
	utilityDistricts: [{
		required: true,
		type: String,
		enum: ['Berlin','BGE','Choptank','DPL','Easton','Hagerstown','PE','Pepco','SMECO','Thurmont','Williamsport' ]
	}],
	projectOwner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Profile'
	}
});

ProjectSchema.post('save', function(next) {
	var that = this;
	//Push the project ID as a ref back to the owning profile
	Profile.findById(this.projectOwner, function(profile) {
		var found = false;
		for (var i = 0; i < profile.projects.length; i++) {
			if (profile.projects[i] == that._id) {
				found = true;
			}
		}
		if (!found) {
			profile.projects.push(that._id);
			profile.save();
		}
	})
})

module.exports = mongoose.model('Project', ProjectSchema);