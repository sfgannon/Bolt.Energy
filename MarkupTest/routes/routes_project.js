var express = require('express');
var mongoose = require('mongoose');
var Project = require('../models/model_project');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/projects")
	.get(function(req, res, next){
		//Get all projects
		Project.find(function(err, projects){
			if (err) {
				console.log(err);
				next(err);
			}
			res.json(projects);
		})
	})
	.post(function(req, res, next) {
		//Save a new project()
		var proj = new Project(req.body);
		proj.save(function(err, proj){
			if (err) {
				console.log(err);
				next(err);
			}
			res.json({ err: err, proj: proj });
			console.log("Project saved");
		});
	});
router.route("/projects/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				console.log("Finding Project");
				Project.findById(req.params.id, function(err, proj) {
					if (err) {
						res.json(err);
						next(err);
					}
					res.json(proj);
				})
			} else { console.log("Invalid ID"); }
		} catch (e) {
			res.json({ err: e });
		}	
	})
	.put(function(req, res, next) {
		try {
			if (objectid.isValid(req.params.id)) {
				Project.findOneAndUpdate({_id: req.params.id}, req.body, function(err, project) { 
					if (err) {
						res.json(err);
					}
					res.json(project);
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
					res.json(proj);
				})
			}
		} catch (e) {
			res.json(e);
		}
	});

	module.exports = router;