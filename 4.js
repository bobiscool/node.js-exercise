/*流数据*/

var fs = require('fs');
var stream = fs.createReadStream('../TSearch.v5.9.zip');

stream.on('data',function(chunk){
  console.log(chunk);// 数据块
})

stream.on('end',function(){
  console.log('finished');
})
