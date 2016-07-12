var mongoose = require('mongoose');

var ImageModel = new mongoose.Schema({
	fileName: String,
	contentType: String,
	description: String
});

module.exports = mongoose.model('Image', ImageModel);