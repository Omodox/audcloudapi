const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const bearerToken = require('express-bearer-token');

var activeUser;

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

      function getUser(req){
        db.collection('users').find({sessions: req.token }).toArray(function (err,docs) {
            activeUser = docs[0];
        });
      }

router.get('/', function (req, res) {


    db.collection('performers').find().toArray(function (err,docs) {
      res.send(docs);
      });

  }); 

  router.delete('/', function (req, res) {

      getUser(req);
      console.log(activeUser);
      res.send(activeUser);

    // db.collection('performers').find().toArray(function (err,docs) {
    //   res.send(docs);
    //   });

  }); 

module.exports = router;