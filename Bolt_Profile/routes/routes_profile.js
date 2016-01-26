var exporess = require('express');
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

	})
	.post(function(req, res) {

	})
	.delete(function(req, res) {
		
	})


module.exports = profileRouter;