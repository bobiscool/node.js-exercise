var http= require("http");
var url = require("url");
var util = require("util")
var formidable = require("formidable");
var route = require("./router.js");

console.log(route);
function start(route,handle){
function onRequest(request,response){
    //console.log(response);

//    if(req.url=="/upload"&&req.method.toLowerCase()=="post"){
//        var form = new formidable.IncomingForm();
//        form.parse(req,function(){
//        res.writeHead(200,{"content-type":"text/plain"});
//            res.write("file recieved");
//            res.end(util.inspect({fields:fields,files:files}));
//
//        });
//        return;
//    }

if (request.url == '/upload' && request.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
      request.writeHead(200, {'content-type': 'text/plain'});
      request.write('received upload:\n\n');
      request.end(util.inspect({fields: fields, files: files}));
    });

    request.writeHead(200, {'content-type': 'text/html'});
  request.end(
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );

    return;
  }

  // show a file upload form
  




    var pathname = url.parse(request.url).pathname;
    request.setEncoding('utf8');

    request.addListener("data",function(postDataChunk){
    postData +=postDatatChunk;
    console.log("recieved dataChunk")+postDataChunk+".";

    });

    request.addListener("end",function(){
        route(handle,pathname,response,request);
    });



    route(handle,pathname,response);
}

http.createServer(onRequest).listen(8888);

console.log("server has start");
}


exports.start = start;
