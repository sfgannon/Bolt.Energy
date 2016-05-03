//var mongoose = require('mongoose');

// module.exports = function(mongoose) {
// 	var dbHost = 'localhost';
// 	var dbPort = '27017';
// 	var dbName = 'boltDb';
// 	var dbAuth = false;
// 	var dbUserName = '';
// 	var dbPassword = '';
// 	var appPort = 3002;
// 	var secret = 'Bolt.Energy';

// 	return {
// 		getDB: function() {
// 			if (dbAuth) {
// 					mongoose.connect('mongodb://' + dbUserName + ':' + dbPassword + dbHost + ':' + dbPort + '/' + dbName);
// 				} else {
// 					mongoose.connect('mongodb://' + dbHost + ':' + dbPort + '/' + dbName);
// 				};
// 			return mongoose;
// 		},

// 		getPort: function() {
// 			return appPort;
// 		},

// 		getSecret: function() {
// 			return secret;
// 		}
// 	}
// };

module.exports = {
	port: 3002,
	secret: 'Bolt.Energy',
	dbUrl: 'mongodb://localhost:27017/boltDb'
}