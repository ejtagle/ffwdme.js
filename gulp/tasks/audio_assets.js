var gulp = require('gulp');

gulp.task('audio_assets',async function() {
  gulp.src('./src/**/*.{json,m4a,mp3,ogg,wav}', { encoding: false, removeBOM: false })
    .pipe(gulp.dest('build'));
});
