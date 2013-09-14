/**
 * deferred factory
 *
 * @method deferred
 * @memberOf abaaso
 * @return {@link abaaso.Deferred}
 */
var deferred = function () {
	return new Deferred();
};

/**
 * Creates a new Deferred
 *
 * @constructor
 * @memberOf abaaso
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

/**
 * Setting constructor loop
 *
 * @method constructor
 * @private
 * @memberOf abaaso.Deferred
 * @type {function}
 */
Deferred.prototype.constructor = Deferred;

/**
 * Registers a function to execute after Promise is reconciled
 *
 * @method always
 * @memberOf abaaso.Deferred
 * @param  {function} arg Function to execute
 * @return {@link abaaso.Deferred}
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
 * @memberOf abaaso.Deferred
 * @param  {function} arg Function to execute
 * @return {@link abaaso.Deferred}
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
 * @memberOf abaaso.Deferred
 * @param  {function} arg Function to execute
 * @return {@link abaaso.Deferred}
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
 * @memberOf abaaso.Deferred
 * @return {boolean} `true` if rejected
 */
Deferred.prototype.isRejected = function () {
	return ( this.promise.state === promise.state.FAILED );
};

/**
 * Determines if Deferred is resolved
 *
 * @method isResolved
 * @memberOf abaaso.Deferred
 * @return {boolean} `true` if resolved
 */
Deferred.prototype.isResolved = function () {
	return ( this.promise.state === promise.state.SUCCESS );
};

/**
 * Rejects the Promise
 *
 * @method reject
 * @memberOf abaaso.Deferred
 * @param  {mixed} arg Rejection outcome
 * @return {@link abaaso.Deferred}
 */
Deferred.prototype.reject = function ( arg ) {
	this.promise.reject.call( this.promise, arg );

	return this;
};

/**
 * Resolves the Promise
 *
 * @method resolve
 * @memberOf abaaso.Deferred
 * @param  {mixed} arg Resolution outcome
 * @return {@link abaaso.Deferred}
 */
Deferred.prototype.resolve = function ( arg ) {
	this.promise.resolve.call( this.promise, arg );

	return this;
};

/**
 * Gets the state of the Promise
 *
 * @method state
 * @memberOf abaaso.Deferred
 * @return {string} Describes the state
 */
Deferred.prototype.state = function () {
	return this.promise.state;
};

/**
 * Registers handler(s) for the Promise
 *
 * @method then
 * @memberOf abaaso.Deferred
 * @param  {function} success Executed when/if promise is resolved
 * @param  {function} failure [Optional] Executed when/if promise is broken
 * @return {@link abaaso.Promise}
 */
Deferred.prototype.then = function ( success, failure ) {
	return this.promise.then( success, failure );
};
