/** @namespace abaaso.json */
var json = {
	/**
	 * Transforms JSON to CSV
	 *
	 * @method csv
	 * @memberOf abaaso.json
	 * @param  {string}  arg JSON  string to transform
	 * @param  {string}  delimiter [Optional] Character to separate fields
	 * @param  {boolean} header    [Optional] False to not include field names as first row
	 * @return {string}            CSV string
	 */
	csv : function ( arg, delimiter, header ) {
		delimiter  = delimiter || ",";
		header     = ( header !== false );
		var obj    = json.decode( arg, true ) || arg,
		    result = "",
		    prepare;

		// Prepares input based on CSV rules
		prepare = function ( input ) {
			var output;

			if ( input instanceof Array ) {
				output = "\"" + input.toString() + "\"";

				if ( regex.object_type.test( output ) ) {
					output = "\"" + json.csv( input, delimiter ) + "\"";
				}
			}
			else if ( input instanceof Object ) {
				output = "\"" + json.csv( input, delimiter ) + "\"";
			}
			else if ( regex.csv_quote.test( input ) ) {
				output = "\"" + input.replace( /"/g, "\"\"" ) + "\"";
			}
			else {
				output = input;
			}

			return output;
		};

		if ( obj instanceof Array ) {
			if ( obj[0] instanceof Object ) {
				if ( header ) {
					result = ( array.keys( obj[0] ).join( delimiter ) + "\n" );
				}

				result += obj.map( function ( i ) {
					return json.csv( i, delimiter, false );
				}).join( "\n" );
			}
			else {
				result += ( prepare( obj, delimiter ) + "\n" );
			}

		}
		else {
			if ( header ) {
				result = ( array.keys( obj ).join( delimiter ) + "\n" );
			}

			result += ( array.cast( obj ).map( prepare ).join( delimiter ) + "\n" );
		}

		return result.replace(/\n$/, "");
	},

	/**
	 * Decodes the argument
	 *
	 * @method decode
	 * @memberOf abaaso.json
	 * @param  {string}  arg    String to parse
	 * @param  {boolean} silent [Optional] Silently fail
	 * @return {mixed}          Entity resulting from parsing JSON, or undefined
	 */
	decode : function ( arg, silent ) {
		try {
			return JSON.parse( arg );
		}
		catch ( e ) {
			if ( silent !== true ) {
				utility.error( e, arguments, this );
			}

			return undefined;
		}
	},

	/**
	 * Encodes the argument as JSON
	 *
	 * @method encode
	 * @memberOf abaaso.json
	 * @param  {mixed}   arg    Entity to encode
	 * @param  {boolean} silent [Optional] Silently fail
	 * @return {string}         JSON, or undefined
	 */
	encode : function ( arg, silent ) {
		try {
			return JSON.stringify( arg );
		}
		catch ( e ) {
			if ( silent !== true) {
				utility.error( e, arguments, this );
			}

			return undefined;
		}
	}
};
