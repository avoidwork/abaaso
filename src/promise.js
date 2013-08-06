/**
 * Promises/A+
 *
 * @class promise
 * @namespace abaaso
 */
var promise = {
	/**
	 * Async delay strategy
	 *
	 * @method delay
	 * @private
	 * @return {Function} Delay method
	 */
	delay : function () {
		if ( typeof setImmediate !== "undefined" ) {
			return setImmediate;
		}
		else if ( typeof process !== "undefined" ) {
			return process.nextTick;
		}
		else {
			return utility.defer;
		}
	},

	/**
	 * Promise factory
	 *
	 * @method factory
	 * @public
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		return new Promise();
	},

	/**
	 * Caching if this function is available
	 *
	 * @private
	 * @return {Boolean} `true` if `Object.freeze` is supported
	 */
	freeze : ( function () {
		return ( typeof Object.freeze === "function" );
	})(),

	// Inherited by promises
	methods : {
		/**
		 * Breaks a Promise
		 *
		 * @method reject
		 * @public
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object} Promise
		 */
		reject : function ( arg ) {
			var self = this;

			promise.delay( function () {
				promise.resolve.call( self, promise.state.broken, arg );
			});

			return this;
		},

		/**
		 * Promise is resolved
		 *
		 * @method resolve
		 * @public
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object}    Promise
		 */
		resolve : function ( arg ) {
			var self = this;

			promise.delay( function () {
				promise.resolve.call( self, promise.state.resolved, arg );
			});

			return this;
		},

		/**
		 * Returns a boolean indicating state of the Promise
		 *
		 * @method resolved
		 * @public
		 * @return {Boolean} `true` if resolved
		 */
		resolved : function () {
			return ( this.state === promise.state.broken || this.state === promise.state.resolved );
		},

		/**
		 * Registers handler(s) for a Promise
		 *
		 * @method then
		 * @public
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		then : function ( success, failure ) {
			var self     = this,
			    deferred = promise.factory(),
			    fn;

			/**
			 * Vouched handler
			 *
			 * @method fn
			 * @private
			 * @param  {Boolean} yay `true` if resolved
			 * @return {Mixed}       Result
			 */
			fn = function ( yay ) {
				var handler = yay ? success : failure,
				    error   = yay ? false   : true,
				    result;

				try {
					result = handler.call( undefined, self.outcome );
					error  = false;
				}
				catch ( e ) {
					result = e;
					error  = true;

					if ( result !== undefined && result !== null && !( result instanceof Error ) ) {
						// Encoding Array or Object as a JSON string for transmission
						if ( typeof result === "object" ) {
							result = json.encode( result );
						}

						// Casting to an Error to fix context
						result = new Error( result );
					}

					// Logging error
					utility.error( result, [self.outcome], self );
				}
				finally {
					// Not a Promise, passing result & chaining if applicable
					if ( !( result instanceof Promise ) ) {
						// This is clearly a mistake on the dev's part
						if ( error && result === undefined ) {
							throw new Error( label.error.invalidArguments );
						}
						else {
							deferred[!error ? "resolve" : "reject"]( result || self.outcome );
						}
					}
					// Assuming a `pending` state until `result` is resolved
					else {
						self.state        = promise.state.pending;
						self.outcome      = null;
						result.parentNode = self;
						result.then( function ( arg ) {
							array.each( self.childNodes, function ( i ) {
								i.resolve( arg );
							});
						}, function ( e ) {
							array.each( self.childNodes, function ( i ) {
								i.reject( e );
							});
						});
					}

					return result;
				}
			};

			if ( typeof success === "function" ) {
				promise.vouch.call( this, promise.state.resolved, function () {
					return fn( true );
				});
			}

			if ( typeof failure === "function" ) {
				promise.vouch.call( this, promise.state.broken, function () {
					return fn( false );
				});
			}

			// Setting references
			deferred.parentNode = self;
			self.childNodes.push( deferred );

			return deferred;
		}
	},

	/**
	 * Resolves a Promise (fulfilled or failed)
	 *
	 * @method resolve
	 * @public
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function ( state, val ) {
		var handler = state === promise.state.broken ? "error" : "fulfill",
		    self    = this,
		    pending = false,
		    error   = false,
		    purge   = [],
		    i, reason, result;

		if ( this.state !== promise.state.pending ) {
			// Walking "forward" from a reverse chain or a fork, we've already been here...
			if ( ( this.parentNode !== null && this.parentNode.state === promise.state.resolved ) || this.childNodes.length > 0 ) {
				return;
			}
			else {
				throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.outcome ) );
			}
		}

		this.state   = state;
		this.outcome = val;

		// The state & outcome can mutate here
		array.each( this[handler], function ( fn, idx ) {
			result = fn.call( self, val );
			purge.push( idx );

			if ( result instanceof Promise ) {
				pending      = true;
				self.outcome = null;
				self.state   = promise.state.pending;

				return false;
			}
			else if ( result instanceof Error ) {
				error  = true;
				reason = result;
				state  = promise.state.broken;
			}
		});

		if ( !pending ) {
			this.error   = [];
			this.fulfill = [];

			// Possible jump to 'resolve' logic
			if ( !error ) {
				result = reason;
				state  = promise.state.resolved;
			}

			// Reverse chaining
			if ( this.parentNode !== null && this.parentNode.state === promise.state.pending ) {
				this.parentNode[state === promise.state.resolved ? "resolve" : "reject"]( result || this.outcome );
			}

			// Freezing promise
			if ( promise.freeze ) {
				Object.freeze( this );
			}

			return this;
		}
		else {
			// Removing handlers that have run
			i = purge.length;
			while ( i-- ) {
				array.remove( self[handler], purge[i] );
			}

			return result;
		}
	},

	// States of a promise
	state : {
		broken   : "rejected",
		pending  : "pending",
		resolved : "fulfilled"
	},

	/**
	 * Vouches for a state
	 *
	 * @method vouch
	 * @public
	 * @param  {String}   state Promise descriptor
	 * @param  {Function} fn    Function to execute
	 * @return {Object}         Promise instance
	 */
	vouch : function ( state, fn ) {
		if ( string.isEmpty( state ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( this.state === promise.state.pending ) {
			this[state === promise.state.resolved ? "fulfill" : "error"].push( fn );
		}
		else if ( this.state === state ) {
			fn( this.outcome );
		}

		return this;
	}
};

/**
 * Promise factory
 *
 * @class Promise
 * @namespace abaaso
 * @method Promise
 * @private
 * @constructor
 * @return {Object} Instance of Promise
 */
function Promise () {
	this.childNodes = [];
	this.error      = [];
	this.fulfill    = [];
	this.parentNode = null;
	this.outcome    = null;
	this.state      = promise.state.pending;
}

// Setting prototype & constructor loop
Promise.prototype = promise.methods;
Promise.prototype.constructor = Promise;
