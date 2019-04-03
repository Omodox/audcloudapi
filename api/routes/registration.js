const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

// 


function encrypt(text){
    var cipher = crypto.createCipher('aes-128-cbc','887dfS2z3R')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  function decrypt(text){
    var cipher = crypto.createCipher('aes-128-cbc','887dfS2z3R')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

  
  router.post('/', function (req, res) {
    var element = req.body;


    var passwordHash = encrypt(element.userPassword);
    var token = passwordHash + Math.floor(new Date() / 1000);
    var session = encrypt(token);

    var user = {
        userEmail: element.userEmail,
        userName: element.userName,
        createdDate: new Date(),
        passwordHash: passwordHash,
        role: "user",
        seesions: session,
    };

    if (element.userEmail && element.userEmail && element.userPassword) {

    }

    res.send(user);
});

module.exports = router;