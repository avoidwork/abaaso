/** @namespace abaaso.math */
var math = {
	/**
	 * Generates bezier curve coordinates for up to 4 points, last parameter is `t`
	 *
	 * Two point example: (0, 10, 0, 0, 1) means move straight up
	 *
	 * @method bezier
	 * @memberOf abaaso.math
	 * @return {Array} Coordinates
	 */
	bezier : function () {
		var a = array.cast( arguments ),
		    t = a.pop(),
		    P = array.chunk( a, 2 ),
		    n = P.length,
		    c, S0, Q0, Q1, Q2, C0, C1, C2, C3;

		if ( n < 2 || n > 4 ) {
			throw new Error( label.error.invalidArguments );
		}

		// Setting variables
		c  = [];
		S0 = 1 - t;
		Q0 = math.sqr( S0 );
		Q1 = 2 * S0 * t;
		Q2 = math.sqr( t );
		C0 = Math.pow( S0, 3 );
		C1 = 3 * Q0 * t;
		C2 = 3 * S0 * Q2;
		C3 = Math.pow( t, 3 );

		// Straight
		if ( n === 2 ) {
			c.push( ( S0 * P[0][0] ) + ( t * P[1][0] ) );
			c.push( ( S0 * P[0][1] ) + ( t * P[1][1] ) );
		}
		// Quadratic
		else if ( n === 3 ) {
			c.push( ( Q0 * P[0][0] ) + ( Q1 * P[1][0] ) + ( Q2 + P[2][0] ) );
			c.push( ( Q0 * P[0][1] ) + ( Q1 * P[1][1] ) + ( Q2 + P[2][1] ) );
		}
		// Cubic
		else if ( n === 4 ) {
			c.push( ( C0 * P[0][0] ) + ( C1 * P[1][0] ) + ( C2 * P[2][0] ) + ( C3 * P[3][0] ) );
			c.push( ( C0 * P[0][1] ) + ( C1 * P[1][1] ) + ( C2 * P[2][1] ) + ( C3 * P[3][1] ) );
		}

		return c;
	},

	/**
	 * Finds the distance between 2 Arrays of coordinates
	 *
	 * @method dist
	 * @memberOf abaaso.math
	 * @param  {Array} a Coordinates [x, y]
	 * @param  {Array} b Coordinates [x, y]
	 * @return {Number}  Distance between `a` & `b`
	 */
	dist : function ( a, b ) {
		return Math.sqrt( math.sqr( b[0] - a[0] ) + math.sqr( b[1] - a[1] ) );
	},

	/**
	 * Squares a Number
	 *
	 * @method sqr
	 * @memberOf abaaso.math
	 * @param  {Number} n Number to square
	 * @return {Number}   Squared value
	 */
	sqr : function ( n ) {
		return Math.pow( n, 2 );
	}
};
