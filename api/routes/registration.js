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
    var token = element.userEmail + passwordHash + Math.floor(new Date() / 1000);
    var userToken = encrypt(token);

    var newSession = {
        token: userToken,
        createdDate : new Date(),
    }


    var user = {
        userEmail: element.userEmail,
        userName: element.userName,
        createdDate: new Date(),
        passwordHash: passwordHash,
        activeStatus: "active",
        role: "user",
        sessions: [],
        history: [],
        likes: [],
      
    };
    user.sessions.push(newSession);

    if (element.userEmail && element.userName && element.userPassword) {
        db.collection('users').find({userEmail:element.userEmail}).toArray(function (err,docs) {
            if (docs.length == 0) {
                db.collection('users').insert(user);
                res.status(200).json({
                    message: 'Done',
                    token: userToken

                })
            } else {
                res.status(500).json({
                    message: 'alredy in database'
                })
            }
        });
    } else {
        res.status(500).json({
            message: 'Error with filds'
        });
    }

   
});

module.exports = router;