const gulp = require('gulp');
const electron = require('electron-connect').server.create();
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const config = require('./webpack.config');

gulp.task('uglify', () => gulp.src('js/bundle.js').pipe(uglify()).pipe(gulp.dest('js/')));

gulp.task('webpack', () => gulp.src('js/app.jsx').pipe(webpack(config)).pipe(gulp.dest('js/')));

gulp.task('serve', () => {
  electron.start();
  gulp.watch('app.js', electron.restart);
  gulp.watch([
    'index.html',
    'js/app.js',
    'js/*/*.js',
    'js/*/*.jsx',
    'css/*.css',
  ], ['webpack', electron.reload]);
});

gulp.task('default', ['webpack', 'serve']);
