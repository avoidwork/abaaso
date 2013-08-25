/**
 * deferred factory
 *
 * @method deferred
 * @public
 * @return {Object} Deferred
 */
var deferred = function () {
	return new Deferred();
};

/**
 * Deferred
 *
 * @class Deferred
 * @namespace abaaso
 * @method Deferred
 * @constructor
 */
function Deferred () {
	var self      = this;

	this.promise  = promise.factory();
	this.onDone   = [];
	this.onAlways = [];
	this.onFail   = [];

	// Setting handlers to execute Arrays of Functions
	this.promise.then( function ( arg ) {
		promise.delay( function () {
			array.each( self.onDone, function ( i ) {
				i( arg );
			});

			array.each( self.onAlways, function ( i ) {
				i( arg );
			});

			self.onAlways = [];
			self.onDone   = [];
			self.onFail   = [];
		});
	}, function ( arg ) {
		promise.delay( function () {
			array.each( self.onFail, function ( i ) {
				i( arg );
			});

			array.each( self.onAlways, function ( i ) {
				i( arg );
			});

			self.onAlways = [];
			self.onDone   = [];
			self.onFail   = [];
		});
	});
}

// Setting constructor loop
Deferred.prototype.constructor = Deferred;

/**
 * Registers a function to execute after Promise is reconciled
 *
 * @method always
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred
 */
Deferred.prototype.always = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onAlways.push( arg );

	return this;
};

/**
 * Registers a function to execute after Promise is resolved
 *
 * @method done
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred
 */
Deferred.prototype.done = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onDone.push( arg );

	return this;
};

/**
 * Registers a function to execute after Promise is rejected
 *
 * @method fail
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred
 */
Deferred.prototype.fail = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onFail.push( arg );

	return this;
};

/**
 * Determines if Deferred is rejected
 *
 * @method isRejected
 * @return {Boolean} `true` if rejected
 */
Deferred.prototype.isRejected = function () {
	return ( this.promise.state === promise.state.FAILED );
};

/**
 * Determines if Deferred is resolved
 *
 * @method isResolved
 * @return {Boolean} `true` if resolved
 */
Deferred.prototype.isResolved = function () {
	return ( this.promise.state === promise.state.SUCCESS );
};

/**
 * Rejects the Promise
 *
 * @method reject
 * @param  {Mixed} arg Rejection outcome
 * @return {Object}    Deferred
 */
Deferred.prototype.reject = function ( arg ) {
	this.promise.reject.call( this.promise, arg );

	return this;
};

/**
 * Resolves the Promise
 *
 * @method resolve
 * @param  {Mixed} arg Resolution outcome
 * @return {Object}    Deferred
 */
Deferred.prototype.resolve = function ( arg ) {
	this.promise.resolve.call( this.promise, arg );

	return this;
};

/**
 * Gets the state of the Promise
 *
 * @method state
 * @return {String} Describes the state
 */
Deferred.prototype.state = function () {
	return this.promise.state;
};

/**
 * Registers handler(s) for the Promise
 *
 * @method then
 * @param  {Function} success Executed when/if promise is resolved
 * @param  {Function} failure [Optional] Executed when/if promise is broken
 * @return {Object}           New Promise instance
 */
Deferred.prototype.then = function ( success, failure ) {
	return this.promise.then( success, failure );
};
