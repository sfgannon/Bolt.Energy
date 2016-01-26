express = require('express');
var config = require('./config/config');
var mongoose = config.getDB();

var router = require('./routes/routes_certification');
var profileRouter = require('./routes/routes_profile');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var port = config.getPort() || 3002;

app.use("/data", router);
app.use("/data", profileRouter);

app.listen(port);
console.log("Bolt Profile app running on " + port);