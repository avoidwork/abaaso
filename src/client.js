/** @namespace client */
var client = {
	/**
	 * ActiveX support
	 *
	 * @type {Boolean}
	 */
	activex : function () {
		var result = false,
		    obj;

		if ( typeof ActiveXObject !== "undefined" ) {
			try {
				obj    = new ActiveXObject( "Microsoft.XMLHTTP" );
				result = true;
			}
			catch ( e ) {}
		}

		return result;
	}(),

	/**
	 * Android platform
	 *
	 * @type {Boolean}
	 */
	android : function () {
		return !server && regex.android.test( navigator.userAgent );
	}(),

	/**
	 * Blackberry platform
	 *
	 * @type {Boolean}
	 */
	blackberry : function () {
		return !server && regex.blackberry.test( navigator.userAgent );
	}(),

	/**
	 * Chrome browser
	 *
	 * @type {Boolean}
	 */
	chrome : function () {
		return !server && regex.chrome.test( navigator.userAgent );
	}(),

	/**
	 * Firefox browser
	 *
	 * @type {Boolean}
	 */
	firefox : function () {
		return !server && regex.firefox.test( navigator.userAgent );
	}(),

	/**
	 * Internet Explorer browser
	 *
	 * @type {Boolean}
	 */
	ie : function () {
		return !server && regex.ie.test( navigator.userAgent );
	}(),

	/**
	 * iOS platform
	 *
	 * @type {Boolean}
	 */
	ios : function () {
		return !server && regex.ios.test( navigator.userAgent );
	}(),

	/**
	 * Linux Platform
	 *
	 * @type {Boolean}
	 */
	linux : function () {
		return !server && regex.linux.test( navigator.userAgent );
	}(),

	/**
	 * Mobile platform
	 *
	 * @type {Boolean}
	 */
	mobile : function () {
		var size;

		if ( server ) {
			return false;
		}
		else {
			size = client.size();

			return ( /blackberry|iphone|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( size[0] < 720 || size[1] < 720 ) ) );
		}
	},

	/**
	 * Playbook platform
	 *
	 * @type {Boolean}
	 */
	playbook: function () {
		return !server && regex.playbook.test( navigator.userAgent );
	}(),

	/**
	 * Opera browser
	 *
	 * @type {Boolean}
	 */
	opera : function () {
		return !server && regex.opera.test( navigator.userAgent );
	}(),

	/**
	 * OSX platform
	 *
	 * @type {Boolean}
	 */
	osx : function () {
		return !server && regex.osx.test( navigator.userAgent );
	}(),

	/**
	 * Safari browser
	 *
	 * @type {Boolean}
	 */
	safari : function () {
		return !server && regex.safari.test( navigator.userAgent.replace(/chrome.*/i, "") );
	}(),

	/**
	 * Tablet platform
	 *
	 * Modern smartphone resolution makes this a hit/miss scenario
	 *
	 * @type {Boolean}
	 */
	tablet : function () {
		var size;

		if ( server ) {
			return false;
		}
		else {
			size = client.size();

			return ( /ipad|playbook|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( size[0] >= 720 || size[1] >= 720 ) ) );
		}
	},

	/**
	 * WebOS platform
	 *
	 * @type {Boolean}
	 */
	webos : function () {
		return !server && regex.webos.test( navigator.userAgent );
	}(),

	/**
	 * Windows platform
	 *
	 * @type {Boolean}
	 */
	windows : function () {
		return !server && regex.windows.test( navigator.userAgent );
	}(),

	/**
	 * Client version
	 *
	 * @type {Boolean}
	 */
	version : function () {
		var version = 0;

		if ( this.chrome ) {
			version = navigator.userAgent.replace( /(.*chrome\/|safari.*)/gi, "" );
		}
		else if ( this.firefox ) {
			version = navigator.userAgent.replace( /(.*firefox\/)/gi, "" );
		}
		else if ( this.ie ) {
			version = navigator.userAgent.replace(/(.*msie|;.*)/gi, "");
		}
		else if ( this.opera ) {
			version = navigator.userAgent.replace( /(.*version\/|\(.*)/gi, "" );
		}
		else if ( this.safari ) {
			version = navigator.userAgent.replace( /(.*version\/|safari.*)/gi, "" );
		}
		else {
			version = navigator.appVersion || "0";
		}

		version = number.parse( string.trim( version ) );

		if ( isNaN( version ) ) {
			version = 0;
		}

		if ( this.ie && document.documentMode && document.documentMode < version ) {
			version = document.documentMode;
		}

		return version;
	},

	/**
	 * Quick way to see if a URI allows a specific verb
	 *
	 * @method allows
	 * @param  {String} uri  URI to query
	 * @param  {String} verb HTTP verb
	 * @return {Boolean}     `true` if the verb is allowed, undefined if unknown
	 */
	allows : function ( uri, verb ) {
		if ( string.isEmpty( uri ) || string.isEmpty( verb ) ) {
			throw new Error( label.error.invalidArguments );
		}

		uri        = utility.parse( uri ).href;
		verb       = verb.toLowerCase();
		var result = false,
		    bit    = 0;

		if ( !cache.get( uri, false ) ) {
			result = undefined;
		}
		else {
			if ( regex.del.test( verb ) ) {
				bit = 1;
			}
			else if ( regex.get_headers.test( verb ) ) {
				bit = 4;
			}
			else if ( regex.put_post.test( verb ) ) {
				bit = 2;
			}
			else if ( regex.patch.test( verb ) ) {
				bit = 8;
			}

			result = Boolean( client.permissions( uri, verb ).bit & bit );
		}

		return result;
	},

	/**
	 * Gets bit value based on args
	 *
	 * @method bit
	 * @param  {Array} args Array of commands the URI accepts
	 * @return {Number} To be set as a bit
	 */
	bit : function ( args ) {
		var result = 0;

		array.each( args, function ( verb ) {
			verb = verb.toLowerCase();

			if ( regex.get_headers.test( verb ) ) {
				result |= 4;
			}
			else if ( regex.put_post.test( verb ) ) {
				result |= 2;
			}
			else if ( regex.patch.test( verb ) ) {
				result |= 8;
			}
			else if ( regex.del.test( verb ) ) {
				result |= 1;
			}
		});

		return result;
	},

	/**
	 * Determines if a URI is a CORS end point
	 *
	 * @method cors
	 * @param  {String} uri  URI to parse
	 * @return {Boolean}     True if CORS
	 */
	cors : function ( uri ) {
		return ( !server && uri.indexOf( "//" ) > -1 && uri.indexOf( "//" + location.host ) === -1 );
	},

	/**
	 * Caches the headers from the XHR response
	 *
	 * @method headers
	 * @param  {Object} xhr  XMLHttpRequest Object
	 * @param  {String} uri  URI to request
	 * @param  {String} type Type of request
	 * @return {Object}      Cached URI representation
	 */
	headers : function ( xhr, uri, type ) {
		var headers = string.trim( xhr.getAllResponseHeaders() ).split( "\n" ),
		    items   = {},
		    o       = {},
		    allow   = null,
		    expires = new Date(),
		    cors    = client.cors( uri );

		array.each( headers, function ( i ) {
			var header, value;

			value         = i.replace( regex.header_value_replace, "" );
			header        = i.replace( regex.header_replace, "" );
			header        = string.unhyphenate( header, true ).replace( /\s+/g, "-" );
			items[header] = value;

			if ( allow === null ) {
				if ( ( !cors && regex.allow.test( header) ) || ( cors && regex.allow_cors.test( header) ) ) {
					allow = value;
				}
			}
		});

		if ( regex.no.test( items["Cache-Control"] ) ) {
			// Do nothing
		}
		else if ( items["Cache-Control"] !== undefined && regex.number_present.test( items["Cache-Control"] ) ) {
			expires = expires.setSeconds( expires.getSeconds() + number.parse( regex.number_present.exec( items["Cache-Control"] )[0], 10 ) );
		}
		else if ( items.Expires !== undefined ) {
			expires = new Date( items.Expires );
		}
		else {
			expires = expires.setSeconds( expires.getSeconds() + $.expires );
		}

		o.expires    = expires;
		o.headers    = items;
		o.permission = client.bit( allow !== null ? string.explode( allow ) : [type] );

		if ( type === "get" ) {
			cache.set( uri, "expires",    o.expires );
			cache.set( uri, "headers",    o.headers );
			cache.set( uri, "permission", o.permission );
		}

		return o;
	},

	/**
	 * Parses an XHR response
	 *
	 * @method parse
	 * @param  {Object} xhr  XHR Object
	 * @param  {String} type [Optional] Content-Type header value
	 * @return {Mixed}       Array, Boolean, Document, Number, Object or String
	 */
	parse : function ( xhr, type ) {
		type = type || "";
		var result, obj;

		if ( ( regex.json_maybe.test( type ) || string.isEmpty( type ) ) && ( regex.json_wrap.test( xhr.responseText ) && Boolean( obj = json.decode( xhr.responseText, true ) ) ) ) {
			result = obj;
		}
		else if ( regex.xml.test( type ) ) {
			if ( type !== "text/xml" ) {
				xhr.overrideMimeType( "text/xml" );
			}

			result = xhr.responseXML;
		}
		else if ( type === "text/plain" && regex.is_xml.test( xhr.responseText) && xml.valid( xhr.responseText ) ) {
			result = xml.decode( xhr.responseText );
		}
		else {
			result = xhr.responseText;
		}

		return result;
	},

	/**
	 * Returns the permission of the cached URI
	 *
	 * @method permissions
	 * @param  {String} uri URI to query
	 * @return {Object}     Contains an Array of available commands, the permission bit and a map
	 */
	permissions : function ( uri ) {
		var cached = cache.get( uri, false ),
		    bit    = !cached ? 0 : cached.permission,
		    result = {allows: [], bit: bit, map: {partial: 8, read: 4, write: 2, "delete": 1, unknown: 0}};

		if ( bit & 1) {
			result.allows.push( "DELETE" );
		}

		if ( bit & 2) {
			result.allows.push( "POST" );
			result.allows.push( "PUT" );
		}

		if ( bit & 4) {
			result.allows.push( "GET" );
		}

		if ( bit & 8) {
			result.allows.push( "PATCH" );
		}

		return result;
	},

	/**
	 * Creates a JSONP request
	 *
	 * @method jsonp
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request ( CORS )
	 * @return {Object}           Deferred
	 */
	jsonp : function ( uri, success, failure, args ) {
		var defer    = deferred(),
		    callback = "callback", cbid, s;

		if ( external === undefined ) {
			if ( global.abaaso === undefined ) {
				utility.define( "abaaso.callback", {}, global );
			}

			external = "abaaso";
		}

		if ( args instanceof Object && args.callback !== undefined ) {
			callback = args.callback;
		}

		defer.then( function (arg ) {
			if ( typeof success === "function") {
				success( arg );
			}
		}, function ( e ) {
			if ( typeof failure === "function") {
				failure( e );
			}

			throw e;
		});

		do {
			cbid = utility.genId().slice( 0, 10 );
		}
		while ( global.abaaso.callback[cbid] !== undefined );

		uri = uri.replace( callback + "=?", callback + "=" + external + ".callback." + cbid );

		global.abaaso.callback[cbid] = function ( arg ) {
			clearTimeout( utility.timer[cbid] );
			delete utility.timer[cbid];
			delete global.abaaso.callback[cbid];
			defer.resolve( arg );
			element.destroy( s );
		};

		s = element.create( "script", {src: uri, type: "text/javascript"}, utility.$( "head" )[0] );
		
		utility.defer( function () {
			defer.reject( undefined );
		}, 30000, cbid );

		return defer;
	},

	/**
	 * Creates an XmlHttpRequest to a URI ( aliased to multiple methods )
	 *
	 * The returned Deferred will have an .xhr property decorated
	 *
	 * Events: before[type]          Fires before the XmlHttpRequest is made, type specific
	 *         failed[type]          Fires on error
	 *         progress[type]        Fires on progress
	 *         progressUpload[type]  Fires on upload progress
	 *         received[type]        Fires on XHR readystate 2
	 *         timeout[type]         Fires when XmlHttpRequest times out
	 *
	 * @method request
	 * @param  {String}   uri     URI to query
	 * @param  {String}   type    Type of request ( DELETE/GET/POST/PUT/HEAD )
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    [Optional] Data to send with the request
	 * @param  {Object}   headers [Optional] Custom request headers ( can be used to set withCredentials )
	 * @param  {Number}   timeout [Optional] Timeout in milliseconds, default is 30000
	 * @return {Object}           Deferred
	 */
	request : function ( uri, type, success, failure, args, headers, timeout ) {
		timeout = timeout || 30000;
		var cors, xhr, payload, cached, typed, contentType, doc, ab, blob, defer;

		if ( ( regex.put_post.test( type ) || regex.patch.test( type ) ) && args === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		uri         = utility.parse( uri ).href;
		type        = type.toLowerCase();
		headers     = headers instanceof Object ? headers : null;
		cors        = client.cors( uri );
		xhr         = ( client.ie && client.version < 10 && cors ) ? new XDomainRequest() : ( !client.ie || ( client.version > 8 || type !== "patch")  ? new XMLHttpRequest() : new ActiveXObject( "Microsoft.XMLHTTP" ) );
		payload     = ( regex.put_post.test( type ) || regex.patch.test( type ) ) && args !== undefined ? args : null;
		cached      = type === "get" ? cache.get( uri ) : false;
		typed       = type.capitalize();
		contentType = null;
		doc         = ( typeof Document !== "undefined" );
		ab          = ( typeof ArrayBuffer !== "undefined" );
		blob        = ( typeof Blob !== "undefined" );
		defer       = deferred();

		// Using a deferred to resolve request
		defer.then( function ( arg ) {
			if ( typeof success === "function" ) {
				success.call( uri, arg, xhr );
			}

			xhr = null;

			return arg;
		}, function ( e ) {
			if ( typeof failure === "function" ) {
				failure.call( uri, e, xhr );
			}

			xhr = null;

			throw e;
		});

		uri.fire( "before" + typed );

		if ( !cors && !regex.get_headers.test( type ) && client.allows( uri, type ) === false ) {
			xhr.status = 405;
			defer.reject( null );

			return uri.fire( "failed" + typed, null, xhr );
		}

		if ( type === "get" && Boolean( cached ) ) {
			// Decorating XHR for proxy behavior
			if ( server ) {
				xhr.readyState  = 4;
				xhr.status      = 200;
				xhr._resheaders = cached.headers;
			}

			defer.resolve( cached.response );
			uri.fire( "afterGet", cached.response, xhr );
		}
		else {
			xhr[typeof xhr.onreadystatechange !== "undefined" ? "onreadystatechange" : "onload"] = function () {
				client.response( xhr, uri, type, defer );
			};

			// Setting timeout
			try {
				if ( xhr.timeout !== undefined ) {
					xhr.timeout = timeout;
				}
			}
			catch ( e ) {}

			// Setting events
			if ( xhr.ontimeout  !== undefined ) {
				xhr.ontimeout = function ( e ) {
					uri.fire( "timeout"  + typed, e, xhr );
				};
			}

			if ( xhr.onprogress !== undefined ) {
				xhr.onprogress = function (e) {
					uri.fire( "progress" + typed, e, xhr );
				};
			}

			if ( xhr.upload !== undefined && xhr.upload.onprogress !== undefined ) {
				xhr.upload.onprogress = function ( e ) {
					uri.fire( "progressUpload" + typed, e, xhr );
				};
			}

			xhr.open( type.toUpperCase(), uri, true );

			// Setting Content-Type value
			if ( headers !== null && headers.hasOwnProperty( "Content-Type" ) ) {
				contentType = headers["Content-Type"];
			}

			if ( cors && contentType === null ) {
				contentType = "text/plain";
			}

			// Transforming payload
			if ( payload !== null ) {
				if ( payload.hasOwnProperty( "xml" ) ) {
					payload = payload.xml;
				}

				if ( doc && payload instanceof Document ) {
					payload = xml.decode( payload );
				}

				if ( typeof payload === "string" && regex.is_xml.test( payload ) ) {
					contentType = "application/xml";
				}

				if ( !( ab && payload instanceof ArrayBuffer ) && !( blob && payload instanceof Blob ) && payload instanceof Object ) {
					contentType = "application/json";
					payload = json.encode( payload );
				}

				if ( contentType === null && ((ab && payload instanceof ArrayBuffer) || (blob && payload instanceof Blob)) ) {
					contentType = "application/octet-stream";
				}

				if ( contentType === null ) {
					contentType = "application/x-www-form-urlencoded; charset=UTF-8";
				}
			}

			// Setting headers (using typeof for PATCH support in IE8)
			if ( typeof xhr.setRequestHeader !== "undefined" ) {
				if ( typeof cached === "object" && cached.headers.hasOwnProperty( "ETag" ) ) {
					xhr.setRequestHeader( "ETag", cached.headers.ETag );
				}

				if ( headers === null ) {
					headers = {};
				}

				if ( contentType !== null ) {
					headers["Content-Type"] = contentType;
				}

				if ( headers.hasOwnProperty( "callback" ) ) {
					delete headers.callback;
				}

				utility.iterate( headers, function ( v, k ) {
					if ( v !== null && k !== "withCredentials") {
						xhr.setRequestHeader( k, v );
					}
				});
			}

			// Cross Origin Resource Sharing ( CORS )
			if ( typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean" ) {
				xhr.withCredentials = headers.withCredentials;
			}

			// Firing event & sending request
			payload !== null ? xhr.send( payload ) : xhr.send();
		}

		defer.xhr = xhr;

		return defer;
	},

	/**
	 * Caches the URI headers & response if received, and fires the relevant events
	 *
	 * If abaaso.state.header is set, an application state change is possible
	 *
	 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
	 * resource
	 *
	 * Events: after[type]  Fires after the XmlHttpRequest response is received, type specific
	 *         reset        Fires if a 206 response is received
	 *         failure      Fires if an exception is thrown
	 *         headers      Fires after a possible state change, with the headers from the response
	 *
	 * @method response
	 * @param  {Object} xhr      XMLHttpRequest Object
	 * @param  {String} uri      URI to query
	 * @param  {String} type     Type of request
	 * @param  {Object} defer    Deferred to reconcile with the response
	 * @return {Undefined}       undefined
	 */
	response : function ( xhr, uri, type, defer ) {
		var typed    = string.capitalize( type.toLowerCase() ),
		    xhrState = null,
		    xdr      = client.ie && xhr.readyState === undefined,
		    shared   = true,
		    exception, o, r, t, redirect;

		// server-side exception handling
		exception = function ( e, xhr ) {
			defer.reject( e );
			uri.fire( "failed" + typed, client.parse( xhr ), xhr );
		};

		if ( !xdr && xhr.readyState === 2) {
			uri.fire( "received" + typed, null, xhr );
		}
		else if ( !xdr && xhr.readyState === 4 ) {
			switch ( xhr.status ) {
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
				case 206:
					// Caching headers
					o = client.headers( xhr, uri, type );
					uri.fire( "headers", o.headers, xhr );

					if ( type === "head" ) {
						defer.resolve( o.headers );

						return uri.fire( "afterHead", o.headers );
					}
					else if ( type === "options" ) {
						defer.resolve( o.headers );

						return uri.fire( "afterOptions", o.headers );
					}
					else if ( type !== "delete" ) {
						if ( server && regex.priv.test( o.headers["Cache-Control"] ) ) {
							shared = false;
						}

						if ( regex.http_body.test( xhr.status ) ) {
							t = o.headers["Content-Type"] || "";
							r = client.parse( xhr, t );

							if ( r === undefined ) {
								exception( new Error( label.error.serverError ), xhr );
							}
						}

						if ( type === "get" && shared ) {
							cache.set( uri, "response", ( o.response = utility.clone( r, true ) ) );
						}
						else {
							cache.expire( uri, true );
						}
					}
					else if ( type === "delete" ) {
						cache.expire( uri, true );
					}

					// Application state change triggered by hypermedia ( HATEOAS )
					if ( state.getHeader() !== null && Boolean( xhrState = o.headers[state.getHeader()] ) && state.current !== xhrState ) {
						state.setCurrent( state );
					}

					switch ( xhr.status ) {
						case 200:
						case 202:
						case 203:
						case 206:
							defer.resolve( r );
							uri.fire( "after" + typed, r, xhr );
							break;
						case 201:
							if ( ( o.headers.location === undefined || string.isEmpty( o.headers.location ) ) && !string.isUrl( r ) ) {
								defer.resolve( r );
							}
							else {
								redirect = string.trim ( o.headers.Location || r );
								client.request( redirect, "GET", function ( arg ) {
									defer.resolve ( arg );
									uri.fire( "after" + typed, arg, xhr );
								}, function ( e ) {
									exception( e, xhr );
								} );
							}
							break;
						case 204:
							defer.resolve( null );
							uri.fire( "after" + typed, null, xhr );
							break;
						case 205:
							defer.resolve( null );
							uri.fire( "reset", null, xhr );
							break;
					}
					break;
				case 304:
					defer.resolve( r );
					uri.fire( "after" + typed, r, xhr );
					break;
				case 401:
					exception( new Error( label.error.serverUnauthorized ), xhr );
					break;
				case 403:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( new Error( label.error.serverForbidden ), xhr );
					break;
				case 405:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( new Error( label.error.serverInvalidMethod ), xhr );
					break;
				default:
					exception( new Error( xhr.responseText || label.error.serverError ), xhr );
					break;
			}

			try {
				xhr.onreadystatechange = null;
			}
			catch ( e ) {}
		}
		else if ( xdr ) {
			r = client.parse( xhr, "text/plain" );
			cache.set( uri, "permission", client.bit( ["get"] ) );
			cache.set( uri, "response", r );
			defer.resolve( r );
			uri.fire( "afterGet", r, xhr );
		}
	},

	/**
	 * Creates a script Element to load an external script
	 *
	 * @method script
	 * @param  {String} arg    URL to script
	 * @param  {Object} target [Optional] Element to receive the script
	 * @param  {String} pos    [Optional] Position to create the script at within the target
	 * @return {Object}        Script
	 */
	script : function ( arg, target, pos ) {
		return element.create( "script", {type: "application/javascript", src: arg}, target || utility.$( "head" )[0], pos );
	},

	/**
	 * Scrolls to a position in the view using a two point bezier curve
	 *
	 * @method scroll
	 * @param  {Array}  dest Coordinates
	 * @param  {Number} ms   [Optional] Milliseconds to scroll, default is 250, min is 100
	 * @return {Object}      Deferred
	 */
	scroll : function ( dest, ms ) {
		var defer = deferred(),
		    start = client.scrollPos(),
		    t     = 0;

		ms = ( !isNaN( ms ) ? ms : 250 ) / 100;

		utility.repeat( function () {
			var pos = math.bezier( start[0], start[1], dest[0], dest[1], ++t / 100 );

			window.scrollTo( pos[0], pos[1] );

			if ( t === 100 ) {
				defer.resolve( true );
				return false;
			}
		}, ms, "scrolling" );

		return defer;
	},

	/**
	 * Returns the current scroll position of the View
	 *
	 * @method scrollPos
	 * @return {Array} Describes the scroll position
	 */
	scrollPos : function () {
		return [
			window.scrollX || 0,
			window.scrollY || 0
		];
	},

	/**
	 * Returns the visible area of the View
	 *
	 * @method size
	 * @return {Array} Describes the View
	 */
	size : function () {
		return [
			document["documentElement" || "body"].clientWidth  || 0,
			document["documentElement" || "body"].clientHeight || 0
		];
	},

	/**
	 * Creates a link Element to load an external stylesheet
	 *
	 * @method stylesheet
	 * @param  {String} arg   URL to stylesheet
	 * @param  {String} media [Optional] Medias the stylesheet applies to
	 * @return {Objecct}      Stylesheet
	 */
	stylesheet : function ( arg, media ) {
		return element.create( "link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, utility.$( "head" )[0] );
	}
};
