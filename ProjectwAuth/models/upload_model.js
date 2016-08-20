var mongoose = require('mongoose');

var UploadModel = new mongoose.Schema({
	filename: String,
	filetype: String,
	description: String,
  // item: { type: mongoose.Schema.Types.ObjectId, required: true }
  //base64: { type: String, required: true },
	filesize: Number,
	path: String
});

module.exports = mongoose.model('Upload', UploadModel);