var exec = require('child_process').exec;


function start(response){
    //sleep(10000);
    console.log("request handler 'start' was called");
    var content = "empty";

    exec("ls -lah",function(error,stdout,stderr){
    content = stdout;
    console.log(response);
    response.writeHead(200,{"Content-type":"text/plain"});
    response.write(stdout);
    response.end();
});

}

function upload(){
    console.log("request handler 'upload' was called");
    return "hello upload";
}

function sleep(milliSeconds){
    var startTime = new Date().getTime();
    while (new Date().getTime()<startTime+milliSeconds);
}


exports.start = start;
exports.upload = upload;
