/**
 * Creates a new Abaaso
 *
 * @method abaaso
 * @namespace abaaso
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
	 * @param  {string}   uri     URI to request
	 * @param  {function} success Success handler
	 * @param  {function} failure Failure handler
	 * @param  {object}   headers [Optional] HTTP headers
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {object} {@link abaaso.Deferred}
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
	 * @return {object} {@link abaaso.Deferred}
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
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {object} {@link abaaso.Deferred}
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
	 * @return {object} {@link abaaso.Deferred}
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
	 * @return {object} {@link abaaso.Deferred}
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
	 * @return {object} {@link abaaso.Deferred}
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
	 * @param  {number}   timeout [Optional] Timeout
	 * @return {object} {@link abaaso.Deferred}
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
 * @param  {object} obj    Object receiving aliasing
 * @param  {object} origin Object providing structure to obj
 * @return {object}        Object receiving aliasing
 * @see {@link abaaso.utility.alias}
 */
abaaso.alias           = utility.alias;

/**
 * Determines if an HTTP method is allowed
 *
 * @method allows
 * @memberOf abaaso
 * @see {@link abaaso.client.allows}
 * @param  {string} uri  URI to query
 * @param  {string} verb HTTP verb
 * @return {boolean}     `true` if the verb is allowed, undefined if unknown
 */
abaaso.allows          = client.allows;

/**
 * Appends an HTML Element or String
 *
 * @method append
 * @param  {string} type Type of Element to create, or HTML string
 * @param  {object} args [Optional] Collection of properties to apply to the new element
 * @param  {mixed}  obj  [Optional] Target Element
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
 * @param  {mixed} obj Element
 * @return {object}    Element
 * @see {@link abaaso.element.clear}
 */
abaaso.clear           = element.clear;

/**
 * Clears deferred & repeating functions
 *
 * @method clearTimer
 * @memberOf abaaso
 * @see {@link abaaso.utility.clearTimers}
 * @param  {string} id ID of timer( s )
 * @return {undefined} undefined
 */
abaaso.clearTimer      = utility.clearTimers;

/**
 * Clones an Object
 *
 * @method clone
 * @memberOf abaaso
 * @see {@link abaaso.utility.clone}
 * @param  {object}  obj     Object to clone
 * @param  {boolean} shallow [Optional] Create a shallow clone, which doesn't maintain prototypes, default is `false`
 * @return {object}          Clone of obj
 */
abaaso.clone           = utility.clone;

/**
 * Coerces a String to a Type
 *
 * @method coerce
 * @memberOf abaaso
 * @see {@link abaaso.utility.coerce}
 * @param  {string} value String to coerce
 * @return {mixed}        Primitive version of the String
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
 * @param  {object} regex     RegExp
 * @param  {string} pattern   Regular expression pattern
 * @param  {string} modifiers Modifiers to apply to the pattern
 * @return {boolean}          true
 */
abaaso.compile         = utility.compile;

/**
 * Creates an Element in document.body or a target Element.
 * An id is generated if not specified with args
 *
 * @method create
 * @memberOf abaaso
 * @see {@link abaaso.element.create}
 * @param  {string} type   Type of Element to create, or HTML String
 * @param  {object} args   [Optional] Collection of properties to apply to the new element
 * @param  {mixed}  target [Optional] Target Element
 * @param  {mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
 * @return {mixed}         Element that was created, or an Array if `type` is a String of multiple Elements (frag)
 */
abaaso.create          = element.create;

/**
 * Creates a CSS stylesheet in the View
 *
 * @method css
 * @memberOf abaaso
 * @see {@link abaaso.utility.css}
 * @param  {string} content CSS to put in a style tag
 * @param  {string} media   [Optional] Medias the stylesheet applies to
 * @return {object}         Element created or undefined
 */
abaaso.css             = utility.css;

/**
 * Decorates a DataStore on an Object
 *
 * @method data
 * @param  {object} obj  Object
 * @param  {mixed}  recs [Optional] Data to set with this.batch
 * @param  {object} args [Optional] Arguments to set on the store
 * @return {object}      Decorated Object
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
 * @param  {object} target   Element to receive the DataList
 * @param  {object} store    Data store to feed the DataList
 * @param  {mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
 * @param  {object} options  Optional parameters to set on the DataList
 * @return {object} {@link abaaso.DataList}
 */
abaaso.datalist        = datalist.factory;

/**
 * Discards observer events
 *
 * @method discard
 * @memberOf abaaso
 * @param {boolean} `true` to discard events, `false` to re-enable
 * @see {@link abaaso.observer.discard}
 * @param  {boolean} arg [Optional] Boolean indicating if events will be ignored
 * @return {boolean}     Current setting
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
 * @param  {function} fn    Function to execute
 * @param  {number}   ms    Time to wait to execute in milliseconds, default is 1000
 * @param  {mixed}    scope `this` context during execution, default is `global`
 * @return {undefined}      undefined
 */
abaaso.debounce        = utility.debounce;

/**
 * Decodes the argument
 *
 * @method decode
 * @memberOf abaaso
 * @see {@link abaaso.json.decode}
 * @param  {string}  arg    String to parse
 * @param  {boolean} silent [Optional] Silently fail
 * @return {mixed}          Entity resulting from parsing JSON, or undefined
 */
abaaso.decode          = json.decode;

/**
 * Creates a new Deferred
 *
 * @method defer
 * @memberOf abaaso
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.defer           = deferred;

/**
 * Allows deep setting of properties without knowing
 * if the structure is valid
 *
 * @method define
 * @memberOf abaaso
 * @see {@link abaaso.utility.define}
 * @param  {string} args  Dot delimited string of the structure
 * @param  {mixed}  value Value to set
 * @param  {object} obj   Object receiving value
 * @return {object}       Object receiving value
 */
abaaso.define          = utility.define;

/**
 * Makes a DELETE request
 *
 * @method del
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
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
 * @param  {function} fn     Function to defer execution of
 * @param  {number}   ms     Milliseconds to defer execution
 * @param  {number}   id     [Optional] ID of the deferred function
 * @param  {boolean}  repeat [Optional] Describes the execution, default is `false`
 * @return {string}          ID of the timer
 */
abaaso.delay           = utility.defer;

/**
 * Destroys an Element
 *
 * @method destroy
 * @memberOf abaaso
 * @see {@link abaaso.element.destroy}
 * @param  {mixed} obj Element
 * @return {undefined} undefined
 */
abaaso.destroy         = element.destroy;

/**
 * Iterates `obj` and executes `fn` with arguments [`value`, `index`].
 * Returning `false` halts iteration.
 *
 * @method each
 * @memberOf abaaso
 * @see {@link abaaso.array.each}
 * @param  {array}    obj   Array to iterate
 * @param  {function} fn    Function to execute on index values
 * @param  {boolean}  async [Optional] Asynchronous iteration
 * @param  {number}   size  [Optional] Batch size for async iteration, default is 10
 * @return {array}          Array
 */
abaaso.each            = array.each;

/**
 * Encodes the argument as JSON
 *
 * @method encode
 * @memberOf abaaso
 * @see {@link abaaso.json.encode}
 * @param  {mixed}   arg    Entity to encode
 * @param  {boolean} silent [Optional] Silently fail
 * @return {string}         JSON, or undefined
 */
abaaso.encode          = json.encode;

/**
 * Error handling, with history in `error.log`
 *
 * @method error
 * @memberOf abaaso
 * @see {@link abaaso.utility.error}
 * @param  {mixed}   e       Error object or message to display
 * @param  {array}   args    Array of arguments from the callstack
 * @param  {mixed}   scope   Entity that was "this"
 * @param  {boolean} warning [Optional] Will display as console warning if true
 * @return {undefined}       undefined
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
 * @type {number}
 */
abaaso.expires         = 120000;

/**
 * Creates a "class" extending Object, with optional decoration
 *
 * @method extend
 * @memberOf abaaso
 * @see {@link abaaso.utility.extend}
 * @param  {object} obj Object to extend
 * @param  {object} arg [Optional] Object for decoration
 * @return {object}     Decorated obj
 */
abaaso.extend          = utility.extend;

/**
 * Fibonacci calculator
 *
 * @method fib
 * @memberOf abaaso
 * @see {@link abaaso.utility.fib}
 * @param  {number}  i Number to calculate
 * @param  {boolean} r Recursive if `true`
 * @return {number}    Calculated number
 */
abaaso.fib             = utility.fib;

abaaso.filter          = filter;

/**
 * Fires an event
 *
 * @method fire
 * @param {mixed}  obj   Instance firing event
 * @param {string} event Event name
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
 * @param  {array}    obj   Array to iterate
 * @param  {function} fn    Function to execute on index values
 * @param  {boolean}  async [Optional] Asynchronous iteration
 * @param  {number}   size  [Optional] Batch size for async iteration, default is 10
 * @return {array}          Array
 */
abaaso.forEach            = array.each;

/**
 * Creates a document fragment
 *
 * @method frag
 * @memberOf abaaso
 * @see {@link abaaso.elemeent.frag}
 * @param  {string} arg [Optional] innerHTML
 * @return {object}     Document fragment
 */
abaaso.frag            = element.frag;

/**
 * Abaaso prototype, add custom functions here
 *
 * @namespace abaaso.fn
 * @memberOf abaaso
 * @type {object}
 */
abaaso.fn              = Abaaso.prototype;

/**
 * Generates an ID value
 *
 * @method genId
 * @memberOf abaaso
 * @see {@link abaaso.utility.genId}
 * @param  {mixed}   obj [Optional] Object to receive id
 * @param  {boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
 * @return {mixed}       Object or id
 */
abaaso.genId           = utility.genId;

/**
 * Makes a GET request
 *
 * @method get
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
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
 * @param  {string} arg Hash to set
 * @return {string}     Current hash
 */
abaaso.hash            = utility.hash,

/**
 * Makes a HEAD request
 *
 * @method headers
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
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
 * @param  {string} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
 * @return {string}       Color as HEX
 */
abaaso.hex             = utility.hex;

/**
 * Returns a Boolean indidcating if the Object is hidden
 *
 * @method hidden
 * @memberOf abaaso
 * @see {@link abaaso.element.hidden}
 * @param  {mixed} obj Element
 * @return {boolean}   `true` if hidden
 */
abaaso.hidden          = element.hidden;

/**
 * Decorates `obj` with `observer` methods
 *
 * @method hook
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @param  {object} obj Object to decorate
 * @return {object}     Object to decorate
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
 * Iterates an Object and executes a function against the properties.
 * Returning `false` halts iteration.
 *
 * @method iterate
 * @memberOf abaaso
 * @see {@link abaaso.utility.iterate}
 * @param  {object}   obj Object to iterate
 * @param  {function} fn  Function to execute against properties
 * @return {object}       Object
 */
abaaso.iterate         = utility.iterate;

/**
 * Makes a JSONP request
 *
 * @method jsonp
 * @memberOf abaaso
 * @see {@link abaaso.client.jsonp}
 * @param  {string}   uri      URI to request
 * @param  {function} success  Success handler
 * @param  {function} failure  Failure handler
 * @param  {function} callback Callback function
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.jsonp           = function ( uri, success, failure, callback) {
	return client.jsonp( uri, success, failure, callback );
};

/**
 * Gets the listeners for an event
 *
 * @method listeners
 * @param  {mixed}  obj   Primitive
 * @param  {string} event Event being queried
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
 * @param  {mixed} obj [Optional] Entity
 * @return {object}    Object with total listeners per event
 */
abaaso.listenersTotal  = observer.sum;

/**
 * Writes argument to the console
 *
 * @method log
 * @memberOf abaaso
 * @see {@link abaaso.utility.log}
 * @param  {string} arg    String to write to the console
 * @param  {string} target [Optional] Target console, default is "log"
 * @return {undefined}     undefined
 */
abaaso.log             = utility.log;

/**
 * Enables console output of events as they fire
 *
 * @name logging
 * @memberOf abaaso
 * @type {boolean}
 */
abaaso.logging         = observer.log;

abaaso.lru             = lru;

/**
 * Merges obj with arg
 *
 * @method merge
 * @memberOf abaaso
 * @see {@link abaaso.utility.merge}
 * @param  {object} obj Object to decorate
 * @param  {object} arg Decoration
 * @return {object}     Decorated Object
 */
abaaso.merge           = utility.merge;

/**
 * Returns Object, or reference to Element
 *
 * @method object
 * @memberOf abaaso
 * @see {@link abaaso.utility.object}
 * @param  {mixed} obj Entity or $ query
 * @return {mixed}     Entity
 */
abaaso.object          = utility.object;

/**
 * Decorates `obj` with `observer` methods
 *
 * @method observerable
 * @memberOf abaaso
 * @see {@link abaaso.observer.decorate}
 * @deprecated Use `abaaso.hook()`
 * @param  {object} obj Object to decorate
 * @return {object}     Object to decorate
 */
abaaso.observerable    = observer.decorate;

/**
 * Adds a handler for an event
 *
 * @method on
 * @param  {mixed}    obj      Primitive
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] ID for the listener
 * @param  {string}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
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
 * @param  {mixed}    obj      Primitive
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] ID for the listener
 * @param  {string}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
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
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
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
 * @param  {string} uri URI to parse
 * @return {object}     Parsed URI
 */
abaaso.parse           = utility.parse;

/**
 * Makes a PATCH request
 *
 * @method patch
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.patch           = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PATCH", success, failure, args, headers, timeout );
};

/**
 * Pauses observer events, and queues them
 *
 * @method pause
 * @param {boolean} arg `true` to pause events, defaults to `true`
 * @memberOf abaaso
 * @see {@link abaaso.observer.pause}
 * @param  {boolean} arg Boolean indicating if events will be queued
 * @return {boolean}     Current setting
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
 * @param  {string} uri URI to query
 * @return {object}     Contains an Array of available commands, the permission bit and a map
 */
abaaso.permissions     = client.permissions;

/**
 * Finds the position of an element
 *
 * @method position
 * @memberOf abaaso
 * @see {@link abaaso.element.position}
 * @param  {mixed} obj Element
 * @return {array}     Coordinates [left, top, right, bottom]
 */
abaaso.position        = element.position;

/**
 * Makes a POST request
 *
 * @method post
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.post            = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "POST", success, failure, args, headers, timeout );
};

/**
 * Prepends an HTML Element or String
 *
 * @method prepend
 * @param  {string} type Type of Element to create, or HTML string
 * @param  {object} args [Optional] Collection of properties to apply to the new element
 * @param  {mixed}  obj  [Optional] Target Element
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
 * @param  {object} e Event
 * @return {object}   Event
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
 * @return {object} {@link abaaso.Promise}
 */
abaaso.promise         = promise.factory;

/**
 * Sets a property on an Object
 *
 * @method property
 * @memberOf abaaso
 * @see {@link abaaso.utility.property}
 * @param  {object} obj        Object to decorate
 * @param  {string} prop       Name of property to set
 * @param  {object} descriptor Descriptor of the property
 * @return {object}            Object receiving the property
 */
abaaso.property        = utility.property;

/**
 * Makes a PUT request
 *
 * @method put
 * @memberOf abaaso
 * @see {@link abaaso.client.request}
 * @param  {string}   uri     URI to request
 * @param  {function} success Success handler
 * @param  {function} failure Failure handler
 * @param  {mixed}    args    Request body
 * @param  {object}   headers [Optional] HTTP headers
 * @param  {number}   timeout [Optional] Timeout
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.put             = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PUT", success, failure, args, headers, timeout );
};

/**
 * Parses a query string & coerces values
 *
 * @method queryString
 * @param {string} key    Query string key
 * @param {string} string [Optional] Query string to parse
 * @memberOf abaaso
 * @see {@link abaaso.utility.queryString}
 * @param  {string} arg     [Optional] Key to find in the querystring
 * @param  {string} qstring [Optional] Query string to parse
 * @return {mixed}          Value or Object of key:value pairs
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
 * @param  {number} arg Ceiling for random number, default is 100
 * @return {number}     Random number
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
 * Returns an Array of parameters of a Function
 *
 * @method reflect
 * @memberOf abaaso
 * @see {@link abaaso.utility.reflect}
 * @param  {function} arg Function to reflect
 * @return {array}        Array of parameters
 */
abaaso.reflect         = utility.reflect;

/**
 * Creates a recursive function. Return false from the function to halt recursion.
 *
 * @method repeat
 * @memberOf abaaso
 * @see {@link abaaso.utility.repeat}
 * @param  {function} fn  Function to execute repeatedly
 * @param  {number}   ms  Milliseconds to stagger the execution
 * @param  {string}   id  [Optional] Timeout ID
 * @param  {boolean}  now Executes `fn` and then setup repetition, default is `true`
 * @return {string}       Timeout ID
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
 * Creates a script Element to load an external script
 *
 * @method script
 * @memberOf abaaso
 * @see {@link abaaso.client.script}
 * @param  {string} arg    URL to script
 * @param  {object} target [Optional] Element to receive the script
 * @param  {string} pos    [Optional] Position to create the script at within the target
 * @return {object}        Element
 */
abaaso.script          = client.script;

/**
 * Scrolls to a position in the view using a two point bezier curve
 *
 * @method scroll
 * @memberOf abaaso
 * @see {@link abaaso.client.scroll}
 * @param  {array}  dest Coordinates
 * @param  {number} ms   [Optional] Milliseconds to scroll, default is 250, min is 100
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.scroll          = client.scroll;

/**
 * Scrolls to the position of an Element
 *
 * @method scrollTo
 * @memberOf abaaso
 * @see {@link abaaso.client.scrollTo}
 * @param  {object} obj Element to scroll to
 * @param  {number} ms  [Optional] Milliseconds to scroll, default is 250, min is 100
 * @return {object} {@link abaaso.Deferred}
 */
abaaso.scrollTo        = element.scrollTo;

/**
 * Creates a link Element to load an external stylesheet
 *
 * @method stylesheet
 * @memberOf abaaso
 * @see {@link abaaso.client.stylesheet}
 * @param  {string} arg   URL to stylesheet
 * @param  {string} media [Optional] Medias the stylesheet applies to
 * @return {Objecct}      Stylesheet
 */
abaaso.stylesheet      = client.stylesheet;

/**
 * Stops an Event from bubbling, & prevents default behavior
 *
 * @method stop
 * @memberOf abaaso
 * @see {@link abaaso.utility.stop}
 * @param  {object} e Event
 * @return {object}   Event
 */
abaaso.stop            = utility.stop;

/**
 * Decorates a DataStore on an Object
 *
 * @method store
 * @param  {object} obj  Object
 * @param  {mixed}  recs [Optional] Data to set with this.batch
 * @param  {object} args [Optional] Arguments to set on the store
 * @return {object}      Decorated Object
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
 * @param  {object} e Event
 * @return {object}   Event target
 */
abaaso.target          = utility.target;

/**
 * Transforms JSON to HTML and appends to Body or target Element
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {object} data   JSON Object describing HTML
 * @param  {mixed}  target [Optional] Target Element or Element.id to receive the HTML
 * @return {object}        New Element created from the template
 */
abaaso.tpl             = utility.tpl;

/**
 * Removes listeners
 *
 * @method un
 * @param  {mixed}  obj   Primitive
 * @param  {string} event [Optional] Event, or Events being fired ( comma delimited supported )
 * @param  {string} id    [Optional] Listener id
 * @param  {string} state [Optional] Application state, default is current
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
 * @param  {mixed}  obj  Element
 * @param  {object} args Collection of properties
 * @return {object}      Element
 */
abaaso.update          = element.update;

/**
 * Generates a version 4 UUID
 *
 * @method uuid
 * @memberOf abaaso
 * @see {@link abaaso.utility.uuid}
 * @param  {boolean} safe [Optional] Strips - from UUID
 * @return {string}       UUID
 */
abaaso.uuid            = utility.uuid;

/**
 * Validates input
 *
 * @method validate
 * @memberOf abaaso
 * @param  {object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
 * @return {object}      Results
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
