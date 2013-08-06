/**
 * URI routing via hashtag
 *
 * Client side routes will be in routes.all
 *
 * @class route
 * @namespace abaaso
 */
var route = {
	/**
	 * Current route ( Client only )
	 *
	 * @private
	 * @type {String}
	 */
	current : "",

	/**
	 * Initial / default route
	 *
	 * @private
	 * @type {String}
	 */
	initial : null,

	/**
	 * Reused regex object
	 *
	 * @private
	 * @type {RegExp}
	 */
	reg : new RegExp(),

	/**
	 * Routing listeners
	 *
	 * @private
	 * @type {Object}
	 */
	routes : {},

	/**
	 * Determines which HTTP method to use
	 *
	 * @method method
	 * @public
	 * @param  {String} arg HTTP method
	 * @return {[type]}     HTTP method to utilize
	 */
	method : function ( arg ) {
		return regex.route_methods.test( arg ) ? arg.toLowerCase() : "all";
	},

	/**
	 * Deletes a route
	 *
	 * @method del
	 * @public
	 * @param  {String} name  Route name
	 * @param  {String} verb  HTTP method
	 * @return {Mixed}        True or undefined
	 */
	del : function ( name, verb, host ) {
		host      = host || "all";
		verb      = route.method( verb );
		var error = ( name === "error" );

		if ( ( error && verb !== "all" ) || ( !error && route.routes[host][verb].hasOwnProperty( name ) ) ) {
			if ( route.initial === name ) {
				route.initial = null;
			}

			return ( delete route.routes[host][verb][name] );
		}
		else {
			throw new Error( label.error.invalidArguments );
		}
	},

	/**
	 * Getter / setter for the hashbang
	 *
	 * @method hash
	 * @public
	 * @param  {String} arg Route to set
	 * @return {String}     Current route
	 */
	hash : function ( arg ) {
		var output = "";

		if ( !server ) {
			if ( arg === undefined ) {
				output = document.location.hash.replace( regex.hash_bang, "" );
			}
			else {
				output = arg.replace( regex.hash_bang, "" );
				document.location.hash = "!" + output;
			}
		}

		return output;
	},

	/**
	 * Creates a hostname entry in the routes table
	 *
	 * @method hostname
	 * @public
	 * @param  {String} arg Hostname to route
	 * @return {Object}     Routes for hostname
	 */
	hostname : function ( arg ) {
		if ( !route.routes.hasOwnProperty( arg ) ) {
			route.routes[arg] = {
				all      : {},
				"delete" : {},
				get      : {},
				post     : {},
				put      : {}
			};
		}

		return route.routes[arg];
	},

	/**
	 * Initializes the routing by loading the initial OR the first route registered
	 *
	 * @method init
	 * @public
	 * @return {Undefined} undefined
	 */
	init : function () {
		var val = document.location.hash;

		string.isEmpty( val ) ? route.hash( route.initial !== null ? route.initial : array.cast( route.routes.all.all, true ).remove( "error" )[0] ) : route.load( val );
	},

	/**
	 * Lists all routes
	 *
	 * @method list
	 * @public
	 * @param  {String} verb HTTP method
	 * @return {Mixed}       Hash of routes if `host` not specified, else an Array of routes for a method
	 */
	list : function ( verb, host ) {
		host = host || "all";
		var result;

		if ( !server ) {
			result = array.cast( route.routes.all.all, true );
		}
		else if ( verb !== undefined ) {
			result = array.cast( route.routes[route.routes[host] ? host : "all" ][route.method( verb )], true );
		}
		else {
			result = {};

			if ( route.routes.hasOwnProperty( host ) ) {
				utility.iterate( route.routes[host], function ( v, k ) {
					result[k] = [];
					utility.iterate( v, function ( fn, r ) {
						result[k].push( r );
					});
				});
			}
		}

		return result;
	},

	/**
	 * Loads the hash into the view
	 *
	 * @method load
	 * @public
	 * @param  {String} name  Route to load
	 * @param  {String} req   [Optional] HTTP request ( node )
	 * @param  {Object} res   [Optional] HTTP response ( node )
	 * @param  {String} host  [Optional] Hostname to query
	 * @return {Mixed}        True or undefined
	 */
	load : function ( name, req, res, host ) {
		req        = req  || "all";
		host       = host || "all";
		var active = "",
		    path   = "",
		    result = true,
		    found  = false,
		    verb   = route.method( req.method || req ),
		    crawl, find;

		// Not a GET, but assuming the route is smart enough to strip the entity body
		if ( regex.route_nget.test( verb ) ) {
			verb = "get";
		}

		// Public, private, local scope
		name = name.replace( /^\#\!?|\?.*|\#.*/g, "" );

		if ( !server ) {
			route.current = name;
		}

		/**
		 * Crawls the hostnames, sets `active` & `path`
		 *
		 * @method crawl
		 * @private
		 * @param  {String} host Hostname
		 * @param  {String} verb HTTP method
		 * @param  {String} name Route
		 * @return {Undefined}   undefined
		 */
		crawl = function ( host, verb, name ) {
			if ( route.routes[host][verb][name] !== undefined ) {
				active = name;
				path   = verb;
			}
			else if ( verb !== "all" && route.routes[host].all[name] !== undefined ) {
				active = name;
				path   = "all";
			}
			else {
				utility.iterate( route.routes[host][verb], function ( v, k ) {
					return find( k, verb, name );
				});

				if ( string.isEmpty( active ) && verb !== "all" ) {
					utility.iterate( route.routes[host].all, function ( v, k ) {
						return find( k, "all", name );
					});
				}
			}
		};

		/**
		 * Finds a match, sets `active` & `path`
		 *
		 * @method find
		 * @private
		 * @param  {String} pattern Route
		 * @param  {String} method  HTTP method
		 * @param  {String} arg     URL
		 * @return {Undefined}      undefined
		 */
		find = function ( pattern, method, arg ) {
			if ( utility.compile( route.reg, "^" + pattern + "$" ) && route.reg.test( arg ) ) {
				active = pattern;
				path   = method;

				return false;
			}
		};

		if ( host !== "all" && !route.routes.hasOwnProperty( host ) ) {
			array.each( array.cast( route.routes, true ), function ( i ) {
				var regex = new RegExp( i.replace(/^\*/g, ".*") );

				if ( regex.test( host ) ) {
					host  = i;
					found = true;

					return false;
				}
			});

			if ( !found ) {
				host = "all";
			}
		}

		crawl( host, verb, name );

		if ( string.isEmpty( active ) ) {
			if ( host !== "all" ) {
				host = "all";
				crawl( host, verb, name );
			}

			if ( string.isEmpty( active ) ) {
				active = "error";
				path   = "all";
				result = false;
			}
		}

		route.routes[host][path][active]( req || active, res );

		return result;
	},

	/**
	 * Resets the routes
	 *
	 * @method reset
	 * @public
	 * @return {Undefined} undefined
	 */
	reset : function () {
		route.routes = {
			all : {
				all : {
					error : function () {
						if ( !server ) {
							if ( string.isEmpty( route.hash() ) ) {
								return history.go( -1 );
							}
							else {
								utility.error( label.error.invalidRoute );
								if ( route.initial !== null ) {
									route.hash( route.initial );
								}
							}
						}
						else {
							throw new Error( label.error.invalidRoute );
						}
					}
				},
				"delete" : {},
				get      : {},
				put      : {},
				post     : {}
			}
		};
	},

	/**
	 * Creates a Server with URI routing
	 *
	 * @method server
	 * @public
	 * @param  {Object}   arg  Server options
	 * @param  {Function} fn   Error handler
	 * @param  {Boolean}  ssl  Determines if HTTPS server is created
	 * @return {Object}        Server
	 */
	server : function ( args, fn, ssl ) {
		var maxConnections = 25,
		    handler, err, obj;

		if ( !server ) {
			throw new Error( label.error.notSupported );
		}

		args = args || {};
		ssl  = ( ssl === true || args.port === 443 );

		/**
		 * Request handler
		 *
		 * @method handler
		 * @private
		 * @param  {Object} req HTTP(S) Request Object
		 * @param  {Object} res HTTP(S) Response Object
		 * @return {Undefined}  undefined
		 */
		handler = function ( req, res ) {
			var parsed   = url.parse( req.url ),
			    hostname = req.headers.host.replace( regex.header_replace, "" );

			route.load( parsed.pathname, req, res, hostname );
		};

		/**
		 * Error handler
		 *
		 * @method err
		 * @private
		 * @param  {Object} e Error
		 * @return {Undefined} undefined
		 */
		err = function ( e ) {
			utility.error( e, [args, fn, ssl] );

			if ( typeof fn === "function" ) {
				fn( e );
			}
		};

		// Enabling routing, in case it's not explicitly enabled prior to route.server()
		route.enabled = true;

		// Server parameters
		args.host = args.host || undefined;
		args.port = args.port || 8000;

		// Creating server
		if ( !ssl ) {
			// For proxy behavior
			http.globalAgent.maxConnections = args.maxConnections  || maxConnections;

			obj = http.createServer( handler ).on( "error", err ).listen( args.port, args.host );

			if ( obj.maxConnections ) {
				obj.maxConnections = args.maxConnections || maxConnections;
			}
		}
		else {
			// For proxy behavior
			https.globalAgent.maxConnections = args.maxConnections;

			obj = https.createServer( args, handler ).on( "error", err).listen( args.port );

			if ( obj.maxConnections ) {
				obj.maxConnections = args.maxConnections || maxConnections;
			}
		}
		
		return obj;
	},

	/**
	 * Sets a route for a URI
	 *
	 * @method set
	 * @public
	 * @param  {String}   name  Regex pattern for the route
	 * @param  {Function} fn    Route listener
	 * @param  {String}   verb  HTTP method the route is for ( default is GET )
	 * @return {Mixed}          True or undefined
	 */
	set : function ( name, fn, verb, host ) {
		host = server ? ( host || "all" )    : "all";
		verb = server ? route.method( verb ) : "all";

		if ( typeof name !== "string" || string.isEmpty( name ) || typeof fn !== "function") {
			throw new Error( label.error.invalidArguments );
		}

		route.hostname( host )[verb][name] = fn;

		return true;
	}
};
