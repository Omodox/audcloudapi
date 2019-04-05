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
            var likes = activeUser.likes;
            var objLikesId = [];
             likes.forEach(element => {
                objLikesId.push(ObjectId(element._id));
            });
            // console.log(objLikesId);

           db.collection('tracks').find({_id: { $in: objLikesId } })
           .toArray(function (arr,tracks){
                var NewTracks = [];
                objLikesId.forEach(element => {
              var copy =   tracks.find( x => { x._id == element._id });
              NewTracks.push(Object.assign(copy, element )); 
            });
            console.log(NewTracks);
            NewTracks.sort(function(a,b){
                return new Date(b.createdDate) - new Date(a.createdDate);
              });

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


router.delete('/:id', function (req, res) {


    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            db.collection("users").update(
                 { _id: ObjectId(activeUser._id) },
              { $pull: { likes: { _id : req.params.id } } } );
              db.collection("tracks").update({_id: ObjectId(req.params.id)}, {$inc: {likes: -1}});
                res.status(200).json(
                    { message : 'Done'}
            );
    
        }  else {
            res.status(500).json({
                message: 'token is bad'
            })
        }
    
    });

  
            // db.collection('tracks').remove({ performerId: ObjectId(req.params.id) });
            // db.collection('performers').remove({ _id: ObjectId(req.params.id) });
 

});


router.post('/', function (req, res) {

    var like = req.body;

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            var createdDate =  new Date();
            db.collection("users").update({ _id: ObjectId(activeUser._id)},{$addToSet : {likes : {_id: like.track_id, createdDate : createdDate} }}, {multi:false});
            db.collection("tracks").update({_id: ObjectId(like.track_id)}, {$inc: {likes: 1}});
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