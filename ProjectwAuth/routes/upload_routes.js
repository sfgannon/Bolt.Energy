// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var UploadModel = require('../models/upload_model');
var UserModel = require('../models/upload_model');
var mkdirp = require('mkdirp-promise')
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	//Make sure there is a folder in the user images directory that
  	//corresponds to the user's ID, if not create it.
    //cb(null, './public/temp/');
    var destinationDirectory = './userImages/';
    var userDir = req.user ? req.user._id.toString() : 'uploads';
    var path = destinationDirectory + userDir;
    mkdirp(path).then(function(responseData) {
    	console.log("User upload directory created: " + path);
    	cb(null, path);
    }).catch(function(error) {
    	console.log("Error creating user upload directory: " + JSON.stringify(error));
    	cb(null, path);
    })
  },
  filename: function (req, file, cb) {
  	//Overall: Grab user ID from auth token in header
  	//Create a directory with the user's ID if it hasn't already been created
  	//Upload the file there with a new name
 		var id = req.user._id.toString();
 		var fileName = id + "_" + file.name;
    cb(null, fileName);
  }
});

var uploadFile = multer({
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

var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
	var router = express.Router();
	router.post("/upload", requireAuth, uploadFile.array('files'), function(req, res, next) {
		try {
      var data = JSON.parse(req.body.data);
      var images = [];
      if (data.length > 0) {
        var saveOne = function(uploadModelInstance) {
          var result = uploadModelInstance.save();
          result.then(function(image) {
            result.resolve({ data: image });
          }, function(err) {
            result.reject({ error: err });
          });
          return result;
        };
        for (var i = 0; i < data.length; i++) {
          var img = new UploadModel(data[i]);
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
	})
	router.get("/upload", function(req, res, next) {
		UploadModel.find(function(err, uploads) {
			if (err) {
				//End execution, send the error
				next(err);
			}
			res.json(uploads);
		});
	})

	app.use('/data', router);
	app.use('/userImages/*', requireAuth);
	app.use('/userImages', express.static('userImages'));
}