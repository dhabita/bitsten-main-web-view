var express = require("express");
var app = express();
var path = require("path");
const port = 80;
const expressLayouts = require('express-ejs-layouts');
var timeout = require('connect-timeout');
app.use(timeout('5s'));
const rateLimit = require("express-rate-limit");
const axios = require('axios');



// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 1 * 30 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);



// const helmet = require("helmet");
// //app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         "img-src": ["'self'", "f1.bitsten.com"],
//         "script-src":["'self' 'unsafe-inline'"],
//       },
//     },
//   })
// );


app.use(express.static(__dirname + "/"));






app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



function api_get(url, res) {
    axios.get(url)
        .then(function(response) {
            res.status(200).json(response.data);
        })
        .catch(function(error) {
            res.status(200).json({});
        })
        .then(function() {});
}
app.get('/api/v1/public/getorderbook/:pair/:both/:limit', function(req, res) {
    let limit = "";
    if (req.params.limit > 0) limit = "/" + req.params.limit;
    var url = 'https://api.bitsten.com/api/v1/public/getorderbook/' + req.params.pair + '/' + req.params.both + limit;
    api_get(url, res);
});


app.get('/api/v1/public/assets', function(req, res) {
    var url = 'https://api.bitsten.com/api/v1/public/assets/';
    api_get(url, res);
});

app.get('/api/v1/public/history/:pair', function(req, res) {
    var url = 'https://api.bitsten.com/api/v1/public/history/' + req.params.pair;
    api_get(url, res);
});

app.get('/api/v1/public/getorderbook/:pair/:both', function(req, res) {
    var url = 'https://api.bitsten.com/api/v1/public/getorderbook/' + req.params.pair + '/' + req.params.both;
    api_get(url, res);
});

app.get('/api/v1/public/getticker/:all', function(req, res) {
    var url = 'https://api.bitsten.com/api/v1/public/getticker/' + req.params.all;
    api_get(url, res);
});


app.get('/', function(req, res) {
    var data = {};
    res.render('pages/landing', {
        title: "Bitsten Exchange"
    });
});

app.get('/markets', function(req, res) {
    var data = {};
    res.render('pages/markets', {
        title: "All Market Bitsten Exchange"
    });
});

app.get('/exchange/:market', function(req, res) {
    var data = {};
    res.redirect('/exchange#' + req.params.market);
});
app.get('/exchange', function(req, res) {
    var data = {};
    res.render('pages/exchange', {
        title: "Trading page Bitsten Exchange"
    });
});

app.get('/login', function(req, res) {
    var data = {};
    res.render('pages/login', {
        title: "Login Bitsten Exchange"
    });
});

app.get('/login2fa', function(req, res) {
    var data = {};
    res.render('pages/login2fa', {
        title: "Login 2FA Bitsten Exchange"
    });
});

app.get('/register', function(req, res) {
    var data = {};
    res.render('pages/register', {
        title: "Register Bitsten Exchange"
    });
});

app.get('/resetpassword', function(req, res) {
    var data = {};
    res.render('pages/resetpassword', {
        title: "Reset password Bitsten Exchange"
    });
});


app.get('/wallet', function(req, res) {
    var data = {};
    res.render('pages/wallet', {
        title: "Wallet Bitsten Exchange"
    });
});

app.get('/reg/:id', function(req, res) {
    res.cookie('upline', req.params.id, { maxAge: 999999999999 });
    res.redirect('/');
});

app.get('/faucet/:id/:ref', function(req, res) {
    res.cookie('faucet_' + req.params.id, req.params.ref, { maxAge: 999999999999 });
    res.redirect('/faucet');
});

app.get('/bst', function(req, res) {
    var data = {};
    res.render('pages/bst', {
        title: "Bitsten Token ( BST )"
    });
});


app.get('/convert', function(req, res) {
    var data = {};
    res.render('pages/convert', {
        title: "Convert Assets Bitsten Exchange"
    });
});
app.get('/finance', function(req, res) {
    var data = {};
    res.render('pages/finance', {
        title: "Decentralize Bitsten Finance"
    });
});
app.get('/set2fa', function(req, res) {
    var data = {};
    res.render('pages/set2fa', {
        title: "Setting 2FA Bitsten Finance"
    });
});
app.get('/cryptobot', function(req, res) {
    var data = {};
    res.render('pages/cryptobot', {
        title: "Auto trading use Bitsten Cryptobot"
    });
});

app.get('/affiliate', function(req, res) {
    var data = {};
    res.render('pages/affiliate', {
        title: "Affiliate Bitsten Exchange"
    });
});
app.get('/airdrop', function(req, res) {
    var data = {};
    res.render('pages/airdrop', {
        title: "Free new crypto assets  Bitsten Users"
    });
});
app.get('/faucet', function(req, res) {
    var data = {};
    res.render('pages/faucet', {
        title: "Free small amount of crypto"
    });
});


app.listen(port, () => console.info(`App listen on port ${port}`));