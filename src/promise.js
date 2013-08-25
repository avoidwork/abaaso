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
			return function ( arg ) {
				setTimeout( arg, 0 );
			};
		}
	}(),

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
	freeze : function () {
		return ( typeof Object.freeze === "function" );
	}(),

	/**
	 * Determines if `arg` is a Promise
	 *
	 * @method isPromise
	 * @private
	 * @param  {Mixed} arg Result of a handler
	 * @return {Boolean}   `true` if `arg.then` is a Function
	 */
	isPromise : function ( arg ) {
		return ( arg && typeof arg.then === "function" );
	},

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
			    deferred = promise.factory();

			function handler ( yay, arg ) {
				var fn = yay ? success : failure,
				    result;

				try {
					result = fn( arg );

					if ( promise.isPromise( result ) ) {
						result.then( function ( arg ) {
							self.resolve( arg );
						});
					}
					else {
						deferred.resolve( result );
					}

					return result;
				}
				catch ( e ) {
					deferred.reject( e );

					return e;
				}
			}

			if ( success ) {
				this.fulfill.push( function ( arg ) {
					handler( true, arg );
				});
			}

			if ( failure ) {
				this.error.push( function ( arg ) {
					handler( false, arg );
				});
			}

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
		    pending = false,
		    purge   = -1;

		this.state   = state;
		this.outcome = val;

		array.each( this[handler], function ( i, idx ) {
			var outcome = i( val );

			if ( promise.isPromise( outcome ) ) {
				pending    = true;
				purge      = idx;

				return false;
			}

			return outcome;
		});

		// Reconciled
		if ( !pending ) {
			this.error   = [];
			this.fulfill = [];

			if ( promise.freeze ) {
				Object.freeze( this );
			}
		}
		// Removing handlers that have run
		else {
			array.remove( this[handler], 0, purge );
		}

		return this;
	},

	// States of a promise
	state : {
		broken   : "rejected",
		pending  : "pending",
		resolved : "fulfilled"
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
	this.error      = [];
	this.fulfill    = [];
	this.outcome    = null;
	this.state      = promise.state.pending;
}

// Setting prototype & constructor loop
Promise.prototype = promise.methods;
Promise.prototype.constructor = Promise;
