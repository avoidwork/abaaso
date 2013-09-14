/** @namespace abaaso.message */
var message = {
	/**
	 * Clears the message listener
	 *
	 * @method clear
	 * @memberOf abaaso.message
	 * @return {object} abaaso
	 */
	clear : function ( state ) {
		state = state || "all";

		return observer.remove( global, "message", "message", state );
	},

	/**
	 * Posts a message to the target
	 *
	 * @method send
	 * @memberOf abaaso.message
	 * @param  {object} target Object to receive message
	 * @param  {mixed}  arg    Entity to send as message
	 * @return {object}        target
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
	 * @memberOf abaaso.message
	 * @param  {function} fn Callback function
	 * @return {object}      abaaso
	 */
	recv : function ( fn, state ) {
		state = state || "all";

		return observer.add( global, "message", fn, "message", global, state );
	}
};
