var http= require("http");
var url = require("url");
var route = require("./router.js");

console.log(route);
function start(route,handle){
function onRequest(request,response){
    //console.log(response);
    var pathname = url.parse(request.url).pathname;
    route(handle,pathname,response);
}

http.createServer(onRequest).listen(8888);

console.log("server has start");
}


exports.start = start;
