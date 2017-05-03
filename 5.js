/*流数据*/
var http = require('http');
var fs = require('fs');
http.createServer(function(res,req){
res.writeHead(200,{
  "Content-Type":"img/gif"
});
fs.createReadScream('../timg.gif').pipe(res)// 设置一个管道从读取流数据流的的管道
});
