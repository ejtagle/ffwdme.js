var gulp = require('gulp');

gulp.task('build', gulp.series('browserify', 'static', 'sass', 'image_assets', 'svg_assets', 'audio_assets', 'misc_assets'));
