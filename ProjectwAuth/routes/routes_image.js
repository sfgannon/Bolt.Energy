// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var ImageModel = require('../models/images_model');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});

var uploadImage = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (file.mimetype.indexOf('image/') > -1) {
      return cb(null, true);
    } else {
      return cb("File not an image.", false);
    }
  }
});

module.exports = function(app) {
	var router = express.Router();
	router.get('/images', function(req, res, next) {
		ImageModel.find(function(err, images) {
			if (err) {
				//End execution, send the error
				next(err);
			}
			res.json(images);
		});
	})
	.post('/images', uploadImage.array('files'), function(req, res, next) {
	  //Multiple images coming in, parse req.files for image data and image contents
    try {
      var data = JSON.parse(req.body.data);
      var images = [];
      if (data.length > 0) {
        var saveOne = function(imageModelInstance) {
          var result = imageModelInstance.save();
          result.then(function(image) {
            result.resolve({ data: image });
            if (image.primaryImage) {
              ImageModel.find({ 'item': image.item, '_id': { $ne: image._id }, 'primaryImage': { $ne: false }}).exec(function(err, images) {
                for (var i = 0; i < images.length; i++) {
                  images[i].primaryImage = false;
                  images[i].save();
                }
              })
            }
          }, function(err) {
            result.reject({ error: err });
          });
          return result;
        };
        for (var i = 0; i < data.length; i++) {
          var img = new ImageModel(data[i]);
          images.push(img);
        }
        var promises = images.map(saveOne);
        Promise.all(promises).then(function(response) {
          res.json({ message: "Successfully uploaded files.", images: response });
        }, function(err) {
          res.json({ message: "File upload failed.", error: err });
        });
      } else {
        next();
      }
    }
    catch (ex) {
      res.status(500).json({ message: "Error uploading file. ", error: ex });
    }
	});
	router.get('/images/:id', function(req, res, next) {
	  try {
	    ImageModel.find({"item": req.params.id}, function(err, images) {
	      if (err) {
	        res.status(401).json({ error: err });
	      } else {
	        res.status(200).json({ images: images });
	      }
	    })
	  } catch (e) {
	    throw e;
	  }
	})
	app.use('/data', router);
};