process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose'),
express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var port = process.env.PORT || 3000;

app.listen(port);
console.log("Express app running on " + port);