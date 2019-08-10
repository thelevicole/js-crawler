'use strict';

const fs			= require( 'fs' );
const PluginError	= require( 'plugin-error' );
const through		= require( 'through2' );

module.exports = function( options ) {

	// Users options object
	options = options || {};

	return through( {
		objectMode: true,
		writable: true,
		readable: true
	}, function( file, encoding, callback ) {

		// Check for null file
		if ( file.isNull() ) {
			return callback( null, file );
		}

		if ( file.isStream() ) {
			this.emit( 'error', new PluginError( 'bookmarker', 'Stream not supported!' ) );
			return callback( null, file );
		}

		if ( file.isBuffer() ) {

			// Get contents of file
			let source = file.contents.toString( encoding );

			let script = '(function(){' + source + '})();'

			source = 'javascript:' + encodeURIComponent( script );

			file.contents = Buffer.from( source, encoding );

			return callback( null, file );
		}
	});
};
