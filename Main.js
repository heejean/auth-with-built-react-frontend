const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const md5 = require('md5');
const hash_key = 'asadlfkj!@#!@#dfgasdg';

var fs = require('fs');
var sessionStore = require('./lib/session_store.js');
var db = require('./lib/db.js');
var session = require('express-session');

app.use(cookieParser());

app.use(session({
  secret: hash_key,
  resave: false,
  saveUninitialized: true,
	store:	sessionStore
}))

app.use(express.static('html'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

function isLoggedIn( req, res ){
	
	if( req.session.is_logged_in ) {
		return true;
	} else {
		return false;
	}
}

app.post('/isLoggedIn', ( req, res ) => {
	
	if( req.session.is_logged_in ) {
		res.json({
			success: true,
			username: req.session.username
		})
		
		return true;
	} else {

		res.json({
			success: false
		})

		return false;
	}
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', index.html));
})

app.post('/login', function(req,res){
	var post = req.body;
	var id = post.username;
	var password = post.password;
	var date = new Date();
	var hash = md5( hash_key + password );

	console.log(`ID = ${id}, Hash = [${hash}]`);

	db.query(`SELECT * FROM user WHERE id = ?`, [id], function(error,records,fields){

		if(error) {
			res.json({
				success: false,
				msg: 'An error occured, please try again'
			})
		}
		// console.log(records);
		if( records.length !== 0 ){
			req.session.is_logged_in	= true;
			req.session.username			= id;
			req.session.type					= records[0].type; 
		
			if ( hash === records[0].password ) {
				req.session.save( function(err){
					res.json({
						success: true,
						username: records[0].id,
						msg: `{id} Successfully Logged-In`
					})
				});
			} else {
				res.json({
					success: false,
					msg: 'ID or Password not Matched'
				})
			}
		} else {
			res.json({
				success: false,
				msg: 'ID or Password NOT Matched'
			})
		}
	});
});

app.post('/logout', function(req,res){

	console.log( req.session );

	if( req.session.username) {
		req.session.destroy();
		res.json({
			success: true	
		})

		return true;
	} else {
		res.json({
			success: false
		})

		return false;
	}
});


app.get('/register', function (req, res) {
	res.sendFile(path.join(__dirname+'/html/register.html'));
})

app.post('/register_process', function(req,res){
	console.log('Hello Register Process');

	res.redirect('/register');
});

app.get('/register', function (req, res) {
	res.sendFile(path.join(__dirname+'/html/register.html'));
})

app.get('/forgot-password', function (req, res) {
	res.sendFile(path.join(__dirname+'/html/forgot-password.html'));
})

app.get('/404', function (req, res) {
	res.sendFile(path.join(__dirname+'/html/404.html'));
})

var port = 3000

if( process.argv.length > 2 ){
	port = parseInt(process.argv[2]);
}

console.log(`Trying to open the port ${port}...`);

app.listen(port, function(){
	console.log(`Connected at ${port} port!`);
});
