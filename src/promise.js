/**
 * Promise & answers
 *
 * Used in lieu of observer
 *
 * @class promise
 * @namespace abaaso
 */
var promise = {
	// States of a promise
	state : {
		broken  : "smashed",
		initial : "unresolved",
		kept    : "fulfilled",
	},

	// Inherited by promises
	methods : {
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
		 * Promise is kept
		 * 
		 * @param  {String} arg Promise status
		 * @return {Object}     Promise instance
		 */
		fulfill : function (arg) {
			promise.resolve.call(this, promise.state.kept, arg);
			return this;
		},

		/**
		 * Smashes a Promise
		 * 
		 * @return {String} Status of promise
		 */
		smash : function (arg) {
			promise.resolve.call(this, promise.state.broken, arg);
			return this;
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
		 * @param  {Function} success Executed when/if promise is kept
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           Promise instance
		 */
		when : function (success, failure) {
			if (typeof success !== "function") throw Error(label.error.invalidArguments);
			promise.vouch.call(this, promise.state.kept, success);
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
			failed  : [],
			outcome : null,
			state   : promise.state.initial,
			waiting : []
		};

		instance = utility.extend(promise.methods, params);
		return instance;
	},

	/**
	 * Resolves a Promise (kept or broken)
	 * 
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function (state, val) {
		if (this.state !== promise.state.initial) throw Error(label.error.promiseResolved.replace("{{status}}", this.status));

		this.state   = state;
		this.outcome = val;

		this[state === promise.state.kept ? "waiting" : "failed"].each(function (fn) {
			try {
				if (typeof fn === "function") fn(val);
			}
			catch (e) {
				error(e, this, arguments);
			}
		});

		this.failed  = null;
		this.waiting = null;

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
				this[state === promise.state.kept ? "waiting" : "failed"].add(fn);
				break;
			case state:
				fn(this.outcome);
		}

		return this;
	}
};
