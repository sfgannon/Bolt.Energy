var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
	name: String,
	desc: String,
	availability: String,
	type: String,
	states: [],
	energyMix: String,
	certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
	}],
	bannerUrl: String
})

module.exports = mongoose.model('Profile', ProfileSchema);