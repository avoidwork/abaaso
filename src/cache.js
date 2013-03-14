/**
 * Cache for RESTful behavior
 *
 * @class cache
 * @namespace abaaso
 * @private
 */
var cache = {
	// Collection URIs
	items : {},

	/**
	 * Garbage collector for the cached items
	 *
	 * @method clean
	 * @return {Undefined} undefined
	 */
	clean : function () {
		return utility.iterate( cache.items, function ( v, k ) {
			if ( cache.expired( k ) ) {
				cache.expire( k );
			}
		});
	},

	/**
	 * Expires a URI from the local cache
	 * 
	 * Events: expire    Fires when the URI expires
	 *
	 * @method expire
	 * @param  {String}  uri    URI of the local representation
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Undefined}      undefined
	 */
	expire : function ( uri, silent ) {
		silent = ( silent === true );
		if ( cache.items[uri] !== undefined ) {
			delete cache.items[uri];

			if ( !silent ) {
				observer.fire( uri, "beforeExpire, expire, afterExpire" );
			}

			return true;
		}
		else {
			return false;
		}
	},

	/**
	 * Determines if a URI has expired
	 *
	 * @method expired
	 * @param  {Object} uri Cached URI object
	 * @return {Boolean}    True if the URI has expired
	 */
	expired : function ( uri ) {
		var item = cache.items[uri];

		return item !== undefined && item.expires !== undefined && item.expires < new Date();
	},

	/**
	 * Returns the cached object {headers, response} of the URI or false
	 *
	 * @method get
	 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
	 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Mixed}          URI Object {headers, response} or False
	 */
	get : function ( uri, expire ) {
		var parsed = utility.parse(uri);

		uri    = parsed.protocol + "//" + parsed.host + parsed.pathname;
		expire = ( expire !== false );

		if ( cache.items[uri] === undefined ) {
			return false;
		}

		if ( expire && cache.expired( uri ) ) {
			cache.expire( uri );

			return false;
		}

		return utility.clone( cache.items[uri] );
	},

	/**
	 * Sets, or updates an item in cache.items
	 *
	 * @method set
	 * @param  {String} uri      URI to set or update
	 * @param  {String} property Property of the cached URI to set
	 * @param  {Mixed} value     Value to set
	 * @return {Mixed}           URI Object {headers, response} or undefined
	 */
	set : function ( uri, property, value ) {
		var parsed = utility.parse(uri);

		uri = parsed.protocol + "//" + parsed.host + parsed.pathname;

		if ( cache.items[uri] === undefined ) {
			cache.items[uri] = {};
			cache.items[uri].permission = 0;
		}

		property === "permission" ? cache.items[uri].permission |= value
		                          : (property === "!permission" ? cache.items[uri].permission &= ~value
		                                                        : cache.items[uri][property]   =  value);

		return cache.items[uri];
	}
};
