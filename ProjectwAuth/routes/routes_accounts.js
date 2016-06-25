var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');

var auth = passport.authenticate('jwt', { session: false });
var Account = require('../models/model_account');

//Login, Register, get single user record, get all users records, Update, Delete

module.exports = function(app) {
  var router = express.Router();

  //Get all user info for admin functions
  //Send token in Authorization header
  router.get('/users', auth, function(req, res) {
    Account.find(function(err, Accounts) {
      if (err) {
        res.status(200).json({ error: err });
      }
      res.status(200).json({ accounts: Accounts });
    })
  })

  router.post('/register', function(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(400).json({ success: false, message: 'Please enter email and password.' });
    } else {
      const newUser = new Account({
        email: req.body.email,
        password: req.body.password
      });

      // Attempt to save the user
      newUser.save(function(err) {
        if (err) {
          return res.status(400).json({ success: false, message: 'That email address already exists.'});
        }
        res.status(201).json({ success: true, message: 'Successfully created new user.' });
      });
    }
  });
}



// // route to authenticate a user (POST http://localhost:8080/api/authenticate)
// // ...
 
// // route to a restricted info (GET http://localhost:8080/api/memberinfo)
// apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     var decoded = jwt.decode(token, config.secret);
//     User.findOne({
//       name: decoded.name
//     }, function(err, user) {
//         if (err) throw err;
 
//         if (!user) {
//           return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
//         } else {
//           res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
//         }
//     });
//   } else {
//     return res.status(403).send({success: false, msg: 'No token provided.'});
//   }
// });
 
// getToken = function (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ');
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };