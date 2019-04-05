
var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors');
const bearerToken = require('express-bearer-token');
const fs = require('fs')
const https = require('https');


var app = express();



app.use(express.static(__dirname + '/omodoxdb', { dotfiles: 'allow' } ));

// app.use('/omodoxdb', express.static(__dirname + '/omodoxdb'));

app.use(cors());
app.use(bearerToken());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));






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






