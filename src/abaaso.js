/**
 * Creates a new Abaaso
 *
 * @method abaaso
 * @namespace abaaso
 * @type {function}
 * @param  {string} query Comma delimited DOM query
 * @return {object}       Abaaso instance
 */
function abaaso ( query ) {
	return new Abaaso( query );
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso
 * @private
 * @type {function}
 */
abaaso.prototype.constructor = abaaso;

abaaso.array           = array;
abaaso.callback        = {};
abaaso.client          = {
	activex     : client.activex,
	android     : client.android,
	blackberry  : client.blackberry,
	chrome      : client.chrome,
	firefox     : client.firefox,
	ie          : client.ie,
	ios         : client.ios,
	linux       : client.linux,
	mobile      : client.mobile,
	opera       : client.opera,
	osx         : client.osx,
	playbook    : client.playbook,
	safari      : client.safari,
	tablet      : client.tablet,
	version     : 0,
	webos       : client.webos,
	windows     : client.windows,

	/**
	 * Makes a DELETE request
	 *
	 * @method del
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	del         : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "DELETE", success, failure, null, headers, timeout );
	},

	/**
	 * Makes a GET request
	 *
	 * @method get
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	get         : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "GET", success, failure, null, headers, timeout );
	},

	/**
	 * Makes a HEAD request
	 *
	 * @method headers
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	headers     : function ( uri, success, failure, timeout ) {
		return client.request( uri, "HEAD", success, failure, null, null, timeout );
	},

	/**
	 * Makes a PATCH request
	 *
	 * @method patch
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	patch       : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PATCH", success, failure, args, headers, timeout );
	},

	/**
	 * Makes a POST request
	 *
	 * @method post
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	post        : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "POST", success, failure, args, headers, timeout );
	},

	/**
	 * Makes a POST request
	 *
	 * @method put
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	put         : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PUT", success, failure, args, headers, timeout );
	},

	
	jsonp       : function ( uri, success, failure, callback ) {
		return client.jsonp(uri, success, failure, callback );
	},

	/**
	 * Makes an OPTIONS request
	 *
	 * @method options
	 * @memberOf abaaso.client
	 * @see {@link abaaso.client.request}
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {@link abaaso.Deferred}
	 */
	options     : function ( uri, success, failure, timeout ) {
		return client.request(uri, "OPTIONS", success, failure, null, null, timeout );
	},
	permissions : client.permissions,
	scrollPos   : client.scrollPos,
	size        : client.size
};
abaaso.cookie          = cookie;
abaaso.element         = element;
abaaso.json            = json;
abaaso.label           = label;
abaaso.loading         = {
	/**
	 * @method create
	 * @memberOf abaaso.loading
	 * @see {@link abaaso.utility.loading}
	 * @type {function}
	 */
	create  : utility.loading,

	/**
	 * @name url
	 * @memberOf abaaso.loading
	 * @type {url}
	 */
	url     : null
};
abaaso.math            = math;
abaaso.message         = message;
abaaso.mouse           = mouse;
abaaso.number          = number;
abaaso.regex           = regex;
abaaso.state           = {};
abaaso.string          = string;
abaaso.xml             = xml;

/**
 * @method alias
 * @memberOf abaaso
 * @see {@link abaaso.utility.alias}
 * @type {function}
 */
abaaso.alias           = utility.alias;

/**
 * @method allows
 * @memberOf abaaso
 * @see {@link abaaso.client.allows}
 * @type {function}
 */
abaaso.allows          = client.allows;

/**
 * @method append
 * @param  {string} type Type of Element to create
 * @param  {object} args [Optional] Collection of properties to apply to the new element
 * @param  {mixed}  obj  [Optional] Target Element
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 * @type {function}
 */
abaaso.append          = function ( type, args, obj ) {
	if ( obj instanceof Element ) {
		utility.genId( obj );
	}

	return element.create( type, args, obj, "last" );
};

abaaso.bootstrap       = bootstrap;
abaaso.channel         = channel;

/**
 * @method clear
 * @memberOf abaaso
 * @see {@link abaaso.element.clear}
 * @type {function}
 */
abaaso.clear           = element.clear;

/**
 * @method clearTimer
 * @memberOf abaaso
 * @see {@link abaaso.utility.clearTimers}
 * @type {function}
 */
abaaso.clearTimer      = utility.clearTimers;

/**
 * @method clone
 * @memberOf abaaso
 * @see {@link abaaso.utility.clone}
 * @type {function}
 */
abaaso.clone           = utility.clone;

/**
 * @method coerce
 * @memberOf abaaso
 * @see {@link abaaso.utility.coerce}
 * @type {function}
 */
abaaso.coerce          = utility.coerce;

/**
 * @method compile
 * @memberOf abaaso
 * @see {@link abaaso.utility.compile}
 * @type {function}
 */
abaaso.compile         = utility.compile;

/**
 * @method create
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 * @type {function}
 */
abaaso.create          = element.create;

/**
 * @method css
 * @memberOf abaaso
 * @see {@link abaaso.utility.css}
 * @type {function}
 */
abaaso.css             = utility.css;

/**
 * @method data
 * @memberOf abaaso
 * @see {@link abaaso.datastore.decorator}
 * @type {function}
 */
abaaso.data            = datastore.decorator;

/**
 * @method datalist
 * @memberOf abaaso
 * @see {@link abaaso.datalist.factory}
 * @type {function}
 */
abaaso.datalist        = datalist.factory;

/**
 * @method discard
 * @memberOf abaaso
 * @see {@link abaaso.observer.discard}
 * @type {function}
 */
abaaso.discard         = function ( arg ) {
	return observer.discard( arg );
};

/**
 * @method debounce
 * @memberOf abaaso
 * @see {@link abaaso.utility.debounce}
 * @type {function}
 */
abaaso.debounce        = utility.debounce;

/**
 * @method decode
 * @memberOf abaaso
 * @see {@link abaaso.json.decode}
 * @type {function}
 */
abaaso.decode          = json.decode;

/**
 * @method defer
 * @memberOf abaaso
 * @see {@link abaaso.deferred}
 * @type {function}
 */
abaaso.defer           = deferred;

/**
 * @method define
 * @memberOf abaaso
 * @see {@link abaaso.utility.define}
 * @type {function}
 */
abaaso.define          = utility.define;

/**
 * #method del
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.del             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "DELETE", success, failure, null, headers, timeout );
};

/**
 * @method delay
 * @memberOf abaaso
 * @see {@link abaaso.utility.defer}
 * @type {function}
 */
abaaso.delay           = utility.defer;

/**
 * @method destroy
 * @memberOf abaaso
 * @see {@link abaaso.element.destroy}
 * @type {function}
 */
abaaso.destroy         = element.destroy;

/**
 * @method each
 * @memberOf abaaso
 * @see {@link abaaso.array.each}
 * @type {function}
 */
abaaso.each            = array.each;

/**
 * @method encode
 * @memberOf abaaso
 * @see {@link abaaso.json.encode}
 * @type {function}
 */
abaaso.encode          = json.encode;

/**
 * @method error
 * @memberOf abaaso
 * @see {@link abaaso.utility.error}
 * @type {function}
 */
abaaso.error           = utility.error;

/**
 * @method expire
 * @memberOf abaaso
 * @see {@link abaaso.cache.clean}
 * @type {function}
 */
abaaso.expire          = cache.clean;

/**
 * Milliseconds until `cache.items` is garabage collected
 * @memberOf abaaso
 * @type {number}
 */
abaaso.expires         = 120000;

/**
 * @method fib
 * @memberOf abaaso
 * @see {@link abaaso.utility.fib}
 * @type {function}
 */
abaaso.fib             = utility.fib;

/**
 * @method extend
 * @memberOf abaaso
 * @see {@link abaaso.utility.extend}
 * @type {function}
 */
abaaso.extend          = utility.extend;

abaaso.filter          = filter;

/**
 * @method fire
 * @param {mixed}  obj   Instance firing event
 * @param {string} event Event name
 * @memberOf abaaso
 * @see {@link abaaso.observer.fire}
 * @type {function}
 */
abaaso.fire            = function ( obj, event ) {
	var all  = typeof obj === "object",
	    o    = all ? obj   : this,
	    e    = all ? event : obj,
	    args = [o, e].concat( array.remove( array.cast( arguments ), 0, !all ? 0 : 1 ) );

	return observer.fire.apply( observer, args );
};

/**
 * @method frag
 * @memberOf abaaso
 * @see {@link abaaso.elemeent.frag}
 * @type {function}
 */
abaaso.frag            = element.frag;

/**
 * @method genId
 * @memberOf abaaso
 * @see {@link abaaso.utility.genId}
 * @type {function}
 */
abaaso.genId           = utility.genId;

/**
 * @method get
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.get             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "GET", success, failure, null, headers, timeout );
};

abaaso.grid            = grid,

/**
 * @method guid
 * @memberOf abaaso
 * @see {@link abaaso.utility.uuid}
 * @type {function}
 */
abaaso.guid            = function () {
	return utility.uuid().toUpperCase();
};

/**
 * @method hash
 * @memberOf abaaso
 * @see {@link abaaso.utility.hash}
 * @type {function}
 */
abaaso.hash            = utility.hash,

/**
 * @method headers
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.headers         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "HEAD", success, failure, null, {}, timeout );
};

/**
 * @method hex
 * @memberOf abaaso
 * @see {@link abaaso.utility.hex}
 * @type {function}
 */
abaaso.hex             = utility.hex;

/**
 * @method hidden
 * @memberOf abaaso
 * @see {@link abaaso.element.hidden}
 * @type {function}
 */
abaaso.hidden          = element.hidden;

/**
 * @method hook
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @type {function}
 */
abaaso.hook            = observer.decorate;

/**
 * "abaaso"
 *
 * @memberOf abaaso
 * @type {string}
 */
abaaso.id              = "abaaso";

/**
 * @method iterate
 * @memberOf abaaso
 * @see {@link abaaso.utility.iterate}
 * @type {function}
 */
abaaso.iterate         = utility.iterate;

/**
 * @method jsonp
 * @memberOf abaaso
 * @see {@link abaaso.client.jsonp}
 * @param  {string}   uri      URI to request
 * @param  {function} success  Success handler
 * @param  {function} failure  Failure handler
 * @param  {function} callback Callback function
 * @return {@link abaaso.Deferred}
 */
abaaso.jsonp           = function ( uri, success, failure, callback) {
	return client.jsonp( uri, success, failure, callback );
};

/**
 * @param  {mixed}  obj   Primitive
 * @param  {string} event Event being queried
 * @method listeners
 * @memberOf abaaso
 * @see {@link abaaso.observer.list}
 * @type {function}
 */
abaaso.listeners       = function ( obj, event ) {
	return observer.list( typeof obj === "object" ? obj : this, event );
};

/**
 * @method listenersTotal
 * @memberOf abaaso
 * @see {@link abaaso.observer.sum}
 * @type {function}
 */
abaaso.listenersTotal  = observer.sum;

/**
 * @method log
 * @memberOf abaaso
 * @see {@link abaaso.utility.log}
 * @type {function}
 */
abaaso.log             = utility.log;

/**
 * @method logging
 * @memberOf abaaso
 * @see {@link abaaso.observer.log}
 * @type {function}
 */
abaaso.logging         = observer.log;

abaaso.lru             = lru;

/**
 * @method merge
 * @memberOf abaaso
 * @see {@link abaaso.utility.merge}
 * @type {function}
 */
abaaso.merge           = utility.merge;

/**
 * @method module
 * @memberOf abaaso
 * @see {@link abaaso.utility.module}
 * @type {function}
 */
abaaso.module          = utility.module;

/**
 * @method object
 * @memberOf abaaso
 * @see {@link abaaso.utility.object}
 * @type {function}
 */
abaaso.object          = utility.object;

/**
 * @method observerable
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @type {function}
 */
abaaso.observerable    = observer.decorate;

/**
 * @method on
 * @param  {mixed}    obj      Primitive
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] The id for the listener
 * @param  {string}   scope    [Optional / Recommended] The id of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
 * @memberOf abaaso
 * @see {@link abaaso.observer.add}
 * @type {function}
 */
abaaso.on              = function ( obj, event, listener, id, scope, state ) {
	var all = typeof obj === "object",
	    o, e, l, i, s, st;

	if ( all ) {
		o  = obj;
		e  = event;
		l  = listener;
		i  = id;
		s  = scope;
		st = state;
	}
	else {
		o  = this;
		e  = obj;
		l  = event;
		i  = listener;
		s  = id;
		st = scope;
	}

	if ( s === undefined ) {
		s = o;
	}

	return observer.add( o, e, l, i, s, st );
};

/**
 * @method once
 * @param  {mixed}    obj      Primitive
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] The id for the listener
 * @param  {string}   scope    [Optional / Recommended] The id of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
 * @memberOf abaaso
 * @see {@link abaaso.observer.once}
 * @type {function}
 */
abaaso.once            = function ( obj, event, listener, id, scope, state ) {
	var all = typeof obj === "object",
	    o, e, l, i, s, st;

	if ( all ) {
		o  = obj;
		e  = event;
		l  = listener;
		i  = id;
		s  = scope;
		st = state;
	}
	else {
		o  = this;
		e  = obj;
		l  = event;
		i  = listener;
		s  = id;
		st = scope;
	}

	if ( s === undefined ) {
		s = o;
	}

	return observer.once( o, e, l, i, s, st );
};

/**
 * @method options
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.options         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
};

/**
 * @method parse
 * @memberOf abaaso
 * @see {@link abaaso.utility.parse}
 * @type {function}
 */
abaaso.parse           = utility.parse;

/**
 * @method patch
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.patch           = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PATCH", success, failure, args, headers, timeout );
};

/**
 * @method pause
 * @param {boolean} arg `true` to pause events
 * @memberOf abaaso
 * @see {@link abaaso.observer.pause}
 * @type {function}
 */
abaaso.pause           = function ( arg ) {
	return observer.pause( ( arg !== false ) );
};

/**
 * @method permissions
 * @memberOf abaaso
 * @see {@link abaaso.client.permissions}
 * @type {function}
 */
abaaso.permissions     = client.permissions;

/**
 * @method position
 * @memberOf abaaso
 * @see {@link abaaso.element.position}
 * @type {function}
 */
abaaso.position        = element.position;

/**
 * @method post
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.post            = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "POST", success, failure, args, headers, timeout );
};

/**
 * @method prepend
 * @method prepend
 * @param  {string} type Type of Element to create
 * @param  {object} args [Optional] Collection of properties to apply to the new element
 * @param  {mixed}  obj  [Optional] Target Element
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 * @type {function}
 */
abaaso.prepend         = function ( type, args, obj ) {
	if ( obj instanceof Element ) {
		obj.genId();
	}

	return element.create( type, args, obj, "first" );
};

/**
 * @method promise
 * @memberOf abaaso
 * @see {@link abaaso.Promise}
 * @type {function}
 */
abaaso.promise         = promise.factory;

/**
 * @method property
 * @memberOf abaaso
 * @see {@link abaaso.utility.property}
 * @type {function}
 */
abaaso.property        = utility.property;

/**
 * @method put
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {@link abaaso.Deferred}
 */
abaaso.put             = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PUT", success, failure, args, headers, timeout );
};

/**
 * @method queryString
 * @param {string} key    Query string key
 * @param {string} string [Optional] Query string to parse
 * @memberOf abaaso
 * @see {@link abaaso.utility.queryString}
 * @type {function}
 */
abaaso.queryString     = function ( key, string ) {
	return utility.queryString( key, string );
};

/**
 * @method random
 * @memberOf abaaso
 * @see {@link abaaso.number.random}
 * @type {function}
 */
abaaso.random          = number.random;

/**
 * Ready status
 *
 * @memberOf abaaso
 * @type {boolean}
 */
abaaso.ready           = false;

/**
 * @method reflect
 * @memberOf abaaso
 * @see {@link abaaso.utility.reflect}
 * @type {function}
 */
abaaso.reflect         = utility.reflect;

/**
 * @method repeat
 * @memberOf abaaso
 * @see {@link abaaso.utility.repeat}
 * @type {function}
 */
abaaso.repeat          = utility.repeat;

/**
 * Gets IDs of repeating timers
 *
 * @method repeating
 * @memberOf abaaso
 * @return {array} IDs of repeating timers
 */
abaaso.repeating       = function () {
	return array.keys( utility.repeating );
};

/**
 * @method script
 * @memberOf abaaso
 * @see {@link abaaso.client.script}
 * @type {function}
 */
abaaso.script          = client.script;

/**
 * @method scroll
 * @memberOf abaaso
 * @see {@link abaaso.client.scroll}
 * @type {function}
 */
abaaso.scroll          = client.scroll;

/**
 * @method scrollTo
 * @memberOf abaaso
 * @see {@link abaaso.client.scrollTo}
 * @type {function}
 */
abaaso.scrollTo        = element.scrollTo;

/**
 * @method stylesheet
 * @memberOf abaaso
 * @see {@link abaaso.client.stylesheet}
 * @type {function}
 */
abaaso.stylesheet      = client.stylesheet;

/**
 * @method stop
 * @memberOf abaaso
 * @see {@link abaaso.utility.stop}
 * @type {function}
 */
abaaso.stop            = utility.stop;

/**
 * @method store
 * @deprecated Use `abaaso.data()`
 * @memberOf abaaso
 * @see {@link abaaso.datastore.decorator}
 * @type {function}
 */
abaaso.store           = data.factory;

/**
 * @method sugar
 * @memberOf abaaso
 * @see {@link abaaso.utility.sugar}
 * @type {function}
 */
abaaso.sugar           = utility.sugar;
abaaso.target          = utility.target;
abaaso.tpl             = utility.tpl;
abaaso.un              = function ( obj, event, id, state ) {
	var all = typeof obj === "object",
	    o, e, i, s;

	if ( all ) {
		o = obj;
		e = event;
		i = id;
		s = state;
	}
	else {
		o = this;
		e = obj;
		i = event;
		s = id;
	}

	return observer.remove( o, e, i, s );
};
abaaso.update          = element.update;
abaaso.uuid            = utility.uuid;
abaaso.validate        = validate.test;
abaaso.version         = "{{VERSION}}";
abaaso.walk            = utility.walk;
abaaso.when            = utility.when;

/**
 * Abaaso
 *
 * @constructor
 * @memberOf abaaso
 * @param {string} query Comma delimited DOM query
 */
function Abaaso ( query ) {
	var self = this;

	if ( query && !string.isEmpty( query ) ) {
		array.each( utility.$( query ), function ( i ) {
			self.push( i );
		});
	}
}

// Extending Array
Abaaso.prototype = [];

// Setting prototype & constructor loop
Abaaso.prototype.constructor = Abaaso;

Abaaso.prototype.addClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg );
	});
};

Abaaso.prototype.after = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "after" ) );
	});

	return result;
};

Abaaso.prototype.append = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "last" ) );
	});

	return result;
};

Abaaso.prototype.at = function ( n ) {
	var result = new Abaaso();

	result.push( this[n] );

	return result;
};

Abaaso.prototype.attr = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.attr( i, key, value );
	});
};

Abaaso.prototype.before = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "before" ) );
	});

	return result;
};

Abaaso.prototype.clear = function () {
	return array.each( this, function ( i ) {
		element.clear( i );
	});
};

Abaaso.prototype.create = function ( type, args, position ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, position ) );
	});

	return result;
};

Abaaso.prototype.css = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.css( i, key, value );
	});
};

Abaaso.prototype.data = function ( key, value ) {
	if ( value !== undefined ) {
		return array.each( this, function (i) {
			element.data( i, key, value );
		});
	}
	else {
		return this.map( function (i) {
			return element.data( i, key );
		});
	}
};

Abaaso.prototype.disable = function () {
	return array.each( this, function ( i ) {
		element.disable( i );
	});
};

Abaaso.prototype.dispatch = function ( event, data, bubbles, cancelable ) {
	return array.each( this, function ( i ) {
		element.dispatch( i, event, data, bubbles, cancelable );
	});
};

Abaaso.prototype.destroy = function () {
	array.each( this, function ( i ) {
		element.destroy( i );
	});

	return new Abaaso();
};

Abaaso.prototype.each = function ( arg, async, size ) {
	var self = this;

	return array.each( this, function ( i, idx ) {
		var instance = new Abaaso();

		instance.push( i );
		arg.call( self, instance, idx );
	}, async, size );
};

Abaaso.prototype.enable = function () {
	return array.each( this, function ( i ) {
		element.enable( i );
	});
};

Abaaso.prototype.find = function ( arg ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		array.each( element.find( i, arg ), function ( r ) {
			result.push( r );
		});
	});

	return result;
};

Abaaso.prototype.fire = function () {
	var args = arguments;

	return array.each( this, function ( i ) {
		observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
	});
};

Abaaso.prototype.forEach = function ( arg, async, size ) {
	return this.each( arg, async, size );
};

Abaaso.prototype.genId = function () {
	return array.each( this, function ( i ) {
		utility.genId( i );
	});
};

Abaaso.prototype.get = function ( uri, headers ) {
	return array.each( this, function ( i ) {
		client.request( "GET", uri, headers, function ( arg ) {
			element.html( i, arg );
		}, function ( e ) {
			element.html( i, e );
		});
	});
};

Abaaso.prototype.has = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.has( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.hasClass = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.hasClass( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.html = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		array.each( this, function ( i ) {
			element.html( i, arg );
		});

		return this;
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( element.html( i ) );
		});

		return result;
	}
};

Abaaso.prototype.is = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.is( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isAlphaNum = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isAlphaNum( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isBoolean = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isBoolean( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isChecked = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isChecked( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDate = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDate( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDisabled = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDisabled( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDomain = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDomain( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmail = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmail( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmpty = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmpty( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isHidden = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isHidden( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isIP = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isIP( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isInt = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isInt( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isNumber = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isNumber( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isPhone = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isPhone( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isUrl = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isUrl( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.last = function ( arg ) {
	var result = new Abaaso(),
	    tmp    = array.last( this, arg );

	if ( isNaN( arg ) || arg < 2 ) {
		tmp = tmp !== undefined ? [tmp] : [];
	}

	array.each( tmp, function ( i ) {
		result.push ( i );
	} );

	return result;
};

Abaaso.prototype.limit = function ( start, offset ) {
	var result = new Abaaso();

	array.each( array.limit( this, start, offset ), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.listeners = function ( event ) {
	var result = [];

	array.each( this, function ( i ) {
		result.push( abaaso.listeners( i, event ) );
	});

	return result;
};

Abaaso.prototype.loading = function () {
	return array.each( this, function ( i ) {
		utility.loading( i );
	});
};

Abaaso.prototype.on = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.add( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.once = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.once( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.position = function () {
	var result = [];

	array.each( this, function ( i ) {
		result.push( element.position( i ) );
	});

	return result;
};

Abaaso.prototype.prepend = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "first" ) );
	});

	return result;
};

Abaaso.prototype.remove = function ( start, end ) {
	return array.remove( this, start, end );
};

Abaaso.prototype.removeIf = function ( fn ) {
	return array.removeIf( this, fn );
};

Abaaso.prototype.removeWhile= function ( fn ) {
	return array.removeWhile( this, fn );
};

Abaaso.prototype.removeAttr = function ( key ) {
	return array.each( this, function ( i ) {
		element.removeAttr( i, key );
	});
};

Abaaso.prototype.removeClass= function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg, false );
	});
};

Abaaso.prototype.serialize = function ( string, encode ) {
	return this.map( function ( i ) {
		element.serialize( i, string, encode );
	});
};

Abaaso.prototype.size = function () {
	return this.map( function ( i ) {
		return element.size( i );
	});
};

Abaaso.prototype.text = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		return array.each( this, function ( i ) {
			var tmp;

			tmp = {};
			tmp[i.innerText ? "innerText" : "text"] = arg;
			element.update( i, tmp );
		});
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( string.trim( i[i.innerText ? "innerText" : "text"] ) );
		});

		return result;
	}
};

Abaaso.prototype.tpl = function ( arg ) {
	return array.each( this, function ( i ) {
		utility.tpl ( arg, i );
	});
};

Abaaso.prototype.toggleClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.toggleClass( i, arg );
	});
};

Abaaso.prototype.un = function ( event, id, state ) {
	return array.each( this, function ( i ) {
		observer.remove( i, event, id, state );
	});
};

Abaaso.prototype.update = function ( arg ) {
	return array.each( this, function ( i ) {
		element.update( i, arg );
	});
};

Abaaso.prototype.val = function ( arg ) {
	var a    = [],
	    type = null,
	    same = true;

	array.each( this, function ( i ) {
		if ( type !== null ) {
			same = ( type === i.type );
		}

		type = i.type;

		if ( typeof i.val === "function" ) {
			a.push( element.val( i, arg ) );
		}
	});

	return same ? a[0] : a;
};

Abaaso.prototype.validate = function () {
	return this.map( function ( i ) {
		return element.validate( i );
	});
};
