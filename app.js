
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db;




var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));





app.get('/',function(req,res){
    
    res.send('Hello ' + req.query.name );
})


app.post('/traks', function (req, res) {

    console.log(req.body);
    var element = req.body;
    
        var perfromer = {
            zId : element.zId,
            perfromerName : element.perfromerName,
            trackName : element.trackName,
        }

        db.collection('traks').insert(perfromer);
        console.log(perfromer);

    
          res.send(req.body.perfromerName);
    
});

app.get('/traks', function (req, res) {

  

    db.collection('traks').find().toArray(function (err,docs) {
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



