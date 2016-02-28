var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	desc: String,
	status: String,
	availability: String,
	type: String,
	states: [],
	energyMix: String,
	bannerUrl: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	programNumber: Number,
	capacity: String,
	utilityDistricts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UtilityDistrict'
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'Profile'
	}
});

module.exports = mongoose.model('Profile', ProfileSchema);