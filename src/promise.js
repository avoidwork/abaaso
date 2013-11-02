/** @namespace promise */
var promise = {
	/**
	 * Async delay strategy
	 *
	 * @method delay
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
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		return new Promise();
	},

	/**
	 * Pipes a reconciliation from `parent` to `child`
	 *
	 * @method pipe
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
	 * Initiates processing a Promise
	 *
	 * @memberOf process
	 * @param  {Object} obj   Promise instance
	 * @param  {Mixed}  arg   Promise value
	 * @param  {Number} state State, e.g. "1"
	 * @return {Object}       Promise instance
	 */
	process : function ( obj, arg, state ) {
		if ( obj.state > promise.state.PENDING ) {
			return;
		}

		obj.value = arg;
		obj.state = state;

		if ( !obj.deferred ) {
			promise.delay( function () {
				obj.process();
			});

			obj.deferred = true;
		}

		return obj;
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
 * @method Promise
 * @constructor
 * @return {Object} Promise instance
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
 * @return {Object} Promise instance
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
			utility.error( e, value, this );
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
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise instance
 */
Promise.prototype.reject = function ( arg ) {
	return promise.process( this, arg, promise.state.FAILURE );
};

/**
 * Resolves a Promise
 *
 * @method resolve
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise instance
 */
Promise.prototype.resolve = function ( arg ) {
	return promise.process( this, arg, promise.state.SUCCESS );
};

/**
 * Registers handler(s) for a Promise
 *
 * @method then
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
