var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var catche = {};

var chatServer = require('./lib/chat_server');



function send404(response){
  response.writeHead(404,{
    'Contend-Type':"text/plain",
  });
  response.write('Error 404:resource not found');
  response.end();
}



function sendFile(response,filePath,fileContents){
  response.writeHead(
    200,
    {"Contend-Type":mime.lookup(path.basename(filePath))}
  );

  response.end(fileContents);
  }



function serveStatic(response,catche,absPath){
// console.log(response);;
  if(catche[absPath]){
    sendFile(response,absPath,catche[absPath])
  }else{
    fs.exists(absPath,function(exists){
      if(exists){
        fs.readFile(absPath,function(err,data){
          if(err){
            send404(response);
          }else {
            catche[absPath]= data;
            sendFile(response,absPath,data);
          }
        })
      }else {
        send404(response);
      }
    })
  }
}

// 静态文件服务

var server = http.createServer(function(request,response){
  var filePath = false;
  if(request.url=='/'){
    filePath = 'public/index.html';
  }else {
    filePath = 'public/'+request.url;
  }

  var absPath = './'+filePath;
  serveStatic(response,catche,absPath);
})


chatServer.listen(server);
server.listen(3000,function(){
  console.log('listen on 3000')
})
