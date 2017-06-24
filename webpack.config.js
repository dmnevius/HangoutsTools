/* eslint strict: ["off"] */

'use strict';

const path = require('path');
const externs = require('./externs');

const externals = {};

for (let i = 0; i < externs.length; i += 1) {
  externals[externs[i]] = `commonjs ${externs[i]}`;
}

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
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.woff2$/,
        loader: 'url-loader',
      },
    ],
  },
  externals,
};
