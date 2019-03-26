const http = require("http");
http.createServer(function(request,response){
     
    response.end("Hello NodeJS!");
     
}).listen(80, "185.143.145.35",function(){
    console.log("Сервер начал прослушивание запросов на порту 80");
});