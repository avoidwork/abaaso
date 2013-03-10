/**
 * Utilities
 *
 * @class utility
 * @namespace abaaso
 */
var utility = {
	// Collection of timers
	timer : {},

	/**
	 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
	 * 
	 * Accepts comma delimited queries
	 *
	 * @method $
	 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
	 * @param  {Boolean} nodelist [Optional] True will return a NodeList ( by reference ) for tags & classes
	 * @return {Mixed}            Element or Array of Elements
	 */
	$ : function ( arg, nodelist ) {
		if ( document === undefined || arg === undefined ) {
			return undefined;
		}

		var queries = [],
		    result  = [],
		    tmp     = [];

		queries  = string.explode( arg );
		nodelist = ( nodelist === true );

		array.each( queries, function ( query ) {
			var obj, sel;

			if ( regex.selector_complex.test( query) ) {
				sel = array.last( query.split( " " ).filter( function ( i ) {
					if ( !string.isEmpty( i ) && i !== ">" ) {
						return true;
					}
				}));

				if ( regex.hash.test( sel ) && !regex.selector_many.test( sel ) ) {
					obj = document.querySelector( query );
				}
				else {
					obj = document.querySelectorAll( query );

					if ( !nodelist ) {
						obj = array.cast( obj );
					}
				}
			}
			else if ( regex.hash.test( query ) && !regex.selector_many.test( query ) ) {
				obj = document.querySelector( query )
			}
			else {
				obj = document.querySelectorAll( query );

				if ( !nodelist ) {
					obj = array.cast( obj );
				}
			}

			if ( obj !== null ) {
				tmp.push( obj );
			}
		});

		array.each( tmp, function ( i ) {
			result = result.concat( i );
		});

		if ( regex.hash.test( arg ) && !regex.selector_many.test( arg ) && !regex.selector_complex.test( arg ) ) {
			result = result[0];
		}

		return result;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @param  {Object} obj    Object receiving aliasing
	 * @param  {Object} origin Object providing structure to obj
	 * @return {Object}        Object receiving aliasing
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
	 * @param  {String} id ID of timer( s )
	 * @return {Undefined} undefined
	 */
	clearTimers : function ( id ) {
		if ( id === undefined || id.isEmpty() ) {
			throw Error( label.error.invalidArguments );
		}

		// deferred
		if ( utility.timer[id] !== undefined ) {
			clearTimeout( utility.timer[id] );
			delete utility.timer[id];
		}

		// repeating
		if ( $.repeating[id] !== undefined ) {
			clearTimeout( $.repeating[id] );
			delete $.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @param {Object}  obj Object to clone
	 * @return {Object}     Clone of obj
	 */
	clone : function ( obj ) {
		var clone;

		if ( obj instanceof Array ) {
			return obj.concat();
		}
		else if ( typeof obj === "boolean" ) {
			return Boolean( obj );
		}
		else if ( typeof obj === "function" ) {
			return obj;
		}
		else if ( typeof obj === "number" ) {
			return Number( obj );
		}
		else if ( typeof obj === "string" ) {
			return String( obj );
		}
		else if ( !client.ie && !server && obj instanceof Document ) {
			return xml.decode( xml.encode(obj) );
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
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Typed version of the String
	 */
	coerce : function ( value ) {
		var result = utility.clone( value ),
		    tmp;

		if ( !isNaN( number.parse( result ) ) ) {
			result = number.parse( result );
		}
		else if ( regex.string_boolean.test( result ) ) {
			result = regex.string_true.test( result );
		}
		else if ( result === "undefined" ) {
			result = undefined;
		}
		else if ( result === "null" ) {
			result = null;
		}
		else if ( (tmp = json.decode( result, true ) ) && tmp !== undefined ) {
			result = tmp;
		}

		return result;
	},

	/**
	 * Recompiles a RegExp by reference
	 *
	 * This is ideal when you need to recompile a regex for use within a conditional statement
	 * 
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
	 * @param  {String} content CSS to put in a style tag
	 * @param  {String} media   [Optional] Medias the stylesheet applies to
	 * @return {Object}         Element created or undefined
	 */
	css : function ( content, media ) {
		var ss, css;

		ss = element.create( "style", {type: "text/css", media: media || "print, screen"}, $( "head" )[0] );

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
	 * @param  {Function} fn    Function to execute
	 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {Mixed}    scope `this` context during execution, default is `global`
	 * @return {Undefined}      undefined
	 */
	debounce : function ( fn, ms, scope ) {
		if ( typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			utility.defer( function () {
				fn.apply( scope, arguments );
			}, ms);
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
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
				void 0;
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
	 * @param  {Function} fn Function to defer execution of
	 * @param  {Number}   ms Milliseconds to defer execution
	 * @param  {Number}   id [Optional] ID of the deferred function
	 * @return {String}      id of the timer
	 */
	defer : function ( fn, ms, id ) {
		var op;

		ms = ms || 0;
		id = id || utility.uuid( true );

		op = function () {
			utility.clearTimers( id );
			fn();
		};

		utility.clearTimers( id );
		utility.timer[id] = setTimeout( op, ms );

		return id;
	},

	/**
	 * Encodes a UUID to a DOM friendly ID
	 *
	 * @method domId
	 * @param  {String} UUID
	 * @return {String} DOM friendly ID
	 * @private
	 */
	domId : function ( arg ) {
		return "a" + arg.replace( /-/g, "" ).slice( 1 );
	},

	/**
	 * Error handling, with history in .log
	 *
	 * @method error
	 * @param  {Mixed}   e       Error object or message to display
	 * @param  {Array}   args    Array of arguments from the callstack
	 * @param  {Mixed}   scope   Entity that was "this"
	 * @param  {Boolean} warning [Optional] Will display as console warning if true
	 * @return {Undefined}       undefined
	 */
	error : function ( e, args, scope, warning ) {
		warning = ( warning === true );
		var o   = {
			arguments : args,
			message   : e.message || e,
			number    : e.number !== undefined ? ( e.number & 0xFFFF ) : undefined,
			scope     : scope,
			stack     : e.stack   || undefined,
			timestamp : new Date().toUTCString(),
			type      : e.type    || "TypeError"
		};

		utility.log( o.stack || o.message, !warning ? "error" : "warn" );
		abaaso.error.log.push( o );
		observer.fire( abaaso, "error", o );

		return undefined;
	},

	/**
	 * Creates a class extending obj, with optional decoration
	 *
	 * @method extend
	 * @param  {Object} obj Object to extend
	 * @param  {Object} arg [Optional] Object for decoration
	 * @return {Object}     Decorated obj
	 */
	extend : function ( obj, arg ) {
		var o, f;

		if ( obj === undefined ) {
			throw Error( label.error.invalidArguments );
		}

		if ( typeof Object.create === "function" ) {
			o = Object.create( obj );
		}
		else {
			f = function () {};
			f.prototype = obj;
			o = new f();
		}

		if ( arg instanceof Object ) {
			utility.merge( o, arg );
		}

		return o;
	},

	/**
	 * Generates an ID value
	 *
	 * @method genId
	 * @param  {Mixed}   obj [Optional] Object to receive id
	 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {Mixed}       Object or id
	 */
	genId : function ( obj, dom ) {
		dom = ( dom === true );
		var id;

		if ( obj !== undefined && ( ( obj.id !== undefined && obj.id !== "" ) || ( obj instanceof Array ) || ( obj instanceof String || typeof obj === "string" ) ) ) {
			return obj;
		}

		if ( dom ) {
			do id = utility.domId( utility.uuid( true) );
			while ( $( "#" + id ) !== undefined );
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
	 * Iterates an Object and executes a function against the properties
	 *
	 * Iteration can be stopped by returning false from fn
	 * 
	 * @method iterate
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	iterate : function () {
		if ( typeof Object.keys === "function" ) {
			return function ( obj, fn ) {
				if ( typeof fn !== "function" ) {
					throw Error( label.error.invalidArguments );
				}

				array.each( Object.keys( obj ), function ( i ) {
					return fn.call( obj, obj[i], i );
				});

				return obj;
			};
		}
		else {
			return function ( obj, fn ) {
				var has = Object.prototype.hasOwnProperty,
				    i, result;

				if ( typeof fn !== "function" ) {
					throw Error( label.error.invalidArguments );
				}

				for ( i in obj ) {
					if ( has.call( obj, i ) ) {
						result = fn.call( obj, obj[i], i );

						if ( result === false ) {
							break;
						}
					}
					else {
						break;
					}
				}

				return obj;
			};
		}
	}(),

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @param  {Mixed} obj Entity or Array of Entities or $ queries
	 * @return {Mixed}     Entity, Array of Entities or undefined
	 */
	loading : function ( obj ) {
		var l = abaaso.loading;

		obj = utility.object( obj );

		if ( obj instanceof Array ) {
			return array.each( obj, function ( i ) {
				utility.loading( i );
			});
		}

		if ( l.url === null || obj === undefined ) {
			throw Error( label.error.invalidArguments );
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
	 * @private
	 * @param  {String} arg    String to write to the console
	 * @param  {String} target [Optional] Target console, default is "log"
	 * @return {Undefined}     undefined
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
	 * @param  {Object} obj Object to decorate
	 * @param  {Object} arg Object to decorate with
	 * @return {Object}     Object to decorate
	 */
	merge : function ( obj, arg ) {
		utility.iterate( arg, function ( v, k ) {
			obj[k] = utility.clone( v );
		});

		return obj;
	},
	
	/**
	 * Registers a module in the abaaso namespace
	 *
	 * IE8 will have factories ( functions ) duplicated onto $ because it will not respect the binding
	 * 
	 * @method module
	 * @param  {String} arg Module name
	 * @param  {Object} obj Module structure
	 * @return {Object}     Module registered
	 */
	module : function ( arg, obj ) {
		if ( $[arg] !== undefined || this[arg] !== undefined || !obj instanceof Object ) {
			throw Error( label.error.invalidArguments );
		}
		
		this[arg] = obj;

		if ( typeof obj === "function") {
			$[arg] = !client.ie || client.version > 8 ? this[arg].bind( $[arg] ) : this[arg];
		}
		else {
			$[arg] = {};
			utility.alias( $[arg], this[arg] );
		}

		return $[arg];
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @param  {Mixed} obj Entity or $ query
	 * @return {Mixed}     Entity
	 * @private
	 */
	object : function ( obj ) {
		return typeof obj === "object" ? obj : ( obj.toString().charAt( 0 ) === "#" ? $( obj ) : obj );
	},

	/**
	 * Parses a URI into an Object
	 * 
	 * @method parse
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function ( uri ) {
		var obj    = {},
		    parsed = {};

		if ( !server ) {
			obj = document.createElement( "a" );
			obj.href = uri;
		}
		else {
			obj = url.parse( uri );
		}

		parsed = {
			protocol : obj.protocol,
			hostname : obj.hostname,
			port     : !string.isEmpty( obj.port ) ? number.parse( obj.port, 10 ) : "",
			pathname : obj.pathname,
			search   : obj.search,
			hash     : obj.hash,
			host     : obj.host
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

		return parsed;
	},

	/**
	 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
	 * 
	 * @method property
	 * @param  {Object} obj        Object to decorate
	 * @param  {String} prop       Name of property to set
	 * @param  {Object} descriptor Descriptor of the property
	 * @return {Object}            Object receiving the property
	 */
	property : function () {
		if ( ( server || ( !client.ie || client.version > 8 ) ) && typeof Object.defineProperty === "function" ) {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw Error( label.error.invalidArguments );
				}

				if ( descriptor.value !== undefined && descriptor.get !== undefined ) {
					delete descriptor.value;
				}

				Object.defineProperty( obj, prop, descriptor );
			};
		}
		else {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw Error( label.error.invalidArguments );
				}

				obj[prop] = descriptor.value;

				return obj;
			};
		}
	},

	/**
	 * Sets methods on a prototype object
	 *
	 * @method proto
	 * @param  {Object} obj  Object receiving prototype extension
	 * @param  {String} type Identifier of obj, determines what Arrays to apply
	 * @return {Object}      obj or undefined
	 * @private
	 */
	proto : function ( obj, type ) {
		var methods, i;

		methods = {
			array : {
				add : function ( arg ) {
					return array.add( this, arg );
				},
				addClass : function ( arg ) {
					return array.each( this, function ( i ) {
						element.klass( i, arg );
					});
				},
				after : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "after" ) );
					});

					return result;
				},
				append : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "last" ) );
					});

					return result;
				},
				attr : function ( key, value ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.attr( i, key, value ) );
					});

					return result;
				},
				before : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "before" ) );
					});

					return result;
				},
				chunk : function ( size ) {
					return array.chunk( this, size );
				},
				clear : function () {
					return !server && ( this[0] instanceof Element ) ? array.each( this, function ( i ) {
						element.clear(i);
					}) : array.clear( this );
				},
				clone : function () {
					return utility.clone( this );
				},
				collect : function ( arg ) {
					return array.collect( this, arg );
				},
				compact : function () {
					return array.compact( this );
				},
				contains : function ( arg ) {
					return array.contains( this, arg );
				},
				create : function ( type, args, position ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, position ) );
					});

					return result;
				},
				css : function ( key, value ) {
					return array.each( this, function ( i ) {
						element.css( i, key, value );
					});
				},
				data : function ( key, value ) {
					var result = [];

					array.each( this, function (i) {
						result.push( element.data( i, key, value ) );
					});

					return result;
				},
				diff : function ( arg ) {
					return array.diff( this, arg );
				},
				disable : function () {
					return array.each( this, function ( i ) {
						element.disable( i );
					});
				},
				destroy : function () {
					array.each( this, function ( i ) {
						element.destroy( i );
					});

					return [];
				},
				each : function ( arg ) {
					return array.each( this, arg );
				},
				empty : function () {
					return array.empty( this );
				},
				enable : function () {
					return array.each( this, function ( i ) {
						element.enable( i );
					});
				},
				equal : function ( arg ) {
					return array.equal( this, arg );
				},
				fill : function ( arg, start, offset ) {
					return array.fill( this, arg, start, offset );
				},
				find : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						i.find( arg ).each( function ( r ) {
							result.add( r );
						});
					});

					return result;
				},
				fire : function () {
					var args = arguments;

					return array.each( this, function ( i ) {
						observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
					});
				},
				first : function () {
					return array.first( this );
				},
				flat : function () {
					return array.flat( this );
				},
				genId : function () {
					return array.each( this, function ( i ) {
						utility.genId( i );
					});
				},
				get : function ( uri, headers ) {
					var result = [];

					array.each( this, function ( i, idx ) {
						i.get( uri, headers, function ( arg ) {
							result[idx] = arg;
						}, function ( e ) {
							result[idx] = e;
						});
					});

					return result;
				},
				has : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.has( i, arg ) );
					});

					return result;
				},
				hasClass : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.hasClass( i, arg ) );
					});

					return result;
				},
				hide : function () {
					return array.each( this, function ( i ) {
						element.hide( i );
					});
				},
				html : function ( arg ) {
					var result;

					if ( arg !== undefined ) {
						return array.each( this, function ( i ) {
							element.html( i, arg );
						});
					}
					else {
						result = [];
						array.each( this, function ( i ) {
							result.push( element.html( i ) );
						});

						return result;
					}
				},
				index : function ( arg ) {
					return array.index( this, arg );
				},
				indexed : function () {
					return array.indexed( this );
				},
				intersect : function ( arg ) {
					return array.intersect( this, arg );
				},
				is : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.is( i, arg ) );
					});

					return result;
				},
				isAlphaNum : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isAlphaNum() );
					});

					return result;
				},
				isBoolean : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isBoolean() );
					});

					return result;
				},
				isChecked : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isChecked() );
					});

					return result;
				},
				isDate : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isDate() );
					});

					return result;
				},
				isDisabled : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.isDisabled( i ) );
					});

					return result;
				},
				isDomain : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isDomain() );
					});

					return result;
				},
				isEmail : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isEmail() );
					});

					return result;
				},
				isEmpty : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isEmpty() );
					});

					return result;
				},
				isHidden : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.isHidden( i ) );
					});

					return result;
				},
				isIP : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isIP() );
					});

					return result;
				},
				isInt : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isInt() );
					});

					return result;
				},
				isNumber : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isNumber() );
					});

					return result;
				},
				isPhone : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isPhone() );
					});

					return result;
				},
				isUrl : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isUrl() );
					});

					return result;
				},
				keep_if : function ( fn ) {
					return array.keep_if( this, fn );
				},
				keys : function () {
					return array.keys( this );
				},
				last : function ( arg ) {
					return array.last( this, arg );
				},
				limit : function ( start, offset ) {
					return array.limit( this, start, offset );
				},
				listeners: function ( event ) {
					var result = [];

					array.each( this, function ( i ) {
						array.merge(result, observer.listeners( i, event ) );
					});

					return result;
				},
				loading : function () {
					return array.each( this, function ( i ) {
						utility.loading( i );
					});
				},
				max : function () {
					return array.max( this );
				},
				mean : function () {
					return array.mean( this );
				},
				median : function () {
					return array.median( this );
				},
				merge : function ( arg ) {
					return array.merge( this, arg );
				},
				min : function () {
					return array.min( this );
				},
				mode : function () {
					return array.mode( this );
				},
				on : function ( event, listener, id, scope, state ) {
					return array.each( this, function ( i ) {
						observer.add( i, event, listener, id, scope || i, state );
					});
				},
				once : function ( event, listener, id, scope, state ) {
					return array.each( this, function ( i ) {
						observer.once( i, event, listener, id, scope || i, state );
					});
				},
				position : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.position( i ) );
					});

					return result;
				},
				prepend : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "first" ) );
					});

					return result;
				},
				range : function () {
					return array.range( this );
				},
				rassoc : function ( arg ) {
					return array.rassoc( this, arg );
				},
				reject : function ( fn ) {
					return array.reject( this, fn );
				},
				remove : function ( start, end ) {
					return array.remove( this, start, end );
				},
				remove_if : function ( fn ) {
					return array.remove_if( this, fn );
				},
				remove_while: function ( fn ) {
					return array.remove_while( this, fn );
				},
				removeClass: function ( arg ) {
					return array.each( this, function ( i ) {
						element.klass( i, arg, false );
					});
				},
				replace : function ( arg ) {
					return array.replace( this, arg );
				},
				rest : function ( arg ) {
					return array.rest( this, arg );
				},
				rindex : function ( arg ) {
					return array.rindex( this, arg );
				},
				rotate : function ( arg ) {
					return array.rotate( this, arg );
				},
				serialize : function ( string, encode ) {
					return element.serialize( this, string, encode );
				},
				series : function ( start, end, offset ) {
					return array.series( start, end, offset );
				},
				show : function () {
					return array.each( this, function ( i ) {
						element.show( i );
					});
				},
				size : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.size( i ) );
					});

					return result;
				},
				split : function ( size ) {
					return array.split( this, size );
				},
				sum : function () {
					return array.sum( this );
				},
				take : function ( arg ) {
					return array.take( this, arg );
				},
				text : function ( arg ) {
					return array.each( this, function ( node ) {
						if ( typeof node !== "object") {
							node = utility.object( node );
						}

						if ( typeof node.text === "function") {
							node.text( arg );
						}
					});
				},
				tpl : function ( arg ) {
					return array.each( this, function ( i ) {
						utility.tpl ( arg, i );
					});
				},
				toggleClass : function ( arg ) {
					return array.each( this, function ( i ) {
						element.toggleClass( i, arg );
					});
				},
				total : function () {
					return array.total( this );
				},
				toObject : function () {
					return array.toObject( this );
				},
				un : function ( event, id, state ) {
					return array.each( this, function ( i ) {
						observer.remove( i, event, id, state );
					});
				},
				unique : function () {
					return array.unique( this );
				},
				update : function ( arg ) {
					return array.each( this, function ( i ) {
						element.update( i, arg );
					});
				},
				val : function ( arg ) {
					var a    = [],
					    type = null,
					    same = true;

					array.each( this, function ( i ) {
						if ( type !== null ) {
							same = ( type === i.type );
						}

						type = i.type;

						if ( typeof i.val === "function" ) {
							a.push( i.val( arg ) );
						}
					});

					return same ? a[0] : a;
				},
				validate : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.validate( i ) );
					});

					return result;
				},
				zip : function () {
					return array.zip( this, arguments );
				}
			},
			element : {
				addClass : function ( arg ) {
					return element.klass( this, arg, true );
				},
				after : function ( type, args ) {
					return element.create( type, args, this, "after" );
				},
				append : function ( type, args ) {
					return element.create( type, args, this, "last" );
				},
				attr : function ( key, value ) {
					return element.attr( this, key, value );
				},
				before : function ( type, args ) {
					return element.create( type, args, this, "before" );
				},
				clear : function () {
					return element.clear( this );
				},
				create : function ( type, args, position ) {
					return element.create( type, args, this, position );
				},
				css : function ( key, value ) {
					return element.css( this, key, value );
				},
				data : function ( key, value ) {
					return element.data( this, key, value );
				},
				destroy : function () {
					return element.destroy( this );
				},
				disable : function () {
					return element.disable( this );
				},
				enable : function () {
					return element.enable( this );
				},
				find : function ( arg ) {
					return element.find( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
				},
				genId : function () {
					return utility.genId( this );
				},
				get : function ( uri, success, failure, headers, timeout ) {
					var self     = this,
					    deferred = promise.factory(),
					    deferred2;

					deferred2 = deferred.then( function ( arg ) {
						element.html( self, arg );
						observer.fire( self, "afterGet" );

						if ( typeof success === "function") {
							success.call( self, arg );
						}

					}, function ( e ) {
						element.html( self, arg || label.error.serverError );
						observer.fire( self, "failedGet" );

						if ( typeof failure === "function") {
							failure.call( self, arg );
						}

						throw e;
					});

					observer.fire( this, "beforeGet" );

					uri.get( function (arg ) { 
						deferred.resolve( arg );
					}, function ( e ) {
						deferred.reject( e );
					}, headers, timeout);

					return deferred2;
				},
				has : function ( arg ) {
					return element.has( this, arg );
				},
				hasClass : function ( arg ) {
					return element.hasClass( this, arg );
				},
				hide : function () {
					return element.hide( this );
				},
				html : function ( arg ) {
					return element.html( this, arg );
				},
				is : function ( arg ) {
					return element.is( this, arg );
				},
				isAlphaNum : function () {
					return element.isAlphaNum( this );
				},
				isBoolean : function () {
					return element.isBoolean( this );
				},
				isChecked : function () {
					return element.isChecked( this );
				},
				isDate : function () {
					return element.isDate( this );
				},
				isDisabled : function () {
					return element.isDisabled( this );
				},
				isDomain : function () {
					return element.isDomain( this );
				},
				isEmail : function () {
					return element.isEmail( this );
				},
				isEmpty : function () {
					return element.isEmpty( this );
				},
				isHidden : function () {
					return element.hidden( this );
				},
				isIP : function () {
					return element.isIP( this );
				},
				isInt : function () {
					return element.isInt( this );
				},
				isNumber : function () {
					return element.isNumber( this );
				},
				isPhone : function () {
					return element.isPhone( this );
				},
				isUrl : function () {
					return element.isUrl( this );
				},
				jsonp : function ( uri, property, callback ) {
					var target = this,
					    arg    = property, fn,
					    deferred;

					fn = function ( response ) {
						var self = target,
						    node = response,
						    prop = arg,
						    i, nth, result;

						try {
							if ( prop !== undefined ) {
								prop = prop.replace( /\]|'|"/g , "" ).replace( /\./g, "[" ).split( "[" );

								prop.each( function ( i ) {
									node = node[!!isNaN( i ) ? i : number.parse( i, 10 )];

									if ( node === undefined ) {
										throw Error( label.error.propertyNotFound );
									}
								});

								result = node;
							}
							else result = response;
						}
						catch ( e ) {
							result = label.error.serverError;
							error( e, arguments, this );
						}

						element.html( self, result );
					};

					deferred = client.jsonp( uri, fn, function (e) {
						element.html( target, label.error.serverError );

						throw e;
					}, callback );

					return deferred;
				},
				listeners : function ( event ) {
					return observer.list( this, event );
				},
				loading : function () {
					return utility.loading( this );
				},
				on : function ( event, listener, id, scope, state ) {
					return observer.add(  this, event, listener, id, scope || this, state );
				},
				once : function ( event, listener, id, scope, state ) {
					return observer.once( this, event, listener, id, scope || this, state );
				},
				prepend : function ( type, args ) {
					return element.create( type, args, this, "first" );
				},
				prependChild : function ( child ) {
					return element.prependChild( this, child );
				},
				position : function () {
					return element.position( this );
				},
				removeClass : function ( arg ) {
					return element.klass( this, arg, false );
				},
				serialize : function ( string, encode ) {
					return element.serialize( this, string, encode );
				},
				show : function () {
					return element.show( this );
				},
				size : function () {
					return element.size( this );
				},
				text : function ( arg ) {
					return element.text( this, arg );
				},
				toggleClass : function ( arg ) {
					return element.toggleClass( this, arg );
				},
				tpl : function ( arg ) {
					return utility.tpl( arg, this );
				},
				un : function ( event, id, state ) {
					return observer.remove( this, event, id, state );
				},
				update : function ( args ) {
					return element.update( this, args );
				},
				val : function ( arg ) {
					return element.val( this, arg );
				},
				validate : function () {
					return element.validate( this );
				}
			},
			"function": {
				reflect : function () {
					return utility.reflect( this );
				},
				debounce : function ( ms ) {
					return utility.debounce( this, ms );
				}
			},
			number : {
				diff : function ( arg ) {
					return number.diff( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this.toString()].concat( array.cast( arguments ) ) );
				},
				format : function ( delimiter, every ) {
					return number.format( this, delimiter, every );
				},
				half : function ( arg ) {
					return number.half( this, arg );
				},
				isEven : function () {
					return number.even( this );
				},
				isOdd : function () {
					return number.odd( this );
				},
				listeners : function ( event ) {
					return observer.list( this.toString(), event );
				},
				on : function ( event, listener, id, scope, state ) {
					observer.add(  this.toString(), event, listener, id, scope || this, state );

					return this;
				},
				once : function ( event, listener, id, scope, state ) {
					observer.once( this.toString(), event, listener, id, scope || this, state );

					return this;
				},
				random : function () {
					return number.random( this );
				},
				round : function () {
					return number.round( this );
				},
				roundDown : function () {
					return number.round( this, "down" );
				},
				roundUp : function () {
					return number.round( this, "up" );
				},
				un : function ( event, id, state ) {
					observer.remove( this.toString(), event, id, state );

					return this;
				}
			},
			string : {
				allows : function ( arg ) {
					return client.allows( this, arg );
				},
				capitalize: function () {
					return string.capitalize( this );
				},
				del : function ( success, failure, headers ) {
					return client.request( this, "DELETE", success, failure, null, headers );
				},
				escape : function () {
					return string.escape(this );
				},
				expire : function ( silent ) {
					return cache.expire( this, silent );
				},
				explode : function ( arg ) {
					return string.explode( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
				},
				get : function ( success, failure, headers ) {
					return client.request( this, "GET", success, failure, null, headers );
				},
				headers : function ( success, failure ) {
					return client.request( this, "HEAD", success, failure );
				},
				hyphenate : function ( camel ) {
					return string.hyphenate( this, camel );
				},
				isAlphaNum : function () {
					return string.isAlphaNum( this );
				},
				isBoolean : function () {
					return string.isBoolean( this );
				},
				isDate : function () {
					return string.isDate( this );
				},
				isDomain : function () {
					return string.isDomain( this );
				},
				isEmail : function () {
					return string.isEmail( this );
				},
				isEmpty : function () {
					return string.isEmpty( this );
				},
				isIP : function () {
					return string.isIP( this );
				},
				isInt : function () {
					return string.isInt( this );
				},
				isNumber : function () {
					return string.isNumber( this );
				},
				isPhone : function () {
					return string.isPhone( this );
				},
				isUrl : function () {
					return string.isUrl( this );
				},
				jsonp : function ( success, failure, callback ) {
					return client.jsonp( this, success, failure, callback );
				},
				listeners : function ( event ) {
					return observer.list( this, event );
				},
				post : function ( success, failure, args, headers ) {
					return client.request( this, "POST", success, failure, args, headers );
				},
				put : function ( success, failure, args, headers ) {
					return client.request( this, "PUT", success, failure, args, headers );
				},
				on : function ( event, listener, id, scope, state ) {
					return observer.add( this, event, listener, id, scope, state );
				},
				once : function ( event, listener, id, scope, state ) {
					return observer.add( this, event, listener, id, scope, state );
				},
				options : function ( success, failure ) {
					return client.request( this, "OPTIONS", success, failure );
				},
				permissions : function () {
					return client.permissions( this );
				},
				singular : function () {
					return string.singular( this );
				},
				toCamelCase : function () {
					return string.toCamelCase( this );
				},
				toNumber : function ( base ) {
					return number.parse( this, base );
				},
				trim : function () {
					return string.trim( this );
				},
				un : function ( event, id, state ) {
					return observer.remove( this, event, id, state );
				},
				uncapitalize : function () {
					return string.uncapitalize( this );
				},
				unhyphenate: function ( arg ) {
					return string.unhyphenate( this, arg );
				}
			}
		};

		// Allowing hooks to be overwritten
		utility.iterate( methods[type], function ( v, k ) {
			utility.property( obj.prototype, k, {value: v, configurable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Parses a query string & coerces values
	 *
	 * @method queryString
	 * @param  {String} arg     [Optional] Key to find in the querystring
	 * @param  {String} qstring [Optional] Query string to parse
	 * @return {Mixed}          Value or Object of key:value pairs
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
	 * @param  {Function} arg Function to reflect
	 * @return {Array}        Array of parameters
	 */
	reflect : function ( arg ) {
		if ( arg === undefined ) {
			arg = this || $;
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

		utility.defer( function () {
			var recursive = function ( fn, ms, id ) {
				var recursive = this;

				if ( fn() !== false ) {
					$.repeating[id] = setTimeout( function () {
						recursive.call( recursive, fn, ms, id );
					}, ms );
				}
				else {
					delete $.repeating[id];
				}
			};

			recursive.call( recursive, fn, ms, id );
		}, ms, id );

		return id;
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
		return element.create( "script", {type: "application/javascript", src: arg}, target || $( "head" )[0], pos );
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
		return element.create( "link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, $( "head" )[0] );
	},

	/**
	 * Stops an Event from bubbling
	 * 
	 * @method stop
	 * @param  {Object} e Event
	 * @return {Object}   Event
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
	 * Returns the Event target
	 * 
	 * @param  {Object} e Event
	 * @return {Object}   Event target
	 */
	target : function ( e ) {
		return e.target || e.srcElement;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @param  {Object} data   JSON Object describing HTML
	 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {Object}        New Element created from the template
	 */
	tpl : function ( arg, target ) {
		var frag;

		if ( typeof arg !== "object" || (!(regex.object_undefined.test( typeof target ) ) && ( target = target.charAt( 0 ) === "#" ? $( target ) : $( target )[0] ) === undefined ) ) {
			throw Error( label.error.invalidArguments );
		}

		if ( target === undefined ) {
			target = $( "body" )[0];
		}

		frag  = document.createDocumentFragment();

		if ( arg instanceof Array ) {
			array.each( arg, function ( i, idx ) {
				element.html(element.create( array.cast( i, true )[0], frag ), array.cast(i)[0] );
			});
		}
		else {
			utility.iterate( arg, function ( v, k ) {
				if ( typeof v === "string" ) {
					element.html( element.create( k, frag ), v );
				}
				else if ( ( v instanceof Array ) || ( v instanceof Object ) ) {
					utility.tpl( v, element.create( k, frag ) );
				}
			});
		}

		target.appendChild( frag );

		return array.last( target.childNodes );
	},

	/**
	 * Generates UUID Version 4
	 *
	 * @method uuid
	 * @param  {Boolean} safe [Optional] Strips - from UUID
	 * @return {String}       UUID
	 */
	uuid : function ( safe ) {
		var s = function () { return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ); },
		    r = [8, 9, "a", "b"],
		    o;

		o = ( s() + s() + "-" + s() + "-4" + s().substr( 0, 3 ) + "-" + r[Math.floor( Math.random() * r.length )] + s().substr( 0, 3 ) + "-" + s() + s() + s() );

		if ( safe === true ) {
			o = o.replace( /-/g, "" );
		}

		return o;
	},

	/**
	 * Walks a structure and returns arg
	 * 
	 * @method  walk
	 * @param  {Mixed}  obj  Object or Array
	 * @param  {String} arg  String describing the property to return
	 * @return {Mixed}       arg
	 */
	walk : function ( obj, arg ) {
		array.each( arg.replace( /\]$/, "" ).replace( /\]/g, "." ).split( /\.|\[/ ), function ( i ) {
			obj = obj[i];
		});

		return obj;
	}
};
