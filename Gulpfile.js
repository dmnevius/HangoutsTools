const gulp = require('gulp');
const electron = require('electron-connect').server.create();
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const config = require('./webpack.config');

gulp.task('uglify', () => gulp.src('app/js/bundle.js').pipe(uglify()).pipe(gulp.dest('app/js/')));

gulp.task('webpack', () => gulp.src('app/js/app.jsx')
  .pipe(webpack(config))
  .pipe(gulp.dest('app/js/')));

gulp.task('serve', () => {
  electron.start();
  gulp.watch('app/index.js', electron.restart);
  gulp.watch([
    'app/index.html',
    'app/js/app.js',
    'app/js/*/*.js',
    'app/js/*/*.jsx',
    'app/css/*.css',
  ], ['webpack', electron.reload]);
});

gulp.task('default', ['webpack', 'serve']);
