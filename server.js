var webpack = require('webpack');
var morgan = require('morgan');

var routes = require('./app/routes');

var express = require('express');
var bodyParser = require('body-parser');

var redisClient = require('./app/utils/dbRedis').client

var app = exports.app = new express();
var port = 3000;

app.use(bodyParser.json());

if (app.get('env') == 'development')
{
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackConfig = require('./webpack-dev.config');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var compiler = webpack(webpackConfig);


  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}
app.use(morgan('combined'));

app.use('/api', routes.router);
app.use('/static', express.static('static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==>  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});
