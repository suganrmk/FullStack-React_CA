// ./express-server/app.js
require('rootpath')();
import express from 'express';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';
import bb from 'express-busboy';
import route from './route';
import mongoStoreFactory from "connect-mongo";



var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expressJwt = require('express-jwt');
var config = require('config.json');
var jwt = require('jsonwebtoken');
var schedule = require('node-schedule');
var passport = require('passport');
import Currencies from './models/currencies.model';
var request = require('request');
var j = schedule.scheduleJob('30 * * * *', function () {
    request('http://data.fixer.io/api/latest?access_key=f59a81350921dd481d2c1f228fd6d84e', function (error, response, body) {
        if (body) {
            var currencydata = JSON.parse(body);
            Currencies.findOneAndUpdate({ _id: '5b4e228707897313b08edf97' }, currencydata, { new: true }, (err, curency) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('curency updated');
                }
            })
        }
    });
});




// define our app using express
const app = express();
// app.set('superSecret', config.secret);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));


// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, {
    useMongoClient: true,
});


// allow-cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});




// configure app

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
// app.use(expressJwt({
//     secret: config.secret,
//     getToken: function (req) {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         }
//         return null;
//     }
// }).unless({ path: config.exceptionPath }));



// const MongoFactory = mongoStoreFactory(session);
app.use(session({
    secret: 'aitravelapp',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        path: '/',
        maxAge: 1800000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: (1 * 60 * 60) }),
    name: "id001"
}));


session.Session.prototype.login = function (user, cb) {
    const req = this.req;
    req.session.regenerate(function (err) {
        if (err) {
            cb(err);
        }
    });
    req.session.userInfo = user;
    console.log(req.session.userInfo)
    // this.userInfo = user;
    cb();
};


app.use(passport.initialize());
app.use(passport.session());


// add Source Map Support
SourceMapSupport.install();


app.use('/users', require('./controllers/users.controller'));
app.use('/route/', route);
app.use(function(req, res, next){
    console.log('checkingsession' ,req.session);
    console.log('checkingsession' ,req.isAuthenticated());
    
next();
})
// app.get('/', (req, res) => {
//     console.log(req.isAuthenticated());
//     return res.end('Api working');
// });

  // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            // res.sendFile('./build/index.html'); // load our public/index.html file
            res.sendFile('index.html', { root: './build/' });
        });

// Access the session as req.session
// app.get('/', function(req, res, next) {
//     console.log(req.session)   
//     if (req.session.views) { 
//       req.session.views++ 
//       res.setHeader('Content-Type', 'text/html')
//       res.write('<p>views: ' + req.session.views + '</p>')
//       res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//       res.end()
//     } else {
//       req.session.views = 1

//       res.end('welcome to the session demo. refresh!')
//     }
//   })

// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});


// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});