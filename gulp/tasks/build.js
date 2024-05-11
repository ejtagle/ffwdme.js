var gulp = require('gulp');

gulp.task('build', gulp.series('browserify', 'static', 'sass', 'assets'));
