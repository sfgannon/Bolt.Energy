var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	bannerUrl: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	programCategory: Number,
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

module.exports = mongoose.model('Project', ProjectSchema);