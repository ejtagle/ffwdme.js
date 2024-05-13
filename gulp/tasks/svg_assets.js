var gulp = require('gulp');

let imagemin;
let imageminSvgo;

const startup = async () => {
	
	imagemin = (await import('gulp-imagemin')).default;
	imageminSvgo = (await import('imagemin-svgo')).default;
};


gulp.task('svg_assets',async function() {
  await startup();
  
  gulp.src('./src/**/*.svg', { encoding: false, removeBOM: false })
	.pipe(imagemin([
            //svg
            imageminSvgo({
                plugins:[
				{
				  name: 'preset-default',
				  params: {
					overrides: {
					  cleanupAttrs: true,
					  removeDoctype: true,
					  removeXMLProcInst: true,
					  removeComments: true,
					  removeMetadata: true,
					  removeTitle: true,
					  removeDesc: true,
					  removeUselessDefs: true,
					  removeEditorsNSData: true,
					  removeEmptyAttrs: true,
					  removeHiddenElems: true,
					  removeEmptyText: true,
					  removeEmptyContainers: true,
					  removeViewBox: false,
					  cleanupEnableBackground: true,
					  convertColors: true,
					  convertPathData: true,
					  convertTransform: true,
					  convertEllipseToCircle: true,
					  removeUnknownsAndDefaults: true,
					  removeNonInheritableGroupAttrs: true,
					  removeUselessStrokeAndFill: true,
					  removeUnusedNS: true,
					  cleanupIds: true,
					  cleanupNumericValues: {
						floatPrecision: 1,
					  },
					  moveElemsAttrsToGroup: true,
					  moveGroupAttrsToElems: true,
					  collapseGroups: true,
					  mergePaths: true,
					  convertShapeToPath: {
						convertArcs: true,
					  },
					  sortAttrs: true,
					  mergeStyles: true,
					  minifyStyles: true,
					},
				  },
				},
				{
					name: 'removeAttrs',
					params: {
						attrs: '(style|color)',
					},
				},
				{
					name: 'convertStyleToAttrs',
					active: true
				},
				{
					name: 'removeRasterImages',
					active: false
				},
				{
					name: 'convertOneStopGradients',
					active: true
				}
			  ]
            })
        ]))
    .pipe(gulp.dest('build'));
});
