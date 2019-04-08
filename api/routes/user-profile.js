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


router.get(':userName', (req, res, next) => {

    var userName = req.params.userName;
    db.collection('users').find({ userName: userName }, { projection: { _id: 1, likes: 1, userName: 1 }} ).toArray(function (err, docs) {
        res.status(200).json(docs);
    });


});


module.exports = router;