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
	 * Pipes a reconciliation from `parent` to `child`
	 *
	 * @method pipe
	 * @private
	 * @param  {Object} parent Promise
	 * @param  {Object} child  Promise
	 * @return {Undefined}     undefined
	 */
	pipe : function ( parent, child ) {
		parent.then( function ( arg ) {
			child.resolve( arg );
		}, function ( e ) {
			child.reject( e );
		});
	},

	/**
	 * States of a Promise
	 *
	 * @type {Object}
	 */
	state : {
		PENDING : 0,
		FAILURE : 1,
		SUCCESS : 2
	}
};

/**
 * Promise
 *
 * @class Promise
 * @namespace abaaso
 * @method Promise
 * @private
 * @constructor
 * @return {Object} Instance of Promise
 */
function Promise () {
	this.deferred = false;
	this.handlers = [];
	this.state    = promise.state.PENDING;
	this.value    = null;
}

// Setting constructor loop
Promise.prototype.constructor = Promise;

/**
 * Processes `handlers` queue
 *
 * @method process
 * @public
 * @return {Object} Promise
 */
Promise.prototype.process = function() {
	var handlers, result, success, value;

	this.deferred = false;

	if ( this.state === promise.state.PENDING ) {
		return;
	}

	value    = this.value;
	success  = this.state === promise.state.SUCCESS;
	handlers = this.handlers.slice( 0 );

	array.each( handlers, function ( i ) {
		var callback = i[success ? "success" : "failure" ],
		    child    = i.promise;

		if ( !callback || typeof callback !== "function" ) {
			if ( value && typeof value.then === "function" ) {
				promise.pipe( value, child );
			}
			else {
				if ( success ) {
					child.resolve( value );
				} else {
					child.reject( value );
				}
			}

			return;
		}

		try {
			result = callback( value );
		}
		catch ( e ) {
			child.reject( e );

			return;
		}

		if ( result && typeof result.then === "function" ) {
			promise.pipe( result, promise );
		}
		else {
			child.resolve( result );
		}
	});

	return this;
};

/**
 * Breaks a Promise
 *
 * @method reject
 * @public
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise
 */
Promise.prototype.reject = function ( arg ) {
	var self = this;

	if ( this.state > promise.state.PENDING ) {
		return;
	}

	this.value = arg;
	this.state = promise.state.FAILURE;

	if ( !this.deferred ) {
		promise.delay( function () {
			self.process();
		});

		this.deferred = true;
	}

	return this;
};

/**
 * Resolves a Promise
 *
 * @method resolve
 * @public
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise
 */
Promise.prototype.resolve = function ( arg ) {
	var self = this;

	if ( this.state > promise.state.PENDING ) {
		return;
	}

	this.value = arg;
	this.state = promise.state.SUCCESS;

	if ( !this.deferred ) {
		promise.delay( function () {
			self.process();
		} );

		this.deferred = true;
	}

	return this;
};

/**
 * Registers handler(s) for a Promise
 *
 * @method then
 * @public
 * @param  {Function} success [Optional] Success handler for eventual value
 * @param  {Function} failure [Optional] Failure handler for eventual value
 * @return {Object}           New Promise instance
 */
Promise.prototype.then = function ( success, failure ) {
	var self  = this,
	    child = new Promise();

	this.handlers.push( {
		success : success,
		failure : failure,
		promise : child
	} );

	if ( this.state > promise.state.PENDING && !this.deferred ) {
		promise.delay( function () {
			self.process();
		});

		this.deferred = true;
	}

	return child;
};
