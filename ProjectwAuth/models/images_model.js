var mongoose = require('mongoose');

var ImageModel = new mongoose.Schema({
	fileName: String,
	contentType: String,
	description: String,
	primaryImage: Boolean,
  item: { type: mongoose.Schema.Types.ObjectId, required: true }
});

// ImageModel.post('save', function(next) {
//     var that = this;
//     ImageModel.find({ 'item': that.item, '_id': { $ne: that._id }}).exec(function(err, images) {
//         if (err) {
//             next();
//         } else {
//             var removePrimary = function(image) {
//                 image.primaryImage = false;
//                 return image.save();
//             }
//             var promises = images.map(removePrimary)
//             Promise.all(promises).then(function(responseData) {
//                 next();
//             })
//         }
//     })
// })

var ImageModel = mongoose.model('Image', ImageModel);

module.exports = ImageModel;