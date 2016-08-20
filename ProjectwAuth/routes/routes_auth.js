// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;

// Set up middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// Load models
const User = require('../models/user_model');
const Profile = require('../models/model_profile');

// Export the routes for our app to use
module.exports = function(app) {
  // // Initialize passport for use
  // app.use(passport.initialize());
  // // Bring in defined Passport Strategy
  // require('../config/passport_config')(passport);
  // Create API group routes
  const apiRoutes = express.Router();
  // Register new users
  apiRoutes.post('/register', function(req, res, next) {
    if (req.body.email && req.body.password) {
      var newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err) {
          if (err.message.indexOf('duplicate') != -1) {
            res.status(403).json({ message: 'Email already in use.' });
          } else {
            res.status(403).json({ error: err });
          }
        } else {
          // Create token if the password matched and no error was thrown
          const token = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, config.secret, {
            expiresIn: 10080 // in seconds
          });
          res.status(201).json({ success: true, message: 'Successfully created new user.', token: 'JWT ' + token, user: user });
        }
      });
    } else {
      res.json({ message: "Email and password are required to register." });
    }
  });

  //This is a general search, for granning individual profiles for administration see below
  apiRoutes.get('/users', function(req, res, next){
    //Get all profiles, or if req.email then search for one user by email
    var queryString = req.query;
    if (Object.keys(queryString).length > 0) {
    // if (req.query) {
      var result = User.find();
      for (var i = 0; i < Object.keys(req.query).length; i++) {
        var term = Object.keys(req.query)[i];
        var value = req.query[term];
        result.where(term).equals(value);
      }
      result.exec(function(err, user) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          if (Object.keys(user).length == 0) {
            res.status(200).json({ message: "No users found matching search criteria." });
          } else {
            res.json({ users: user });
          }
        }
      });
    } else {
      User.find(function(err, users){
        if (err) {
          console.log(err);
          res.json({ error: err });
        } else {
          console.log(users);
          res.json({ users: users });
        }
      });
    }
  });

  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            const token = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, config.secret, {
              expiresIn: 10080 // in seconds
            });
            console.log(Date.now());
            res.status(200).json({ success: true, token: 'JWT ' + token, user: user });
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
  });

  //TODO: Add an authentication check to make sure user can edit this profile
  apiRoutes.put('/users/:id', function(req, res) {
    try {
      if (objectId.isValid(req.params.id)) {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function(err, User) {
          if (err) {
            //wtf happened?
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({ user: User, message: 'User information updated.'});
          }
        });
      } else {
        res.status(500).json({ message: "Invalid Object Id." });
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "Error occurred while saving." });
    }
  });

  apiRoutes.get('/users/:id', function(req, res) {
    try {
      if (objectId.isValid(req.params.id)) {
        User.findById(req.params.id).populate('profiles profile.projects').exec(function(err, User) {
          if (err) {
            res.status(500).json({ error: err, message: "Error finding user." });
          } else {
            res.status(200).json({ user: User, message: "User information found." });
          }
        });
      } else {
        res.status(500).json({ message: "Invalid User Id." });
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "Error occurred while retrieving data." });
    }
  });

  // Set url for API group routes
  app.use('/data', apiRoutes);
};