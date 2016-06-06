var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UtilityDistrictSchema = new Schema({
	name: String,
	state: String
});

module.expots = mongoose.model.('UtilityDistrict', UtilityDistrictSchema);