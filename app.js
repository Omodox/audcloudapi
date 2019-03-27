// const http = require("http");
// http.createServer(function(request,response){
     
//     response.end("Hello NodeJS!");
     
// }).listen(80, "185.143.145.35",function(){
//     console.log("Сервер начал прослушивание запросов на порту 80");
// });


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

app.post('/performer', function (req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'audcloud';
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
   db.collection('performers').insert(req.body);

          }); 
       res.send(req.body);
});

app.listen(80, function() {
    console.log('ok');
})


