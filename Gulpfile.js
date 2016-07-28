var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', () => {
  electron.start();
  gulp.watch('app.js', electron.restart);
  gulp.watch([
    'index.html',
    'system.config.js',
    'lib/*.js',
    'components/*.html',
    'styles/*.html'
  ], electron.reload);
});

gulp.task('default', ['serve']);
