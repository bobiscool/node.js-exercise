/*以下是 NODEjs 起一个简单的 httpserver*/
// CreatServer 的另一种 写法

var http = require('http');
var server = http.createServer();
server.on('request',function(req,res){
  res.writeHead(200,('Contend-Type','text-plain'));
  res.end('Hello world');
})

server.listen(3000);
console.log("Server is running on 3000");
