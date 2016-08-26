var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user_model');
var UploadSchema = require('./upload_model').schema;
var ProjectSchema = require('./model_project').schema;

var ProducerSchema = new Schema({
	name: String,
	desc: String,
	status: String,
	availability: [],
	type: String,
	states: [],
	energyType: String,
  	uploads: [ UploadSchema ],
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
	projects: [ ProjectSchema ]
});
module.exports = mongoose.model('Producer', ProducerSchema);