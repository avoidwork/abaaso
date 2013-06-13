/**
 * Application state
 *
 * @class state
 * @namespace abaaso
 */
var state = ( function () {
	var prop = {current: "active", previous: null, header: null},
	    getCurrent, setCurrent, getHeader, setHeader, getPrevious, setPrevious;

	/**
	 * Gets current application state
	 *
	 * @method getCurrent
	 * @return {String} Application state
	 */
	getCurrent = function () {
		return prop.current;
	};

	/**
	 * Sets current application state
	 *
	 * @method setCurrent
	 * @param  {String} arg New application state
	 * @return {String}     Application state
	 */
	setCurrent = function ( arg ) {
		if ( arg === null || typeof arg !== "string" || prop[0] === arg || string.isEmpty( arg ) ) {
			throw new Error( label.error.invalidArguments );
		}

		prop.previous = prop.current;
		prop.current  = arg;

		observer.fire( abaaso, "state", arg );

		return arg;
	};

	/**
	 * Gets current application state header
	 *
	 * @method getHeader
	 * @return {String} Application state header
	 */
	getHeader = function () {
		return prop.header;
	};

	/**
	 * Sets current application state header
	 *
	 * @method setHeader
	 * @param  {String} arg New application state header
	 * @return {String}     Application state header
	 */
	setHeader = function ( arg ) {
		if ( arg !== null && ( typeof arg !== "string" || prop.header === arg || string.isEmpty( arg ) ) ) {
			throw new Error( label.error.invalidArguments );
		}

		prop.header = arg;

		return arg;
	};

	/**
	 * Gets previous application state
	 *
	 * @method getPrevious
	 * @return {String} Previous application state
	 */
	getPrevious = function () {
		return prop.previous;
	};

	/**
	 * Exists because you can't mix accessor & data descriptors
	 *
	 * @method setPrevious
	 * @return {Undefined} undefined
	 */
	setPrevious = function () {
		throw new Error( label.error.readOnly );
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
