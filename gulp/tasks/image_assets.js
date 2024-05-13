var gulp = require('gulp');

let imagemin;
let imageminPngquant;
let imageminZopfli;
let imageminMozjpeg;
let imageminGiflossy;
let imageminJpegtran;

const startup = async () => {
	
	imagemin = (await import('gulp-imagemin')).default;
	imageminPngquant = (await import('imagemin-pngquant')).default;
	imageminZopfli = (await import('imagemin-zopfli')).default;
	imageminMozjpeg = (await import('imagemin-mozjpeg')).default;
	imageminGiflossy = (await import('imagemin-giflossy')).default;
	imageminJpegtran = (await import('imagemin-jpegtran')).default;
};


gulp.task('image_assets',async function() {
  await startup();
  
  gulp.src('./src/components/leaflet/*.png', { encoding: false, removeBOM: false })
	.pipe(imagemin([
            //png
            imageminPngquant({
                speed: 1,
                quality: [0.95, 1] //lossy settings
            }),
            imageminZopfli({
                more: true
                // iterations: 50 // very slow but more effective
            }),
            //gif
            // imagemin.gifsicle({
            //     interlaced: true,
            //     optimizationLevel: 3
            // }),
            //gif very light lossy, use only one of gifsicle or Giflossy
            imageminGiflossy({
                optimizationLevel: 3,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //jpg lossless
            imageminJpegtran({
                progressive: true
            }),
            //jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 90
            })
        ]))
    .pipe(gulp.dest('build/components/leaflet'));
});
