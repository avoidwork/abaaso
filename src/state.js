/**
 * abaaso application state
 * 
 * @type {Object}
 */
var state = (function () {
	var _current = "active",
	    header   = null,
	    previous = null,
	    getter, setter;

	/**
	 * Gets current application state
	 * 
	 * @return {String} Application state
	 */
	getter = function () {
		return _current;
	};

	/**
	 * Sets current application state
	 * 
	 * @param  {String} arg New application state
	 * @return {String}     Application state
	 */
	setter = function (arg) {
		if (arg === null || typeof arg !== "string" || current === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

		previous = _current;
		_current = arg;

		observer.fire(abaaso, "state", arg);

		return arg;
	};

	return {
		header   : header,
		previous : previous,
		getter   : getter,
		setter   : setter
	};
})();
