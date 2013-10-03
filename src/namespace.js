/**
 * Creates a new Abaaso
 *
 * @method abaaso
 * @namespace abaaso
 * @param  {Mixed} arg Element, HTML, or comma delimited DOM query
 * @return {Object}    Abaaso instance
 */
function abaaso ( arg ) {
	return new Abaaso( arg );
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso
 * @private
 * @type {Function}
 */
abaaso.prototype.constructor = abaaso;

abaaso.array           = array;

/**
 * JSONP callback registry
 *
 * @memberOf abaaso
 * @type {Object}
 */
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Object}   headers [Optional] HTTP headers
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Object}   headers [Optional] HTTP headers
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {Object}   headers [Optional] HTTP headers
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {Object}   headers [Optional] HTTP headers
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Mixed}    args    Request body
	 * @param  {Object}   headers [Optional] HTTP headers
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success Success handler
	 * @param  {Function} failure Failure handler
	 * @param  {Number}   timeout [Optional] Timeout
	 * @return {Object} {@link abaaso.Deferred}
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

/**
 * Decorates an Element with a `loading` image
 *
 * @namespace abaaso.loading
 * @memberOf abaaso
 */
abaaso.loading         = {
	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method create
	 * @memberOf abaaso.loading
	 * @see {@link abaaso.utility.loading}
	 */
	create  : utility.loading,

	/**
	 * URL to loading icon/image
	 *
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

/**
 * Application state
 *
 * @memberOf abaaso
 * @namespace abaaso.state
 * @type {Object}
 */
abaaso.state           = {};

abaaso.string          = string;
abaaso.xml             = xml;

/**
 * Creates an alias
 *
 * @method alias
 * @memberOf abaaso
 * @param  {Object} obj    Object receiving aliasing
 * @param  {Object} origin Object providing structure to obj
 * @return {Object}        Object receiving aliasing
 * @see {@link abaaso.utility.alias}
 */
abaaso.alias           = utility.alias;

/**
 * Determines if an HTTP method is allowed
 *
 * @method allows
 * @memberOf abaaso
 * @see {@link abaaso.client.allows}
 * @param  {String} uri  URI to query
 * @param  {String} verb HTTP verb
 * @return {Boolean}     `true` if the verb is allowed, undefined if unknown
 */
abaaso.allows          = client.allows;

/**
 * Appends an HTML Element or String
 *
 * @method append
 * @param  {String} type Type of Element to create, or HTML string
 * @param  {Object} args [Optional] Properties to set
 * @param  {Mixed}  obj  [Optional] Target Element
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
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
 * Clears an object's innerHTML, or resets it's state
 *
 * @method clear
 * @memberOf abaaso
 * @param  {Mixed} obj Element
 * @return {Object}    Element
 * @see {@link abaaso.element.clear}
 */
abaaso.clear           = element.clear;

/**
 * Clears deferred & repeating functions
 *
 * @method clearTimer
 * @memberOf abaaso
 * @see {@link abaaso.utility.clearTimers}
 * @param  {String} id ID of timer( s )
 * @return {Undefined} undefined
 */
abaaso.clearTimer      = utility.clearTimers;

/**
 * Clones an Object
 *
 * @method clone
 * @memberOf abaaso
 * @see {@link abaaso.utility.clone}
 * @param  {Object}  obj     Object to clone
 * @param  {Boolean} shallow [Optional] Create a shallow clone, which doesn't maintain prototypes, default is `false`
 * @return {Object}          Clone of obj
 */
abaaso.clone           = utility.clone;

/**
 * Coerces a String to a Type
 *
 * @method coerce
 * @memberOf abaaso
 * @see {@link abaaso.utility.coerce}
 * @param  {String} value String to coerce
 * @return {Mixed}        Primitive version of the String
 */
abaaso.coerce          = utility.coerce;

/**
 * Recompiles a RegExp by reference
 *
 * This is ideal when you need to recompile a regex for use within a conditional statement
 *
 * @method compile
 * @memberOf abaaso
 * @see {@link abaaso.utility.compile}
 * @param  {Object} regex     RegExp
 * @param  {String} pattern   Regular expression pattern
 * @param  {String} modifiers Modifiers to apply to the pattern
 * @return {Boolean}          true
 */
abaaso.compile         = utility.compile;

/**
 * Creates an Element in document.body or a target Element.
 * An id is generated if not specified with args
 *
 * @method create
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 * @param  {String} type   Type of Element to create, or HTML String
 * @param  {Object} args   [Optional] Properties to set
 * @param  {Mixed}  target [Optional] Target Element
 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
 * @return {Mixed}         Element that was created, or an Array if `type` is a String of multiple Elements (frag)
 */
abaaso.create          = element.create;

/**
 * Creates a CSS stylesheet in the View
 *
 * @method css
 * @memberOf abaaso
 * @see {@link abaaso.utility.css}
 * @param  {String} content CSS to put in a style tag
 * @param  {String} media   [Optional] Medias the stylesheet applies to
 * @return {Object}         Element created or undefined
 */
abaaso.css             = utility.css;

/**
 * Decorates a DataStore on an Object
 *
 * @method data
 * @param  {Object} obj  Object
 * @param  {Mixed}  recs [Optional] Data to set with this.batch
 * @param  {Object} args [Optional] Arguments to set on the store
 * @return {Object}      Decorated Object
 * @memberOf abaaso
 * @see {@link abaaso.DataStore}
 */
abaaso.data            = datastore.decorator;

/**
 * Creates a DataList
 *
 * @method datalist
 * @memberOf abaaso
 * @see {@link abaaso.DataList}
 * @param  {Object} target   Element to receive the DataList
 * @param  {Object} store    Data store to feed the DataList
 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
 * @param  {Object} options  Optional parameters to set on the DataList
 * @return {Object} {@link abaaso.DataList}
 */
abaaso.datalist        = datalist.factory;

/**
 * DataStores
 *
 * @memberOf abaaso
 * @type {Object}
 */
abaaso.datastores      = {};

/**
 * Discards observer events
 *
 * @method discard
 * @memberOf abaaso
 * @param {Boolean} `true` to discard events, `false` to re-enable
 * @see {@link abaaso.observer.discard}
 * @param  {Boolean} arg [Optional] Boolean indicating if events will be ignored
 * @return {Boolean}     Current setting
 */
abaaso.discard         = function ( arg ) {
	return observer.discard( arg );
};

/**
 * Debounces a function
 *
 * @method debounce
 * @memberOf abaaso
 * @see {@link abaaso.utility.debounce}
 * @param  {Function} fn    Function to execute
 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
 * @param  {Mixed}    scope `this` context during execution, default is `global`
 * @return {Undefined}      undefined
 */
abaaso.debounce        = utility.debounce;

/**
 * Decodes the argument
 *
 * @method decode
 * @memberOf abaaso
 * @see {@link abaaso.json.decode}
 * @param  {String}  arg    String to parse
 * @param  {Boolean} silent [Optional] Silently fail
 * @return {Mixed}          Entity resulting from parsing JSON, or undefined
 */
abaaso.decode          = json.decode;

/**
 * Creates a new Deferred
 *
 * @method defer
 * @memberOf abaaso
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.defer           = deferred;

/**
 * Allows deep setting of properties without knowing
 * if the structure is valid
 *
 * @method define
 * @memberOf abaaso
 * @see {@link abaaso.utility.define}
 * @param  {String} args  Dot delimited string of the structure
 * @param  {Mixed}  value Value to set
 * @param  {Object} obj   Object receiving value
 * @return {Object}       Object receiving value
 */
abaaso.define          = utility.define;

/**
 * Makes a DELETE request
 *
 * @method del
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.del             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "DELETE", success, failure, null, headers, timeout );
};

/**
 * Defers the execution of Function by at least the supplied milliseconds.
 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine.
 *
 * @method delay
 * @memberOf abaaso
 * @see {@link abaaso.utility.defer}
 * @param  {Function} fn     Function to defer execution of
 * @param  {Number}   ms     Milliseconds to defer execution
 * @param  {Number}   id     [Optional] ID of the deferred function
 * @param  {Boolean}  repeat [Optional] Describes the execution, default is `false`
 * @return {String}          ID of the timer
 */
abaaso.delay           = utility.defer;

/**
 * Destroys an Element
 *
 * @method destroy
 * @memberOf abaaso
 * @see {@link abaaso.element.destroy}
 * @param  {Mixed} obj Element
 * @return {Undefined} undefined
 */
abaaso.destroy         = element.destroy;

/**
 * Iterates `obj` and executes `fn` with arguments [`value`, `index`].
 * Returning `false` halts iteration.
 *
 * @method each
 * @memberOf abaaso
 * @see {@link abaaso.array.each}
 * @param  {Array}    obj   Array to iterate
 * @param  {Function} fn    Function to execute on index values
 * @param  {Boolean}  async [Optional] Asynchronous iteration
 * @param  {Number}   size  [Optional] Batch size for async iteration, default is 10
 * @return {Array}          Array
 */
abaaso.each            = array.each;

/**
 * Encodes the argument as JSON
 *
 * @method encode
 * @memberOf abaaso
 * @see {@link abaaso.json.encode}
 * @param  {Mixed}   arg    Entity to encode
 * @param  {Boolean} silent [Optional] Silently fail
 * @return {String}         JSON, or undefined
 */
abaaso.encode          = json.encode;

/**
 * Error handling, with history in `error.log`
 *
 * @method error
 * @memberOf abaaso
 * @see {@link abaaso.utility.error}
 * @param  {Mixed}   e       Error object or message to display
 * @param  {Array}   args    Array of arguments from the callstack
 * @param  {Mixed}   scope   Entity that was "this"
 * @param  {Boolean} warning [Optional] Will display as console warning if true
 * @return {Undefined}       undefined
 */
abaaso.error           = utility.error;

/**
 * Garbage collector for the cached items
 *
 * @method expire
 * @memberOf abaaso
 * @see {@link abaaso.cache.clean}
 */
abaaso.expire          = cache.clean;

/**
 * Milliseconds until private HTTP cache is garbage collected
 *
 * @memberOf abaaso
 * @type {Number}
 */
abaaso.expires         = 120000;

/**
 * Creates a "class" extending Object, with optional decoration
 *
 * @method extend
 * @memberOf abaaso
 * @see {@link abaaso.utility.extend}
 * @param  {Object} obj Object to extend
 * @param  {Object} arg [Optional] Object for decoration
 * @return {Object}     Decorated obj
 */
abaaso.extend          = utility.extend;

/**
 * Fibonacci calculator
 *
 * @method fib
 * @memberOf abaaso
 * @see {@link abaaso.utility.fib}
 * @param  {Number}  i Number to calculate
 * @param  {Boolean} r Recursive if `true`
 * @return {Number}    Calculated number
 */
abaaso.fib             = utility.fib;

abaaso.filter          = filter;

/**
 * Fires an event
 *
 * @method fire
 * @param {Mixed}  obj   Instance firing event
 * @param {String} event Event name
 * @memberOf abaaso
 * @see {@link abaaso.observer.fire}
 */
abaaso.fire            = function ( obj, event ) {
	var all  = typeof obj === "object",
	    o    = all ? obj   : this,
	    e    = all ? event : obj,
	    args = [o, e].concat( array.remove( array.cast( arguments ), 0, !all ? 0 : 1 ) );

	return observer.fire.apply( observer, args );
};

/**
 * Iterates `obj` and executes `fn` with arguments [`value`, `index`].
 * Returning `false` halts iteration.
 *
 * @method forEach
 * @memberOf abaaso
 * @see {@link abaaso.array.each}
 * @param  {Array}    obj   Array to iterate
 * @param  {Function} fn    Function to execute on index values
 * @param  {Boolean}  async [Optional] Asynchronous iteration
 * @param  {Number}   size  [Optional] Batch size for async iteration, default is 10
 * @return {Array}          Array
 */
abaaso.forEach            = array.each;

/**
 * Creates a document fragment
 *
 * @method frag
 * @memberOf abaaso
 * @see {@link abaaso.elemeent.frag}
 * @param  {String} arg [Optional] innerHTML
 * @return {Object}     Document fragment
 */
abaaso.frag            = element.frag;

/**
 * Abaaso prototype, add custom functions here
 *
 * @namespace abaaso.fn
 * @memberOf abaaso
 * @type {Object}
 */
abaaso.fn              = Abaaso.prototype;

/**
 * Generates an ID value
 *
 * @method genId
 * @memberOf abaaso
 * @see {@link abaaso.utility.genId}
 * @param  {Mixed}   obj [Optional] Object to receive id
 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
 * @return {Mixed}       Object or id
 */
abaaso.genId           = utility.genId;

/**
 * Makes a GET request
 *
 * @method get
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.get             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "GET", success, failure, null, headers, timeout );
};

abaaso.grid            = grid,

/**
 * Generates a capital case version 4 UUID
 *
 * @method guid
 * @memberOf abaaso
 * @see {@link abaaso.utility.uuid}
 */
abaaso.guid            = function () {
	return utility.uuid().toUpperCase();
};

/**
 * Getter / setter for location.hash
 *
 * @method hash
 * @memberOf abaaso
 * @see {@link abaaso.utility.hash}
 * @param  {String} arg Hash to set
 * @return {String}     Current hash
 */
abaaso.hash            = utility.hash,

/**
 * Makes a HEAD request
 *
 * @method headers
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.headers         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "HEAD", success, failure, null, {}, timeout );
};

/**
 * Converts RGB to HEX
 *
 * @method hex
 * @memberOf abaaso
 * @see {@link abaaso.utility.hex}
 * @param  {String} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
 * @return {String}       Color as HEX
 */
abaaso.hex             = utility.hex;

/**
 * Returns a Boolean indidcating if the Object is hidden
 *
 * @method hidden
 * @memberOf abaaso
 * @see {@link abaaso.element.hidden}
 * @param  {Mixed} obj Element
 * @return {Boolean}   `true` if hidden
 */
abaaso.hidden          = element.hidden;

/**
 * Decorates `obj` with `observer` methods
 *
 * @method hook
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @param  {Object} obj Object to decorate
 * @return {Object}     Object to decorate
 */
abaaso.hook            = observer.decorate;

/**
 * "abaaso"
 *
 * @memberOf abaaso
 * @type {String}
 */
abaaso.id              = "abaaso";

/**
 * Iterates an Object and executes a function against the properties.
 * Returning `false` halts iteration.
 *
 * @method iterate
 * @memberOf abaaso
 * @see {@link abaaso.utility.iterate}
 * @param  {Object}   obj Object to iterate
 * @param  {Function} fn  Function to execute against properties
 * @return {Object}       Object
 */
abaaso.iterate         = utility.iterate;

/**
 * Makes a JSONP request
 *
 * @method jsonp
 * @memberOf abaaso
 * @see {@link abaaso.client.jsonp}
 * @param  {String}   uri      URI to request
 * @param  {Function} success  Success handler
 * @param  {Function} failure  Failure handler
 * @param  {Function} callback Callback function
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.jsonp           = function ( uri, success, failure, callback) {
	return client.jsonp( uri, success, failure, callback );
};

/**
 * Gets the listeners for an event
 *
 * @method listeners
 * @param  {Mixed}  obj   Primitive
 * @param  {String} event Event being queried
 * @method listeners
 * @memberOf abaaso
 * @see {@link abaaso.observer.list}
 */
abaaso.listeners       = function ( obj, event ) {
	return observer.list( typeof obj === "object" ? obj : this, event );
};

/**
 * Returns the sum of active listeners for one or all Objects
 *
 * @method listenersTotal
 * @memberOf abaaso
 * @see {@link abaaso.observer.sum}
 * @param  {Mixed} obj [Optional] Entity
 * @return {Object}    Object with total listeners per event
 */
abaaso.listenersTotal  = observer.sum;

/**
 * Writes argument to the console
 *
 * @method log
 * @memberOf abaaso
 * @see {@link abaaso.utility.log}
 * @param  {String} arg    String to write to the console
 * @param  {String} target [Optional] Target console, default is "log"
 * @return {Undefined}     undefined
 */
abaaso.log             = utility.log;

/**
 * Enables console output of events as they fire
 *
 * @name logging
 * @memberOf abaaso
 * @type {Boolean}
 */
abaaso.logging         = observer.log;

abaaso.lru             = lru;

/**
 * Merges obj with arg
 *
 * @method merge
 * @memberOf abaaso
 * @see {@link abaaso.utility.merge}
 * @param  {Object} obj Object to decorate
 * @param  {Object} arg Decoration
 * @return {Object}     Decorated Object
 */
abaaso.merge           = utility.merge;

/**
 * Returns Object, or reference to Element
 *
 * @method object
 * @memberOf abaaso
 * @see {@link abaaso.utility.object}
 * @param  {Mixed} obj Entity or $ query
 * @return {Mixed}     Entity
 */
abaaso.object          = utility.object;

/**
 * Decorates `obj` with `observer` methods
 *
 * @method observerable
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @deprecated Use `abaaso.hook()`
 * @param  {Object} obj Object to decorate
 * @return {Object}     Object to decorate
 */
abaaso.observerable    = observer.decorate;

/**
 * Adds a handler for an event
 *
 * @method on
 * @param  {Mixed}    obj      Primitive
 * @param  {String}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {Function} listener Event handler
 * @param  {String}   id       [Optional / Recommended] ID for the listener
 * @param  {String}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {String}   st       [Optional] Application state, default is current
 * @memberOf abaaso
 * @see {@link abaaso.observer.add}
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
 * Adds a listener for a single execution
 *
 * @method once
 * @param  {Mixed}    obj      Primitive
 * @param  {String}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {Function} listener Event handler
 * @param  {String}   id       [Optional / Recommended] ID for the listener
 * @param  {String}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {String}   st       [Optional] Application state, default is current
 * @memberOf abaaso
 * @see {@link abaaso.observer.once}
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
 * Makes an OPTIONS request
 *
 * @method options
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.options         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
};

/**
 * Parses a URI into an Object
 *
 * @method parse
 * @memberOf abaaso
 * @see {@link abaaso.utility.parse}
 * @param  {String} uri URI to parse
 * @return {Object}     Parsed URI
 */
abaaso.parse           = utility.parse;

/**
 * Makes a PATCH request
 *
 * @method patch
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Mixed}    args    Request body
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.patch           = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PATCH", success, failure, args, headers, timeout );
};

/**
 * Pauses observer events, and queues them
 *
 * @method pause
 * @param {Boolean} arg `true` to pause events, defaults to `true`
 * @memberOf abaaso
 * @see {@link abaaso.observer.pause}
 * @param  {Boolean} arg Boolean indicating if events will be queued
 * @return {Boolean}     Current setting
 */
abaaso.pause           = function ( arg ) {
	return observer.pause( arg !== false );
};

/**
 * Returns the permission of the cached URI
 *
 * @method permissions
 * @memberOf abaaso
 * @see {@link abaaso.client.permissions}
 * @param  {String} uri URI to query
 * @return {Object}     Contains an Array of available commands, the permission bit and a map
 */
abaaso.permissions     = client.permissions;

/**
 * Finds the position of an element
 *
 * @method position
 * @memberOf abaaso
 * @see {@link abaaso.element.position}
 * @param  {Mixed} obj Element
 * @return {Array}     Coordinates [left, top, right, bottom]
 */
abaaso.position        = element.position;

/**
 * Makes a POST request
 *
 * @method post
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Mixed}    args    Request body
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.post            = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "POST", success, failure, args, headers, timeout );
};

/**
 * Prepends an HTML Element or String
 *
 * @method prepend
 * @param  {String} type Type of Element to create, or HTML string
 * @param  {Object} args [Optional] Properties to set
 * @param  {Mixed}  obj  [Optional] Target Element
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 */
abaaso.prepend         = function ( type, args, obj ) {
	if ( obj instanceof Element ) {
		obj.genId();
	}

	return element.create( type, args, obj, "first" );
};

/**
 * Prevents default behavior of an Event
 *
 * @method prevent
 * @memberOf abaaso.utility
 * @param  {Object} e Event
 * @return {Object}   Event
 * @memberOf abaaso
 * @see {@link abaaso.utility.prevent}
 */
abaaso.prevent         = utility.prevent;

/**
 * Creates a new Promise
 *
 * @method promise
 * @memberOf abaaso
 * @see {@link abaaso.Promise}
 * @return {Object} {@link abaaso.Promise}
 */
abaaso.promise         = promise.factory;

/**
 * Sets a property on an Object
 *
 * @method property
 * @memberOf abaaso
 * @see {@link abaaso.utility.property}
 * @param  {Object} obj        Object to decorate
 * @param  {String} prop       Name of property to set
 * @param  {Object} descriptor Descriptor of the property
 * @return {Object}            Object receiving the property
 */
abaaso.property        = utility.property;

/**
 * Makes a PUT request
 *
 * @method put
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {String}   uri     URI to request
 * @param  {Function} success Success handler
 * @param  {Function} failure Failure handler
 * @param  {Mixed}    args    Request body
 * @param  {Object}   headers [Optional] HTTP headers
 * @param  {Number}   timeout [Optional] Timeout
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.put             = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PUT", success, failure, args, headers, timeout );
};

/**
 * Parses a query string & coerces values
 *
 * @method queryString
 * @param {String} key    Query string key
 * @param {String} string [Optional] Query string to parse
 * @memberOf abaaso
 * @see {@link abaaso.utility.queryString}
 * @param  {String} arg     [Optional] Key to find in the querystring
 * @param  {String} qstring [Optional] Query string to parse
 * @return {Mixed}          Value or Object of key:value pairs
 */
abaaso.queryString     = function ( key, string ) {
	return utility.queryString( key, string );
};

/**
 * Generates a random number between 0 and `arg`
 *
 * @method random
 * @memberOf abaaso
 * @see {@link abaaso.number.random}
 * @param  {Number} arg Ceiling for random number, default is 100
 * @return {Number}     Random number
 */
abaaso.random          = number.random;

/**
 * Ready status
 *
 * @memberOf abaaso
 * @type {Boolean}
 */
abaaso.ready           = false;

/**
 * Returns an Array of parameters of a Function
 *
 * @method reflect
 * @memberOf abaaso
 * @see {@link abaaso.utility.reflect}
 * @param  {Function} arg Function to reflect
 * @return {Array}        Array of parameters
 */
abaaso.reflect         = utility.reflect;

/**
 * Creates a recursive function. Return false from the function to halt recursion.
 *
 * @method repeat
 * @memberOf abaaso
 * @see {@link abaaso.utility.repeat}
 * @param  {Function} fn  Function to execute repeatedly
 * @param  {Number}   ms  Milliseconds to stagger the execution
 * @param  {String}   id  [Optional] Timeout ID
 * @param  {Boolean}  now Executes `fn` and then setup repetition, default is `true`
 * @return {String}       Timeout ID
 */
abaaso.repeat          = utility.repeat;

/**
 * Gets IDs of repeating timers
 *
 * @method repeating
 * @memberOf abaaso
 * @return {Array} IDs of repeating timers
 */
abaaso.repeating       = function () {
	return array.keys( utility.repeating );
};

/**
 * Creates a script Element to load an external script
 *
 * @method script
 * @memberOf abaaso
 * @see {@link abaaso.client.script}
 * @param  {String} arg    URL to script
 * @param  {Object} target [Optional] Element to receive the script
 * @param  {String} pos    [Optional] Position to create the script at within the target
 * @return {Object}        Element
 */
abaaso.script          = client.script;

/**
 * Scrolls to a position in the view using a two point bezier curve
 *
 * @method scroll
 * @memberOf abaaso
 * @see {@link abaaso.client.scroll}
 * @param  {Array}  dest Coordinates
 * @param  {Number} ms   [Optional] Milliseconds to scroll, default is 250, min is 100
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.scroll          = client.scroll;

/**
 * Scrolls to the position of an Element
 *
 * @method scrollTo
 * @memberOf abaaso
 * @see {@link abaaso.client.scrollTo}
 * @param  {Object} obj        Element to scroll to
 * @param  {Number} ms         [Optional] Milliseconds to scroll, default is 250, min is 100
 * @param  {Number} offsetTop  [Optional] Offset from top of Element
 * @param  {Number} offsetLeft [Optional] Offset from left of Element
 * @return {Object} {@link abaaso.Deferred}
 */
abaaso.scrollTo        = element.scrollTo;

/**
 * Creates a link Element to load an external stylesheet
 *
 * @method stylesheet
 * @memberOf abaaso
 * @see {@link abaaso.client.stylesheet}
 * @param  {String} arg   URL to stylesheet
 * @param  {String} media [Optional] Medias the stylesheet applies to
 * @return {Object}      Stylesheet
 */
abaaso.stylesheet      = client.stylesheet;

/**
 * Stops an Event from bubbling, & prevents default behavior
 *
 * @method stop
 * @memberOf abaaso
 * @see {@link abaaso.utility.stop}
 * @param  {Object} e Event
 * @return {Object}   Event
 */
abaaso.stop            = utility.stop;

/**
 * Decorates a DataStore on an Object
 *
 * @method store
 * @param  {Object} obj  Object
 * @param  {Mixed}  recs [Optional] Data to set with this.batch
 * @param  {Object} args [Optional] Arguments to set on the store
 * @return {Object}      Decorated Object
 * @deprecated Use `abaaso.data()`
 * @memberOf abaaso
 * @see {@link abaaso.datastore.decorator}
 */
abaaso.store           = datastore.decorator;

/**
 * Creates syntactic sugar by hooking abaaso into native Objects
 *
 * @method sugar
 * @memberOf abaaso
 * @see {@link abaaso.utility.sugar}
 */
abaaso.sugar           = utility.sugar;

/**
 * Returns the Event target
 *
 * @method target
 * @memberOf abaaso
 * @see {@link abaaso.utility.target}
 * @param  {Object} e Event
 * @return {Object}   Event target
 */
abaaso.target          = utility.target;

/**
 * Transforms JSON to HTML and appends to Body or target Element
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {Object} data   JSON Object describing HTML
 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
 * @return {Object}        New Element created from the template
 */
abaaso.tpl             = utility.tpl;

/**
 * Removes listeners
 *
 * @method un
 * @param  {Mixed}  obj   Primitive
 * @param  {String} event [Optional] Event, or Events being fired ( comma delimited supported )
 * @param  {String} id    [Optional] Listener id
 * @param  {String} state [Optional] Application state, default is current
 * @memberOf abaaso
 * @see {@link abaaso.observer.remove}
 */
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

/**
 * Updates an Element
 *
 * @method update
 * @memberOf abaaso
 * @see {@link abaaso.element.update}
 * @param  {Mixed}  obj  Element
 * @param  {Object} args Properties to set
 * @return {Object}      Element
 */
abaaso.update          = element.update;

/**
 * Generates a version 4 UUID
 *
 * @method uuid
 * @memberOf abaaso
 * @see {@link abaaso.utility.uuid}
 * @param  {Boolean} safe [Optional] Strips - from UUID
 * @return {String}       UUID
 */
abaaso.uuid            = utility.uuid;

/**
 * Validates input
 *
 * @method validate
 * @memberOf abaaso
 * @param  {Object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
 * @return {Object}      Results
 */
abaaso.validate        = validate.test;

/**
 * Version of abaaso
 *
 * @memberOf abaaso
 * @type {String}
 */
abaaso.version         = "{{VERSION}}";

/**
 * Walks `obj` and returns `arg`
 *
 * @method walk
 * @memberOf abaaso
 * @see {@link abaaso.utility.walk}
 */
abaaso.walk            = utility.walk;

/**
 * Accepts Deferreds or Promises as arguments, or an Array of either
 *
 * @method when
 * @memberOf abaaso
 * @see {@link abaaso.utility.when}
 */
abaaso.when            = utility.when;
