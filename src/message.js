/** @namespace message */
var message = {
	/**
	 * Clears the message listener
	 *
	 * @method clear
	 * @return {Object} abaaso
	 */
	clear : function ( state ) {
		state = state || "all";

		return observer.remove( global, "message", "message", state );
	},

	/**
	 * Posts a message to the target
	 *
	 * @method send
	 * @param  {Object} target Object to receive message
	 * @param  {Mixed}  arg    Entity to send as message
	 * @return {Object}        target
	 */
	send : function ( target, arg ) {
		try {
			target.postMessage( arg, "*" );
		}
		catch ( e ) {
			utility.error( e, arguments, this );
		}

		return target;
	},

	/**
	 * Sets a handler for recieving a message
	 *
	 * @method recv
	 * @param  {Function} fn Callback function
	 * @return {Object}      abaaso
	 */
	recv : function ( fn, state ) {
		state = state || "all";

		return observer.add( global, "message", fn, "message", global, state );
	}
};
