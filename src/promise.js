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
		broken   : "broken",
		initial  : "unresolved",
		complete : "kept",
	},

	// Inherited by promises
	methods : {
		/**
		 * Promise cannot be kept
		 * 
		 * @param  {Function} fn Function to execute upon broken promise
		 * @return {Object}      Promise instance
		 */
		fail : function (fn) {
			promise.vouch.call(this, promise.state.broken, fn);
			return this;
		},

		/**
		 * Keeps a promise
		 * 
		 * @param  {String} arg Promise status
		 * @return {Object}     Promise instance
		 */
		keep : function (arg) {
			promise.resolve.call(this, promise.state.complete, arg);
			return this;
		},

		/**
		 * Returns status of promise
		 * 
		 * @return {String} Status of promise
		 */
		status : function () {
			return this.status;
		},

		/**
		 * When a promise is kept, execute a function
		 * 
		 * @param  {Function} fn Function to execute
		 * @return {Object}      Promise instance
		 */
		when : function (fn) {
			promise.vouch.call(this, promise.state.complete, fn);
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
			broken  : [],
			outcome : null,
			status  : promise.state.initial,
			waiting : []
		};

		instance = utility.extend(promise.methods, params);
		return instance;
	},

	/**
	 * Resolves a promise (kept or broken)
	 * 
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function (state, val) {
		if (this.status !== promise.state.initial) throw Error(label.error.promiseResolved.replace("{{status}}", this.status));

		this.status  = state;
		this.outcome = val;

		this[state === promise.state.complete ? "waiting" : "broken"].each(function (fn) {
			try {
				if (typeof fn === "function") fn(val);
			}
			catch (e) {
				error(e, this, arguments);
			}
		});

		this.broken  = null;
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
		switch (this.status) {
			case promise.state.initial:
				this[state === promise.state.complete ? "waiting" : "broken"].push(fn);
				break;
			case state:
				fn(this.outcome);
		}

		return this;
	}
};
