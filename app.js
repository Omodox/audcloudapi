
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
const bearerToken = require('express-bearer-token');
const fs = require('fs')
const https = require('https')

// 
const request = require('request');
const telegramUrl = 'https://api.telegram.org/bot693449666:AAH83H6PYwp8wwxH1-Gbgb8A03KeRiKpxWU/sendMessage'; 
var answer = '';
// 

var db;







var app = express();


app.use(express.static(__dirname, { dotfiles: 'allow' } ));


app.use(cors());
app.use(bearerToken());

  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get('/',function(req,res){
    
    res.send({ token: req.token});
})


app.post('/tracks', function (req, res) {

    console.log(req.body);
    var element = req.body;



      element.performerName =  element.performerName.replace('&amp;amp;', '&');
      element.trackName =  element.trackName.replace('&amp;amp;', '&');
      element.trackName =  element.trackName.replace('(', '');
      element.trackName =  element.trackName.replace(')', '');
      element.trackName =  element.trackName.replace('-', ' ');
      var TimeNow = Math.floor(new Date() / 1000);
        var track = {
            zId : element.zId,
            performerName : element.performerName,
            trackName : element.trackName,
            performerId :null,
            keys: null,
            genres: null,
            duration: 0,
            auditions: 0,
            errors: 0,
            createdTime: TimeNow,
            rating: 0,
            auditionsTime: 0,
            likes: 0,
            dislikes: 0,

        }

        db.collection('performers').find({performerName:element.performerName}).toArray(function (err,docs) {

            var keys =  element.performerName.split(' ');
            var trackKeys = keys.concat(track.trackName.split(' '));
            track.keys = trackKeys;
            if (docs == '') {
          
                var performer =  {
                    "performerName": element.performerName,
                     "keys": keys,
                     "genres": null,

                     }
                db.collection('performers').insertOne(performer, function(err,docsInserted){
                   
                    track.performerId = docsInserted.ops[0]._id;
                   
                    createTrack();
                });

            }

            else {
     
                track.performerId = docs[0]._id;
                createTrack();
            }


            });

            function createTrack() {
                var searchParameter = { $and: [ { performerName: track.performerName }, { trackName: track.trackName } ]};
                db.collection('tracks').find(searchParameter).toArray(function (err,docs) { 
                    if (docs == '') {
                        db.collection('tracks').insert(track);
                    }
                });
            }

    
          res.send(req.body.perfromerName);
    
});





  app.get('/performers', function (req, res) {

  

    db.collection('performers').find().toArray(function (err,docs) {
      res.send(docs);
      });

  }); 

  
  app.get('/tracks', function (req, res) {

    var perfid = req.query.performerid; 
    db.collection('tracks').find({performerId:ObjectId(perfid)}).sort({"rating" : -1}).toArray(function (err,docs) {

      res.send(docs);
      });

  }); 

// 
app.post('/trackDuration', function (req, res) {
    var element = req.body;
    db.collection('tracks').update({_id:ObjectId(element._id)}, {$set: {duration : element.duration}});
        res.send(element);
    
});
// 

// 
app.post('/trackRating', function (req, res) {
    var element = req.body;
    var TimeNow = Math.floor(new Date() / 1000);
    db.collection('tracks').find({_id:ObjectId(element._id)}).toArray(function (err,tracks) {
        var track = tracks[0];
            var auditionsTime = element.auditionsTime +  track.auditionsTime; 
            var rating = auditionsTime  / (TimeNow - track.createdTime);
            
       var updateTrack = {
            auditions: track.auditions + 1,
            auditionsTime: auditionsTime,
            rating:  rating,
        };

        db.collection('tracks').update({_id:ObjectId(element._id)}, {$set: updateTrack});
        res.send(updateTrack);

    });
    
    
});
// 

  app.get('/search', function (req, res) {

    var search = req.query.search; 
    var searchArray = [];
     search =  search.split(' ');
    
      search.forEach(element => {
        element =  new RegExp(element, 'i');
        searchArray.push(element);
     });
    db.collection('tracks').find({ keys: { $all: searchArray } }).sort({"rating" : -1}).toArray(function (err,docs) {

         
        request({
            method: 'GET',
            url: telegramUrl,
            // параметры GET-запроса
            // index.php?param=edit&value=10
            qs: {
             chat_id: '-266590437',
             text: req.query.search
            }
           }, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             // console.log(body);
             // валидация и 
             // обработка полученного ответа, заголовков
             answer = body;
           }
         })


      res.send(docs);
      });



  }); 






  
  http.createServer(app).listen(80, () => {
    console.log('Listening...')
  })
  
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/path/to/key.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/path/to/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/path/to/chain.pem')
  }, app).listen(443, () => {
    console.log('Listening...')
  })



// app.listen(80, function() {
//     console.log('ok');
// })


const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
         
        
      }); 



