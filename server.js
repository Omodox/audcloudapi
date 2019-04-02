
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
const bearerToken = require('express-bearer-token');
const fs = require('fs')
const https = require('https');
var crypto = require('crypto');

// 
const request = require('request');
const telegramUrl = 'https://api.telegram.org/bot693449666:AAH83H6PYwp8wwxH1-Gbgb8A03KeRiKpxWU/sendMessage'; 
var answer = '';
// 

var db;

var app = express();



// app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.use(cors());
app.use(bearerToken());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const tracksRouter = require('./api/routes/tracks.js');
app.use('/tracks', tracksRouter);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500); 
    res.json({
        error: {
            message: error.message
        }
    })
});



// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/audcloud.top/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/audcloud.top/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/audcloud.top/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// https.createServer(credentials, app).listen(443);

app.listen(8080, function() {
    console.log('ok');
})


const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
         
        
      }); 



