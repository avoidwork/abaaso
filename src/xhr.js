/**
 * XMLHttpRequest shim for node.js
 *
 * @method xhr
 * @return {Object} XMLHttpRequest instance
 */
var xhr = function () {
	var UNSENT           = 0,
	    OPENED           = 1,
	    HEADERS_RECEIVED = 2,
	    LOADING          = 3,
	    DONE             = 4,
	    ERR_REFUSED      = /ECONNREFUSED/,
	    ready            = new RegExp( HEADERS_RECEIVED + "|" + LOADING ),
	    XMLHttpRequest, headers, handler, handlerError, state;

	headers = {
		"User-Agent"   : "abaaso/{{VERSION}} node.js/" + process.versions.node.replace( /^v/, "" ) + " (" + string.capitalize( process.platform ) + " V8/" + process.versions.v8 + " )",
		"Content-Type" : "text/plain",
		"Accept"       : "*/*"
	};

	/**
	 * Changes the readyState of an XMLHttpRequest
	 *
	 * @method state
	 * @param  {String} arg New readyState
	 * @return {Object}     XMLHttpRequest instance
	 */
	state = function ( arg ) {
		if ( this.readyState !== arg ) {
			this.readyState = arg;
			this.dispatchEvent( "readystatechange" );

			if ( this.readyState === DONE && !this._error ) {
				this.dispatchEvent( "load" );
				this.dispatchEvent( "loadend" );
			}
		}

		return this;
	};

	/**
	 * Response handler
	 *
	 * @method handler
	 * @param  {Object} res HTTP(S) Response Object
	 * @return {undefined}  undefined
	 */
	handler = function ( res ) {
		var self = this;

		state.call( this, HEADERS_RECEIVED );

		this.status      = res.statusCode;
		this._resheaders = res.headers;

		if ( this._resheaders["set-cookie"] !== undefined && this._resheaders["set-cookie"] instanceof Array ) {
			this._resheaders["set-cookie"] = this._resheaders["set-cookie"].join( ";" );
		}

		res.on( "data", function ( arg ) {
			res.setEncoding( "utf8" );

			if ( self._send ) {
				if ( arg ) {
					self.responseText += arg;
				}

				state.call( self, LOADING );
			}
		});

		res.on( "end", function () {
			if ( self._send ) {
				state.call( self, DONE );
				self._send = false;
			}
		});
	};

	/**
	 * Response error handler
	 *
	 * @method handlerError
	 * @param  {Object} e Error
	 * @return {Undefined} undefined
	 */
	handlerError = function ( e ) {
		this.status       = ERR_REFUSED.test( e.message ) ? 503 : 500;
		this.statusText   = "";
		this.responseText = e.message;
		this._error       = true;
		this._send        = false;
		this.dispatchEvent( "error" );
		state.call( this, DONE );
	};

	/**
	 * XMLHttpRequest
	 *
	 * @method XMLHttpRequest
	 * @constructor
	 * @return {Object} XMLHttpRequest instance
	 */
	XMLHttpRequest = function () {
		this.onabort            = null;
		this.onerror            = null;
		this.onload             = null;
		this.onloadend          = null;
		this.onloadstart        = null;
		this.onreadystatechange = null;
		this.readyState         = UNSENT;
		this.response           = null;
		this.responseText       = "";
		this.responseType       = "";
		this.responseXML        = null;
		this.status             = UNSENT;
		this.statusText         = "";

		// Psuedo private for prototype chain
		this._id                = utility.genId();
		this._error             = false;
		this._headers           = {};
		this._listeners         = {};
		this._params            = {};
		this._request           = null;
		this._resheaders        = {};
		this._send              = false;
	};

	/**
	 * Aborts a request
	 *
	 * @method abort
	 * @return {Object} XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.abort = function () {
		if ( this._request !== null ) {
			this._request.abort();
			this._request = null;
		}

		this.responseText = "";
		this.responseXML  = "";
		this._error       = true;
		this._headers     = {};

		if ( this._send === true || ready.test( this.readyState ) ) {
			this._send = false;
			state.call( this, DONE );
		}

		this.dispatchEvent( "abort" );
		this.readyState = UNSENT;

		return this;
	};

	/**
	 * Adds an event listener to an XMLHttpRequest instance
	 *
	 * @method addEventListener
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.addEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			this._listeners[event] = [];
		}

		this._listeners[event].add( fn );

		return this;
	};

	/**
	 * Dispatches an event
	 *
	 * @method dispatchEvent
	 * @param  {String} event Name of event
	 * @return {Object}       XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.dispatchEvent = function ( event ) {
		var self = this;

		if ( typeof this["on" + event] === "function" ) {
			this["on" + event]();
		}

		if ( this._listeners.hasOwnProperty( event )) {
			array.each( this._listeners[event], function ( i ) {
				if ( typeof i === "function" ) {
					i.call( self );
				}
			});
		}

		return this;
	};

	/**
	 * Gets all response headers
	 *
	 * @method getAllResponseHeaders
	 * @return {Object} Response headers
	 */
	XMLHttpRequest.prototype.getAllResponseHeaders = function () {
		var result = "";

		if ( this.readyState < HEADERS_RECEIVED ) {
			throw new Error( label.error.invalidStateNoHeaders );
		}

		utility.iterate( this._resheaders, function ( v, k ) {
			result += k + ": " + v + "\n";
		});

		return result;
	};

	/**
	 * Gets a specific response header
	 *
	 * @method getResponseHeader
	 * @param  {String} header Header to get
	 * @return {String}        Response header value
	 */
	XMLHttpRequest.prototype.getResponseHeader = function ( header ) {
		var result;

		if ( this.readyState < HEADERS_RECEIVED || this._error ) {
			throw new Error( label.error.invalidStateNoHeaders );
		}

		result = this._resheaders[header] || this._resheaders[header.toLowerCase()];

		return result;
	};

	/**
	 * Prepares an XMLHttpRequest instance to make a request
	 *
	 * @method open
	 * @param  {String}  method   HTTP method
	 * @param  {String}  url      URL to receive request
	 * @param  {Boolean} async    [Optional] Asynchronous request
	 * @param  {String}  user     [Optional] Basic auth username
	 * @param  {String}  password [Optional] Basic auth password
	 * @return {Object}           XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.open = function ( method, url, async, user, password ) {
		var self = this;

		if ( async !== undefined && async !== true) {
			throw new Error( label.error.invalidStateNoSync );
		}

		this.abort();
		this._error  = false;
		this._params = {
			method   : method,
			url      : url,
			async    : async    || true,
			user     : user     || null,
			password : password || null
		};

		utility.iterate( headers, function ( v, k ) {
			self._headers[k] = v;
		});

		this.readyState = OPENED;

		return this;
	};

	/**
	 * Overrides the Content-Type of the request
	 *
	 * @method overrideMimeType
	 * @param  {String} mime Mime type of the request ( media type )
	 * @return {Object}      XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.overrideMimeType = function ( mime ) {
		this._headers["Content-Type"] = mime;

		return this;
	};

	/**
	 * Removes an event listener from an XMLHttpRequest instance
	 *
	 * @method removeEventListener
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.removeEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			return;
		}

		this._listeners[event].remove( fn );

		return this;
	};

	/**
	 * Sends an XMLHttpRequest request
	 *
	 * @method send
	 * @param  {Mixed} data [Optional] Payload to send with the request
	 * @return {Object}     XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.send = function ( data ) {
		data     = data || null;
		var self = this,
		    options, parsed, request, obj;

		if ( this.readyState < OPENED ) {
			throw new Error( label.error.invalidStateNotOpen );
		}
		else if ( this._send ) {
			throw new Error( label.error.invalidStateNotSending );
		}

		parsed      = utility.parse( this._params.url );
		parsed.port = parsed.port || ( parsed.protocol === "https:" ? 443 : 80 );

		if ( this._params.user !== null && this._params.password !== null ) {
			parsed.auth = this._params.user + ":" + this._params.password;
		}

		// Specifying Content-Length accordingly
		if ( regex.put_post.test( this._params.method ) ) {
			this._headers["Content-Length"] = data !== null ? Buffer.byteLength( data ) : 0;
		}

		this._headers.Host = parsed.hostname + ( !regex.http_ports.test( parsed.port ) ? ":" + parsed.port : "" );

		options = {
			hostname : parsed.hostname,
			path     : parsed.path,
			port     : parsed.port,
			method   : this._params.method,
			headers  : this._headers
		};

		if ( parsed.protocol === "https:" ) {
			options.rejectUnauthorized = false;
			options.agent              = false;
		}

		if ( parsed.auth !== undefined ) {
			options.auth = parsed.auth;
		}

		self._send = true;
		self.dispatchEvent( "readystatechange" );

		obj = parsed.protocol === "http:" ? http : https;

		request = obj.request( options, function ( arg ) {
			handler.call( self, arg );
		}).on( "error", function ( e ) {
			handlerError.call( self, e );
		});

		data === null ? request.setSocketKeepAlive( true, 10000 ) : request.write( data, "utf8" );
		this._request = request;
		request.end();

		self.dispatchEvent( "loadstart" );

		return this;
	};

	/**
	 * Sets a request header of an XMLHttpRequest instance
	 *
	 * @method setRequestHeader
	 * @param {String} header HTTP header
	 * @param {String} value  Header value
	 * @return {Object}       XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.setRequestHeader = function ( header, value ) {
		if ( this.readyState !== OPENED ) {
			throw new Error( label.error.invalidStateNotUsable );
		}
		else if ( this._send ) {
			throw new Error( label.error.invalidStateNotSending );
		}

		this._headers[header] = value;

		return this;
	};

	return XMLHttpRequest;
};
