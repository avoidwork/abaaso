// concated before outro.js
error     = utility.error;
bootstrap = function () {
	var self = this,
	    cleanup, fn;

	// Blocking multiple executions
	delete abaaso.bootstrap;

	// Removes references to deleted DOM elements, avoiding memory leaks
	cleanup = function ( obj ) {
		observer.remove( obj );
		array.each( array.cast( obj.childNodes ), function ( i ) {
			cleanup( i );
		});
	};

	fn = function ( e ) {
		if ( regex.complete_loaded.test( document.readyState ) ) {
			if ( typeof self.init === "function" ) {
				self.init.call(self );
			}

			return false;
		}
	};

	// Describing the Client
	if ( !server ) {
		this.client.size    = client.size();
		this.client.version = client.version = client.version();
		this.client.mobile  = client.mobile.call( this );
		this.client.tablet  = client.tablet.call( this );

		// IE7 and older is not supported
		if ( client.ie && client.version < 8 ) {
			throw Error( label.error.upgrade );
		}

		// Curried
		this.array.cast = array.cast();
		this.mouse.view = mouse.view       = mouse.view();
		this.property   = utility.property = utility.property();

		if ( Array.prototype.filter === undefined ) {
			Array.prototype.filter = function ( fn ) {
				if ( this === void 0 || this === null || typeof fn !== "function" ) throw Error( label.error.invalidArguments );

				var i      = null,
				    t      = Object( this ),
				    nth    = t.length >>> 0,
				    result = [],
				    prop   = arguments[1],
				    val    = null;

				for ( i = 0; i < nth; i++ ) {
					if ( i in t ) {
						val = t[i];

						if ( fn.call( prop, val, i, t ) ) {
							result.push( val );
						}
					}
				}

				return result;
			};
		}

		if ( Array.prototype.forEach === undefined ) {
			Array.prototype.forEach = function ( callback, thisArg ) {
				if ( this === null || typeof callback !== "function" ) throw Error( label.error.invalidArguments );

				var T,
				    k   = 0,
				    O   = Object( this ),
				    len = O.length >>> 0;

				if ( thisArg ) {
					T = thisArg;
				}

				while ( k < len ) {
					var kValue;

					if ( k in O ) {
						kValue = O[k];
						callback.call( T, kValue, k, O );
					}
					k++;
				}
			};
		}

		if ( Array.prototype.indexOf === undefined ) {
			Array.prototype.indexOf = function( obj, start ) {
				for ( var i = (start || 0 ), j = this.length; i < j; i++ ) {
					if ( this[i] === obj ) {
						return i;
					}
				}

				return -1;
			}
		}

		if ( Array.prototype.map === undefined ) {
			Array.prototype.map = function ( callback, thisArg ) {
				var T, A, k;

				if ( this == null ) {
					throw new TypeError( "this is null or not defined" );
				}

				var O = Object( this );
				var len = O.length >>> 0;

				if ( {}.toString.call( callback ) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				if ( thisArg ) {
					T = thisArg;
				}

				A = new Array( len );
				k = 0;

				while ( k < len ) {
					var kValue, mappedValue;

					if ( k in O ) {
						kValue = O[k];
						mappedValue = callback.call( T, kValue, k, O );
						A[k] = mappedValue;
					}
					k++;
				}

				return A;
			}
		}

		if ( Array.prototype.reduce === undefined ) {
			Array.prototype.reduce = function ( accumulator ) {
				if ( this === null || this === undefined ) {
					throw new TypeError( "Object is null or undefined" );
				}

				var i = 0, l = this.length >> 0, curr;

				if ( typeof accumulator !== "function") {
					throw new TypeError( "First argument is not callable" );
				}

				if ( arguments.length < 2 ) {
					if ( l === 0) {
						throw new TypeError( "Array length is 0 and no second argument" );
					}

					curr = this[0];
					i = 1; // start accumulating at the second element
				}
				else {
					curr = arguments[1];
				}

				while ( i < l ) {
					if ( i in this) {
						curr = accumulator.call(undefined, curr, this[i], i, this );
					}

					++i;
				}

				return curr;
			};
		}

		if ( document.documentElement.classList === undefined ) {
			( function (view ) {
				var ClassList, getter, proto, target, descriptor;

				if ( !( "HTMLElement" in view ) && !( "Element" in view ) ) {
					return;
				}

				ClassList = function ( obj ) {
					var classes = !string.isEmpty( obj.className ) ? obj.className.explode( " " ) : [],
					    self    = this;

					array.each( classes, function (i) {
						self.push( i );
					});

					this.updateClassName = function () {
						obj.className = this.join( " " );
					};
				};

				getter = function () {
					return new ClassList( this );
				};

				proto  = ClassList["prototype"] = [];
				target = ( view.HTMLElement || view.Element )["prototype"];

				proto.add = function ( arg ) {
					if ( !array.contains( this, arg ) ) {
						this.push( arg );
						this.updateClassName();
					}
				};

				proto.contains = function ( arg ) {
					return array.contains( this, arg );
				};

				proto.remove = function ( arg ) {
					if ( array.contains(this, arg) ) {
						array.remove( this, arg );
						this.updateClassName();
					}
				};

				proto.toggle = function ( arg ) {
					array[array.contains( this, arg) ? "remove" : "add"]( this, arg );
					this.updateClassName();
				};

				if ( Object.defineProperty ) {
					descriptor = {
						get          : getter,
						enumerable   : !client.ie || client.version > 8 ? true : false,
						configurable : true
					};

					Object.defineProperty( target, "classList", descriptor );
				}
				else if ( Object.prototype.__defineGetter__) {
					target.__defineGetter__( "classList", getter );
				}
				else {
					throw Error( "Could not create classList shim" );
				}
			})( global );
		}

		if ( Function.prototype.bind === undefined ) {
			Function.prototype.bind = function ( arg ) {
				var fn    = this,
				    slice = Array.prototype.slice,
				    args  = slice.call( arguments, 1 );
				
				return function () {
					return fn.apply( arg, args.concat( slice.call( arguments ) ) );
				};
			};
		}
	}
	else {
		// Cookie class is not relevant for server environment
		delete this.cookie;

		// Curried
		this.array.cast = array.cast();
		this.property   = utility.property = utility.property();

		// XHR shim
		XMLHttpRequest = xhr();
	}

	// Binding helper & namespace to $
	$ = utility.$;
	utility.merge( $, this );
	delete $.$;
	delete $.bootstrap;
	delete $.init;
	delete $.loading;

	// Setting default routes
	route.reset();

	// Shortcut to loading.create
	$.loading   = this.loading.create.bind( $.loading );

	// Unbinding observer methods to maintain scope
	$.fire      = this.fire;
	$.on        = this.on;
	$.once      = this.once;
	$.un        = this.un;
	$.listeners = this.listeners;

	// Hooking abaaso into native Objects
	utility.proto( Array, "array" );

	if ( typeof Element !== "undefined" ) {
		utility.proto( Element, "element" );
	}

	if ( client.ie && client.version === 8 ) {
		utility.proto( HTMLDocument, "element" );
	}

	utility.proto( Function, "function" );
	utility.proto( Number, "number" );
	utility.proto( String, "string" );

	// Creating error log
	$.error.log = this.error.log = [];

	// Setting events & garbage collection
	if ( !server ) {
		observer.add( global, "error", function ( e ) {
			observer.fire( abaaso, "error", e );
		}, "error", global, "all");

		observer.add( global, "hashchange", function (e )  {
			var hash = location.hash.replace( /\#|\!\/|\?.*/g, "" );

			if ( $.route.current !== hash || self.route.current !== hash ) {
				self.route.current = hash;

				if ( $.route.current !== self.route.current ) {
					$.route.current = self.route.current;
				}

				observer.fire( abaaso, "beforeHash, hash, afterHash", location.hash );
			}
		}, "hash", global, "all");
		
		observer.add( global, "resize", function ( e )  {
			$.client.size = self.client.size = client.size();
			observer.fire( abaaso, "resize", self.client.size );
		}, "resize", global, "all");
		
		observer.add( global, "load", function ( e )  {
			observer.fire( abaaso, "render" );
			observer.remove( abaaso, "render" );
			observer.remove( this, "load" );
		});
		
		if ( typeof Object.observe === "function" ) {
			observer.add( global, "DOMNodeInserted", function ( e ) {
				var obj = utility.target( e );

				Object.observe( obj, function ( arg ) {
					observer.fire( obj, "change", arg );
				});
			}, "mutation", global, "all");
		}

		observer.add( global, "DOMNodeRemoved", function (e ) {
			var obj = utility.target( e );

			if ( obj.id !== undefined && !string.isEmpty( obj.id ) ) {
				utility.defer( function () {
					if ( $( obj.id ) === undefined ) {
						cleanup( obj );
					}
				}, 100);
			}
		}, "mutation", global, "all");

		// Routing listener
		observer.add( abaaso, "hash", function (arg ) {
			if ( $.route.enabled || self.route.enabled ) {
				route.load( arg );
			}
		}, "route", this.route, "all");
	}

	// Creating a public facade for `state`
	if ( !client.ie || client.version > 8 ) {
		utility.property( this.state, "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( this.state, "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( this.state, "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
		utility.property( $.state,    "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( $.state,    "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( $.state,    "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
	}
	else {
		// Pure hackery, only exists when needed
		$.state.current   = self.state.current   = self.state._current;
		$.state.change    = this.state.change    = function ( arg) { return self.state.current = state.setCurrent(arg ); };
		$.state.setHeader = this.state.setHeader = function ( arg) { return self.state.header  = state.setHeader(arg ); };
	}

	$.ready = true;

	// Preparing init()
	switch ( true ) {
		case typeof exports !== "undefined":
		case typeof define === "function":
			this.init();
			break;
		case ( regex.complete_loaded.test( document.readyState ) ):
			this.init();
			break;
		case typeof document.addEventListener === "function":
			document.addEventListener( "DOMContentLoaded" , function () {
				self.init.call( self );
			}, false);
			break;
		case typeof document.attachEvent === "function":
			document.attachEvent( "onreadystatechange" , fn );
			break;
		default:
			utility.repeat( fn );
	}

	return $;
};
