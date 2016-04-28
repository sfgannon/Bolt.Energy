var express = require('express');
var config = require('./config/config');
//var passport = require('passport');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(passport.initialize());
var port = config.getPort() || 3004;

app.listen(port);
console.log("Bolt Profile app running on " + port);