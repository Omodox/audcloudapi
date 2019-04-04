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