var mongoose = require('mongoose');

var ImageModel = new mongoose.Schema({
	fileName: String,
	contentType: String
});

module.exports = mongoose.model('Image', ImageModel);