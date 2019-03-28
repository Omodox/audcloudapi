
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db;




var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));





app.get('/',function(req,res){
    res.send('hello world 2');
})


app.post('/traks', function (req, res) {

    
//    console.log(req.body);
//    console.log(req.body.length);
    req.body.forEach(element => {

        var perfromer = {
            zId : element.name,
            perfromerName : element.perfromerName,
            trackName : element.trackName,
        }
        db.collection('performers').insert(perfromer);
        console.log(perfromer);
    });

    
          res.send('lorem');
    
});


app.listen(80, function() {
    console.log('ok');
})


const url = 'mongodb://localhost:27017';
const dbName = 'audcloud';
    MongoClient.connect(url, function(err, client) {
         db = client.db(dbName);
        
      }); 



