const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 


router.get('/', (req, res, next) => {

    var perfid = req.query.performerid; 
    db.collection('tracks').find({performerId:ObjectId(perfid)}).sort({"rating" : -1}).toArray(function (err,docs) {
        res.status(200).json(docs);
      });


});



router.post('/', function (req, res) {

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

module.exports = router;