const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
const bearerToken = require('express-bearer-token');

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

// 


router.get('/', (req, res, next) => {

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
        if (docs.length > 0) {
            var activeUser = docs[0];
           db.collection('tracks').find(
            {$and : 
                [
                  {likes: 
                    {$elemMatch: 
                      { _id : docs[0].likes }
                    }
                  },
                      {  _id: ObjectId(activeUser._id) }
                    ]
                  }
               ).toArray(function (arr,tracks){
                res.status(200).json(
                    tracks
                );
               });
        } else {
            res.status(500).json({
                message: 'Bad token'
            });
        }
     
    });


});


router.post('/', function (req, res) {

    var like = req.body;

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            db.collection("users").update({ _id: ObjectId(activeUser._id)},{$addToSet : {likes : {_id: like.track_id} }}, {multi:false});
            res.status(200).json(
                like
            );
    
        }  else {
            res.status(500).json({
                message: 'token is bad'
            })
        }
     


    });

});




module.exports = router;