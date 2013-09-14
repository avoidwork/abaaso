/** @namespace abaaso.number */
var number = {
	/**
	 * Returns the difference of arg
	 *
	 * @method odd
	 * @memberOf abaaso.number
	 * @param {number} arg Number to compare
	 * @return {number}    The absolute difference
	 */
	diff : function ( num1, num2 ) {
		if ( isNaN( num1 ) || isNaN( num2 ) ) {
			throw new Error( label.error.expectedNumber );
		}

		return Math.abs( num1 - num2 );
	},

	/**
	 * Tests if an number is even
	 *
	 * @method even
	 * @memberOf abaaso.number
	 * @param {number} arg Number to test
	 * @return {boolean}   True if even, or undefined
	 */
	even : function ( arg ) {
		return arg % 2 === 0;
	},

	/**
	 * Formats a Number to a delimited String
	 *
	 * @method format
	 * @memberOf abaaso.number
	 * @param  {number} arg       Number to format
	 * @param  {string} delimiter [Optional] String to delimit the Number with
	 * @param  {string} every     [Optional] Position to insert the delimiter, default is 3
	 * @return {string}           Number represented as a comma delimited String
	 */
	format : function ( arg, delimiter, every ) {
		if ( isNaN( arg ) ) {
			throw new Error( label.error.expectedNumber );
		}

		arg       = arg.toString();
		delimiter = delimiter || ",";
		every     = every     || 3;

		var d = arg.indexOf( "." ) > -1 ? "." + arg.replace( regex.number_format_1, "" ) : "",
		    a = arg.replace( regex.number_format_2, "" ).split( "" ).reverse(),
		    p = Math.floor( a.length / every ),
		    i = 1, n, b;

		for ( b = 0; b < p; b++ ) {
			n = i === 1 ? every : ( every * i ) + ( i === 2 ? 1 : ( i - 1 ) );
			a.splice( n, 0, delimiter );
			i++;
		}

		a = a.reverse().join( "" );

		if ( a.charAt( 0 ) === delimiter ) {
			a = a.substring( 1 );
		}

		return a + d;
	},

	/**
	 * Returns half of a, or true if a is half of b
	 *
	 * @method half
	 * @memberOf abaaso.number
	 * @param  {number} a Number to divide
	 * @param  {number} b [Optional] Number to test a against
	 * @return {mixed}    Boolean if b is passed, Number if b is undefined
	 */
	half : function ( a, b ) {
		return b !== undefined ? ( ( a / b ) === 0.5 ) : ( a / 2 );
	},

	/**
	 * Tests if a number is odd
	 *
	 * @method odd
	 * @memberOf abaaso.number
	 * @param  {number} arg Number to test
	 * @return {boolean}    True if odd, or undefined
	 */
	odd : function ( arg ) {
		return !number.even( arg );
	},

	/**
	 * Parses the number
	 *
	 * @method parse
	 * @memberOf abaaso.number
	 * @param  {mixed}  arg  Number to parse
	 * @param  {number} base Integer representing the base or radix
	 * @return {number}      Integer or float
	 */
	parse : function ( arg, base ) {
		return ( base === undefined ) ? parseFloat( arg ) : parseInt( arg, base );
	},

	/**
	 * Generates a random number between 0 and arg
	 *
	 * @method random
	 * @memberOf abaaso.number
	 * @param  {number} arg Ceiling for random number, default is 100
	 * @return {number}     Random number
	 */
	random : function ( arg ) {
		arg = arg || 100;

		return Math.floor( Math.random() * ( arg + 1 ) );
	},

	/**
	 * Rounds a number up or down
	 *
	 * @method round
	 * @memberOf abaaso.number
	 * @param  {number} arg       Number to round
	 * @param  {string} direction [Optional] "up" or "down"
	 * @return {number}           Rounded interger
	 */
	round : function ( arg, direction ) {
		arg = number.parse( arg );

		if ( direction === undefined || string.isEmpty( direction ) ) {
			return number.parse( arg.toFixed( 0 ) );
		}
		else if ( regex.down.test( direction ) ) {
			return ~~( arg );
		}
		else {
			return Math.ceil( arg );
		}
	}
};
