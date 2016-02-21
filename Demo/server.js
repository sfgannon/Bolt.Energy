process.env.NODE_ENV = process.env.NODE_ENV || 'development';
express = require('express');
var app = express();
app.use(express.static('public'));
var port = process.env.PORT || 8080;
app.listen(port);
console.log("Express app running on " + port);