const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const bearerToken = require('express-bearer-token');

const url = 'mongodb://localhost:27017';
const dbName = 'ali';
MongoClient.connect(url, function (err, client) {
    db = client.db(dbName);
});


router.get('/', (req, res, next) => {

    var perfid = req.query.performerid;
    if (perfid) {

        if (perfid.length < 24 || perfid.length > 24) {
            res.status(200).json([]);
            return true;
        }

        db.collection('tracks').find({ performerId: ObjectId(perfid) }).sort({ "rating": -1 }).toArray(function (err, docs) {
            if (docs.length > 0) {
                res.status(200).json(docs);
            } else {
                res.status(200).json([]);
            }
        });
    }
    var rating = req.query.rating;
    if (rating == "true") {
        db.collection('tracks').find().sort({ "rating": -1 }).limit(100).toArray(function (err, docs) {
            res.status(200).json(docs);
        });

        
    } 


 


});

router.get('/:id', (req, res, next) => {

    var trackId = req.params.id;

    if (trackId.length < 24 || trackId.length > 24) {
        res.status(200).json([]);
        return true;
    }

    db.collection('tracks').find({ _id: ObjectId(trackId) }).sort({ "rating": -1 }).toArray(function (err, docs) {
       
        if (docs.length > 0) {
            res.status(200).json(docs);
        } else {
            res.status(200).json([]);
        }
    }
    );


});



router.post('/', function (req, res) {

    var item = req;
    item.keys =   item.productTitle.split(' ');
    item.audtions = 0;

            db.collection('items').insertOne(item, function (err, docsInserted) {
                res.send(item);
            });

});


router.delete('/:id', function (req, res) {

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {

        activeUser = docs[0];
        if (activeUser.role == "admin") {
            db.collection('tracks').remove({ _id: ObjectId(req.params.id) });
            res.status(200).json({
                role: activeUser.role,
                _id: req.params.id
            });
        } else {
            res.status(500).json({
                message: 'token is bad'
            })
        }

    });


});


router.patch('/', function (req, res) {

    var newTrackPatch = req.body;
    var trackId = newTrackPatch._id;
    delete newTrackPatch._id;

    db.collection('users').find({ "sessions.token" :req.token}).toArray(function (err, docs) {

        activeUser = docs[0];

        if (activeUser.role == "admin" || activeUser.role == "manager") {
            db.collection('tracks').update({ _id: ObjectId(trackId) }, { $set: newTrackPatch });

            res.status(200).json(
                newTrackPatch
            );
        } else {
            res.status(500).json({
                message: 'token is bad'
            })
        }

    });

});

module.exports = router;