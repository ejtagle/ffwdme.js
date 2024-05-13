var gulp = require('gulp');

gulp.task('misc_assets',async function() {
  gulp.src('./src/**/*.{json}', { encoding: false, removeBOM: false })
    .pipe(gulp.dest('build'));
});
