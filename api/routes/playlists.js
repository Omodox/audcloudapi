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

//  Get playlists
router.get('/', (req, res, next) => {

    var playlistOwner = req.query.playlistowner;
    if (playlistOwner) {
        db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
            activeUser = docs[0];
            if (docs.length > 0) {
                db.collection('playlists').find({ playlistOwner: ObjectId(activeUser._id) }).toArray(function (err, docs) {
                    res.status(200).json(docs)
                });
            }
        });
   
    } else {
        db.collection('playlists').find().toArray(function (err, docs) {
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
        var playlistTracks = playlistTracks;

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

//  Bad 
router.delete('/:id', function (req, res) {


    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            db.collection("users").update(
                { _id: ObjectId(activeUser._id) },
                { $pull: { likes: { _id: req.params.id } } });
            db.collection("tracks").update({ _id: ObjectId(req.params.id) }, { $inc: { likes: -1 } });
            res.status(200).json(
                { message: 'Done' }
            );

        } else {
            res.status(500).json({
                message: 'token is bad'
            })
        }

    });


});

//  Create Playlist
router.post('/', function (req, res) {

    var newPlaylist = req.body;

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {

        if (docs.length > 0) {
            activeUser = docs[0];
            var addedDate = new Date();

            playlist = {
                playlistOwner: activeUser._id,
                playlistName : newPlaylist.playlistName,
                playlistTracks: [],
                createdDate: addedDate,
                playlistRating: 0,
                playlistAuditions: 0,
                playlistAuditionsTime: 0,
                playlistLikes: 0,
                playlistAccess: true,
            }

            db.collection('playlists').insertOne(playlist, function (err, docsInserted) {

            });
            res.status(200).json(
                newPlaylist
            );

        } else {
            res.status(500).json({
                message: 'token is bad'
            })
        }

    });


});

//  Add track to playlist
router.patch('/', function (req, res) { 

    var setToPlaylist = req.body;
    // playlist_id: userPlaylist._id,
    // track_id: this.trackToPlaylst._id,

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
    
        if (docs.length > 0) {
            activeUser = docs[0];
            var addedDate = new Date();
            // db.collection("playlists").update({ _id: ObjectId(setToPlaylist.playlist_id)},{ $pull: { playlistTracks: { _id : setToPlaylist.track_id } } } ); // remove from User list 
            db.collection("playlists").update({ _id: ObjectId(setToPlaylist.playlist_id), playlistOwner: ObjectId(activeUser._id) },{$addToSet : {playlistTracks : {_id: setToPlaylist.track_id, addedDate : addedDate } }}); // add from User list
            // var historyLength = activeUser.history.length;
            // if (historyLength > 69) {
            //     db.collection("users").update( { _id: ObjectId(activeUser._id)}, { $pop: { history: 1 } } ); //Remove last of history user list
            // }
            res.status(200).json(
                 {message : 'Added to playlist'}
            );
    
        }  else {
            res.status(200).json(
                {message : 'some wrong'}
           );
        }
    
    });

});




module.exports = router;