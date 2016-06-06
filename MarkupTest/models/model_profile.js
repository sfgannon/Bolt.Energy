var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
	name: String,
	desc: String,
	status: String,
	availability: [],
	type: String,
	states: [],
	energyType: String,
	bannerUrl: String,
	owner: String,	
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	approvalNumber: Number,
	certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
	}],
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}]
});

module.exports = mongoose.model('Profile', ProfileSchema);