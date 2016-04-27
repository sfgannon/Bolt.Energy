var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user_model');
var objectid = mongoose.Types.ObjectId;

var router = express.Router();
router.route("/users")
	.get(function(req, res, next){
		//Get all users
		User.find(function(err, users){
			if (err) {
				console.log(err);
				next(err);
			}
			console.log(users);
			res.json(users);
		})
	})
	.post(function(req, res, next) {
		//Save a new user()
		var proj = new User(req.body);
		proj.save(function(err, proj){
			if (err) {
				console.log(err);
				next(err);
			}
			res.json({ err: err, proj: proj });
			console.log("User saved");
		});
	});
router.route("/users/:id")
	.get(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				console.log("Finding User");
				User.findById(req.params.id, function(err, proj) {
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
				User.findOneAndUpdate({_id: req.params.id}, req.body, function(err, user) { 
					if (err) {
						res.json(err);
					}
					res.json(user);
				});
			}
		} catch (e) {
			res.json({ err: e });
		}
	})
	.delete(function(req, res) {
		try {
			if (objectid.isValid(req.params.id)) {
				User.remove({
					_id: req.params.id
				}, function(err, proj) { 
					res.json(proj);
				})
			}
		} catch (e) {
			res.json(e);
		}
	});

router.routes('/register').post(function(req, res, next) {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.routes('/login').post(function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;