/** @namespace abaaso.utility */
var utility = {
	/**
	 * MutationObserver instances
	 *
	 * @memberOf abaaso.utility
	 * @type {Object}
	 */
	observers : {},

	/**
	 * Collection of timers
	 *
	 * @memberOf abaaso.utility
	 * @type {Object}
	 */
	timer : {},

	/**
	 * Collection of repeating functions
	 *
	 * @memberOf abaaso.utility
	 * @type {Object}
	 */
	repeating: {},

	/**
	 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
	 *
	 * @method $
	 * @memberOf abaaso.utility
	 * @param  {Mixed} arg Element, HTML, or Comma delimited string of CSS selectors
	 * @return {Mixed}     Element or Array of Elements
	 */
	$ : function ( arg ) {
		var result;

		// Nothing
		if ( !arg ) {
		}
		// Element
		else if ( arg.nodeName ) {
			result = [arg];
		}
		// HTML
		else if ( regex.html.test( arg ) ) {
			result = [element.create( arg )];
		}
		// CSS selector(s)
		else {
			arg = string.trim( arg );

			if ( arg.indexOf( "," ) === -1 ) {
				result = utility.dom( arg );

				if ( result ) {
					if ( isNaN( result.length ) ) {
						result = [result];
					}
				}
				else {
					result = [];
				}
			}
			else {
				result = [];

				array.each( string.explode( arg ), function ( query ) {
					var obj = utility.dom( query );

					if ( obj instanceof Array ) {
						result = result.concat( obj );
					}
					else if ( obj ) {
						result.push( obj );
					}
				} );
			}
		}

		return result;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @memberOf abaaso.utility
	 * @param  {Object} obj    Object receiving aliasing
	 * @param  {Object} origin Object providing structure to obj
	 * @return {Object}        Object receiving aliasing
	 */
	alias : function ( obj, origin ) {
		var o = obj,
		    s = origin;

		utility.iterate( s, function ( v, k ) {
			var getter, setter;

			if ( !( v instanceof RegExp ) && typeof v == "function" ) {
				o[k] = v.bind( o[k] );
			}
			else if ( !( v instanceof RegExp ) && !( v instanceof Array ) && ( v instanceof Object ) ) {
				if ( o[k] === undefined ) {
					o[k] = {};
				}

				utility.alias( o[k], s[k] );
			}
			else {
				getter = function () {
					return s[k];
				};

				setter = function ( arg ) {
					s[k] = arg;
				};

				utility.property( o, k, {enumerable: true, get: getter, set: setter, value: s[k]} );
			}
		} );

		return obj;
	},

	/**
	 * Clears deferred & repeating functions
	 *
	 * @method clearTimers
	 * @memberOf abaaso.utility
	 * @param  {String} id ID of timer( s )
	 * @return {Undefined} undefined
	 */
	clearTimers : function ( id ) {
		if ( id === undefined || string.isEmpty( id ) ) {
			throw new Error( label.error.invalidArguments );
		}

		// deferred
		if ( utility.timer[id] ) {
			clearTimeout( utility.timer[id] );
			delete utility.timer[id];
		}

		// repeating
		if ( utility.repeating[id] ) {
			clearTimeout( utility.repeating[id] );
			delete utility.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @memberOf abaaso.utility
	 * @param  {Object}  obj     Object to clone
	 * @param  {Boolean} shallow [Optional] Create a shallow clone, which doesn't maintain prototypes, default is `false`
	 * @return {Object}          Clone of obj
	 */
	clone : function ( obj, shallow ) {
		var clone;

		if ( shallow === true ) {
			return json.decode( json.encode( obj ) );
		}
		else if ( !obj || regex.primitive.test( typeof obj ) || ( obj instanceof RegExp ) ) {
			return obj;
		}
		else if ( obj instanceof Array ) {
			return obj.slice();
		}
		else if ( !server && !client.ie && obj instanceof Document ) {
			return xml.decode( xml.encode( obj ) );
		}
		else if ( typeof obj.__proto__ != "undefined" ) {
			return utility.extend( obj.__proto__, obj );
		}
		else if ( obj instanceof Object ) {
			// If JSON encoding fails due to recursion, the original Object is returned because it's assumed this is for decoration
			clone = json.encode( obj, true );

			if ( clone !== undefined ) {
				clone = json.decode( clone );

				// Decorating Functions that would be lost with JSON encoding/decoding
				utility.iterate( obj, function ( v, k ) {
					if ( typeof v == "function" ) {
						clone[k] = v;
					}
				} );
			}
			else {
				clone = obj;
			}

			return clone;
		}
		else {
			return obj;
		}
	},

	/**
	 * Coerces a String to a Type
	 *
	 * @method coerce
	 * @memberOf abaaso.utility
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Primitive version of the String
	 */
	coerce : function ( value ) {
		var tmp;

		if ( value === null || value === undefined ) {
			return undefined;
		}
		else if ( value === "true" ) {
			return true;
		}
		else if ( value === "false" ) {
			return false;
		}
		else if ( value === "null" ) {
			return null;
		}
		else if ( value === "undefined" ) {
			return undefined;
		}
		else if ( value === "" ) {
			return value;
		}
		else if ( !isNaN( tmp = Number( value ) ) ) {
			return tmp;
		}
		else if ( regex.json_wrap.test( value ) ) {
			return json.decode( value, true ) || value;
		}
		else {
			return value;
		}
	},

	/**
	 * Recompiles a RegExp by reference
	 *
	 * This is ideal when you need to recompile a regex for use within a conditional statement
	 *
	 * @method compile
	 * @memberOf abaaso.utility
	 * @param  {Object} regex     RegExp
	 * @param  {String} pattern   Regular expression pattern
	 * @param  {String} modifiers Modifiers to apply to the pattern
	 * @return {Boolean}          true
	 */
	compile : function ( reg, pattern, modifiers ) {
		reg.compile( pattern, modifiers );

		return true;
	},

	/**
	 * Creates a CSS stylesheet in the View
	 *
	 * @method css
	 * @memberOf abaaso.utility
	 * @param  {String} content CSS to put in a style tag
	 * @param  {String} media   [Optional] Medias the stylesheet applies to
	 * @return {Object}         Element created or undefined
	 */
	css : function ( content, media ) {
		var ss, css;

		ss = element.create( "style", {type: "text/css", media: media || "print, screen"}, utility.dom( "head" )[0] );

		if ( ss.styleSheet ) {
			ss.styleSheet.cssText = content;
		}
		else {
			css = document.createTextNode( content );
			ss.appendChild( css );
		}

		return ss;
	},

	/**
	 * Debounces a function
	 *
	 * @method debounce
	 * @memberOf abaaso.utility
	 * @param  {Function} fn    Function to execute
	 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {Mixed}    scope `this` context during execution, default is `global`
	 * @return {Undefined}      undefined
	 */
	debounce : function ( fn, ms, scope ) {
		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			setTimeout( function () {
				fn.apply( scope, arguments );
			}, ms );
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
	 * @memberOf abaaso.utility
	 * @param  {String} args  Dot delimited string of the structure
	 * @param  {Mixed}  value Value to set
	 * @param  {Object} obj   Object receiving value
	 * @return {Object}       Object receiving value
	 */
	define : function ( args, value, obj ) {
		args    = args.split( "." );
		var p   = obj,
		    nth = args.length;

		if ( obj === undefined ) {
			obj = this;
		}

		if ( value === undefined ) {
			value = null;
		}

		array.each( args, function ( i, idx ) {
			var num = idx + 1 < nth && !isNaN( number.parse( args[idx + 1], 10 ) ),
			    val = value;

			if ( !isNaN( number.parse( i, 10 ) ) )  {
				i = number.parse( i, 10 );
			}
			
			// Creating or casting
			if ( p[i] === undefined ) {
				p[i] = num ? [] : {};
			}
			else if ( p[i] instanceof Object && num ) {
				p[i] = array.cast( p[i] );
			}
			else if ( p[i] instanceof Object ) {
				// Do nothing
			}
			else if ( p[i] instanceof Array && !num ) {
				p[i] = array.toObject( p[i] );
			}
			else {
				p[i] = {};
			}

			// Setting reference or value
			idx + 1 === nth ? p[i] = val : p = p[i];
		} );

		return obj;
	},

	/**
	 * Defers the execution of Function by at least the supplied milliseconds.
	 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine.
	 *
	 * @method defer
	 * @memberOf abaaso.utility
	 * @param  {Function} fn     Function to defer execution of
	 * @param  {Number}   ms     Milliseconds to defer execution
	 * @param  {Number}   id     [Optional] ID of the deferred function
	 * @param  {Boolean}  repeat [Optional] Describes the execution, default is `false`
	 * @return {String}          ID of the timer
	 */
	defer : function ( fn, ms, id, repeat ) {
		var op;

		ms     = ms || 0;
		repeat = ( repeat === true );

		if ( id !== undefined ) {
			utility.clearTimers( id );
		}
		else {
			id = utility.uuid( true );
		}

		op = function () {
			utility.clearTimers( id );
			fn();
		};

		utility[repeat ? "repeating" : "timer"][id] = setTimeout( op, ms );

		return id;
	},

	/**
	 * Queries DOM with fastest method
	 *
	 * @method dom
	 * @memberOf abaaso.utility
	 * @param  {String} arg DOM query
	 * @return {Mixed}      undefined, Element, or Array of Elements
	 */
	dom : function ( arg ) {
		var result;

		if ( !regex.selector_complex.test( arg ) ) {
			if ( regex.hash.test( arg ) ) {
				result = document.getElementById( arg.replace( regex.hash, "" ) ) || undefined;
			}
			else if ( regex.klass.test( arg ) ) {
				result = array.cast( document.getElementsByClassName( arg.replace( regex.klass, "" ) ) );
			}
			else if ( regex.word.test( arg ) ) {
				result = array.cast( document.getElementsByTagName( arg ) );
			}
			else {
				result = array.cast( document.querySelectorAll( arg ) );
			}
		}
		else {
			result = array.cast( document.querySelectorAll( arg ) );
		}

		return result;
	},

	/**
	 * Encodes a UUID to a DOM friendly ID
	 *
	 * @method domId
	 * @memberOf abaaso.utility
	 * @param  {String} UUID
	 * @return {String} DOM friendly ID
	 */
	domId : function ( arg ) {
		return "a" + arg.replace( /-/g, "" ).slice( 1 );
	},

	/**
	 * Error handling, with history in `error.log`
	 *
	 * @method error
	 * @memberOf abaaso.utility
	 * @param  {Mixed}   e       Error object or message to display
	 * @param  {Array}   args    Array of arguments from the callstack
	 * @param  {Mixed}   scope   Entity that was "this"
	 * @param  {Boolean} warning [Optional] Will display as console warning if true
	 * @return {Undefined}       undefined
	 */
	error : function ( e, args, scope, warning ) {
		var o = {
			"arguments" : args ? array.cast( args ) : [],
			message     : e.message || e,
			number      : e.number ? ( e.number & 0xFFFF ) : undefined,
			scope       : scope,
			stack       : e.stack || undefined,
			timestamp   : new Date().toUTCString(),
			type        : e.type || "TypeError"
		};

		utility.log( o.stack || o.message, warning !== true ? "error" : "warn" );
		utility.error.log.push( o );
		observer.fire( "abaaso", "error", o );

		return undefined;
	},

	/**
	 * Creates a "class" extending Object, with optional decoration
	 *
	 * @method extend
	 * @memberOf abaaso.utility
	 * @param  {Object} obj Object to extend
	 * @param  {Object} arg [Optional] Object for decoration
	 * @return {Object}     Decorated obj
	 */
	extend : function ( obj, arg ) {
		var o;

		if ( obj === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		o = Object.create( obj );

		if ( arg instanceof Object ) {
			utility.merge( o, arg );
		}

		return o;
	},

	/**
	 * Fibonacci calculator
	 *
	 * @method fib
	 * @memberOf abaaso.utility
	 * @param  {Number}  i Number to calculate
	 * @param  {Boolean} r Recursive if `true`
	 * @return {Number}    Calculated number
	 */
	fib : function ( i, r ) {
		if ( r === true ) {
			return i > 1 ? utility.fib( i - 1, r ) + utility.fib( i - 2, r ) : i;
		}
		else {
			return array.last( array.fib( i ) );
		}
	},

	/**
	 * Generates an ID value
	 *
	 * @method genId
	 * @memberOf abaaso.utility
	 * @param  {Mixed}   obj [Optional] Object to receive id
	 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {Mixed}       Object or id
	 */
	genId : function ( obj, dom ) {
		dom = ( dom === true );
		var id;

		if ( obj && ( obj.id || ( obj instanceof Array ) || ( typeof obj == "string" || obj instanceof String ) ) ) {
			return obj;
		}

		if ( dom ) {
			do {
				id = utility.domId( utility.uuid( true ) );
			}
			while ( utility.dom( "#" + id ) );
		}
		else {
			id = utility.domId( utility.uuid( true ) );
		}

		if ( typeof obj == "object" ) {
			obj.id = id;

			return obj;
		}
		else {
			return id;
		}
	},

	/**
	 * Getter / setter for location.hash
	 *
	 * @method hash
	 * @memberOf abaaso.utility
	 * @param  {String} arg Hash to set
	 * @return {String}     Current hash
	 */
	hash : function ( arg ) {
		if ( arg !== undefined ) {
			document.location.hash = arg;
		}

		return document.location.hash;
	},

	/**
	 * Converts RGB to HEX
	 *
	 * @method hex
	 * @memberOf abaaso.utility
	 * @param  {String} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
	 * @return {String}       Color as HEX
	 */
	hex : function ( color ) {
		var digits, red, green, blue, result, i, nth;

		if ( color.charAt( 0 ) === "#" ) {
		    result = color;
		}
		else {
			digits = string.explode( color.replace( /.*\(|\)/g, "" ) );
			red    = number.parse( digits[0] || 0 );
			green  = number.parse( digits[1] || 0 );
			blue   = number.parse( digits[2] || 0 );
			result = ( blue | ( green << 8 ) | ( red << 16 ) ).toString( 16 );

			if ( result.length < 6 ) {
				nth = number.diff( result.length, 6 );
				i   = -1;

				while ( ++i < nth ) {
					result = "0" + result;
				}
			}

			result = "#" + result;
		}

		return result;
	},

	/**
	 * Iterates an Object and executes a function against the properties.
	 * Returning `false` halts iteration.
	 *
	 * @method iterate
	 * @memberOf abaaso.utility
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	iterate : function ( obj, fn ) {
		if ( typeof fn != "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		array.each( Object.keys( obj ), function ( i ) {
			return fn.call( obj, obj[i], i );
		} );

		return obj;
	},

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @memberOf abaaso.utility
	 * @param  {Mixed} obj Element
	 * @return {Mixed}     Element
	 */
	loading : function ( obj ) {
		var l = abaaso.loading;

		if ( l.url === null || !obj ) {
			throw new Error( label.error.invalidArguments );
		}

		// Setting loading image
		if ( !l.image ) {
			l.image     = new Image();
			l.image.src = l.url;
		}

		// Clearing target element
		element.clear( obj );

		// Creating loading image in target element
		element.create( "img", {alt: label.common.loading, src: l.image.src}, element.create( "div", {"class": "loading"}, obj ) );

		return obj;
	},

	/**
	 * Writes argument to the console
	 *
	 * @method log
	 * @memberOf abaaso.utility
	 * @param  {String} arg    String to write to the console
	 * @param  {String} target [Optional] Target console, default is "log"
	 * @return {Undefined}     undefined
	 */
	log : function ( arg, target ) {
		var ts, msg;

		if ( typeof console != "undefined" ) {
			ts  = typeof arg != "object";
			msg = ts ? "[" + new Date().toLocaleTimeString() + "] " + arg : arg;
			console[target || "log"]( msg );
		}
	},

	/**
	 * Merges obj with arg
	 *
	 * @method merge
	 * @memberOf abaaso.utility
	 * @param  {Object} obj Object to decorate
	 * @param  {Object} arg Decoration
	 * @return {Object}     Decorated Object
	 */
	merge : function ( obj, arg ) {
		utility.iterate( arg, function ( v, k ) {
			if ( ( obj[k] instanceof Array ) && ( v instanceof Array ) ) {
				array.merge( obj[k], v );
			}
			else if ( ( obj[k] instanceof Object ) && ( v instanceof Object ) ) {
				utility.iterate( v, function ( x, y ) {
					obj[k][y] = utility.clone( x );
				} );
			}
			else {
				obj[k] = utility.clone( v );
			}
		} );

		return obj;
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @memberOf abaaso.utility
	 * @param  {Mixed} obj Entity or $ query
	 * @return {Mixed}     Entity
	 */
	object : function ( obj ) {
		return typeof obj == "object" ? obj : ( obj.charAt && obj.charAt( 0 ) === "#" ? utility.dom( obj ) : obj );
	},

	/**
	 * Parses a URI into an Object
	 *
	 * @method parse
	 * @memberOf abaaso.utility
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function ( uri ) {
		var obj    = {},
		    parsed = {};

		if ( uri === undefined ) {
			uri = !server ? location.href : "";
		}

		uri = decodeURIComponent( uri );

		if ( !server ) {
			obj = document.createElement( "a" );
			obj.href = uri;
		}
		else {
			obj = url.parse( uri );
		}

		if ( server ) {
			utility.iterate( obj, function ( v, k ) {
				if ( v === null ) {
					obj[k] = undefined;
				}
			} );
		}

		parsed = {
			auth     : server ? null : regex.auth.exec( uri ),
			protocol : obj.protocol || "http:",
			hostname : obj.hostname || "localhost",
			port     : obj.port ? number.parse( obj.port, 10 ) : "",
			pathname : obj.pathname,
			search   : obj.search   || "",
			hash     : obj.hash     || "",
			host     : obj.host     || "localhost"
		};

		// 'cause IE is ... IE; required for data.batch()
		if ( client.ie ) {
			if ( parsed.protocol === ":" ) {
				parsed.protocol = location.protocol;
			}

			if ( string.isEmpty( parsed.hostname ) ) {
				parsed.hostname = location.hostname;
			}

			if ( string.isEmpty( parsed.host ) ) {
				parsed.host = location.host;
			}

			if ( parsed.pathname.charAt( 0 ) !== "/" ) {
				parsed.pathname = "/" + parsed.pathname;
			}
		}

		parsed.auth  = obj.auth || ( parsed.auth === null ? "" : parsed.auth[1] );
		parsed.href  = obj.href || ( parsed.protocol + "//" + ( string.isEmpty( parsed.auth ) ? "" : parsed.auth + "@" ) + parsed.host + parsed.pathname + parsed.search + parsed.hash );
		parsed.path  = obj.path || parsed.pathname + parsed.search;
		parsed.query = utility.queryString( null, parsed.search );

		return parsed;
	},

	/**
	 * Prevents default behavior of an Event
	 *
	 * @method prevent
	 * @memberOf abaaso.utility
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	prevent : function ( e ) {
		if ( typeof e.preventDefault == "function" ) {
			e.preventDefault();
		}

		return e;
	},

	/**
	 * Sets a property on an Object
	 *
	 * @method property
	 * @memberOf abaaso.utility
	 * @param  {Object} obj        Object to decorate
	 * @param  {String} prop       Name of property to set
	 * @param  {Object} descriptor Descriptor of the property
	 * @return {Object}            Object receiving the property
	 */
	property : function ( obj, prop, descriptor ) {
		if ( !( descriptor instanceof Object ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( descriptor.value && descriptor.get ) {
			delete descriptor.value;
		}

		Object.defineProperty( obj, prop, descriptor );

		return obj;
	},

	/**
	 * Sets methods on a prototype object
	 *
	 * Allows hooks to be overwritten
	 *
	 * @method proto
	 * @memberOf abaaso.utility
	 * @param  {Object} obj  Object receiving prototype extension
	 * @param  {String} type Identifier of obj, determines what Arrays to apply
	 * @return {Object}      obj or undefined
	 */
	proto : function ( obj, type ) {
		var target = obj.prototype || obj;

		utility.iterate( prototypes[type], function ( v, k ) {
			if ( !target[k] ) {
				utility.property( target, k, {value: v, configurable: true, writable: true} );
			}
		} );

		return obj;
	},

	/**
	 * Parses a query string & coerces values
	 *
	 * @method queryString
	 * @memberOf abaaso.utility
	 * @param  {String} arg     [Optional] Key to find in the querystring
	 * @param  {String} qstring [Optional] Query string to parse
	 * @return {Mixed}          Value or Object of key:value pairs
	 */
	queryString : function ( arg, qstring ) {
		var obj    = {},
		    result = qstring !== undefined ? ( qstring.indexOf( "?" ) > -1 ? qstring.replace( /.*\?/, "" ) : null ) : ( server || string.isEmpty( location.search ) ? null : location.search.replace( "?", "" ) ),
		    item;

		if ( result !== null && !string.isEmpty( result ) ) {
			result = result.split( "&" );
			array.each( result, function ( prop ) {
				item = prop.split( "=" );

				if ( string.isEmpty( item[0] ) ) {
					return;
				}

				if ( !item[1] ) {
					item[1] = "";
				}
				else if ( string.isNumber( item[1] ) ) {
					item[1] = Number( item[1] );
				}
				else if ( string.isBoolean( item[1] ) ) {
					item[1] = ( item[1] === "true" );
				}

				if ( obj[item[0]] === undefined ) {
					obj[item[0]] = item[1];
				}
				else if ( !( obj[item[0]] instanceof Array ) ) {
					obj[item[0]] = [obj[item[0]]];
					obj[item[0]].push( item[1] );
				}
				else {
					obj[item[0]].push( item[1] );
				}
			} );
		}

		if ( arg !== null && arg !== undefined ) {
			obj = obj[arg];
		}

		return obj;
	},

	/**
	 * Returns an Array of parameters of a Function
	 *
	 * @method reflect
	 * @memberOf abaaso.utility
	 * @param  {Function} arg Function to reflect
	 * @return {Array}        Array of parameters
	 */
	reflect : function ( arg ) {
		if ( arg === undefined ) {
			arg = this || utility.$;
		}

		arg = arg.toString().match( regex.reflect )[1];

		return string.explode( arg );
	},

	/**
	 * Creates a recursive function. Return false from the function to halt recursion.
	 *
	 * @method repeat
	 * @memberOf abaaso.utility
	 * @param  {Function} fn  Function to execute repeatedly
	 * @param  {Number}   ms  Milliseconds to stagger the execution
	 * @param  {String}   id  [Optional] Timeout ID
	 * @param  {Boolean}  now Executes `fn` and then setup repetition, default is `true`
	 * @return {String}       Timeout ID
	 */
	repeat : function ( fn, ms, id, now ) {
		ms  = ms || 10;
		id  = id || utility.uuid( true );
		now = ( now !== false );

		// Could be valid to return false from initial execution
		if ( now && fn() === false ) {
			return;
		}

		// Creating repeating execution
		utility.defer( function () {
			var recursive = function ( fn, ms, id ) {
				var recursive = this;

				if ( fn() !== false ) {
					utility.repeating[id] = setTimeout( function () {
						recursive.call( recursive, fn, ms, id );
					}, ms );
				}
				else {
					delete utility.repeating[id];
				}
			};

			recursive.call( recursive, fn, ms, id );
		}, ms, id, true );

		return id;
	},

	/**
	 * Stops an Event from bubbling, & prevents default behavior
	 *
	 * @method stop
	 * @memberOf abaaso.utility
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	stop : function ( e ) {
		if ( typeof e.stopPropagation == "function" ) {
			e.stopPropagation();
		}

		utility.prevent( e );

		// Assumed to always be valid, even if it's not decorated on `e` ( I'm looking at you IE8 )
		e.returnValue = false;

		return e;
	},

	/**
	 * Creates syntactic sugar by hooking abaaso into native Objects
	 *
	 * @method sugar
	 * @memberOf abaaso.utility
	 * @return {Undefined} undefined
	 */
	sugar : function () {
		utility.proto( Array, "array" );

		if ( typeof Element != "undefined" ) {
			utility.proto( Element, "element" );
		}

		utility.proto( Function, "function" );
		utility.proto( Math,     "math" );
		utility.proto( Number,   "number" );
		utility.proto( String,   "string" );
	},

	/**
	 * Returns the Event target
	 *
	 * @method target
	 * @memberOf abaaso.utility
	 * @param  {Object} e Event
	 * @return {Object} {@link abaaso.Abaaso}
	 */
	target : function ( e ) {
		var obj = new Abaaso();

		obj.push( e.target || e.srcElement );

		return obj;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @memberOf abaaso.utility
	 * @param  {Object} data   JSON Object describing HTML
	 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {Object}        New Element created from the template
	 */
	tpl : function ( arg, target ) {
		var frag;

		if ( typeof arg != "object" || ( !regex.object_undefined.test( typeof target ) && !( target = target.charAt( 0 ) === "#" ? utility.dom( target ) : utility.dom( target )[0] ) ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( target === undefined ) {
			target = utility.dom( "body" )[0];
		}

		frag  = document.createDocumentFragment();

		if ( arg instanceof Array ) {
			array.each( arg, function ( i ) {
				element.html( element.create( array.cast( i, true )[0], frag ), array.cast( i )[0] );
			} );
		}
		else {
			utility.iterate( arg, function ( v, k ) {
				if ( typeof v == "string" ) {
					element.html( element.create( k, undefined, frag ), v );
				}
				else if ( ( v instanceof Array ) || ( v instanceof Object ) ) {
					utility.tpl( v, element.create( k, undefined, frag ) );
				}
			} );
		}

		target.appendChild( frag );

		return array.last( target.childNodes );
	},

	/**
	 * Generates a version 4 UUID
	 *
	 * @method uuid
	 * @memberOf abaaso.utility
	 * @param  {Boolean} safe [Optional] Strips - from UUID
	 * @return {String}       UUID
	 */
	uuid : function ( safe ) {
		var s = function () { return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ); },
		    r = [8, 9, "a", "b"],
		    o;

		o = ( s() + s() + "-" + s() + "-4" + s().substr( 0, 3 ) + "-" + r[Math.floor( Math.random() * 4 )] + s().substr( 0, 3 ) + "-" + s() + s() + s() );

		if ( safe === true ) {
			o = o.replace( /-/g, "" );
		}

		return o;
	},

	/**
	 * Walks `obj` and returns `arg`
	 *
	 * @method  walk
	 * @memberOf abaaso.utility
	 * @param  {Mixed}  obj  Object or Array
	 * @param  {String} arg  String describing the property to return
	 * @return {Mixed}       arg
	 */
	walk : function ( obj, arg ) {
		array.each( arg.replace( /\]$/, "" ).replace( /\]/g, "." ).replace( /\.\./g, "." ).split( /\.|\[/ ), function ( i ) {
			obj = obj[i];
		} );

		return obj;
	},

	/**
	 * Accepts Deferreds or Promises as arguments, or an Array of either
	 *
	 * @method when
	 * @memberOf abaaso.utility
	 * @return {Object} {@link abaaso.Deferred}
	 */
	when : function () {
		var i     = 0,
		    defer = deferred(),
		    args  = array.cast( arguments ),
		    nth;

		// Did we receive an Array? if so it overrides any other arguments
		if ( args[0] instanceof Array ) {
			args = args[0];
		}

		// How many instances to observe?
		nth = args.length;

		// None, end on next tick
		if ( nth === 0 ) {
			defer.resolve( null );
		}
		// Setup and wait
		else {
			array.each( args, function ( p ) {
				p.then( function () {
					if ( ++i === nth && !defer.isResolved() ) {
						if ( args.length > 1 ) {
							defer.resolve( args.map( function ( obj ) {
								return obj.value || obj.promise.value;
							} ) );
						}
						else {
							defer.resolve( args[0].value || args[0].promise.value );
						}
					}
				}, function () {
					if ( !defer.isResolved() ) {
						if ( args.length > 1 ) {
							defer.reject( args.map( function ( obj ) {
								return obj.value || obj.promise.value;
							} ) );
						}
						else {
							defer.reject( args[0].value || args[0].promise.value );
						}
					}
				} );
			} );
		}

		return defer;
	}
};
