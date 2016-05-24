var express = require('express');
app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/app_config');
var cors = require('cors');

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Log requests to console
app.use(morgan('dev'));

// Home route. We'll end up changing this to our main front end index later.
// app.get('/', function(req, res) {
//   res.send('Relax. We will put the home page here later.');
// });
app.use(express.static('public'));

// Connect to database
mongoose.connect(config.dbUrl);

require('./config/passport_config')(passport);
app.use(passport.initialize());
require('./routes/user_routes')(app);
require('./routes/profile_routes')(app);
// Start the server
//app.listen(port);
app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');