module.exports = {
  output: {
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js(x?)$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
      },
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: {
    electron: true,
    fs: true,
  },
};
