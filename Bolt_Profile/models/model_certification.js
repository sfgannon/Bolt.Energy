var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CertificationSchema = new Schema({
	type: String,
	desc: String
});

module.exports = mongoose.model('Certification', CertificationSchema);