var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var express = require("express");
var serveIndex = require("serve-index");
var bodyParser = require('body-parser');

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: {
    rewrites: [
      { from: /\/preview/, to: '/preview.html'},
      { from: /\/json/, to: '/json'},
    ]
  },
  contentBase: false,
});
server.listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  // this.post()

  console.log('Listening at localhost:3000');
});


var app = server.app;
app.use(bodyParser.urlencoded({ extended: true }));

var contentBase = process.cwd();
app.post('/json', function(req, res, next){
  app.cachedJson = req.body.json;
  res.send(200);
});
app.get('/json', function(req, res, next){
  res.json(app.cachedJson);
});


app.get("*", express.static(contentBase), serveIndex(contentBase));
