// Import dependencies
var passport = require('passport');
var express = require('express');
var config = require('../config/app_config');
var jwt = require('jsonwebtoken');
var ImageModel = require('../models/images_model');
var multer = require('multer');

var userImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './userImages/');
  },
  filename: function (req, file, cb) {
    //Decode auth header, gives user info. pull destination folder from user info
    cb(null, file.originalname);
  }
});

var uploadUserImage = multer({
  storage: userImageStorage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (file.mimetype.indexOf('image/') > -1) {
      return cb(null, true);
    } else {
      return cb("File not an image.", false);
    }
  }
});

// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
	var router = express.Router();

}