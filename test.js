var http = require('http');
var Cookies = require('./lib/cookies.js');

http.createServer(function (req, res) {
  var cookies = new Cookies(req.headers.cookie);
  
  if(cookies.mycookie1 != undefined) {
    console.log('mycookie1 is set');
    console.log('mycookie1 value is:', cookies.mycookie1.value);
  } else {
    console.log('mycookie1 is NOT set');
  }
  
  if(cookies['mycookie2'] != undefined) {
    console.log('mycookie2 is set');
    console.log('mycookie2 value is:', cookies['mycookie2']['value']);
    
  } else {
    console.log('mycookie2 is NOT set');
  }
  
  console.log(cookies.toString());
  
  
  res.writeHead(200, {'Content-Type': 'text/plain', 'Set-Cookie': ['mycookie1=value1', 'mycookie2=value2'] });
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
