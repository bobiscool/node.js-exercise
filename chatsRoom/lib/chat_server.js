

var socket = require('socket.io');
var io;
var guestNumber = 1;
var nickNames ={};
var nameUsed = [];
var currentRoom = {};

exports.listen = function(server){
  io = socket.listen(server);//启动 io服务 让其搭在 已经存在的 http服务

  io.set('log level',10);



  io.sockets.on('connection',function(socket){//定义每一个用户连接的时候 得处里逻辑
    guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);

    joinRoom(socket,'lobby');
    //把连接上的用户 添加到 lo里面
    handleMessageBroadcasting(socket,nickNames);
    handleNameChangeAttemps(socket,nickNames,nameUsed);
    handleRoomJoining(socket);



  socket.on('rooms',function(){
    // socket.emit('rooms',io.sockets.manager.rooms); 这个地方也变了

   socket.emit("rooms",io.of('/').adapter.rooms);
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
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.broadcast.to(room).emit('message',{text:nickNames[socket.id]+'has joined '+room+'.'});

  // var usersInRoom = io.sockets.clients(room); 这个地方不是这个样的 因为 socket io 升级了

  var usersInRoom = io.of('/').in(room).clients;

  if(usersInRoom.length>1){
    var usersInRoomSummary = 'User currently in '+room+':';
    for(var  index  in usersInRoom){
      var userSocketId = usersInRoom[index].id;
      if(userSocketId != socket.id){
        if(index>0){
          usersInRoomSummary +=',  '
        }

        usersInRoomSummary += nickNames[userSocketId];
      }
    }

   usersInRoomSummary +='.'
   socket.emit('message',{text:usersInRoomSummary});
 }
}


function handleNameChangeAttemps(socket,nickNames,nameUsed){
  socket.on('nameAttempt',function(name){
    //昵称 不能 以guest开头
    if(name.indexOf('Guest')==0){
      socket.emit('nameResult',{
        success:false,
        message:"Name can't begin with 'Guest'"
      })
    }else{
      if(nameUsed.indexOf(name) == -1){// 如果还没有注册
        var previousName = nickName[socket.id];
        var previousNameIndex = nameUsed.indexOf(previousName);
        nameUsed.push(name);
        nickNames[socket.id] = name;
        delete nameUsed[previousNameIndex];//删掉之前的昵称

        socket.emit('nameResult',{
          success:true,
          name:name
        });

        socket.broadcast.to(currentRoom[socket.id]).emit('message',{
          text:previousName+'is now known as ' + name+" . "
        })


      }else{
        socket.emit('nameResult',{
          success:false,   // 如果昵称 被占用 那就向客户端发送 消息
          message:'that name is already in use'
        })
      }
    }
  })
}

/*发送聊天消息*/
function handleMessageBroadcasting(socket){
  socket.on('message',function(message){
    socket.broadcast.to(message.room).emit('message',{
      text:nickNames[socket.id]+':'+message.text
    });
  })
}



/*创建房间*/
function handleRoomJoining(socket){
  socket.on('join',function(room){
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket,room.newRoom);
  })
}

/*关闭连接*/
function handleClientDisconnection(socket){
   socket.on('disconnect',function(){
     var nameIndex = nameUsed.indexOf(nickNames[socket.id]);
     delete nameUsed[nameIndex];
     delete nickNames[socket.id];
   })
}
