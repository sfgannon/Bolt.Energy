var exporess = require('express');
var mongoose = require('mongoose');
var Profile = require('../models/model_profile');

var profileRouter = express.Router();
profileRouter.route("/profiles")
	.post(function(req, res) {
		var prof = new Profile();
		prof.name = req.body.name;
		prof.desc = req.body.desc;
		prof.availability = req.body.availability;
		prof.type = req.body.type;
		prof.energyMix = req.body.energyMix;
		prof.states = req.body.states.split(",");
		var certifications;
		if (req.body.certifications) {
			certifications = req.body.certifications.split(",");
			for (i = 0; i < certifications.length; i++) {
				prof.certifications.push({  _id: certifications[i] });
			}
		}
		prof.bannerUrl = req.body.bannerUrl;
		Profile.where({ 'name': prof.name, 'desc': prof.desc }).exec(function(err, results){
			if (err) { res.json({ message: "Error executing Model.Find().", error: err}); }
			else {
				if (results.length == 0) {
					if ((prof.name)&&(prof.desc)) {
						prof.save(function(err) {
							if (err) {
								res.json({ error: err, message: 'Error saving profile.' });
							};
							res.json({ message: 'Profile saved successfully.' });
						})
					} else {
						res.json({ message: "Name and Description are required for profiles."});
					}
				} else {
					res.json({ message: "Profile already exists." });
				}
			}

		})
	})
	.get(function(req, res) {
		Profile.find(function(err, profiles) {
			if (err) {
				res.json({ error: err, message: 'Error getting profiles.' });
			};
			res.json(profiles);
		})
	});
profileRouter.route("/profiles/:id")
	.get(function (req, res) {
		try {
		  	objectid = mongoose.Types.ObjectId;
			if (objectid.isValid(req.params.id)) {
				Profile.findById(req.params.id, function(err, cert) {
					if (err) {
						res.json({ message: "Error finding profile", error: err });
					}
					if (cert) {
						res.json(cert);
					} else {
						res.json({ message: "No Profile exists with that ID." });
					}
				});
			} else {
				res.json({message: "Invalid ObjectId"});
			}
		} catch (e) {
			res.json({message: "Error finding profile.", error: e });
		}
	})
	.put(function(req, res) {
	  	objectid = mongoose.Types.ObjectId;
		if (objectid.isValid(req.params.id)) {
			Profile.findById(req.params.id, function(err, profile) {

	            if (err)
	                res.send(err);

				prof.name = req.body.name ? req.body.name : prof.name;
				prof.desc = req.body.desc ? req.body.desc : prof.desc;
				prof.availability = req.body.availability ? req.body.availability : prof.availability;
				prof.type = req.body.type ? req.body.type : prof.type;
				prof.energyMix = req.body.energyMix ? req.body.energyMix : prof.energyMix;
				prof.states = req.body.states ? req.body.states.split(",") : prof.states;
				var certifications;
				if (req.body.certifications) {
					prof.certifications.clear();
					certifications = req.body.certifications.split(",");
					for (i = 0; i < certifications.length; i++) {
						prof.certifications.push({  _id: certifications[i] });
					}
				}

	            if ((profile.name)&&(profile.desc)) {
		            profile.save(function(err) {
		                if (err)
		                    res.send(err);

		                res.json({ message: 'Profile updated.' });
		            });
	            } else {
	            	res.json({ message: "Profile fields cannot be blank." })
	            }
	        });
		} else {
			res.json({ message: "Invalid ObjectId" });
		}
	})
	.delete(function(req, res) {
	  	objectid = mongoose.Types.ObjectId;
		if (objectid.isValid(req.params.id)) {
	        Profile.remove({
	            _id: req.params.id
	        }, function(err, profile) {
	            if (err)
	                res.json({ error: err, message: "Error deleting profile." });

	            res.json({ message: 'Successfully deleted' });
	        });
	    } else {
	    	res.json({ message: "Invalid ObjecyId" });
	    }
	});


module.exports = profileRouter;