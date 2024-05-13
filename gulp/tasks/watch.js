/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browser_sync.js automatically reloads any files
     that change within the directory it's serving from
*/

var gulp = require('gulp');

gulp.task('watch', gulp.series('setWatch', 'browserSync'), function() {
  gulp.watch('static/**', ['static']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/components/leaflet/*.png', ['image_assets']);
  gulp.watch('./src/**/*.svg', ['svg_assets']);
  gulp.watch('./src/**/*.{m4a,mp3,ogg,wav}', ['audio_assets']);
  gulp.watch('./src/**/*.{json}', ['misc_assets']);
});
