function Crawler( settings = {} ) {

	/**
	 * Total number of URLs to crawl
	 * @type {Number}
	 */
	this.limit = settings.limit || 200;

	/**
	 * Keep track of the current iteration count
	 * @type {Number}
	 */
	this.currentIteration = 0;

	/**
	 * Store baseURL
	 * @type {String}
	 */
	this.baseURL = settings.baseURL || window.location.origin;

	/**
	 * Reference to the current processing URL
	 * @type {String}
	 */
	this.currentURL = null;

	/**
	 * Store result data in an object
	 * @type {Object}
	 */
	this.results = {};

	/**
	 * Array of URLs pending crawl
	 * @type {Array}
	 */
	this.queue = [];

	/**
	 * Initiate
	 */
	this.trigger( 'crawl.start' );
	this.crawlURL( this.baseURL );

}

/**
 * Hold all event listeners in a contained array
 * @type {Array}
 */
Crawler.prototype.listeners = [];

/**
 * Add event lister
 *
 * @param	{String}	event	Name of event to listen for
 * @param	{Function}	callback
 * @return	{Void}
 */
Crawler.prototype.on = function( event, callback ) {
	this.listeners.push( {
		name: event,
		callback: callback
	} );
};

/**
 * Trigger an event
 *
 * @param	{String}	event	Name of event to listen for
 * @param	{Mixed}		args	These args are passed to the callback function
 * @return	{Void}
 */
Crawler.prototype.trigger = function( event, ...args ) {
	for ( let i = 0; i < this.listeners.length; i++ ) {
		const listener = this.listeners[ i ];
		if ( listener.name === event ) {
			if ( typeof listener.callback === 'function' ) {
				listener.callback( ...args );
			}
		}
	}
};


/**
 * Clean up and convert relative/absolute urls to absolute base urls
 * @param  {String} url
 * @param  {String} base
 * @return {String}
 */
Crawler.prototype.cleanURL = function( url ) {

	/**
	 * Escape string for regex
	 * @param  {String} string
	 * @return {String}
	 */
	const esc = string => string.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );

	/**
	 * Remove trailing slash from base url
	 * @type {String}
	 */
	const base = this.baseURL.replace( /\/$/i, '' );

	/**
	 * Remove trailing slash from current url
	 * @type {String}
	 */
	const current = this.currentURL.replace( /\/$/i, '' );

	/**
	 * Create regex pattern including BASE url variable
	 * @type {RegExp}
	 */
	const pattern = new RegExp( '^' + esc( base ) + '\\/?', 'i' );

	/**
	 * Check if url is absolute or relative
	 * @type {String}
	 */
	const isAbsolute = pattern.test( url );

	/**
	 * Try and check if url is local to the current site, or not a hash url, if not return null
	 */
	if ( !isAbsolute && ( /^https?:/i.test( url ) || /^www\./i.test( url ) || /^#/i.test( url ) ) ) {
		return null;
	}

	/**
	 * If the url is relative to the current url, prefix with current url
	 */
	if ( !isAbsolute && !/^\//i.test( url ) ) {
		url = current + '/' + url;
	}

	/**
	 * Clean URL
	 */
	url = url.replace( pattern , '/' );
	url = url.replace( /^\//, '' );

	return base + '/' + url;

};

/**
 * This function will loop through the queue and find the next valid URL
 * @return {Void}
 */
Crawler.prototype.run = function() {
	if ( this.queue.length ) {

		/**
		 * Loop through each url in queue and crawl
		 */
		for ( let i = 0; i < this.queue.length; i++ ) {

			/**
			 * Get and clean this iteration value
			 * @type {String}
			 */
			const url = this.cleanURL( this.queue[ i ] );

			/**
			 * Check if we already have a result for this value
			 * @type {Boolean}
			 */
			const hasResult = url in this.results;

			/**
			 * Quick check if we should crawl this url
			 * @type {Boolean}
			 */
			const crawlThis = url && !hasResult;

			/**
			 * If not a valid url or already has result remove from queue
			 */
			if ( !url || hasResult || crawlThis ) {
				this.queue.splice( i, 1 );
			}

			/**
			 * If we have a valid URL and no result, crawl this url
			 */
			if ( crawlThis ) {
				this.crawlURL( url );
				return true;
			}
		}
	}

	return false;
};


/**
 * Crawl a specific URL and loop until no more left in the queue
 * @param  {String} url
 * @return {Void}
 */
Crawler.prototype.crawlURL = function( url ) {
	const self = this;

	// Increase the iteration cound
	this.currentIteration++;

	// Store the current url
	self.currentURL = url;

	// Set default result value
	self.results[ url ] = null;

	// Send event
	self.trigger( 'crawl.single.start', url );

	// Create request
	const request = new XMLHttpRequest();

	// Initialise request with these params
	request.open( 'GET', url, true );

	// Run on request success
	request.onload = function() {

		self.trigger( 'crawl.single.end', url, this );

		const status = this.status;
		const response = this.response;

		// Store result
		self.results[ url ] = {
			status: status,
			response: response
		};

		// Find all other links
		if ( status === 200 ) {
			const dom = new DOMParser().parseFromString( response, 'text/html' );
			const tags = dom.getElementsByTagName( 'a' );

			for ( let i = 0; i < tags.length; i++ ) {
				const tag = tags[ i ];
				const rel = Array.from( tag.relList ) || [];

				// Only add url to queue if does not contain nofollow
				if ( rel.indexOf( 'nofollow' ) === -1 ) {
					const cleaned = self.cleanURL( tag.href );

					if ( cleaned && cleaned.indexOf( self.baseURL ) !== -1 ) {
						if ( self.queue.indexOf( tag.href ) === -1 ) {
							self.queue.push( tag.href );
						}
					}
				}
			}
		}

		let runNext = self.limit !== -1 && Object.keys( self.results ).length < self.limit;

		if ( runNext ) {
			runNext = self.run();
		}

		// Go on to next
		if ( !runNext ) {
			self.trigger( 'crawl.end' );
		}
	};

	// Send request
	request.send();
};

const crawlLimit = parseInt( prompt( 'Set the crawl limit with the field below. Set to `-1` for infinate crawling. Default is limit is 200.' ) ) || null;

/**
 * Initiate crawler on load
 */
const runner = new Crawler( {
	limit: crawlLimit
} );

runner.on( 'crawl.single.start', ( url ) => {
	console.log( `${runner.currentIteration}/${runner.queue.length}` );
} );


runner.on( 'crawl.end', () => {

	let table = [];

	table.push( '<table width="100%" cellpadding="5" cellspacing="2" border="1">' );

	table.push( '<tr>' );
		table.push( '<td>URL</td>' );
		table.push( '<td>Status</td>' );
		table.push( '<td>Title</td>' );
		table.push( '<td>H1</td>' );
	table.push( '</tr>' );

	for ( var url in runner.results ) {
		const result = runner.results[ url ];
		let title = '';
		let h1 = '';

		if ( result.status === 200 ) {
			const dom = new DOMParser().parseFromString( result.response, 'text/html' );

			const titleElement = dom.querySelector( 'title' );
			const h1Elements = dom.getElementsByTagName( 'h1' );

			if ( titleElement ) {
				title = titleElement.innerText;
			}

			if ( h1Elements.length && h1Elements[ 0 ] ) {
				h1 = h1Elements[ 0 ].innerText;
			}
		}

		table.push( '<tr>' );
			table.push( `<td>${url}</td>` );
			table.push( `<td>${result.status}</td>` );
			table.push( `<td>${title}</td>` );
			table.push( `<td>${h1}</td>` );
		table.push( '</tr>' );

	}

	table.push( '</table>' );

	var newWindow = window.open();
	newWindow.document.write( table.join( '' ) );
	newWindow.focus();

} );

