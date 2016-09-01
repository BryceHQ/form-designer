var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',//eval
  entry: {
    core: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    display: ['./src/display']

  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "bundle.[name].js",
    //filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src') },
      { test: /\.less$/, loader: "style!css!less"},
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader", query: { mimetype: "image/png" }}
    ]
  }
};
