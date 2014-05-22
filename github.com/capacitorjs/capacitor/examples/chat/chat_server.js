var shoe = require('shoe'),
    through = require('through2'),
    path = require('path'),
    http = require('http'),
    ecstatic = require('ecstatic')(path.resolve(__dirname, '..', '..', 'dist', 'chat')),
    server,
    sock;

server = http.createServer(ecstatic);
server.listen(9000);

sock = shoe(function (stream) {
  stream.write('hello!');

  var iv = setInterval(function() {
    stream.write('hello again')
  }, 5000);

  stream.on('end', function () {
      clearInterval(iv);
  });

  stream.pipe(through.obj(function(message, enc, callback) {
    stream.write('hello again');
    this.push(message);
    callback();
  })).pipe(process.stdout, { end : false });  
});

sock.install(server, '/chat');