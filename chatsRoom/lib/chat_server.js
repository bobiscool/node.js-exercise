// var http = require('http');
// var fs = require('fs');
// var path = require('path');
// var mime = require('mime');
// var catche = {};
//
//
//
// function send404(response){
//   response.writeHead(404,{
//     'Contend-Type':"text/plain",
//   });
//   response.write('Error 404:resource not found');
//   response.end();
// }
//
//
//
// function sendFile(response,filePath,fileContents){
//   response.writeHead(
//     200,
//     {"Contend-Type":mime.lookup(path.basename(filePath))}
//   );
//
//   response.end(fileContents);
//   }
//
//
//
// function serveStatic(response,catche,absPath){
//   if(catche[absPath]){
//     sendFile(reponse,absPath,catche[absPath])
//   }else{
//     fs.exists(absPath,function(exists){
//       if(exists){
//         fs.readFile(absPath,function(err,data){
//           if(err){
//             send404(response);
//           }else {
//             catche[absPath]= data;
//             sendFile(response,absPath,data);
//           }
//         })
//       }else {
//         send404(response);
//       }
//     })
//   }
// }
//
// // 静态文件服务
//
// var server = http.createServer(function(request,response){
//   var filePath = false;
//   if(request.url=='/'){
//     filePath = 'public/index.html';
//   }else {
//     filePath = 'public/'+request.url;
//   }
//
//   var absPath = './'+filePath;
//   serveStatic(response,catche,absPath);
// })
//
//
// server.listen(3000,function(){
//   console.log('listen on 3000')
// })

var socket = require('socket.io');
var io;
var guestNumber = 1;
var nickNames ={};
var nameUsed = [];
var currentRoom = {};

exports.listen = function(server){
  io = socketio.listen(server);//启动 io服务 让其搭在 已经存在的 http服务
  io.set('log level',1);

  io.sockets.on('connection',function(socket){//定义每一个用户连接的时候 得处里逻辑
    guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);

    joinRoom(socket,'lobby');
    //把连接上的用户 添加到 lo里面
    handleMessageBroadcasting(socket,nickNames);
    handleNameChangeAttemps(socket,nickNames,nameUsed);
    handleRoomJoining(socket);



  socket.on('rooms',function(){
    socket.emit('rooms',io.sockets,manager.rooms);

  }) // 用户发送请求时 向用户提供意境being占用 的 聊天室列表
    //处理用户的消息 以及聊天室的 创建 以及变动
    handleClientDisconnection(socket,nickNames,nameUsed);
  })
}



/*分配用户名称*/
function assignGuestName(socket,guestNumber,nickNames,nameUsed){
  var name = 'Guest'+guestNumber;
  nickNames[socket.id]=name;
  socket.emit('nameResult',{
    success:true,
    name:name
  });
  nameUsed.push(name);   //存放已经被占用的名称
  return guestNumber+1;  // 生成 昵称的计数器
};


/*进入聊天室 的相关逻辑 */

function joinRoom(socket,room){
  socker.join(room);
  currentRoom[socket.id] = room;
  socket.broadcast.to(room).emit('message',{text:nickNames[socket.id]+'has joined '+room+'.'});

  var usersInRoom = io.sockets.clients(room);

  if(usersInRoom.length>1){
    var usersInRoomSummary = 'User currently in '+room+':';

  }


}
