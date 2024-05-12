var gulp = require('gulp');

gulp.task('audio_assets', function() {
  return gulp.src('./src/**/*.{json,m4a,mp3,ogg,wav}', { encoding: false, removeBOM: false })
    .pipe(gulp.dest('build'));
});
