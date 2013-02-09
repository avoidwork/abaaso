/**
 * Promises/A+
 *
 * @class promise
 * @namespace abaaso
 */
var promise = {
	/**
	 * Promise factory
	 * 
	 * @method factory
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		return new Promise();
	},

	// Inherited by promises
	methods : {
		/**
		 * Breaks a Promise
		 * 
		 * @method reject
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object} Promise
		 */
		reject : function (arg) {
			var self = this;

			utility.defer(function () {
				promise.resolve.call(self, promise.state.broken, arg);
			});

			return this;
		},

		/**
		 * Promise is resolved
		 * 
		 * @method resolve
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object}    Promise
		 */
		resolve : function (arg) {
			var self = this;

			utility.defer(function () {
				promise.resolve.call(self, promise.state.resolved, arg);
			});

			return this;
		},

		/**
		 * Returns a boolean indicating state of the Promise
		 * 
		 * @method resolved
		 * @return {Boolean} `true` if resolved
		 */
		resolved : function () {
			return (this.state === promise.state.broken || this.state === promise.state.resolved);
		},

		/**
		 * Registers handler(s) for a Promise
		 * 
		 * @method then
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
				    result, outcome;

				try {
					if (typeof handler !== "function") throw self.outcome;
					result = handler(self.outcome);
					if (!(result instanceof Promise) && !yay && instance.state === promise.state.initial && instance.fulfill.length > 0) self.state = promise.state.resolved
				}
				catch (e) {
					result     = e.message || e;
					self.state = promise.state.broken;
				}
				finally {
					// Not a Promise, passing result
					if (!(result instanceof Promise)) {
						outcome = result;

						// Determining what the result will be and chaining events
						if (instance.fulfill.length === 0 && instance.error.length === 0)              result = self;
						else if (self.state === promise.state.resolved && instance.fulfill.length > 0) result = instance.resolve(outcome);
						else if (self.state === promise.state.broken && instance.error.length > 0)     result = instance.reject(outcome);

						self.state   = result.state;
						self.outcome = result.outcome;
						
						return self.outcome;
					}
					// Assuming a `pending` state until `result` is resolved
					else {
						self.state        = promise.state.pending;
						self.outcome      = null;
						result.parentNode = self;
						result.then(function (arg) {
							self.state = promise.state.initial;
							self.resolve(arg);
						}, function (arg) {
							self.state = promise.state.initial;
							self.reject(arg);
						});
						return result;
					}
				}
			};

			if (typeof success === "function") promise.vouch.call(this, promise.state.resolved, function () { return fn(true);  });
			if (typeof failure === "function") promise.vouch.call(this, promise.state.broken,   function () { return fn(false); });

			// Setting reference to `self`
			instance.parentNode = self;
			return instance;
		}
	},

	/**
	 * Resolves a Promise (fulfilled or failed)
	 * 
	 * @method resolve
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function (state, val) {
		var handler = state === promise.state.broken ? "error" : "fulfill",
		    self    = this,
		    pending = false,
		    result;

		if (this.state === promise.state.pending) throw Error(label.error.promisePending);
		if (this.state !== promise.state.initial) throw Error(label.error.promiseResolved.replace("{{outcome}}", this.outcome));

		this.state     = state;
		this.outcome   = val;

		// The state & outcome can mutate here
		array.each(this[handler], function (fn) {
			result = fn.call(this, val);
			if (result instanceof Promise) {
				pending      = true;
				self.state   = promise.state.initial
				self.outcome = null;
				return false;
			}
		});

		if (!pending) {
			this.error   = [];
			this.fulfill = [];

			// Reverse chaining
			if (this.parentNode !== null && this.parentNode.state === promise.state.initial) {
				result = this.parentNode[state === promise.state.resolved ? "resolve" : "reject"](this.outcome);
				if (result instanceof Promise) return result;
			}

			// Freezing promise
			if (typeof Object.freeze === "function") Object.freeze(this);

			return this;
		}
		else return result;
	},

	// States of a promise
	state : {
		broken   : "failed",
		initial  : "unfulfilled",
		pending  : "pending",
		resolved : "fulfilled"
	},

	/**
	 * Vouches for a state
	 * 
	 * @method vouch
	 * @param  {String}   state Promise descriptor
	 * @param  {Function} fn    Function to execute
	 * @return {Object}         Promise instance
	 */
	vouch : function (state, fn) {
		if (String(state).isEmpty()) throw Error(label.error.invalidArguments);

		if (this.state === promise.state.initial) this[state === promise.state.resolved ? "fulfill" : "error"].push(fn);
		else if (this.state === state) fn(this.outcome);

		return this;
	}
};

/**
 * Promise factory
 *
 * @class Promise
 * @namespace abaaso
 * @return {Object} Instance of Promise
 */
function Promise () {
	this.error      = [];
	this.fulfill    = [];
	this.parentNode = null;
	this.outcome    = null;
	this.state      = promise.state.initial;
};

// Setting prototype & constructor loop
Promise.prototype = promise.methods;
Promise.prototype.constructor = Promise;
