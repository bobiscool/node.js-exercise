/*以下是 NODEjs 起一个简单的 httpserver*/

var http = require('http');
http.createServer(function(req,res){
  res.writeHead(200,{'Content-type':'text-plain'});
  res.end('Hello world');
}).listen(3000);

console.log('server on');
