/**
 * JSON methods
 *
 * @class json
 * @namespace abaaso
 */
var json = {
	/**
	 * Decodes the argument
	 *
	 * @method decode
	 * @param  {String}  arg    String to parse
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {Mixed}          Entity resulting from parsing JSON, or undefined
	 */
	decode : function ( arg, silent ) {
		try {
			return JSON.parse( arg );
		}
		catch ( e ) {
			if ( silent !== true ) {
				error( e, arguments, this );
			}

			return undefined;
		}
	},

	/**
	 * Encodes the argument as JSON
	 *
	 * @method encode
	 * @param  {Mixed}   arg    Entity to encode
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {String}         JSON, or undefined
	 */
	encode : function ( arg, silent ) {
		try {
			return JSON.stringify( arg );
		}
		catch ( e ) {
			if ( silent !== true) {
				error( e, arguments, this );
			}

			return undefined;
		}
	}
};
