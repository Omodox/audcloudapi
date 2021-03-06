const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const bearerToken = require('express-bearer-token');



const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
MongoClient.connect(url, function (err, client) {
    db = client.db(dbName);
});



router.get('/', (req, res, next) => {

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {
        activeUser = docs[0];

        if (activeUser.role == "admin" || activeUser.role == "manager") {
            var activeUser = docs[0];
            db.collection('users').find().toArray(function (err, users) { 
                res.status(200).json(
                    users
                );
            });

        } else {
            res.status(503).json({
                message: 'not for you'
            });
        }

    });


});




router.get('/:id', (req, res, next) => {

    var userId = req.params.id;
    db.collection('users').find({ _id: ObjectId(userId) }, { projection: { _id: 1, likes: 1, userName: 1 }} ).toArray(function (err, docs) {
        res.status(200).json(docs);
    });


});

router.get('/name/:name', (req, res, next) => {

    var userName = req.params.name;
    userName =  new RegExp(userName, 'i');
    db.collection('users').find({ userName: userName }, { projection: { _id: 1, likes: 1, userName: 1 }} ).toArray(function (err, docs) {
      
        var selectedUser = docs[0];
        var likes = selectedUser.likes;
        var objLikesId = [];
        likes.forEach(element => {
            objLikesId.push(ObjectId(element._id));
        });
        // console.log(objLikesId);

        db.collection('tracks').find({ _id: { $in: objLikesId } },
             { projection: { _id: 1, zId: 1, performerName: 1, trackName : 1, performerId: 1,rating : 1, duration: 1 }} )
            .toArray(function (arr, tracks) {

                var NewTracks = [];
                likes.forEach(element => {
                    var copy = tracks.find(x => x._id == element._id);
                    if (copy) {
                        NewTracks.push(Object.assign(copy, element));
                    }
                });
                NewTracks.sort(function (a, b) {
                    return new Date(b.addedDate) - new Date(a.addedDate);
                });
                delete  selectedUser.likes;
                selectedUser.tracks = NewTracks
                res.status(200).json(selectedUser);
            });
      
  
    });


});






module.exports = router;