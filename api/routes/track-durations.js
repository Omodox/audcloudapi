const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

// 
router.post('/', function (req, res) {
    var element = req.body;
    db.collection('tracks').update({_id:ObjectId(element._id)}, {$set: {duration : element.duration}});
        res.send(element);
    
});
// 

module.exports = router;