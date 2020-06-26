var mysql = require('mysql')
var session = require('express-session');
var mySqlStore = require('express-mysql-session')(session);
var options = {
	host: 'localhost',
	port: 3306,
	user:	'user_id',
	password: 'password',
	database: 'database'
};

var sessionStore = new mySqlStore(options);

module.exports = sessionStore;

// console.log('sessionStore: ', sessionStore);
