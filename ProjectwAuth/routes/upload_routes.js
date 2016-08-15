// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var ImageModel = require('../models/upload_model');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp/');
  },
  filename: function (req, file, cb) {
  	//Overall: Grab user ID from auth token in header
  	//Create a directory with the user's ID if it hasn't already been created
  	//Upload the file there with a new name
 //  	var authHeader = req.get('Authorization');
 //  	authHeader = authHeader.substr(4, test.length - 4);
	// jwt.verify(authHeader, config.secret, function(err, decoded) {      
 //      if (err) {
 //        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
 //      } else {
 //        // if everything is good, save to request for use in other routes
 //        req.decoded = decoded;    
 //        next();
 //      }
 //    });
 	//req.user should already be good since passport.authenticate has been called ahead of time
 	var fileName = req.
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});