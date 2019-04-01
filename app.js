
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
const bearerToken = require('express-bearer-token');


var db;




var app = express();


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
            rating: null,
            auditionsTime: 0,
            likes: 0,

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
    db.collection('tracks').find({performerId:ObjectId(perfid)}).toArray(function (err,docs) {

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
    db.collection('tracks').find({_id:ObjectId(element._id)}).toArray(function (err,track) {
            var auditionsTime = element.auditionsTime +  track.auditionsTime; 
            var rating = auditionsTime  / (TimeNow - track.createdTime);
            // var auditions = track.auditions + 1;
      var  updateTrack = {
            auditions: track.auditions,
            auditionsTime: element.auditionsTime + track.auditionsTime,
            rating:  track.rating,
        };

var test = {
    auditionsTime: element.auditionsTime,
    track: track,
    trackAuditionsTime: track.auditionsTime,
    plust: element.auditionsTime + track.auditionsTime

}

        db.collection('tracks').update({_id:ObjectId(element._id)}, {$set: updateTrack});
        res.send(test);

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
    db.collection('tracks').find({ keys: { $all: searchArray } }).toArray(function (err,docs) {

      res.send(docs);
      });

  }); 


  




app.listen(80, function() {
    console.log('ok');
})


const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
         
        
      }); 



