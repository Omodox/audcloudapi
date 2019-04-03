const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const request = require('request');

const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
      }); 

// 

const telegramUrl = 'https://api.telegram.org/bot693449666:AAH83H6PYwp8wwxH1-Gbgb8A03KeRiKpxWU/sendMessage'; 
var answer = '';
// 


router.get('/', function (req, res) {

    var search = req.query.search; 
    var searchArray = [];
     search =  search.split(' ');
    
      search.forEach(element => {
        element =  new RegExp(element, 'i');
        searchArray.push(element);
     });
    db.collection('tracks').find({ keys: { $all: searchArray } }).sort({"rating" : -1}).toArray(function (err,docs) {

         
        request({
            method: 'GET',
            url: telegramUrl,
            // параметры GET-запроса
            // index.php?param=edit&value=10
            qs: {
             chat_id: '-266590437',
             text: req.query.search
            }
           }, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             // console.log(body);
             // валидация и 
             // обработка полученного ответа, заголовков
             answer = body;
           }
         })


      res.send(docs);
      });



  }); 

  module.exports = router;