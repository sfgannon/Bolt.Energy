var mongoose = require('mongoose');

var UploadModel = new mongoose.Schema({
	filename: String,
	filetype: String,
	description: String,
	primaryImage: Boolean,
  // item: { type: mongoose.Schema.Types.ObjectId, required: true }
  base64: { type: String, required: true },
	filesize: Number
});

module.exports = mongoose.model('Upload', UploadModel);