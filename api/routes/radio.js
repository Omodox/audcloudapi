const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
const bearerToken = require('express-bearer-token');

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
MongoClient.connect(url, function (err, client) {
    db = client.db(dbName);
});

// 

//  Get radio list
router.get('/', (req, res, next) => {

    var playlistOwner = req.query.playlistowner;
    if (playlistOwner) {
        db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {
            activeUser = docs[0];
            if (docs.length > 0) {
                db.collection('radio').find({ playlistOwner: ObjectId(activeUser._id) }).toArray(function (err, docs) {
                    res.status(200).json(docs)
                });
            }
        });
   
    } else {
        db.collection('radio').find().toArray(function (err, docs) {
            res.status(200).json(docs)
        });
    }
    
});
// Get playlist
router.get('/:id', (req, res, next) => {

    var playlistId = req.params.id;

    db.collection('playlists').find({ _id: ObjectId(req.params.id) })
    .toArray(function (arr,playlist){
        objPplaylistTracks = [];
        var playlistTracks = playlist[0].playlistTracks;

        playlistTracks.forEach(element => {
            objPplaylistTracks.push(ObjectId(element._id));
        });

        db.collection('tracks').find({_id: { $in: objPplaylistTracks } })
        .toArray(function (arr,tracks){
         // 
         var NewTracks = [];
         playlistTracks.forEach(element => {
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

    });
            

});


//  Create Radio
router.post('/', function (req, res) {

    var newRadio = req.body;

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            var addedDate = new Date();

            radio = {
                radioName : newRadio.radioName,
                radioUrl: newRadio.radioUrl,
                radioCountry: newRadio.radioCountry,
                radioLogo : newRadio.radioLogo,
                createdDate: addedDate,
            }

            db.collection('radio').insertOne(radio, function (err, docsInserted) {

            });
            res.status(200).json(
                radio
            );

        } else {
            res.status(500).json({
                message: 'token is bad'
            })
        }

    });


});
// delete radio 
router.delete('/:id', function (req, res) {
   

   var  radioId = req.params.id;

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {
    
        if (docs.length > 0 && docs[0].role == "admin") {

            db.collection("radio").remove(    { _id: ObjectId(radioId)} ); // remove radio
                
            res.status(200).json(
                 {message : 'Radio Removed'}
            );
    
        }  else {
            res.status(200).json(
                {message : 'some wrong'}
           );
        }
    
    });


 });

//  Edit radio
router.patch('/', function (req, res) { 

    var radioToEdit = req.body;
    var radioToEditId = req.body._id;
    delete radioToEdit._id;


    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {
    
        if (docs.length > 0 && docs[0].role == "admin") {
            activeUser = docs[0];
            var addedDate = new Date();
            db.collection("radio").update({ _id: ObjectId(radioToEditId),},{$set : radioToEdit }); // edit radio

            res.status(200).json(
                 {message : 'Edited '}
            );
    
        }  else {
            res.status(200).json(
                {message : 'some wrong'}
           );
        }
    
    });

});




module.exports = router;