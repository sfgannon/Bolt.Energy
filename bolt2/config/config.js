var boltDB = require('mongoose');

var config = (function() {
	var dbHost = 'localhost';
	var dbPort = '27017';
	var dbName = 'boltDb';
	var dbAuth = false;
	var dbUserName = '';
	var dbPassword = '';
	var appPort = 3001;

	return {
		getDB: function() {
			if (dbAuth) {
				boltDB.connect('mongodb://' + dbUserName + ':' + dbPassword + dbHost + ':' + dbPort + '/' + dbName);
			} else {
				boltDB.connect('mongodb://' + dbHost + ':' + dbPort + '/' + dbName);
			};
			return boltDB;
		},
		getPort: function() {
			return appPort;
		}
	};
})(boltDB);

module.exports = config;