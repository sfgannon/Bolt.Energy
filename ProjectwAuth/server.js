var express = require('express');
var config = require('./config/app_config');
var mongoose = require('mongoose');
mongoose.connect(config.dbUrl);
var passport = require('passport');
var jwt = require('jsonwebtoken');

var projectRouter = require('./routes/routes_project');
var profileRouter = require('./routes/routes_profile');
var certRouter = require('./routes/routes_certification');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport_config')(passport);
require('./routes/routes_auth')(app);
require('./routes/routes_image')(app);
app.use(express.static('public'));
var port = process.env.PORT || config.port || 3001;

app.use("/data", projectRouter);
app.use("/data", profileRouter);
app.use("/data", certRouter);

app.listen(port);
console.log("Bolt Profile app running on " + port);