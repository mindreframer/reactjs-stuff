var fs          = require('fs');
var path        = require('path');
var url         = require('url');
var express     = require('express');
var browserify  = require('connect-browserify');
var ReactAsync  = require('react-async');
var nodejsx     = require('node-jsx').install();
var App         = require('./modules/App');

var development = process.env.NODE_ENV !== 'production';

function renderApp(req, res, next) {
  var path = url.parse(req.url).pathname;
  var app = App({path: path});
  ReactAsync.renderComponentToStringWithAsyncState(app, function(err, markup) {
    if (err) {
      return next(err);
    }
    res.send(markup);
  });
}

function returnJSONFile(req, res, filePath) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      res.status(404).send('Not found');
    }
    data = JSON.parse(data);
    res.send(data);
  });
}

var api = express()
  .get('/phones/:phone', function(req, res) {
    var phone = req.params.phone;
    var path = './data/phones/' + phone + '.json';
    returnJSONFile(req, res, path);
  })
  .get('/phones', function(req, res) {
    returnJSONFile(req, res, './data/phones/phones.json');
  });

var app = express();

if (development) {
  app.get('/assets/bundle.js',
    browserify('./modules/App', {
      debug: true,
      watch: true
    }));
}

app
  .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use(express.favicon("assets/img/favicon.ico"))
  .use('/api', api)
  .use(renderApp)
  .listen(3000, function() {
    console.log('Point your browser at http://localhost:3000');
  });
