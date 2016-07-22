var path = require('path');
var webpack = require('webpack');

var es3ifyPlugin = require('es3ify-webpack-plugin');
// var es3ifyPlugin = require('./es3ifyPlugin');

module.exports = {
  entry: {
    core: "./src/index",
    display: ['babel-polyfill', "./src/display"],
  },
  output: {
    //path: path.join(__dirname, "dist"),
    path: 'D://job/2015/Demo/WitBPM.Demo.Web/Scripts/witui/form/design',
    filename: "formDesigner.[name].js",
    library: ["FormDesigner", "[name]"],
    libraryTarget: "var",
  },
  // externals: [
  //   "react",//当把react设为externals时，material会引用react，导致react再次被引用进来
  //   {"jquery": "jQuery"},
  // ],
  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
    new es3ifyPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.less$/,
      loader: "style!css!less"
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
    {
      test: /\.png$/,
      loader: "url-loader",
      query: { mimetype: "image/png" }
    }]
  }
};
