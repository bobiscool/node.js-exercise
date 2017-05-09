var querystring = require("querystring");
var fs = require("fs");
var exec = require('child_process').exec;
var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post">'+
        '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';

function start(response){
    //sleep(10000);
    console.log("request handler 'start' was called");
    var content = "empty";

    response.writeHead(200,{"Content-type":"text/plain"});
    response.write(body);
    response.end();

}

function upload(response,postData){
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("you send postdata"+querystring.parse(postData).text);
    response.end();
    console.log("request handler 'upload' was called");
}

function sleep(milliSeconds){
    var startTime = new Date().getTime();
    while (new Date().getTime()<startTime+milliSeconds);
}

function show(response,postData){
    fs.readFile("/tmp/test.png","binary",function(error,file){
        if(error){
            response.writeHead("500",{"Content-Type":"text/plain"});
            response.write(error+"\n");
            response.end();
        }else{
            response.writeHead(200,{"Content-Type":"text/png"});
            response.write(file,"binary");
            response.end();
        }
    })
}



exports.start = start;
exports.upload = upload;
exports.show=show;
