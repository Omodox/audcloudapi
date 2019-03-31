
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var db;




var app = express();



// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get('/',function(req,res){
    
    res.send('Hello ' + req.query.name );
})


app.post('/tracks', function (req, res) {

    console.log(req.body);
    var element = req.body;



      element.performerName =  element.performerName.replace('&amp;amp;', '&');
      element.trackName =  element.trackName.replace('&amp;amp;', '&');
    
        var track = {
            zId : element.zId,
            performerName : element.performerName,
            trackName : element.trackName,
            performerId :null,
            keys: null,
            genres: null,
            duration: null,
            auditions: null,
            errors: null,
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



