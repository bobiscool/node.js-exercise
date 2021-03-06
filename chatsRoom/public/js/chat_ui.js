function divEscapedContentElement(message){
   return $('<div></div>').text(message);
}

function divSystemContentElement(message){
  return $('<div></div>').html('<i>'+message+'</i>')
}


function processUserInput(chatApp,socket){
  var message = $('#send-message').val();
  console.log(message);
  var systemMessage;
  if(message.charAt(0) == '/'){
    systemMessage = chatApp.processCommand(message);
    console.log(systemMessage);
    if(systemMessage){
      $("#messages").append(divEscapedContentElement(systemMessage));
    }
  }else {
    chatApp.sendMessage($("#room").text(),message);

    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-massege').val('');
}


/*初始化*/

var socket = io.connect();
$(document).ready(function(){
  var chatApp = new Chat(socket);
  console.log(chatApp);
  socket.on('nameResult',function(result){
    var message;
    if(result.success){
      message = 'You are know as'+result.name+'.';
    }else{
      message =result.message;
    }

    $("#messages").append(divSystemContentElement(message));
  });

  socket.on('joinResult',function(result){
     $('#room').text(result.room);
     $('messages').append(divSystemContentElement('Room changed'))
  });



  socket.on('message',function(message){
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  })

  socket.on('rooms',function(rooms){
    $('#room-list').empty();
    for(var room in rooms){
      room = room.substring(1,room.length);
      if (room!='') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }


    /*点击房间切换房间*/
        $('#room-list div').click(function(){
          // chatApp.processCommand('/join',$(this).text());
          // $('#send-message').focus();
        });

    });




setInterval(function(){
  socket.emit('rooms');
},1000);

$('#send-message').focus();

//提交表单发送信息
$('#send-button').click(function(){
  console.log("被点击")
  processUserInput(chatApp,socket);
  return false;
});



  }
)
