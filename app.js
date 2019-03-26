const http = require('http');
const port = 8080;
const ip = '127.0.0.1';

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
}).listen(port, ip);

console.log(`server is running on ${ip}:${port}`);