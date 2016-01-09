// server.js

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://ubuntu:@localhost:27017/sugar'); // connect to our database

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('static'));

//var port = process.env.PORT || 3030;        // set our port
var port = process.env.PORT || 3030;        // set our port

// MODELS
// =============================================================================
var Email = require('./models/email.js')


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('This is a placeholder for further middleware.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Router response.' });   
});

// more routes for our API will happen here

router.route('/email')

    // create a email (accessed at POST http://localhost:8080/api/email)
    .post(function(req, res) {
        
        var email = new Email();      // create a new instance of the Email model
        email.name = req.body.name;  // set the email (comes from the request)

        // save the email and check for errors
        email.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Email saved.' });
        });
        
    })

    .get(function(req, res) {
        Email.find(function(err, emails) {
            if (err)
                res.send(err);

            res.json(emails);
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Site running on port ' + port);