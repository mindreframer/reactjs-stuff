var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var lr = require('tiny-lr');
var lrServer;

var argv = require('minimist')(process.argv.slice(2), {
  string: ['lrport', 'port'],
  default: {
    lrport: '35729',
    port: 9000
  }
});

module.exports = {
  listen: function(root) {
    return function() {
      lrServer = lr();
      lrServer.listen(argv.lrport, function(err) {
        if (err) {
          console.error('livereload error on port %s', argv.lrport);
          console.error(err);
          process.exit(1);
        }
        console.log('livereload listening on %s', argv.lrport);
      });

      http.createServer(
        ecstatic({
          root: path.join(root)
        })
      ).listen(argv.port, function() {
        console.log('http listening on %s', argv.port);
      });
    }
  },
  changed: function() {
    if (lrServer) {
      lrServer.changed.apply(lrServer, arguments);
    }
  }
}
