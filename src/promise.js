/**
 * Promises/A
 *
 * @class promise
 * @namespace abaaso
 */
var promise = {
	// States of a promise
	state : {
		broken   : "failed",
		initial  : "unfulfilled",
		resolved : "fulfilled",
	},

	// Inherited by promises
	methods : {
		/**
		 * Promise is resolved
		 * 
		 * @param  {String} arg Promise status
		 * @return {Object}     Promise instance
		 */
		done : function (arg) {
			promise.resolve.call(this, promise.state.resolved, arg);
			return this;
		},

		/**
		 * Promise is broken
		 * 
		 * @param  {Function} fn Function to execute upon broken promise
		 * @return {Object}      Promise instance
		 */
		fail : function (fn) {
			promise.vouch.call(this, promise.state.broken, fn);
			return this;
		},

		/**
		 * Breaks a Promise
		 * 
		 * @return {String} Status of promise
		 */
		reject : function (arg) {
			promise.resolve.call(this, promise.state.broken, arg);
			return this;
		},

		/**
		 * Returns a boolean indicating state of the Promise
		 * 
		 * @return {Boolean} `true` if resolved
		 */
		resolved : function () {
			return (this.state === promise.state.broken || this.state === promise.state.resolved);
		},

		/**
		 * Returns status of a Promise
		 * 
		 * @return {String} Status of promise
		 */
		status : function () {
			return this.state;
		},

		/**
		 * Registers handlers for a Promise
		 * 
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           Promise instance
		 */
		then : function (success, failure) {
			if (typeof success !== "function") throw Error(label.error.invalidArguments);
			promise.vouch.call(this, promise.state.resolved, success);
			if (typeof failure === "function") this.fail(failure);
			return this;
		}
	},

	/**
	 * Promise factory
	 * 
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		var instance = {},
		    params   = {};

		// Promise structure
		params = {
			error     : [],
			fulfilled : [],
			outcome   : null,
			state     : promise.state.initial
		};

		instance = utility.extend(promise.methods, params);
		return instance;
	},

	/**
	 * Resolves a Promise (resolved or broken)
	 * 
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function (state, val) {
		if (this.state !== promise.state.initial) throw Error(label.error.promiseResolved.replace("{{status}}", this.status));

		this.state   = state;
		this.outcome = val;

		this[state === promise.state.resolved ? "fulfilled" : "error"].each(function (fn) {
			try {
				if (typeof fn === "function") fn(val);
			}
			catch (e) {
				error(e, this, arguments);
			}
		});

		this.error     = null;
		this.fulfilled = null;

		return this;
	},

	/**
	 * Vouches for a state
	 * 
	 * @param  {String}   state Promise descriptor
	 * @param  {Function} fn    Function to execute
	 * @return {Object}         Promise instance
	 */
	vouch : function (state, fn) {
		if (String(state).isEmpty() || typeof fn !== "function") throw Error(label.error.invalidArguments);
		switch (this.state) {
			case promise.state.initial:
				this[state === promise.state.resolved ? "fulfilled" : "error"].add(fn);
				break;
			case state:
				fn(this.outcome);
		}

		return this;
	}
};
