/**
 * Deferreds
 *
 * @type {Object}
 * @namespace abaaso
 */
var deferred = {
	/**
	 * Deferred factory
	 *
	 * @method factory
	 * @return {Object} Deferred
	 */
	factory : function () {
		return new Deferred();
	},

	// Inherited by deferreds
	methods : {
		/**
		 * Registers a function to execute after Promise is reconciled
		 *
		 * @method always
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		always : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw new Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onAlways.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is resolved
		 *
		 * @method done
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		done : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw new Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onDone.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is rejected
		 *
		 * @method fail
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		fail : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw new Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onFail.push( arg );

			return this;
		},

		/**
		 * Determines if Deferred is rejected
		 *
		 * @method isRejected
		 * @return {Boolean} `true` if rejected
		 */
		isRejected : function () {
			return ( this.promise.state === promise.state.broken );
		},

		/**
		 * Determines if Deferred is resolved
		 *
		 * @method isResolved
		 * @return {Boolean} `true` if resolved
		 */
		isResolved : function () {
			return ( this.promise.state === promise.state.resolved );
		},

		/**
		 * Rejects the Promise
		 *
		 * @method reject
		 * @param  {Mixed} arg Rejection outcome
		 * @return {Object}    Deferred
		 */
		reject : function ( arg ) {
			this.promise.reject.call( this.promise, arg );

			return this;
		},

		/**
		 * Resolves the Promise
		 *
		 * @method resolve
		 * @param  {Mixed} arg Resolution outcome
		 * @return {Object}    Deferred
		 */
		resolve : function ( arg ) {
			this.promise.resolve.call( this.promise, arg );

			return this;
		},

		/**
		 * Gets the state of the Promise
		 *
		 * @method state
		 * @return {String} Describes the state
		 */
		state : function () {
			return this.promise.state;
		},

		/**
		 * Registers handler(s) for the Promise
		 *
		 * @method then
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		then : function ( success, failure ) {
			return this.promise.then( success, failure );
		}
	}
};


/**
 * Deferred factory
 *
 * @class Deferred
 * @namespace abaaso
 * @return {Object} Instance of Deferred
 */
function Deferred () {
	var self      = this;

	this.promise  = promise.factory();
	this.onDone   = [];
	this.onAlways = [];
	this.onFail   = [];

	// Setting handlers to execute Arrays of Functions
	this.promise.then( function ( arg ) {
		utility.defer( function () {
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
		utility.defer( function () {
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

// Setting prototype & constructor loop
Deferred.prototype = deferred.methods;
Deferred.prototype.constructor = Deferred;
