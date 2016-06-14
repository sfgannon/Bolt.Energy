// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var ImageModel = require('../models/images_model');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage })

module.exports = function(app) {
	var router = express.Router();
	router.get('/images', function(req, res) {
		ImageModel.find(function(err, images) {
			if (err) {
				//End execution, send the error
				next(err);
			}
			res.json(images);
		})
	})
	.post('/images', upload.single('file'), function(req, res) {
	//.post('/images', function(req, res) {
		console.log("Saved to: " + req.file.path);
		var img = new ImageModel(req.body);
		img.save(function(err, images) {
			if (err) {
				console.log(err);
				next(err);
			}
			res.json({ status: "Image Saved." });
		})
	})
	app.use('/data', router);
}