var gulp = require('gulp');

gulp.task('misc_assets', function() {
  return gulp.src('./src/**/*.{json}', { encoding: false, removeBOM: false })
    .pipe(gulp.dest('build'));
});
