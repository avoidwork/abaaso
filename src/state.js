/**
 * abaaso application state
 * 
 * @class state
 * @namespace abaaso
 */
var state = (function () {
	var prop = ["active", null, null], // current, previous, header
	    getCurrent, setCurrent, getHeader, setHeader, getPrevious, setPrevious;

	/**
	 * Gets current application state
	 * 
	 * @method getCurrent
	 * @return {String} Application state
	 */
	getCurrent = function () {
		return utility.clone(prop[0]);
	};

	/**
	 * Sets current application state
	 * 
	 * @method setCurrent
	 * @param  {String} arg New application state
	 * @return {String}     Application state
	 */
	setCurrent = function (arg) {
		if (arg === null || typeof arg !== "string" || prop[0] === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

		prop[1] = utility.clone(prop[0]);
		prop[0] = arg;
		observer.fire(abaaso, "state", arg);
		return arg;
	};

	/**
	 * Gets current application state header
	 * 
	 * @method getHeader
	 * @return {String} Application state header
	 */
	getHeader = function () {
		return utility.clone(prop[2]);
	};

	/**
	 * Sets current application state header
	 * 
	 * @method setHeader
	 * @param  {String} arg New application state header
	 * @return {String}     Application state header
	 */
	setHeader = function (arg) {
		if (arg !== null && (typeof arg !== "string" || prop[2] === arg || arg.isEmpty())) throw Error(label.error.invalidArguments);

		prop[2] = arg;
		return arg;
	};

	/**
	 * Gets previous application state
	 * 
	 * @method getPrevious
	 * @return {String} Previous application state
	 */
	getPrevious = function () {
		return utility.clone(prop[1]);
	};

	/**
	 * Exists because you can't mix accessor & data descriptors
	 *
	 * @method setPrevious
	 * @return {Undefined} undefined
	 */
	setPrevious = function () {
		throw Error(label.error.readOnly);
	};

	// interface
	return {
		getCurrent  : getCurrent,
		setCurrent  : setCurrent,
		getHeader   : getHeader,
		setHeader   : setHeader,
		getPrevious : getPrevious,
		setPrevious : setPrevious
	};
})();
