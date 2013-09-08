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

	// Describing the Client
	if ( !server ) {
		this.client.version = client.version = client.version();
		this.client.mobile  = client.mobile.call( this );
		this.client.tablet  = client.tablet.call( this );

		// IE8 and older is not supported
		if ( client.ie && client.version < 9 ) {
			throw new Error( label.error.upgrade );
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
						enumerable   : true,
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
	}
	else {
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

	// Setting events & garbage collection
	if ( !server ) {
		observer.add( global, "error", function ( e ) {
			observer.fire( abaaso, "error", e );
		}, "error", global, "all");

		observer.add( global, "hashchange", function ()  {
			observer.fire( abaaso, "beforeHash, hash, afterHash", location.hash );
		}, "hash", global, "all" );

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
	}

	// Creating a public facade for `state`
	utility.property( this.state, "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
	utility.property( this.state, "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
	utility.property( this.state, "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
	utility.property( $.state,    "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
	utility.property( $.state,    "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
	utility.property( $.state,    "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );

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
