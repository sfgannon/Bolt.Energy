var express = require('express');
var config = require('./config/app_config');
var mongoose = require('mongoose');
var compression = require('compression');
var passport = require('passport');
mongoose.connect(config.dbUrl);

var projectRouter = require('./routes/routes_project');
var profileRouter = require('./routes/routes_profile');
var certRouter = require('./routes/routes_certification');

var bodyParser = require('body-parser');
var app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// Initialize passport for use
app.use(passport.initialize());
// Bring in defined Passport Strategy
require('./config/passport_config')(passport);

require('./routes/routes_auth')(app);
require('./routes/routes_image')(app);
// require('./routes/upload_routes')(app);
app.use(express.static('public'));
var port = process.env.PORT || config.port || 3001;
//var port = config.port || 3001;

app.use("/data", projectRouter);
app.use("/data", profileRouter);
app.use("/data", certRouter);

require('./routes/user_routes')(app);

app.listen(port);
console.log("Bolt Profile app running on " + port);