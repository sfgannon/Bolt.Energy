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
    	console.log("Producer upload directory created: " + path);
    	req.filepath = path;
    	cb(null, path);
    }).catch(function(error) {
    	console.log("Error creating producer upload directory: " + JSON.stringify(error));
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


var express = require('express');
var mongoose = require('mongoose');
var Profile = require('../models/model_profile');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/profiles")
	.get(function(req, res, next){
    //Get all profiles, or if req.email then search for one user by email
    var queryString = req.query;
    if (Object.keys(queryString).length > 0) {
    // if (req.query) {
      var result = Profile.find();
      for (i = 0; i < Object.keys(req.query).length; i++) {
        var term = Object.keys(req.query)[i];
        var value = req.query[term];
        if (term && value) {
        	result.where(term).equals(value);
        }
      };
      result.populate('projects').exec(function(err, profiles) {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (Object.keys(profiles).length == 0) {
          res.status(200).json({ message: "No profiles found matching search criteria." });
        } else {
          res.json({ profiles: profiles });
        }
      })
    } else {
      Profile.find(function(err, profile){
        if (err) {
          console.log(err);
          res.json({ error: err });
        }
        console.log(profile);
        res.json(profile);
      })
    }
  })
	.post(function(req, res, next) {
		//Save a new profile()
		//TODO: Check if user already has a profile, run auth() to check authentication, pass user
		//info on to rest of cb func
		req.body.profile.owner = mongoose.Types.ObjectId(req.body.profile.owner);
		var profile = new Profile(req.body.profile);
		profile.save(function(err, profile){
			if (err) {
				res.status(400).json({ error: err });
			} else {
				res.json({ message: "Profile saved.", profile: profile });
			}
		});
	});
router.route("/profiles/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Profile.findById(req.params.id).populate('projects').populate('owner').exec(function(err, profile) {
					if (err) {
						res.status(400).json({error: err});
					} else {
						res.json({ profile: profile });
					}
				});
			} else { res.status(401).json({ message: "Invalid object id." }); }
		} catch (e) {
			res.json({ err: e });
		}
	})
	.put(function(req, res, next) {
		try {
			if (objectid.isValid(req.params.id)) {
				Profile.findOneAndUpdate({_id: req.params.id}, req.body.profile, { new: true }, function(err, profile) {
					if (err) {
						res.status(400).json(err);
					} else {
						res.json({ profile: profile });
					}
				});
			}
		} catch (e) {
			res.json({ err: e });
		}
	})
	.delete(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Profile.remove({
					_id: req.params.id
				}, function(err, proj) {
					if (err) {
						res.json({error: err});
					} else {
						res.json({ message: "Profile deleted." });
					}
				})
			}
		} catch (e) {
			res.json(e);
		}
	});

	module.exports = router;