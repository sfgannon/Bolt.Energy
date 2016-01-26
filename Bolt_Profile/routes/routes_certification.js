var express = require('express');
var mongoose = require('mongoose');
var Certification = require('../models/model_certification');

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

router.route("/certifications/:id")
	.get(function (req, res) {
		try {
		  	objectid = mongoose.Types.ObjectId;
			if (objectid.isValid(req.params.id)) {
				Certification.findById(req.params.id, function(err, cert) {
					if (err) {
						res.json({ message: "Error finding Cert", error: err });
					}
					if (cert) {
						res.json(cert);
					} else {
						res.json({ message: "No Certification exists with that ID." });
					}
				});
			} else {
				res.json({message: "Invalid ObjectId"});
			}
		} catch (e) {
			res.json({message: "Error finding certification.", error: e });
		}
	})
	.put(function(req, res) {

	})
	.delete(function(req, res) {
		
	})

module.exports = router;