// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var fs = require('fs-extra');
var mkdirp = require('mkdirp-promise')
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var destinationDirectory = './userImages/';
    var userDir = req.user ? req.user._id.toString() : 'uploads';
    var path = destinationDirectory + userDir;
    mkdirp(path).then(function(responseData) {
    	console.log("User upload directory created: " + path);
    	req.filepath = path;
    	cb(null, path);
    }).catch(function(error) {
    	console.log("Error creating user upload directory: " + JSON.stringify(error));
    	cb(null, path);
    })
  },
  filename: function (req, file, cb) {
 		var id = req.user._id.toString();
 		var fileName = id + "_" + file.originalname;
 		file.path = req.filepath;
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

// Load models
const User = require('../models/user_model');
const Profile = require('../models/model_profile');
const Project = require('../models/model_project');
const Upload = require('../models/upload_model');

module.exports = function(app) {
	var router = express.Router();
	router.get("/account/:id", function(req, res, next) {
    try {
      if (objectId.isValid(req.params.id)) {
        User.findById(req.params.id).populate('uploads producerProfile').exec(function(err, User) {
          if (err) {
            res.status(500).json({ error: err, message: "Error finding user." });
          } else {
            res.status(200).json({ user: User, message: "User information found." });
          }
        });
      } else {
        res.status(500).json({ message: "Invalid User Id." });
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "Error occurred while retrieving data." });
    }
  });
  router.put("/account/:id", requireAuth, uploadFile.array('files'), function(req, res, next) {
  //router.put("/account/:id", uploadFile.array('files'), function(req, res, next) {
  	//Ensure that the user editing the account is the owner
  	if (req.user._id == req.params.id) {
	    try {
	    	//Check to see if this is an image removal post
	    	var data = (req.body.data)?(JSON.parse(req.body.data)):('');
	    	//Try to really specifially add each photo as an upload rather than as an array of objects
				if (data.removeImage) {
					User.findById(req.params.id, function(err, user) {
						var image = user.uploads.id(data.removeImage);
						fs.remove(image.path + image.filename, null);
						user.uploads.id(data.removeImage).remove();
						user.save(function(err, user) {
		          if (err) {
		            //wtf happened?
		            res.status(500).json({ error: err });
		          } else {
		            res.status(200).json({ user: user, message: 'User information updated.'});
		          }
						});
					})
				} else {
		    	var uplds = (req.body.uploads)?(JSON.parse(req.body.uploads)):('');
		    	var destinationDirectory = './userImages/';
	  			var userDir = req.user ? req.user._id.toString() : 'uploads';
	  			var path = destinationDirectory + userDir + "/";
	  			var setPath = function(upload) {
	  				upload.path = path;
	  				upload.filename = req.user._id + "_" + upload.filename;
	  			};
	  			var addUploads = function(upload) {
	  				var up = new Upload(upload);
	  				data.uploads.push(up);
	  			}
	  			uplds.map(setPath);
					uplds.map(addUploads);
		      if (objectId.isValid(req.params.id)) {
		        User.findOneAndUpdate({ _id: req.params.id }, data, { new: true }, function(err, User) {
		          if (err) {
		            //wtf happened?
		            res.status(500).json({ error: err });
		          } else {
		            res.status(200).json({ user: User, message: 'User information updated.'});
		          }
		        });
		      } else {
		        res.status(500).json({ message: "Invalid Object Id." });
		      }
				}
	    } catch (e) {
	      res.status(500).json({ error: e, message: "Error occurred while saving." });
	    }
  	} else {
  		res.status(403).json({ error: "Access denied." });
  	}
  });
  app.use('/admin', router);
	//app.use('/userImages/*', requireAuth);
	app.use('/userImages', express.static('userImages'));
}
