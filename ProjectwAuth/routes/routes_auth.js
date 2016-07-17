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

// Export the routes for our app to use
module.exports = function(app) {
  // API Route Section

  // Initialize passport for use
  app.use(passport.initialize());

  // Bring in defined Passport Strategy
  require('../config/passport_config')(passport);

  // Create API group routes
  const apiRoutes = express.Router();

  // Register new users
    apiRoutes.post('/register', function (req, res) {
        console.log('hitting register');
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ success: false, message: 'Please enter email and password.' });
        } else {
            console.log(req.body);
            if (!req.body.email || !req.body.password) {
                res.status(400).json({ success: false, message: 'Please enter email and password.' });
            } 
            else {
                const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,        
                    email: req.body.email,
                    password: req.body.password
                });
                                
                // Attempt to save the user
                newUser.save(function (err, user) {
                    if (err) {
                        return res.status(400).json({ success: false, message: 'That email address already exists.' });
                    }
                    const token = jwt.sign(user, config.secret, {
                      expiresIn: 10080 // in seconds
                    });
                    debugger;
                    res.status(201).json({ success: true, message: 'Successfully created new user.', token: 'JWT ' + token, user: user });
                });
            }
        }
  });

  //This is a general search, for granning individual profiles for administration see below
  apiRoutes.get('/users', function(req, res, next){
    //Get all profiles, or if req.email then search for one user by email
    var queryString = req.query;
    if (Object.keys(queryString).length > 0) {
    // if (req.query) {
      var result = User.find();
      for (i = 0; i < Object.keys(req.query).length; i++) {
        var term = Object.keys(req.query)[i];
        var value = req.query[term];
        result.where(term).equals(value);
      };
      result.exec(function(err, user) {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (Object.keys(user).length == 0) {
          res.status(200).json({ message: "No users found matching search criteria." });
        } else {
          res.json({ user: user });
        }
      })
    } else {
      User.find(function(err, users){
        if (err) {
          console.log(err);
          next(err);
        }
        console.log(users);
        res.json(users);
      })
    }
  })

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
            const token = jwt.sign(user, config.secret, {
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
        User.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, User) {
          if (err) {
            //wtf happened?
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({ user: User, message: 'User information updated.'});
          }
        })
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
        User.findById(req.params.id, function(err, User) {
          if (err) {
            res.status(500).json({ error: err, message: "Erro finding user." });
          } else {
            res.status(200).json({ user: User, message: "User information found." });
          }
        })
      } else {
        res.status(500).json({ message: "Invalid User Id." });
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "Error occurred while retrieving data." });
    }
  })

  // Set url for API group routes
  app.use('/data', apiRoutes);
};
