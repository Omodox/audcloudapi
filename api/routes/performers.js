const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 


router.get('/performers', function (req, res) {


    db.collection('performers').find().toArray(function (err,docs) {
      res.send(docs);
      });

  }); 

module.exports = router;