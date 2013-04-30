/**
 * Deferreds
 * 
 * @type {Object}
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
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		always : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onAlways.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is resolved
		 * 
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		done : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onDone.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is rejected
		 * 
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		fail : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onFail.push( arg );

			return this;
		},

		/**
		 * Determines if Deferred is rejected
		 * 
		 * @return {Boolean} `true` if rejected
		 */
		isRejected : function () {
			return ( this.promise.state === promise.state.broken );
		},

		/**
		 * Determines if Deferred is resolved
		 * 
		 * @return {Boolean} `true` if resolved
		 */
		isResolved : function () {
			return ( this.promise.state === promise.state.resolved );
		},

		/**
		 * Rejects the Promise
		 * 
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
		 * @param  {Mixed} arg Resolution outcome
		 * @return {Object}    Deferred
		 */
		resolve : function ( arg ) {
			this.promise.resolve.call( this.promise, arg );

			return this;
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

	utility.when( this.promise ).then( function ( arg ) {
		array.each( self.onDone, function ( i ) {
			i( arg );
		});

		array.each( self.onAlways, function ( i ) {
			i( arg );
		});

		self.onAlways = [];
		self.onDone   = [];
		self.onFail   = [];
	}, function ( arg ) {
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
};

// Setting prototype & constructor loop
Deferred.prototype = deferred.methods;
Deferred.prototype.constructor = Deferred;
