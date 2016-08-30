// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var Producer = require('../models/producer_model');
var Upload = require('../models/upload_model');
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
var Project = require('../models/model_project');
var Producer = require('../models/producer_model');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/projects")
	.get(function(req, res, next){
    //Get all projects, or if req.email then search for one user by email
    var queryString = req.query;
    if (Object.keys(queryString).length > 0) {
    // if (req.query) {
      var result = Project.find();
      for (var i = 0; i < Object.keys(req.query).length; i++) {
        var term = Object.keys(req.query)[i];
        var value = req.query[term];
        result.where(term).equals(value);
      }
      result.exec(function(err, projects) {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (Object.keys(projects).length == 0) {
          res.status(200).json({ message: "No projects found matching search criteria." });
        } else {
          res.json({ projects: projects });
        }
      });
    } else {
      Project.find(function(err, project){
        if (err) {
          console.log(err);
          res.json({ error: err });
        }
        console.log(project);
        res.json(project);
      });
    }
  })
	.post(function(req, res, next) {
		//Save a new project()
		//TODO: Check if user already has a project, run auth() to check authentication, pass user
		//info on to rest of cb func
		//TODO make sure project is associated with profile
		//TODO Image provessing, replicate producer save
		req.body.project.projectOwner = mongoose.Types.ObjectId(req.body.project.owner);
		var project = new Project(req.body.project);
		project.save(function(err, project){
			if (err) {
				res.status(400).json({ error: err });
			} else {
				res.json({ message: "Project saved.", project: project });
			}
		});
	});
router.route("/projects/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Project.findById(req.params.id, function(err, project) {
					if (err) {
						res.status(400).json({error: err});
					} else {
						res.json({ project: project });
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
				Project.findOneAndUpdate({_id: req.params.id}, req.body.project, { new: true }, function(err, project) {
					if (err) {
						res.status(400).json(err);
					} else {
						res.json({ project: project });
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
				Project.remove({
					_id: req.params.id
				}, function(err, proj) {
					if (err) {
						res.json({error: err});
					} else {
						res.json({ message: "Project deleted." });
					}
				})
			}
		} catch (e) {
			res.json(e);
		}
	});

	module.exports = router;