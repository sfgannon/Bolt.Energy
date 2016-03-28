var express = require('express');
var mongoose = require('mongoose');
var Project = require('../models/model_project');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/projects")
	.get(function(req, res){
		//Get all projects
		Project.find(function(err, projects){ 
			res.json({ err: err, projects: projects });
		})
	})
	.post(function(req, res) {
		//Save a new project()
		var proj = new Project(req.body);
		proj.save(function(err, proj){
			res.json({ err: err, proj: proj });
			console.log("Project saved");
		});
	});
router.route("/projects/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Project.findById(req.params.id, function(err, proj) {
					res.json({ err: err, proj: proj });
				})
			}
		} catch (e) {
			res.json({ err: e });
		}	
	})
	.put(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Project.findById(req.params.id, function(err, proj) {
					var newProj = new Project(req.body);
					proj = newProj;
					proj.save(function(err, proj) {
						res.json({ err: err, proj: proj });
					})
				})
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
					res.json({ err: err, proj: proj });
				})
			}
		} catch (e) {
			res.json({ err: e });
		}
	});

	module.exports = router;