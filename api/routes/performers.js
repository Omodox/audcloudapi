const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const bearerToken = require('express-bearer-token');



const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

  

router.get('/', function (req, res) {


    db.collection('performers').find().toArray(function (err,docs) {
      res.send(docs);
      });

  }); 

  router.delete('/:id', function (req, res) {

    db.collection('users').find({sessions: req.token }).toArray(function (err,docs) {

        activeUser = docs[0];
        if (activeUser.role == "admin") {
            db.collection('tracks').remove({performerId:req.params.id});
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
      

    // db.collection('performers').find().toArray(function (err,docs) {
    //   res.send(docs);
    //   });

  }); 

module.exports = router;