var express = require('express');
var mongoose = require('mongoose');
var Certification = require('../models/model_certification');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/certifications")
	.get(function(req, res, next){
		//Get all certifications
		Certification.find(function(err, certifications){
			if (err) {
				console.log(err);
				next(err);
			}
			console.log(certifications);
			res.json(certifications);
		})
	})
	.post(function(req, res, next) {
		//Save a new certification()
		var proj = new Certification(req.body);
		proj.save(function(err, proj){
			if (err) {
				console.log(err);
				next(err);
			}
			res.json({ err: err, proj: proj });
			console.log("Certification saved");
		});
	});
router.route("/certifications/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				console.log("Finding Certification");
				Certification.findById(req.params.id, function(err, proj) {
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
				Certification.findOneAndUpdate({_id: req.params.id}, req.body, function(err, certification) { 
					if (err) {
						res.json(err);
					}
					res.json(certification);
				});
			}
		} catch (e) {
			res.json({ err: e });
		}
	})
	.delete(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				Certification.remove({
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