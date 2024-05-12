var gulp = require('gulp');

let imagemin;
let imageminSvgo;

const startup = async () => {
	
	imagemin = (await import('gulp-imagemin')).default;
	imageminSvgo = (await import('imagemin-svgo')).default;
};


gulp.task('svg_assets',async function() {
  await startup();
  
  gulp.src('./src/**/*.{svg}')
	.pipe(imagemin([
            //svg
            imageminSvgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ]))
    .pipe(gulp.dest('build'));
});
