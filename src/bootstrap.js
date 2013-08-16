/**
 * Bootstraps framework and sets on $
 *
 * @method bootstrap
 * @private
 * @return {Undefined} undefined
 */
bootstrap = function () {
	var self = this,
	    cleanup, fn;

	// Removes references to deleted DOM elements, avoiding memory leaks
	cleanup = function ( obj ) {
		observer.remove( obj );
		array.each( array.cast( obj.childNodes ), function ( i ) {
			cleanup( i );
		});
	};

	// Repeating function to call init()
	fn = function () {
		if ( regex.complete_loaded.test( document.readyState ) ) {
			if ( typeof self.init === "function" ) {
				self.init.call( self );
			}

			return false;
		}
	};

	// Blocking multiple executions
	delete this.bootstrap;

	// Creating error log
	this.error.log = [];

	// Lazy feature detection
	promise.delay = promise.delay();

	// Describing the Client
	if ( !server ) {
		this.client.size    = client.size();
		this.client.version = client.version = client.version();
		this.client.mobile  = client.mobile.call( this );
		this.client.tablet  = client.tablet.call( this );

		// IE7 and older is not supported
		if ( client.ie && client.version < 8 ) {
			throw new Error( label.error.upgrade );
		}

		// Strategies
		this.array.cast = array.cast();
		this.mouse.view = mouse.view();
		this.property   = utility.property = utility.property();

		if ( Array.prototype.filter === undefined ) {
			Array.prototype.filter = function ( fn, self ) {
				self       = self || this;
				var result = [];

				if ( self === undefined || self === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					if ( fn.call( self, i ) ) {
						result.push( i );
					}
				});

				return result;
			};
		}

		if ( Array.prototype.forEach === undefined ) {
			Array.prototype.forEach = function ( fn, self ) {
				self = self || this;

				if ( this === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					fn.call( self, i );
				});
			};
		}

		if ( Array.prototype.indexOf === undefined ) {
			Array.prototype.indexOf = function( arg, start ) {
				var nth = this.length >> 0,
				    i   = ( start || 0 ) -1;

				if ( this === undefined || this === null || arg === undefined ) {
					throw new Error( label.error.invalidArguments );
				}

				while ( ++i < nth ) {
					if ( this[i] === arg ) {
						return i;
					}
				}

				return -1;
			};
		}

		if ( Array.prototype.map === undefined ) {
			Array.prototype.map = function ( fn, self ) {
				self       = self || this;
				var result = [];

				if ( self === undefined || self === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					result.push( fn.call( self, i ) );
				});

				return result;
			};
		}

		if ( Array.prototype.reduce === undefined ) {
			Array.prototype.reduce = function ( fn, x ) {
				var nth = this.length >> 0,
				    i   = 0;

				if ( this === undefined || this === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				if ( x === undefined ) {
					if ( nth === 0 ) {
						throw new Error( label.error.invalidArguments );
					}

					x = this[0];
					i = 1;
				}

				i--;

				while ( ++i < nth ) {
					x = fn.call( this, x, this[i] );
				}

				return x;
			};
		}

		if ( Element.prototype.getElementsByClassName === undefined ) {
			( function () {
				var getElementsByClassName = function ( arg ) {
					return document.querySelectorAll( "." + arg );
				};

				Element.prototype.getElementsByClassName = HTMLDocument.prototype.getElementsByClassName = getElementsByClassName;
			})();
		}

		if ( document.documentElement.classList === undefined ) {
			( function ( view ) {
				var ClassList, getter, proto, target, descriptor;

				if ( !( "HTMLElement" in view ) && !( "Element" in view ) ) {
					return;
				}

				ClassList = function ( obj ) {
					var classes = string.explode( obj.className, " " ),
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

				proto  = ClassList.prototype = [];
				target = ( view.HTMLElement || view.Element ).prototype;

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
					throw new Error( "Could not create classList shim" );
				}
			})( global );
		}

		if ( Function.prototype.bind === undefined ) {
			Function.prototype.bind = function ( arg ) {
				var fn    = this,
				    args  = slice.call( arguments, 1 );

				return function () {
					return fn.apply( arg, args.concat( slice.call( arguments ) ) );
				};
			};
		}
	}
	else {
		// Strategies
		this.array.cast = array.cast();
		this.property   = utility.property = utility.property();

		// XHR shim
		XMLHttpRequest = xhr();
	}

	// Caching functions
	has   = Object.prototype.hasOwnProperty;
	slice = Array.prototype.slice;

	// Binding helper & namespace to $
	$ = utility.$;
	utility.merge( $, this );
	delete $.init;
	delete $.loading;

	// Setting default routes
	route.reset();

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

	// Setting events & garbage collection
	if ( !server ) {
		observer.add( global, "error", function ( e ) {
			observer.fire( abaaso, "error", e );
		}, "error", global, "all");

		observer.add( global, "hashchange", function ()  {
			var hash = location.hash.replace( /^\#\!?|\?.*|\#.*/g, "" );

			if ( $.route.current !== hash || self.route.current !== hash ) {
				self.route.current = hash;

				if ( $.route.current !== self.route.current ) {
					$.route.current = self.route.current;
				}

				observer.fire( abaaso, "beforeHash, hash, afterHash", location.hash );
			}
		}, "hash", global, "all");

		observer.add( global, "resize", function ()  {
			$.client.size = self.client.size = client.size();
			observer.fire( abaaso, "resize", self.client.size );
		}, "resize", global, "all");

		observer.add( global, "load", function ()  {
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

			if ( obj.id !== undefined && !string.isEmpty( obj.id ) && ( e.relatedNode instanceof Element ) ) {
				cleanup( obj );
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
		$.state.current   = this.state.current   = this.state._current;
		$.state.change    = this.state.change    = function ( arg) { return self.state.current = state.setCurrent(arg ); };
		$.state.setHeader = this.state.setHeader = function ( arg) { return self.state.header  = state.setHeader(arg ); };
	}

	$.ready = this.ready = true;

	// Initializing
	if ( typeof exports !== "undefined" || typeof define == "function" || regex.complete_loaded.test( document.readyState ) ) {
		this.init();
	}
	else if ( typeof document.addEventListener === "function" ) {
		document.addEventListener( "DOMContentLoaded" , function () {
			self.init.call( self );
		}, false);
	}
	else if ( typeof document.attachEvent === "function" ) {
		document.attachEvent( "onreadystatechange" , fn );
	}
	else {
		utility.repeat( fn );
	}
};
