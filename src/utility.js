/** @namespace abaaso.utility */
var utility = {
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
	 * @param  {string} arg Comma delimited string of CSS selectors
	 * @return {mixed}      Element or Array of Elements
	 */
	$ : function ( arg ) {
		var result;

		if ( !arg ) {
			return;
		}

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
			});
		}

		return result;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @memberOf abaaso.utility
	 * @param  {object} obj    Object receiving aliasing
	 * @param  {object} origin Object providing structure to obj
	 * @return {object}        Object receiving aliasing
	 */
	alias : function ( obj, origin ) {
		var o = obj,
		    s = origin;

		utility.iterate( s, function ( v, k ) {
			var getter, setter;

			if ( !( v instanceof RegExp ) && typeof v === "function" ) {
				o[k] = v.bind( o[k] );
			}
			else if ( !(v instanceof RegExp ) && !(v instanceof Array ) && v instanceof Object ) {
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
		});

		return obj;
	},

	/**
	 * Clears deferred & repeating functions
	 *
	 * @method clearTimers
	 * @memberOf abaaso.utility
	 * @param  {string} id ID of timer( s )
	 * @return {undefined} undefined
	 */
	clearTimers : function ( id ) {
		if ( id === undefined || string.isEmpty( id ) ) {
			throw new Error( label.error.invalidArguments );
		}

		// deferred
		if ( utility.timer[id] !== undefined ) {
			clearTimeout( utility.timer[id] );
			delete utility.timer[id];
		}

		// repeating
		if ( utility.repeating[id] !== undefined ) {
			clearTimeout( utility.repeating[id] );
			delete utility.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @memberOf abaaso.utility
	 * @param  {object}  obj     Object to clone
	 * @param  {boolean} shallow [Optional] Create a shallow clone, which doesn't maintain prototypes, default is `false`
	 * @return {object}          Clone of obj
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
		else if ( typeof obj.__proto__ !== "undefined" ) {
			return utility.extend( obj.__proto__, obj );
		}
		else if ( obj instanceof Object ) {
			// If JSON encoding fails due to recursion, the original Object is returned because it's assumed this is for decoration
			clone = json.encode( obj, true );

			if ( clone !== undefined ) {
				clone = json.decode( clone );

				// Decorating Functions that would be lost with JSON encoding/decoding
				utility.iterate( obj, function ( v, k ) {
					if ( typeof v === "function" ) {
						clone[k] = v;
					}
				});
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
	 * @param  {string} value String to coerce
	 * @return {mixed}        Primitive version of the String
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
	 * @param  {object} regex     RegExp
	 * @param  {string} pattern   Regular expression pattern
	 * @param  {string} modifiers Modifiers to apply to the pattern
	 * @return {boolean}          true
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
	 * @param  {string} content CSS to put in a style tag
	 * @param  {string} media   [Optional] Medias the stylesheet applies to
	 * @return {object}         Element created or undefined
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
	 * @param  {function} fn    Function to execute
	 * @param  {number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {mixed}    scope `this` context during execution, default is `global`
	 * @return {undefined}      undefined
	 */
	debounce : function ( fn, ms, scope ) {
		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			setTimeout( function () {
				fn.apply( scope, arguments );
			}, ms);
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
	 * @memberOf abaaso.utility
	 * @param  {string} args  Dot delimited string of the structure
	 * @param  {mixed}  value Value to set
	 * @param  {object} obj   Object receiving value
	 * @return {object}       Object receiving value
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
		});

		return obj;
	},

	/**
	 * Defers the execution of Function by at least the supplied milliseconds
	 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
	 *
	 * @method defer
	 * @memberOf abaaso.utility
	 * @param  {function} fn     Function to defer execution of
	 * @param  {number}   ms     Milliseconds to defer execution
	 * @param  {number}   id     [Optional] ID of the deferred function
	 * @param  {boolean}  repeat [Optional] Describes the execution, default is `false`
	 * @return {string}          ID of the timer
	 */
	defer : function ( fn, ms, id, repeat ) {
		var op;

		ms     = ms || 0;
		id     = id || utility.uuid( true );
		repeat = ( repeat === true );

		op = function () {
			utility.clearTimers( id );
			fn();
		};

		utility.clearTimers( id );
		utility[repeat ? "repeating" : "timer"][id] = setTimeout( op, ms );

		return id;
	},

	/**
	 * Queries DOM with fastest method
	 *
	 * @method dom
	 * @memberOf abaaso.utility
	 * @param  {string} arg DOM query
	 * @return {mixed}      undefined, Element, or Array of Elements
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
	 * @param  {string} UUID
	 * @return {string} DOM friendly ID
	 */
	domId : function ( arg ) {
		return "a" + arg.replace( /-/g, "" ).slice( 1 );
	},

	/**
	 * Error handling, with history in .log
	 *
	 * @method error
	 * @memberOf abaaso.utility
	 * @param  {mixed}   e       Error object or message to display
	 * @param  {array}   args    Array of arguments from the callstack
	 * @param  {mixed}   scope   Entity that was "this"
	 * @param  {boolean} warning [Optional] Will display as console warning if true
	 * @return {undefined}       undefined
	 */
	error : function ( e, args, scope, warning ) {
		warning = ( warning === true );
		var o   = {
			"arguments" : args !== undefined ? array.cast( args ) : [],
			message     : e.message || e,
			number      : e.number !== undefined ? ( e.number & 0xFFFF ) : undefined,
			scope       : scope,
			stack       : e.stack   || undefined,
			timestamp   : new Date().toUTCString(),
			type        : e.type    || "TypeError"
		};

		utility.log( o.stack || o.message, !warning ? "error" : "warn" );
		utility.error.log.push( o );
		observer.fire( "abaaso", "error", o );

		return undefined;
	},

	/**
	 * Creates a "class" extending Object, with optional decoration
	 *
	 * @method extend
	 * @memberOf abaaso.utility
	 * @param  {object} obj Object to extend
	 * @param  {object} arg [Optional] Object for decoration
	 * @return {object}     Decorated obj
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
	 * @param  {number}  i Number to calculate
	 * @param  {boolean} r Recursive if `true`
	 * @return {number}    Calculated number
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
	 * @param  {mixed}   obj [Optional] Object to receive id
	 * @param  {boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {mixed}       Object or id
	 */
	genId : function ( obj, dom ) {
		dom = ( dom === true );
		var id;

		if ( obj !== undefined && ( ( obj.id !== undefined && obj.id !== "" ) || ( obj instanceof Array ) || ( obj instanceof String || typeof obj === "string" ) ) ) {
			return obj;
		}

		if ( dom ) {
			do {
				id = utility.domId( utility.uuid( true) );
			}
			while ( utility.dom( "#" + id ) !== undefined );
		}
		else {
			id = utility.domId( utility.uuid( true) );
		}

		if ( typeof obj === "object" ) {
			obj.id = id;

			return obj;
		}
		else {
			return id;
		}
	},

	/**
	 * Getter / setter for the hashbang
	 *
	 * @method hash
	 * @memberOf abaaso.utility
	 * @param  {string} arg Route to set
	 * @return {string}     Current route
	 */
	hash : function ( arg ) {
		if ( arg ) {
			document.location.hash = arg;
		}

		return document.location.hash;
	},

	/**
	 * Converts RGB to HEX
	 *
	 * @method hex
	 * @memberOf abaaso.utility
	 * @param  {string} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
	 * @return {string}       Color as HEX
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
	 * Iterates an Object and executes a function against the properties
	 *
	 * Iteration can be stopped by returning false from fn
	 *
	 * @method iterate
	 * @memberOf abaaso.utility
	 * @param  {object}   obj Object to iterate
	 * @param  {function} fn  Function to execute against properties
	 * @return {object}       Object
	 */
	iterate : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		array.each( Object.keys( obj ), function ( i ) {
			return fn.call( obj, obj[i], i );
		});

		return obj;
	},

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @memberOf abaaso.utility
	 * @param  {mixed} obj Element
	 * @return {mixed}     Element
	 */
	loading : function ( obj ) {
		var l = abaaso.loading;

		if ( l.url === null || obj === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		// Setting loading image
		if ( l.image === undefined ) {
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
	 * @param  {string} arg    String to write to the console
	 * @param  {string} target [Optional] Target console, default is "log"
	 * @return {undefined}     undefined
	 */
	log : function ( arg, target ) {
		var ts, msg;

		if ( typeof console !== "undefined" ) {
			ts  = typeof arg !== "object";
			msg = ts ? "[" + new Date().toLocaleTimeString() + "] " + arg : arg;
			console[target || "log"]( msg );
		}
	},

	/**
	 * Merges obj with arg
	 *
	 * @method merge
	 * @memberOf abaaso.utility
	 * @param  {object} obj Object to decorate
	 * @param  {object} arg Decoration
	 * @return {object}     Decorated Object
	 */
	merge : function ( obj, arg ) {
		utility.iterate( arg, function ( v, k ) {
			if ( ( obj[k] instanceof Array ) && ( v instanceof Array ) ) {
				array.merge( obj[k], v );
			}
			else if ( ( obj[k] instanceof Object ) && ( v instanceof Object ) ) {
				utility.iterate( v, function ( x, y ) {
					obj[k][y] = utility.clone( x );
				});
			}
			else {
				obj[k] = utility.clone( v );
			}
		});

		return obj;
	},
	
	/**
	 * Registers a module on abaaso
	 *
	 * @method module
	 * @memberOf abaaso.utility
	 * @param  {string} arg Module name
	 * @param  {object} obj Module structure
	 * @return {object}     Module registered
	 */
	module : function ( arg, obj ) {
		if ( abaaso[arg] !== undefined || !obj instanceof Object ) {
			throw new Error( label.error.invalidArguments );
		}
		
		abaaso[arg] = obj;

		return abaaso[arg];
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @memberOf abaaso.utility
	 * @param  {mixed} obj Entity or $ query
	 * @return {mixed}     Entity
	 */
	object : function ( obj ) {
		return typeof obj === "object" ? obj : ( obj.charAt && obj.charAt( 0 ) === "#" ? utility.dom( obj ) : obj );
	},

	/**
	 * Parses a URI into an Object
	 *
	 * @method parse
	 * @memberOf abaaso.utility
	 * @param  {string} uri URI to parse
	 * @return {object}     Parsed URI
	 */
	parse : function ( uri ) {
		var obj    = {},
		    parsed = {};

		if ( uri === undefined ) {
			uri = !server ? location.href : "";
		}

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
			});
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
	 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
	 *
	 * @method property
	 * @memberOf abaaso.utility
	 * @param  {object} obj        Object to decorate
	 * @param  {string} prop       Name of property to set
	 * @param  {object} descriptor Descriptor of the property
	 * @return {object}            Object receiving the property
	 */
	property : function ( obj, prop, descriptor ) {
		if ( !( descriptor instanceof Object ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( descriptor.value !== undefined && descriptor.get !== undefined ) {
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
	 * @param  {object} obj  Object receiving prototype extension
	 * @param  {string} type Identifier of obj, determines what Arrays to apply
	 * @return {object}      obj or undefined
	 */
	proto : function ( obj, type ) {
		var target = obj.prototype || obj;

		utility.iterate( prototypes[type], function ( v, k ) {
			if ( !target[k] ) {
				utility.property( target, k, {value: v, configurable: true, writable: true} );
			}
		});

		return obj;
	},

	/**
	 * Parses a query string & coerces values
	 *
	 * @method queryString
	 * @memberOf abaaso.utility
	 * @param  {string} arg     [Optional] Key to find in the querystring
	 * @param  {string} qstring [Optional] Query string to parse
	 * @return {mixed}          Value or Object of key:value pairs
	 */
	queryString : function ( arg, qstring ) {
		var obj    = {},
		    result = qstring !== undefined ? ( qstring.indexOf( "?" ) > -1 ? qstring.replace( /.*\?/, "" ) : null) : ( server || string.isEmpty( location.search ) ? null : location.search.replace( "?", "" ) ),
		    item;

		if ( result !== null && !string.isEmpty( result ) ) {
			result = result.split( "&" );
			array.each( result, function (prop ) {
				item = prop.split( "=" );

				if ( string.isEmpty( item[0] ) ) {
					return;
				}

				if ( item[1] === undefined || string.isEmpty( item[1] ) ) {
					item[1] = "";
				}
				else if ( string.isNumber( item[1] )) {
					item[1] = Number(item[1] );
				}
				else if ( string.isBoolean( item[1] )) {
					item[1] = (item[1] === "true" );
				}

				if ( obj[item[0]] === undefined ) {
					obj[item[0]] = item[1];
				}
				else if ( !(obj[item[0]] instanceof Array) ) {
					obj[item[0]] = [obj[item[0]]];
					obj[item[0]].push( item[1] );
				}
				else {
					obj[item[0]].push( item[1] );
				}
			});
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
	 * @param  {function} arg Function to reflect
	 * @return {array}        Array of parameters
	 */
	reflect : function ( arg ) {
		if ( arg === undefined ) {
			arg = this || utility.$;
		}

		arg = arg.toString().match( regex.reflect )[1];

		return string.explode( arg );
	},

	/**
	 * Creates a recursive function
	 *
	 * Return false from the function to halt recursion
	 *
	 * @method repeat
	 * @memberOf abaaso.utility
	 * @param  {function} fn  Function to execute repeatedly
	 * @param  {number}   ms  Milliseconds to stagger the execution
	 * @param  {string}   id  [Optional] Timeout ID
	 * @param  {boolean}  now Executes `fn` and then setup repetition, default is `true`
	 * @return {string}       Timeout ID
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
	 * Stops an Event from bubbling
	 *
	 * @method stop
	 * @memberOf abaaso.utility
	 * @param  {object} e Event
	 * @return {object}   Event
	 */
	stop : function ( e ) {
		if ( e.cancelBubble !== undefined ) {
			e.cancelBubble = true;
		}

		if ( typeof e.preventDefault === "function" ) {
			e.preventDefault();
		}

		if ( typeof e.stopPropagation === "function" ) {
			e.stopPropagation();
		}

		// Assumed to always be valid, even if it's not decorated on `e` ( I'm looking at you IE8 )
		e.returnValue = false;

		return e;
	},

	/**
	 * Creates syntactic sugar by hooking abaaso into native Objects
	 *
	 * @method sugar
	 * @memberOf abaaso.utility
	 * @return {undefined} undefined
	 */
	sugar : function () {
		utility.proto( Array, "array" );

		if ( typeof Element !== "undefined" ) {
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
	 * @param  {object} e Event
	 * @return {object}   Event target
	 */
	target : function ( e ) {
		return e.target || e.srcElement;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @memberOf abaaso.utility
	 * @param  {object} data   JSON Object describing HTML
	 * @param  {mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {object}        New Element created from the template
	 */
	tpl : function ( arg, target ) {
		var frag;

		if ( typeof arg !== "object" || (!(regex.object_undefined.test( typeof target ) ) && ( target = target.charAt( 0 ) === "#" ? utility.dom( target ) : utility.dom( target )[0] ) === undefined ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( target === undefined ) {
			target = utility.dom( "body" )[0];
		}

		frag  = document.createDocumentFragment();

		if ( arg instanceof Array ) {
			array.each( arg, function ( i ) {
				element.html(element.create( array.cast( i, true )[0], frag ), array.cast(i)[0] );
			});
		}
		else {
			utility.iterate( arg, function ( v, k ) {
				if ( typeof v === "string" ) {
					element.html( element.create( k, undefined, frag ), v );
				}
				else if ( ( v instanceof Array ) || ( v instanceof Object ) ) {
					utility.tpl( v, element.create( k, undefined, frag ) );
				}
			});
		}

		target.appendChild( frag );

		return array.last( target.childNodes );
	},

	/**
	 * Generates a version 4 UUID
	 *
	 * @method uuid
	 * @memberOf abaaso.utility
	 * @param  {boolean} safe [Optional] Strips - from UUID
	 * @return {string}       UUID
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
	 * Walks a structure and returns arg
	 *
	 * @method  walk
	 * @memberOf abaaso.utility
	 * @param  {mixed}  obj  Object or Array
	 * @param  {string} arg  String describing the property to return
	 * @return {mixed}       arg
	 */
	walk : function ( obj, arg ) {
		array.each( arg.replace( /\]$/, "" ).replace( /\]/g, "." ).replace( /\.\./g, "." ).split( /\.|\[/ ), function ( i ) {
			obj = obj[i];
		});

		return obj;
	},

	/**
	 * Accepts Deferreds or Promises as arguments or an Array
	 *
	 * @method when
	 * @memberOf abaaso.utility
	 * @return {object} Deferred
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
					if ( ++i === nth && !defer.isResolved()) {
						if ( args.length > 1 ) {
							defer.resolve( args.map( function ( obj ) {
								return obj.value || obj.promise.value;
							}));
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
							}));
						}
						else {
							defer.reject( args[0].value || args[0].promise.value );
						}
					}
				});
			});
		}

		return defer;
	}
};
