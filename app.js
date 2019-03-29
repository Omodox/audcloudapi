
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db;




var app = express();



// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get('/',function(req,res){
    
    res.send('Hello ' + req.query.name );
})


app.post('/traks', function (req, res) {

    console.log(req.body);
    var element = req.body;
    
        var trak = {
            zId : element.zId,
            performerName : element.performerName,
            trackName : element.trackName,
            perfromerId :null,
        }

        db.collection('performers').find({performerName:element.performerName}).toArray(function (err,docs) {
     console.log(docs);
            if (docs == '') {
          
                var performer =  {"performerName": element.performerName }
                db.collection('performers').insertOne(performer, function(err,docsInserted){
                   
                    trak.perfromerId = docsInserted.ops[0]._id;
                    createTrak();
                });

            }

            else {
     
                trak.perfromerId = docs[0]._id;
                createTrak();
            }


            });

            function createTrak() {
                var searchParameter = { $and: [ { performerName: trak.performerName }, { trackName: trak.trackName } ]};
                db.collection('traks').find(searchParameter).toArray(function (err,docs) { 
                    if (docs == '') {
                        db.collection('traks').insert(trak);
                    }
                });
            }

    
          res.send(req.body.perfromerName);
    
});

app.get('/traks', function (req, res) {

    db.collection('traks').find().toArray(function (err,docs) {
      res.send(docs);
      });

  });    






  app.get('/performers', function (req, res) {

  

    db.collection('performers').find().toArray(function (err,docs) {
      res.send(docs);
      });

  }); 

  
  app.get('/tracks/:id', function (req, res) {

  
    db.collection('traks').find({_id: req.params.id}).toArray(function (err,docs) {
      res.send(docs);
      });

  }); 



app.listen(80, function() {
    console.log('ok');
})


const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
         
        
      }); 



