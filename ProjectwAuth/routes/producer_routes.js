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

var uploadFile = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (file.mimetype.indexOf('image/') > -1) {
      return cb(null, true);
    } else {
      return cb("File not an image.", false);
    }
  }
});

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
	var router = express.Router();


	router.post('/producer', requireAuth, uploadFile.array('files'), function(req, res, next) {
		try {
			var producerData = (req.body.data)?(JSON.parse(req.body.data)):('');
			producerData.owner = req.user._id;
			var producerImages = (req.body.uploads)?(JSON.parse(req.body.uploads):('');
			var uploadSaveDir = './userImages/' + ((req.user)?(req.user._id):('uploads'));
			var setPath = function(upload) {
				upload.path = uploadSaveDir;
				upload.filename = req.user._id + "_" + upload.filename;
			};
			var addUploads = function(upload) {
				var up = new Upload(upload);
				producerData.uploads.push(up);
			};
			producerImages.map(setPath);
			producerImages.map(addUploads);
			var newProducer = new Producer(producerData);
			newProducer.save(function(err, producer){
				if (err) {
					res.status(500).json({ message: "Errorcreating producer profile.", error: err });
				} else {
					res.status(200).json({ message: "Producer profile saved.", producer: producer });
				}
			})
		} catch(e) {
			//TODO: check file upload status, check model save status
			res.status(500).json({ message: "Error saving producer profile.", error: e });
		}
	})

	router.put('/producer/:id', requireAuh, uploadFile.array('files'), function(req, res, next) {
		//Use separate route for projects and images
		try {
			//Check req.user._id and producer.owner._id, if they match then save
			Producer.findById(req.params.id, functin(err, producer) {
				if (err) {
					res.status(400).json({ error: err });
				} else {
				//Check ownership of producer
				if (req.user._id == producer.owner) {
					//Allow the update
					producer.save(function(err, producer) {
						if (err) {
							res.status(400).json({ error: JSON.stringify(err) });
						}
						res.status(200).json({ producer: producer });
					})
				} else {
					//Return forbidden
					res.status(403).json({ error: "Forbidden" });
				}
			})
		} catch(e) {
			res.status(500).json({ error: JSON.stringify(err) });
		}
	})








	//Rewrite
	router.get('/producer', function(req, res) {
		//Get all projects, narrow by search, how to implement paging?
		//TODO implement paging, we don;t want users requesting thousands of profiles
    //Get all profiles, or if req.email then search for one user by email
    var queryString = req.query;
    if (Object.keys(queryString).length > 0) {
    // if (req.query) {
      var result = Producer.find();
      for (i = 0; i < Object.keys(req.query).length; i++) {
        var term = Object.keys(req.query)[i];
        var value = req.query[term];
        if (term && value) {
        	result.where(term).equals(value);
        }
      };
      result.populate('uploads').populate('projects').exec(function(err, profiles) {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (Object.keys(profiles).length == 0) {
          res.status(200).json({ message: "No producer profiles found matching search criteria." });
        } else {
          res.json({ producers: producers });
        }
      })
    } else {
      Producer.find(function(err, profile){
        if (err) {
          console.log(err);
          res.json({ error: err });
        }
        res.status(200).json(producer);
      })
    }
  })

	router.post('/producer', requireAuth, function(req, res) {
		//New producer profile, check Owner, assign to req.user
		var p = new Producer(req.body);
		p.owner = req.user._id;
		p.save(function(err, producer) {
			if (err) {
				res.status(500).json({ error: JSON.stringify(err) });
			} else {
				//Producer saved successfully
				res.status(200).json({ producer: prodcer, message: "Save successful"})
			}
		})
	})

	router.get('/producer/:id', function(req, res) {
		try {
			if (objectId.isValid(req.params.id)) {
				Producer.findById(req.params.id).populate('uploads').populate('projects').exec(function(err, producer) {
					if (err) {
						res.status(400).json({error: err});
					} else {
						res.json({ producer: producer });
					}
				});
			} else { res.status(401).json({ message: "Invalid object id." }); }
		} catch (e) {
			res.json({ err: e });
		}
	})

	router.put('/producer/:id', requireAuth, function(req, res) {
		try {
			if (objectId.isValid(req.params.id)) {
				Producer.findById(req.params.id, function(err, producer) {
					if (producer.owner == req.user._id) {
						//This user owns the profile, enable update
						Producer.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function(err, newProducer) {
							if (err) {
								res.status(500).json({ error: JSON.stringify(err) });
							} else {
								res.status(200).json({ producer: newProducer, message: "Update successful" });
							}
						})
					} else {
						res.status(403).json({ message: "Access denied" });
					}
				})
			} else {
				res.status(500).json({ message: "Invalid object id" });
			}
		} catch (e) {
			res.status(500).json({ error: JSON.stringify(e) });
		}
	})

	router.delete('/producer/:id', requireAuth, function(req, res) {
		try {
			if (objectId.isValid(req.params.id)) {
				Producer.findById(req.params.id, function(err, producer) {
					if (producer.owner == req.user._id) {
						//This user owns the profile, enable update
						Producer.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function(err, newProducer) {
							if (err) {
								res.status(500).json({ error: JSON.stringify(err) });
							} else {
								res.status(200).json({ producer: newProducer, message: "Update successful" });
							}
						})
					} else {
						res.status(403).json({ message: "Access denied" });
					}
				})
			} else {
				res.status(500).json({ message: "Invalid object id" });
			}
		} catch (e) {
			res.status(500).json({ error: JSON.stringify(e) });
		}
	})

	router.post('/producer/:id/uploads', requireAuth, function(res, res) {
		try {

		} catch (e) {
			res.status(404)
		}
	})

	router.put('/producer/:id/uploads/:uploadId', requireAuth, function(req, res) {

	})

	router.delete('/producer/:id/uploads/:uploadId', requireAuth, function(req, res) {

	})

	router.post('/producer/:id/projects', requireAuth, function(res, res) {
		
	})

	router.put('/producer/:id/projects/:projectId', requireAuth, function(req, res) {

	})

	router.delete('/producer/:id/projects/:projectId', requireAuth, function(req, res) {

	})



}
