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
            var history = activeUser.history;
            var objHistoryId = [];
            history.forEach(element => {
                objHistoryId.push(ObjectId(element._id));
            });

           db.collection('tracks').find({_id: { $in: objHistoryId } })
           .toArray(function (arr,tracks){
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


module.exports = router;