express = require('express');
var config = require('./config/config');
var mongoose = config.getDB();

var projectRouter = require('./routes/routes_project');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var port = config.getPort() || 3002;

app.use("/data", projectRouter);

app.listen(port);
console.log("Bolt Profile app running on " + port);