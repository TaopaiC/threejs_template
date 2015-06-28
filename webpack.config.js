/*global __dirname*/
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    app: './app/javascripts/app.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: 'build/',
    filename: '[name].js',
    chunkFilename: '[hash]/js/[id].js',
    hotUpdateMainFilename: '[hash]/update.json',
    hotUpdateChunkFilename: '[hash]/js/[id].update.js',
    pathinfo: true
  },
  recordsOutputPath: path.join(__dirname, 'records.json'),
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime' },
      { test: __dirname + '/web_modules/three/build/three.js', loader: 'expose?THREE' },
      { test: __dirname + '/web_modules/webvr-boilerplate/src/main.js', loader: 'imports?window=>{}!exports?window.WebVRManager' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: "three"
    }),
    new webpack.PrefetchPlugin('three'),
    new webpack.PrefetchPlugin('engine'),
    new webpack.PrefetchPlugin('babel-runtime/core-js/promise'),
    new webpack.PrefetchPlugin('babel-runtime/helpers/get'),
    new webpack.PrefetchPlugin('webvr-polyfill/src/main'),
    new webpack.PrefetchPlugin('webvr-boilerplate/src/main')
  ],
  resolve: {
    root: path.join(__dirname, 'app', 'javascripts'),
    modulesDirectories: [
      'web_modules',
      'node_modules'
    ],
    extensions: ["", ".js"]
  },
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: "cheap-source-map",
  // devtool: "cheap-source-map",
  // devtool: "eval",
  devServer: {
  }
};
