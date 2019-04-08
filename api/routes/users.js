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

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
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




module.exports = router;