const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 


router.post('/', function (req, res) {
    var element = req.body;
    var TimeNow = Math.floor(new Date() / 1000);
    db.collection('tracks').find({_id:ObjectId(element._id)}).toArray(function (err,tracks) {
        var track = tracks[0];
            var auditionsTime = element.auditionsTime +  track.auditionsTime; 
            var rating = auditionsTime  / ((TimeNow - track.createdTime) /  ((track.duration +1) * track.auditions) );
            
       var updateTrack = {
            auditions: track.auditions + 1,
            auditionsTime: auditionsTime,
            rating:  rating,
        };

        db.collection('tracks').update({_id:ObjectId(element._id)}, {$set: updateTrack});
        // res.send(updateTrack);

    });

        db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
    
            if (docs.length > 0) {
                activeUser = docs[0];
                var addedDate = new Date();
                db.collection("users").update({ _id: ObjectId(activeUser._id)},{ $pull: { history: { _id : element._id } } } ); // remove from User list
                db.collection("users").update({ _id: ObjectId(activeUser._id)},{$addToSet : {history : {_id: element._id, addedDate : addedDate } }}); // add from User list
                var historyLength = activeUser.history.length;
                if (historyLength > 69) {
                    db.collection("users").update( { _id: ObjectId(activeUser._id)}, { $pop: { history: 1 } } ); //Remove last of history user list
                }
                res.status(200).json(
                     {message : 'History seted'}
                );
        
            }  else {
                res.status(200).json(
                    {message : 'Rating update without history'}
               );
            }
        
        });
    
    
  

    // $push: {"field": $each: ["val1", "val2"], $slice: -10}
    
    
});
// 

module.exports = router;