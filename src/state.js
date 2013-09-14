/** @namespace abaaso.state */
var state = ( function () {
	var prop = {current: "active", previous: null, header: null},
	    getCurrent, setCurrent, getHeader, setHeader, getPrevious, setPrevious;

	/**
	 * Gets current application state
	 *
	 * @method getCurrent
	 * @memberOf abaaso.state
	 * @return {string} Application state
	 */
	getCurrent = function () {
		return prop.current;
	};

	/**
	 * Sets current application state
	 *
	 * @method setCurrent
	 * @memberOf abaaso.state
	 * @param  {string} arg New application state
	 * @return {string}     Application state
	 */
	setCurrent = function ( arg ) {
		if ( arg === null || typeof arg !== "string" || prop[0] === arg || string.isEmpty( arg ) ) {
			throw new Error( label.error.invalidArguments );
		}

		prop.previous = prop.current;
		prop.current  = arg;

		observer.fire( "abaaso", "state", arg );

		return arg;
	};

	/**
	 * Gets current application state header
	 *
	 * @method getHeader
	 * @memberOf abaaso.state
	 * @return {string} Application state header
	 */
	getHeader = function () {
		return prop.header;
	};

	/**
	 * Sets current application state header
	 *
	 * @method setHeader
	 * @memberOf abaaso.state
	 * @param  {string} arg New application state header
	 * @return {string}     Application state header
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
	 * @memberOf abaaso.state
	 * @return {string} Previous application state
	 */
	getPrevious = function () {
		return prop.previous;
	};

	/**
	 * Exists because you can't mix accessor & data descriptors
	 *
	 * @method setPrevious
	 * @memberOf abaaso.state
	 * @return {undefined} undefined
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
