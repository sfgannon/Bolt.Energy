var express = require('express');
var mongoose = require('mongoose');
var Profile = require('../models/profile_model');
var objectid = mongoose.Types.ObjectId;
var passport = require('passport');



module.exports = function(app) {
	const requireAuth = passport.authenticate('jwt', { session: false });

	var router = express.Router();
	router.route("/profiles")
		.get(function(req, res, next){
			//Get all profiles
			Profile.find(function(err, profiles){
				if (err) {
					console.log(err);
					next(err);
				}
				console.log(profiles);
				res.json(profiles);
			})
		})
		.post(function(req, res, next) {
			//Save a new profile()
			var proj = new Profile(req.body);
			proj.save(function(err, proj){
				if (err) {
					console.log(err);
					next(err);
				}
				res.json({ err: err, proj: proj });
				console.log("Profile saved");
			});
		});
	router.route("/profiles/:id")
		.get(function(req, res) {
			try {
				if (objectid.isValid(req.params.id)) {
					console.log("Finding Profile");
					Profile.findById(req.params.id, function(err, proj) {
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
					Profile.findOneAndUpdate({_id: req.params.id}, req.body, function(err, profile) { 
						if (err) {
							res.json(err);
						}
						res.json(profile);
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
						res.json(proj);
					})
				}
			} catch (e) {
				res.json(e);
			}
		});
	app.use('/data', router);
};