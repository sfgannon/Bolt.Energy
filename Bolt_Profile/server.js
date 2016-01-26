var config = require('./config/config');

var mongoose = config.getDB();

var Certification = require('./models/model_certification');
var Profile = require('./models/model_profile');

express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var port = config.getPort() || 3002;

var router = express.Router();
router.route("/certifications")
	.post(function(req, res) {
		var cert = new Certification();
		cert.type = req.body.type;
		cert.desc = req.body.desc;
		Certification.where({ 'type':cert.type, 'desc':cert.desc }).exec(function(err, results) {
			if (err) {
				res.json({ message: 'Error saving cert. Error on Model.find()', error: err });
			} else {
				if (results.length == 0) {
					if ((!cert.type)||(!cert.desc)) {
						res.json({ message: 'Enter type and desc.' });
					} else {
						cert.save(function(err) {
							if (err) {
								res.json({ message: 'Error saving certification.' });
							}
							res.json({ message: 'Certification saved.' });
						})
					}
				} else {
					res.json({ message: 'Cert already exists.' });
				}
			}
		})
	})
	.get(function(req, res) {
		Certification.find(function(err, certifications) {
			if (err) {
				res.json({ error: err, message: 'Error getting certifications.' });
			}
			res.json(certifications);
		})
	});
router.route("/profiles")
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

app.use("/", router);

app.listen(port);
console.log("Bolt Profile app running on " + port);