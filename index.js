var express = require("express");
var app     = express();
var path    = require("path");
const port = 80;
const expressLayouts = require('express-ejs-layouts');

var timeout = require('connect-timeout');

app.use(timeout('5s'));

const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 15 minutes
  max: 200 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);



//const helmet = require("helmet");
//app.use(helmet());

app.use(express.static(__dirname+"/"));

//set view engine
// app.use(expressLayouts);
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.get('/',function(req,res){
//  res.sendFile(path.join(__dirname+'/html/index.html'));
//    // res.send("aaaa");
// });


 
 

app.get('/',function(req,res){
   var data = {};
    res.render('pages/landing',{'data' :   data });
 });

 app.get('/markets',function(req,res){
  var data = {};
  res.render('pages/markets',{'data' :   data });
});

app.get('/exchange',function(req,res){
  var data = {};
  res.render('pages/exchange',{'data' :   data });
});

app.get('/login',function(req,res){
  var data = {};
  res.render('pages/login',{'data' :   data });
});

app.get('/register',function(req,res){
  var data = {};
  res.render('pages/register',{'data' :   data });
});

app.get('/resetpassword',function(req,res){
  var data = {};
  res.render('pages/resetpassword',{'data' :   data });
});
 
 
 



app.listen(port, () => console.info(`App listen on port ${port}`));