const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
const bearerToken = require('express-bearer-token');

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

  router.get('/', (req, res, next) => {

    db.collection('users').find({ sessions: req.token }).toArray(function (err, docs) {
        if (docs.length > 0) {
            res.status(200).json( {
                role : docs[0].role
            } );
        } else {
            res.status(200).json({
                message: 'Bad token'
            });
        }
     
    });


});

  
  router.post('/', function (req, res) {
    var element = req.body;
    var passwordHash = encrypt(element.userPassword);
    var token = element.userEmail + passwordHash + Math.floor(new Date() / 1000);
    var token = encrypt(token);

    var user = {
        userEmail: element.userEmail,
        passwordHash: passwordHash,
    };
    
    var newSession = {
        token: token,
        createdDate : new Date(),
        testfild: '1', 
    }

    if (element.userEmail && element.userPassword) {
        db.collection('users').find(user).toArray(function (err,docs) {
            if (docs.length > 0) {
                db.collection('users').update(user,{$set: {sessions: newSession} });
                res.status(200).json({
                    token: token,
                    role: docs[0].role
                });
            } else {
                res.status(500).json({
                    message: 'Bad Email or Password'
                });
            }
        });
    }
});

module.exports = router;