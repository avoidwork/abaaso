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
		 * Registers a failure handler for a Promise
		 * 
		 * @param  {Function} fn Executed when/if promise is broken
		 * @return {Object}      Promise instance
		 */
		fail : function (fn) {
			return promise.vouch.call(this, promise.state.broken, fn);
		},

		/**
		 * Breaks a Promise
		 * 
		 * @return {String} Status of promise
		 */
		reject : function (arg) {
			return promise.resolve.call(this, promise.state.broken, arg);
		},

		/**
		 * Promise is resolved
		 * 
		 * @param  {String} arg Promise status
		 * @return {Object}     Promise instance
		 */
		resolve : function (arg) {
			return promise.resolve.call(this, promise.state.resolved, arg);
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
		 * Registers handler(s) for a Promise
		 * 
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		then : function (success, failure) {
			var self     = this,
			    instance = promise.factory(),
			    fn;

			fn = function (yay) {
				var handler = yay ? success : failure,
				    result;

				try {
					if (typeof handler !== "function") throw self.outcome;
					result = handler(self.outcome);
					if (!yay && typeof instance.fulfilled === "function") self.state = promise.state.resolved
				}
				catch (e) {
					result     = e.message || e;
					self.state = promise.state.broken;
				}
				finally {
					if (typeof result !== "undefined") self.outcome = result;
					switch (true) {
						case instance.fulfilled === null && instance.error === null:
							result = self;
							break;
						case self.state === promise.state.resolved && instance.fulfilled !== null:
							result = instance.resolve(self.outcome);
							break;
						case self.state === promise.state.broken && instance.error !== null:
							result = instance.reject(self.outcome);
							break;
					}
				}

				self.state   = result.state;
				self.outcome = result.outcome;

				return self.outcome;
			};

			promise.vouch.call(this, promise.state.resolved, function () { fn(true); });
			if (typeof failure === "function") this.fail(function () { fn(false); });
			return instance;
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
			error     : null,
			fulfilled : null,
			outcome   : null,
			state     : promise.state.initial
		};

		instance = utility.extend(promise.methods, params);
		return instance;
	},

	/**
	 * Resolves a Promise (fulfilled or failed)
	 * 
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function (state, val) {
		var handler = state === promise.state.resolved ? "fulfilled" : "error";

		if (this.state !== promise.state.initial) throw Error(label.error.promiseResolved.replace("{{outcome}}", this.outcome));

		this.state     = state;
		this.outcome   = val;

		// The state & outcome can mutate here
		this[handler](val);

		this.error     = null;
		this.fulfilled = null;

		if (typeof Object.freeze === "function") Object.freeze(this);

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
		if (String(state).isEmpty()) throw Error(label.error.invalidArguments);

		switch (this.state) {
			case promise.state.initial:
				this[state === promise.state.resolved ? "fulfilled" : "error"] = fn;
				break;
			case state:
				fn(this.outcome);
		}

		return this;
	}
};
