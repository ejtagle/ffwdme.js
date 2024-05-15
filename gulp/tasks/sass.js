var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var bundleLogger = require('../util/bundle_logger');
var handleErrors = require('../util/handle_errors');

gulp.task('sass',async function () {
  bundleLogger.start();

  gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}))
      .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .on('end', bundleLogger.end);
});
