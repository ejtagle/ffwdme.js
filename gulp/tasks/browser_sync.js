var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browserSync', gulp.series('build'), function() {
  browserSync.init(['build/**'], {
    server: {
      baseDir: ['build', 'src']
    }
  });
});
