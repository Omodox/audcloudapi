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

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {
        if (docs.length > 0) {
            var activeUser = docs[0];
            if (!activeUser.history || activeUser.likes.history == 0) {
              
                res.status(200).json(
                   []
                );
            return true;
        }
            var history = activeUser.history;
            var objHistoryId = [];
            history.forEach(element => {
                objHistoryId.push(ObjectId(element._id));
            });

           db.collection('tracks').find({_id: { $in: objHistoryId } })
           .toArray(function (arr,tracks){
            // 
            var NewTracks = [];
            history.forEach(element => {
                var copy = tracks.find(x => x._id == element._id);
                if (copy) {
                    NewTracks.push(Object.assign(copy, element));
                }
            });
            NewTracks.sort(function (a, b) {
                return new Date(b.addedDate) - new Date(a.addedDate);
            });
            //    

                res.status(200).json(
                    NewTracks
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