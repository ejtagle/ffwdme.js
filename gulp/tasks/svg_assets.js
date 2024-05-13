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
                plugins: 				
				[ 
				  {name: 'cleanupAttrs', active: true,
				},{name: 'cleanupEnableBackground', active: true,
				},{name: 'cleanupIds', active: true,
				},{name: 'cleanupListOfValues', active: true,
				},{name: 'cleanupNumericValues', active: true,
				},{name: 'collapseGroups', active: true,
				},{name: 'convertColors', active: true,
				},{name: 'convertEllipseToCircle', active: true,
				},{name: 'convertOneStopGradients', active: true,
				},{name: 'convertPathData', active: true,
				},{name: 'convertShapeToPath', active: true,
				},{name: 'convertStyleToAttrs', active: true,
				},{name: 'convertTransform', active: true,
				},{name: 'inlineStyles', active: true,
				},{name: 'mergePaths', active: true,
				},{name: 'mergeStyles', active: true,
				},{name: 'minifyStyles', active: true,
				},{name: 'moveElemsAttrsToGroup', active: true,
				},{name: 'moveGroupAttrsToElems', active: true,
				},{name: 'removeAttrs', active: true, params: {attrs: '(stroke|fill)'},
				},{name: 'removeComments', active: true,
				},{name: 'removeDesc', active: true,
				},{name: 'removeDimensions', active: true,
				},{name: 'removeDoctype', active: true,
				},{name: 'removeEditorsNSData', active: true,
				},{name: 'removeElementsByAttr', active: false,
				},{name: 'removeEmptyAttrs', active: true,
				},{name: 'removeEmptyContainers', active: true,
				},{name: 'removeEmptyText', active: true,
				},{name: 'removeHiddenElems', active: true,
				},{name: 'removeMetadata', active: true,
				},{name: 'removeNonInheritableGroupAttrs', active: true,
				},{name: 'removeOffCanvasPaths', active: true,
				},{name: 'removeRasterImages', active: false,
				},{name: 'removeStyleElement', active: false,
				},{name: 'removeScriptElement', active: false,
				},{name: 'removeTitle', active: true,
				},{name: 'removeUnknownsAndDefaults', active: true,
				},{name: 'removeUnusedNS', active: true,
				},{name: 'removeUselessDefs', active: true,
				},{name: 'removeUselessStrokeAndFill', active: true,
				},{name: 'removeViewBox', active: false,
				},{name: 'removeXMLProcInst', active: true,
				},{name: 'removeXMLNS', active: false,
				},{name: 'removeXlink', active: true,
				},{name: 'reusePaths', active: true,
				},{name: 'sortAttrs', active: true,
				}]
            })
        ]))
    .pipe(gulp.dest('build'));
});
