
var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors');
const bearerToken = require('express-bearer-token');
const fs = require('fs')
const https = require('https');


// 
const request = require('request');
const telegramUrl = 'https://api.telegram.org/bot693449666:AAH83H6PYwp8wwxH1-Gbgb8A03KeRiKpxWU/sendMessage'; 
var answer = '';
// 


var app = express();



// app.use(express.static(__dirname + '/omodoxdb', { dotfiles: 'allow' } ));

// app.use('/omodoxdb', express.static(__dirname + '/omodoxdb'));

app.use(cors());
app.use(bearerToken());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const tracksRouter = require('./api/routes/tracks.js');
app.use('/tracks', tracksRouter);

const performersRouter = require('./api/routes/performers.js');
app.use('/performers', performersRouter);

const searchRouter = require('./api/routes/search.js');
app.use('/search', searchRouter);

const trackDurationRouter = require('./api/routes/track-durations.js');
app.use('/trackDuration', trackDurationRouter);

const trackRatingRouter = require('./api/routes/track-rating.js');
app.use('/trackRating', trackRatingRouter);

const registrationRouter = require('./api/routes/registration.js');
app.use('/registration', registrationRouter);

const loginRouter = require('./api/routes/login.js');
app.use('/login', loginRouter);

const likesRouter = require('./api/routes/likes.js');
app.use('/likes', likesRouter);

const historyRouter = require('./api/routes/history.js');
app.use('/history', historyRouter);

const PlaylistsRouter = require('./api/routes/playlists.js');
app.use('/playlists', PlaylistsRouter);

const UsersRouter = require('./api/routes/users.js');
app.use('/users', UsersRouter);



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






