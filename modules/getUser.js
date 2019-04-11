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
// { sessions :{ $elemMatch: {token: userToken}}}

var getUser = function(userToken) {
    db.collection('users').find().toArray(function (err, docs) {
        if (docs.length > 0) {
            var activeUser = docs[0];
            console.log(activeUser);
            return activeUser;
        }
    });
}




module.exports = getUser;