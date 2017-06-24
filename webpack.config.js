/* eslint strict: ["off"] */

'use strict';

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app', 'src', 'main.js'),
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: {
    vue: true,
  },
};
