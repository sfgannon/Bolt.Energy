var testDb = require('mongoose');

var config = (function() {
	var dbHost = 'localhost';
	var dbPort = '27017';
	var dbName = 'testDb';
	var dbAuth = false;
	var dbUserName = '';
	var dbPassword = '';
	var appPort = 3004;

	return {
		getDB: function() {
			if (dbAuth) {
				testDb.connect('mongodb://' + dbUserName + ':' + dbPassword + dbHost + ':' + dbPort + '/' + dbName);
			} else {
				testDb.connect('mongodb://' + dbHost + ':' + dbPort + '/' + dbName);
			};
			return testDb;
		},
		getPort: function() {
			return appPort;
		}
	};
})(testDb);

module.exports = config;