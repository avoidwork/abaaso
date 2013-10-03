/**
 * @namespace abaaso.promise
 * @private
 */
var promise = {
	/**
	 * Async delay strategy
	 *
	 * @method delay
	 * @memberOf abaaso.promise
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
	 * @memberOf abaaso.promise
	 * @return {Object} {@link abaaso.Promise}
	 */
	factory : function () {
		return new Promise();
	},

	/**
	 * Pipes a reconciliation from `parent` to `child`
	 *
	 * @method pipe
	 * @memberOf abaaso.promise
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
	 * @memberOf abaaso.promise
	 * @type {Object}
	 */
	state : {
		PENDING : 0,
		FAILURE : 1,
		SUCCESS : 2
	}
};

/**
 * Creates a new Promise
 *
 * @constructor
 * @memberOf abaaso
 */
function Promise () {
	this.deferred = false;
	this.handlers = [];
	this.state    = promise.state.PENDING;
	this.value    = null;
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso.Promise
 * @private
 * @type {Function}
 */
Promise.prototype.constructor = Promise;

/**
 * Processes `handlers` queue
 *
 * @method process
 * @memberOf abaaso.Promise
 * @return {Object} {@link abaaso.Promise}
 */
Promise.prototype.process = function() {
	var result, success, value;

	this.deferred = false;

	if ( this.state === promise.state.PENDING ) {
		return;
	}

	value   = this.value;
	success = this.state === promise.state.SUCCESS;

	array.each( this.handlers.slice(), function ( i ) {
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
 * @memberOf abaaso.Promise
 * @param  {Mixed} arg Promise value
 * @return {Object} {@link abaaso.Promise}
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
 * @memberOf abaaso.Promise
 * @param  {Mixed} arg Promise value
 * @return {Object} {@link abaaso.Promise}
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
 * @memberOf abaaso.Promise
 * @param  {Function} success [Optional] Success handler for eventual value
 * @param  {Function} failure [Optional] Failure handler for eventual value
 * @return {Object} {@link abaaso.Promise}
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
