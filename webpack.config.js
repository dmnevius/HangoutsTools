const path = require('path');
const VueLoader = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', path.resolve(__dirname, 'app', 'src', 'main.ts')],
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.pug', '.css'],
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
        },
      }, {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
      }, {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      }, {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
    ],
  },
  externals: {
    electron: 'commonjs electron',
    fs: 'commonjs fs',
  },
  plugins: [
    new VueLoader(),
  ],
};
