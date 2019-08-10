'use strict';

const gulp			= require( 'gulp' );
const rename		= require( 'gulp-rename' );
const babel			= require( 'gulp-babel' );
const minify		= require( 'gulp-babel-minify' );
const bookmarker	= require( './tasks/bookmarker' );
const browsers		= [ 'last 2 version', '> 1%', 'ie 8', 'ie 7' ];

let tasks = {};

function compile( fileIn, fileOut ) {

	const taskName = 'js.compile.' + fileIn;
	const source = [ './src/' + fileIn ];

	tasks[ taskName ] = source;

	gulp.task( taskName, function() {
		return gulp.src( source )
			.pipe( babel( {
				'presets': [
					[ '@babel/env', {
							'targets': { 'browsers': browsers }
					} ]
				]
			} ) )
			.on( 'error', console.error.bind( console ) )
			.pipe( minify() )
			.pipe( bookmarker() )
			.pipe( rename( fileOut || fileIn ) )
			.pipe( gulp.dest( './dist' ) );
	} );
}

compile( 'crawler.js', 'crawler.min.txt' );

gulp.task( 'watch', function() {
	for ( var taskName in tasks ) {
		gulp.watch( tasks[ taskName ], gulp.parallel( taskName ) );
	}
} );

gulp.task( 'default', gulp.parallel.apply( null, Object.keys( tasks ) ) );
