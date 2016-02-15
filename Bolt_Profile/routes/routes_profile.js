var exporess = require('express');
var mongoose = require('mongoose');
var Profile = require('../models/model_profile');

var profileRouter = express.Router();
profileRouter.route("/profiles")
	.post(function(req, res) {
		var profile = new Profile();
		profile.name = req.body.name ? req.body.name : profile.name;
		profile.desc = req.body.desc ? req.body.desc : profile.desc;
		profile.availability = req.body.availability ? req.body.availability : profile.availability;
		profile.type = req.body.type ? req.body.type : profile.type;
		profile.energyMix = req.body.energyMix ? req.body.energyMix : profile.energyMix;
		profile.states = req.body.states ? req.body.states : profile.states;
		profile.bannerUrl = req.body.bannerUrl ? req.body.bannerUrl : profile.bannnerUrl;
		var certifications;
		if (req.body.certifications) {
			profile.certifications = [];
			console.log(req.body.certifications);
			certifications = req.body.certifications;
			for (i = 0; i < certifications.length; i++) {
				profile.certifications.push(certifications[i]);
			}
			console.log(profile.certifications);
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
	  	// console.log(req);
	  	// console.log(req.data);
	  	// console.log(req._id);
		if (objectid.isValid(req.body._id)) {
			Profile.findById(req.body._id, function(err, profile) {

	            if (err)
	                res.send(err);

				profile.name = req.body.name ? req.body.name : profile.name;
				profile.desc = req.body.desc ? req.body.desc : profile.desc;
				profile.availability = req.body.availability ? req.body.availability : profile.availability;
				profile.type = req.body.type ? req.body.type : profile.type;
				profile.energyMix = req.body.energyMix ? req.body.energyMix : profile.energyMix;
				profile.states = req.body.states ? req.body.states : profile.states;
				profile.bannerUrl = req.body.bannerUrl ? req.body.bannerUrl : profile.bannnerUrl;
				profile.type = req.body.type ? req.body.type : profile.type;
				var certifications;
				if (req.body.certifications) {
					Profile.update({ _id: objectid(req.body._id) }, {$set: {"certifications": []}});
					profile.certifications = [];
					console.log(req.body.certifications);
					certifications = req.body.certifications;
					for (i = 0; i < certifications.length; i++) {
						profile.certifications.push(certifications[i]);
					}
					console.log(profile.certifications);
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