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

function isLoggedIn( req, res ){
	
	if( req.session.is_logged_in ) {
		return true;
	} else {
		return false;
	}
}

app.get('/', function (req, res) {

	if( !isLoggedIn(req,res) ) {
		res.redirect('/login');
	} else {
		res.redirect('/purchase');
		// res.sendFile(path.join(__dirname+'/html/purchase.html'));
	}
})

app.get('/login', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		res.redirect('/purchase');
	} else {
		res.sendFile(path.join(__dirname+'/html/login.html'));
	}
})

app.post('/login_process', function(req,res){
	var post = req.body;
	var id = post.id;
	var password = post.password;
	var date = new Date();
	var hash = md5( hash_key + password );

	console.log(`ID = ${id}, Hash = [${hash}]`);

	db.query(`SELECT * FROM user WHERE id = ?`, [id], function(error,records,fields){

		if(error) throw(error);
		// console.log(records);
		if( records.length !== 0 ){
			req.session.is_logged_in	= true;
			req.session.userId				= post.id;
			req.session.type					= records[0].type; 
			
			req.session.save( function(err){
				res.send('Successfully Logged-in');
			});
		} else {
			res.redirect('/login');
		}
	});
});

app.get('/logout', function(req,res){

	req.session.destroy(function(err){
		res.redirect('/login');
	});
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

app.get('/brand', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.brand(req,res);
	} else {
		res.redirect('/');
	}
})

app.get('/currency', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.currency(req,res);
	} else {
		res.redirect('/');
	}
	// res.sendFile(path.join(__dirname+'/html/currency.html'));
})

app.get('/denomination', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.denomination(req,res);
	} else {
		res.redirect('/');
	}
})

app.post('/denomination', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.denomination(req,res);
	} else {
		res.redirect('/');
	}
})

app.get('/purchase', function (req, res) {
	console.log("Hello Purchase");

	if ( isLoggedIn(req,res) ) {
		console.log("Logged In");
		rixty.purchase(req,res);
		// res.sendFile(path.join(__dirname+'/html/purchase.html'));
	} else {
		console.log("Need to Log In");
		res.redirect('/');
	}
})

app.get('/addbrand', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		res.sendFile(path.join(__dirname+'/html/add-brand.html'));
	} else {
		res.redirect('/');
	}
})

app.post('/addbrand_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.addbrand_process(req,res);
	} else {
		res.redirect('/');
	}
});

app.get('/updatebrand/:id', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.updatebrand(req,res);
	} else {
		res.redirect('/');
	}
})

app.post('/updatebrand_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.updatebrand_process(req,res);
	} else {
		res.redirect('/');
	}
});

app.get('/addcurrency', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		res.sendFile(path.join(__dirname+'/html/add-currency.html'));
	} else {
		res.redirect('/');
	}
})

app.post('/addcurrency_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.addcurrency_process(req,res);
	} else {
		res.redirect('/');
	}
})

app.get('/updatecurrency/:id', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.updatecurrency(req,res);
	} else {
		res.redirect('/');
	}
})

app.post('/updatecurrency_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.updatecurrency_process(req,res);
	} else {
		res.redirect('/');
	}
});

app.get('/additem', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.additem(req,res);
	} else {
		res.redirect('/');
	}
})

app.get('/adddenomination', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.adddenomination(req,res);
	} else {
		res.redirect('/');
	}
})

app.post('/adddenomination_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.adddenomination_process(req,res);
	} else {
		res.redirect('/');
	}
})

app.post('/purchase_process', function (req, res) {
	if ( isLoggedIn(req,res) ) {
		rixty.purchase_process(req,res);
	} else {
		res.redirect('/');
	}
})

/*
app.post('/post_test', function (req, res) {
	rixty.post_test(req,res);
})

app.post('/confirm_test', function (req, res) {
	rixty.confirm_test(req,res);
})

app.get('/dropdown', function (req, res) {
	res.sendFile(path.join(__dirname+'/html/dropdown.html'));
})
*/

var port = 5000

if( process.argv.length > 2 ){
	port = parseInt(process.argv[2]);
}

console.log(`Trying to open the port ${port}...`);

app.listen(port, function(){
	console.log(`Connected at ${port} port!`);
});
