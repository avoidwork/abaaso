/**
 * Array methods
 *
 * @namespace abaaso.array
 */
var array = {
	/**
	 * Adds 'arg' to 'obj' if it is not found
	 *
	 * @method add
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to receive 'arg'
	 * @param  {Mixed} arg Argument to set in 'obj'
	 * @return {Array}     Array that was queried
	 */
	add : function ( obj, arg ) {
		if ( !array.contains( obj, arg ) ) {
			obj.push( arg );
		}

		return obj;
	},

	/**
	 * Preforms a binary search on a sorted Array
	 *
	 * @method binIndex
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    Index of `arg` within `obj`
	 */
	binIndex : function ( obj, arg ) {
		var min = 0,
		    max = obj.length - 1,
		    idx, val;

		while ( min <= max ) {
			idx = Math.floor( ( min + max ) / 2 );
			val = obj[idx];

			if ( val < arg ) {
				min = idx + 1;
			}
			else if ( val > arg ) {
				max = idx - 1;
			}
			else {
				return idx;
			}
		}

		return -1;
	},

	/**
	 * Returns an Object ( NodeList, etc. ) as an Array
	 *
	 * @method cast
	 * @memberOf abaaso.array
	 * @param  {Object}  obj Object to cast
	 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
	 * @return {Array}       Object as an Array
	 */
	cast : function ( obj, key ) {
		key   = ( key === true );
		var o = [];

		if ( !isNaN( obj.length ) ) {
			o = slice.call( obj );
		}
		else if ( key ) {
			o = array.keys( obj );
		}
		else {
			utility.iterate( obj, function ( i ) {
				o.push( i );
			} );
		}

		return o;
	},

	/**
	 * Transforms an Array to a 2D Array of chunks
	 *
	 * @method chunk
	 * @memberOf abaaso.array
	 * @param  {Array}  obj  Array to parse
	 * @param  {Number} size Chunk size ( integer )
	 * @return {Array}       Chunked Array
	 */
	chunk : function ( obj, size ) {
		var result = [],
		    nth    = number.round( ( obj.length / size ), "up" ),
		    start  = 0,
		    i      = -1;

		while ( ++i < nth ) {
			start = i * size;
			result.push( array.limit( obj, start, size ) );
		}

		return result;
	},

	/**
	 * Clears an Array without destroying it
	 *
	 * @method clear
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to clear
	 * @return {Array}     Cleared Array
	 */
	clear : function ( obj ) {
		return obj.length > 0 ? array.remove( obj, 0, obj.length ) : obj;
	},

	/**
	 * Clones an Array
	 *
	 * @method clone
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to clone
	 * @return {Array}     Clone of Array
	 */
	clone : function ( obj ) {
		return obj.slice();
	},

	/**
	 * Determines if obj contains arg
	 *
	 * @method contains
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to look for
	 * @return {Boolean}   True if found, false if not
	 */
	contains : function ( obj, arg ) {
		return ( array.index( obj, arg ) > -1 );
	},

	/**
	 * Creates a new Array of the result of `fn` executed against every index of `obj`
	 *
	 * @method collect
	 * @memberOf abaaso.array
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against indices
	 * @return {Array}        New Array
	 */
	collect : function ( obj, fn ) {
		var result = [];

		array.each( obj, function ( i ) {
			result.push( fn( i ) );
		} );

		return result;
	},

	/**
	 * Compacts a Array by removing `null` or `undefined` indices
	 *
	 * @method compact
	 * @memberOf abaaso.array
	 * @param  {Array} obj    Array to compact
	 * @param  {Boolean} diff Indicates to return resulting Array only if there's a difference
	 * @return {Array}        Compacted copy of `obj`, or null ( if `diff` is passed & no diff is found )
	 */
	compact : function ( obj, diff ) {
		var result = [];

		result = obj.filter( function ( i ) {
			return !regex.null_undefined.test( i );
		} );

		return !diff ? result : ( result.length < obj.length ? result : null );
	},

	/**
	 * Counts `value` in `obj`
	 *
	 * @method count
	 * @memberOf abaaso.array
	 * @param  {Array} obj   Array to search
	 * @param  {Mixed} value Value to compare
	 * @return {Array}       Array of counts
	 */
	count : function ( obj, value ) {
		return obj.filter( function ( i ) {
			return ( i === value );
		}).length;
	},

	/**
	 * Finds the difference between array1 and array2
	 *
	 * @method diff
	 * @memberOf abaaso.array
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the differences
	 */
	diff : function ( array1, array2 ) {
		var result = [];

		array.each( array1, function ( i ) {
			if ( !array.contains( array2, i ) ) {
				array.add( result, i );
			}
		} );

		array.each( array2, function ( i ) {
			if ( !array.contains( array1, i ) ) {
				array.add( result, i );
			}
		} );

		return result;
	},

	/**
	 * Iterates `obj` and executes `fn` with arguments [`value`, `index`].
	 * Returning `false` halts iteration.
	 *
	 * @method each
	 * @memberOf abaaso.array
	 * @param  {Array}    obj   Array to iterate
	 * @param  {Function} fn    Function to execute on index values
	 * @param  {Boolean}  async [Optional] Asynchronous iteration
	 * @param  {Number}   size  [Optional] Batch size for async iteration, default is 10
	 * @return {Array}          Array
	 */
	each : function ( obj, fn, async, size ) {
		var nth = obj.length,
		    i, offset;

		if ( async !== true ) {
			for ( i = 0; i < nth; i++ ) {
				if ( fn.call( obj, obj[i], i ) === false ) {
					break;
				}
			}
		}
		else {
			size   = size || 10;
			offset = 0;

			if ( size > nth ) {
				size = nth;
			}

			utility.repeat( function () {
				var i = 0,
				    idx;

				for ( i = 0; i < size; i++ ) {
					idx = i + offset;

					if ( idx === nth || fn.call( obj, obj[idx], idx ) === false ) {
						return false;
					}
				}

				offset += size;

				if ( offset >= nth ) {
					return false;
				}
			}, undefined, undefined, false );
		}

		return obj;
	},

	/**
	 * Determines if an Array is empty
	 *
	 * @method empty
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to inspect
	 * @return {Boolean}   `true` if there's no indices
	 */
	empty : function ( obj ) {
		return ( obj.length === 0 );
	},

	/**
	 * Determines if `a` is equal to `b`
	 *
	 * @method equal
	 * @memberOf abaaso.array
	 * @param  {Array} a Array to compare
	 * @param  {Array} b Array to compare
	 * @return {Boolean} `true` if the Arrays match
	 */
	equal : function ( a, b ) {
		return ( json.encode( a ) === json.encode( b ) );
	},

	/**
	 * Fibonacci generator
	 *
	 * @method fib
	 * @memberOf abaaso.array
	 * @param  {Number} arg [Optional] Amount of numbers to generate, default is 100
	 * @return {Array}      Array of numbers
	 */
	fib : function ( arg ) {
		var result = [1, 1],
		    first  = result[0],
		    second = result[1],
		    sum;

		// Subtracting 1 to account for `first` & `second`
		arg = ( arg || 100 ) - 1;
		
		if ( isNaN( arg ) || arg < 2 ) {
			throw new Error( label.error.invalidArguments );
		}

		while ( --arg ) {
			sum    = first + second;
			first  = second;
			second = sum;
			result.push( sum );
		}

		return result;
	},

	/**
	 * Fills `obj` with the evalution of `arg`, optionally from `start` to `offset`
	 *
	 * @method fill
	 * @memberOf abaaso.array
	 * @param  {Array}  obj   Array to fill
	 * @param  {Mixed}  arg   String, Number of Function to fill with
	 * @param  {Number} start [Optional] Index to begin filling at
	 * @param  {Number} end   [Optional] Offset from start to stop filling at
	 * @return {Array}        Filled Array
	 */
	fill : function ( obj, arg, start, offset ) {
		var fn  = typeof arg == "function",
		    l   = obj.length,
		    i   = !isNaN( start ) ? start : 0,
		    nth = !isNaN( offset ) ? i + offset : l - 1;

		if ( nth > ( l - 1) ) {
			nth = l - 1;
		}

		while ( i <= nth ) {
			obj[i] = fn ? arg( obj[i] ) : arg;
			i++;
		}

		return obj;
	},

	/**
	 * Returns the first Array node
	 *
	 * @method first
	 * @memberOf abaaso.array
	 * @param  {Array} obj The array
	 * @return {Mixed}     The first node of the array
	 */
	first : function ( obj ) {
		return obj[0];
	},

	/**
	 * Iterates `obj` and executes `fn` with arguments [`value`, `index`].
	 * Returning `false` halts iteration.
	 *
	 * @method forEach
	 * @memberOf abaaso.array
	 * @see abaaso.array.each
	 * @param  {Array}    obj   Array to iterate
	 * @param  {Function} fn    Function to execute on index values
	 * @param  {Boolean}  async [Optional] Asynchronous iteration
	 * @param  {Number}   size  [Optional] Batch size for async iteration, default is 10
	 * @return {Array}          Array
	 */
	forEach : function ( obj, fn, async, size ) {
		return array.each( obj, fn, async, size );
	},

	/**
	 * Flattens a 2D Array
	 *
	 * @method flat
	 * @memberOf abaaso.array
	 * @param  {Array} obj 2D Array to flatten
	 * @return {Array}     Flatten Array
	 */
	flat : function ( obj ) {
		var result = [];

		result = obj.reduce( function ( a, b ) {
			return a.concat( b );
		}, result );

		return result;
	},

	/**
	 * Creates a 2D Array from an Object
	 *
	 * @method fromObject
	 * @param  {Object} obj Object to convert
	 * @return {Array}      2D Array
	 */
	fromObject : function ( obj ) {
		return array.mingle( array.keys( obj ), array.cast( obj ) );
	},

	/**
	 * Facade to indexOf for shorter syntax
	 *
	 * @method index
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    The position of arg in instance
	 */
	index : function ( obj, arg ) {
		return obj.indexOf( arg );
	},

	/**
	 * Returns an Associative Array as an Indexed Array
	 *
	 * @method indexed
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to index
	 * @return {Array}     Indexed Array
	 */
	indexed : function ( obj ) {
		var indexed = [];

		utility.iterate( obj, function ( v ) {
			indexed.push( v );
		} );

		return indexed;
	},

	/**
	 * Finds the intersections between array1 and array2
	 *
	 * @method intersect
	 * @memberOf abaaso.array
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the intersections
	 */
	intersect : function ( array1, array2 ) {
		var a = array1.length > array2.length ? array1 : array2,
		    b = ( a === array1 ? array2 : array1 );

		return a.filter( function ( key ) {
			return array.contains( b, key );
		} );
	},

	/**
	 * Keeps every element of `obj` for which `fn` evaluates to true
	 *
	 * @method keepIf
	 * @memberOf abaaso.array
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	keepIf : function ( obj, fn ) {
		if ( typeof fn != "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		var result = [],
		    remove = [];

		result = obj.filter( fn );
		remove = array.diff( obj, result );

		array.each( remove, function ( i ) {
			array.remove( obj, array.index( obj, i ) );
		} );

		return obj;
	},

	/**
	 * Sorts an Array based on key values, like an SQL ORDER BY clause
	 *
	 * @method sort
	 * @memberOf abaaso.array
	 * @param  {Array}  obj   Array to sort
	 * @param  {String} query Sort query, e.g. "name, age desc, country"
	 * @param  {String} sub   [Optional] Key which holds data, e.g. "{data: {}}" = "data"
	 * @return {Array}        Sorted Array
	 */
	keySort : function ( obj, query, sub ) {
		query       = query.replace( /\s*asc/ig, "" ).replace( /\s*desc/ig, " desc" );
		var queries = string.explode( query ).map( function ( i ) { return i.split( " " ); }),
		    sorts   = [];

		if ( sub && sub !== "" ) {
			sub = "." + sub;
		}
		else {
			sub = "";
		}

		array.each( queries, function ( i ) {
			var desc = i[1] === "desc";

			if ( !desc ) {
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"] ) return -1;" );
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"] ) return 1;" );
			}
			else {
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"] ) return 1;" );
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"] ) return -1;" );
			}
		} );

		sorts.push( "else return 0;" );

		return obj.sort( new Function( "a", "b", sorts.join( "\n" ) ) );
	},

	/**
	 * Returns the keys in an "Associative Array"
	 *
	 * @method keys
	 * @memberOf abaaso.array
	 * @param  {Mixed} obj Array or Object to extract keys from
	 * @return {Array}     Array of the keys
	 */
	keys : function ( obj ) {
		return Object.keys( obj );
	},

	/**
	 * Returns the last index of the Array
	 *
	 * @method last
	 * @memberOf abaaso.array
	 * @param  {Array}  obj Array
	 * @param  {Number} arg [Optional] Negative offset from last index to return
	 * @return {Mixed}      Last index( s ) of Array
	 */
	last : function ( obj, arg ) {
		var n = obj.length - 1;

		if ( arg >= ( n + 1 ) ) {
			return obj;
		}
		else if ( isNaN( arg ) || arg === 1 ) {
			return obj[n];
		}
		else {
			return array.limit( obj, ( n - ( --arg ) ), n );
		}
	},

	/**
	 * Returns a limited range of indices from the Array
	 *
	 * @method limit
	 * @memberOf abaaso.array
	 * @param  {Array}  obj    Array to iterate
	 * @param  {Number} start  Starting index
	 * @param  {Number} offset Number of indices to return
	 * @return {Array}         Array of indices
	 */
	limit : function ( obj, start, offset ) {
		var result = [],
		    i      = start - 1,
		    nth    = start + offset,
		    max    = obj.length;

		if ( max > 0 ) {
			while ( ++i < nth && i < max ) {
				result.push( obj[i] );
			}
		}

		return result;
	},

	/**
	 * Finds the maximum value in an Array
	 *
	 * @method max
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	max : function ( obj ) {
		return array.last( obj.sort( array.sort ) );
	},

	/**
	 * Finds the mean of an Array ( of numbers )
	 *
	 * @method mean
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Mean of the Array ( float or integer )
	 */
	mean : function ( obj ) {
		return obj.length > 0 ? ( array.sum( obj ) / obj.length ) : undefined;
	},

	/**
	 * Finds the median value of an Array ( of numbers )
	 *
	 * @method median
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Median number of the Array ( float or integer )
	 */
	median : function ( obj ) {
		var nth    = obj.length,
		    mid    = number.round( nth / 2, "down" ),
		    sorted = obj.sort( array.sort );

		return number.odd( nth ) ? sorted[mid] : ( ( sorted[mid - 1] + sorted[mid] ) / 2 );
	},

	/**
	 * Merges `arg` into `obj`, excluding duplicate indices
	 *
	 * @method merge
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to receive indices
	 * @param  {Array} arg Array to merge
	 * @return {Array}     obj
	 */
	merge : function ( obj, arg ) {
		array.each( arg, function ( i ) {
			array.add( obj, i );
		} );

		return obj;
	},

	/**
	 * Finds the minimum value in an Array
	 *
	 * @method min
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	min : function ( obj ) {
		return obj.sort( array.sort )[0];
	},

	/**
	 * Mingles Arrays and returns a 2D Array
	 *
	 * @method mingle
	 * @memberOf abaaso.array
	 * @param  {Array} obj1 Array to mingle
	 * @param  {Array} obj2 Array to mingle
	 * @return {Array}      2D Array
	 */
	mingle : function ( obj1, obj2 ) {
		var result;

		result = obj1.map( function ( i, idx ) {
			return [i, obj2[idx]];
		} );

		return result;
	},

	/**
	 * Finds the mode value of an Array
	 *
	 * @method mode
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Mode value of the Array
	 */
	mode : function ( obj ) {
		var values = {},
		    count  = 0,
		    nth    = 0,
		    mode   = [],
		    result;

		// Counting values
		array.each( obj, function ( i ) {
			if ( !isNaN( values[i] ) ) {
				values[i]++;
			}
			else {
				values[i] = 1;
			}
		} );

		// Finding the highest occurring count
		count = array.max( array.cast( values ) );

		// Finding values that match the count
		utility.iterate( values, function ( v, k ) {
			if ( v === count ) {
				mode.push( number.parse( k ) );
			}
		} );

		// Determining the result
		nth = mode.length;

		if ( nth > 0 ) {
			result = nth === 1 ? mode[0] : mode;
		}

		return result;
	},

	/**
	 * Creates an Array of percentages from an Array of Numbers (ints/floats)
	 *
	 * @method percents
	 * @memberOf abaaso.array
	 * @param  {Array}  obj       Array to iterate
	 * @param  {Number} precision [Optional] Rounding precision
	 * @param  {Number} total     [Optional] Value to compare against
	 * @return {Array}            Array of percents
	 */
	percents : function ( obj, precision, total ) {
		var result = [],
		    custom = false,
		    last, padding, sum;

		precision = precision || 0;
		
		if ( total === undefined ) {
			total = array.sum( obj );
		}
		else {
			custom = true;
		}

		array.each( obj, function ( i ) {
			result.push( number.parse( ( ( i / total ) * 100 ).toFixed( precision ) ) );
		} );

		// Dealing with the awesomeness of JavaScript "integers"
		if ( !custom ) {
			sum = array.sum( result );

			if ( sum < 100 ) {
				padding = number.parse( number.diff( sum, 100 ).toFixed( precision ) );
				last    = array.last( result ) + padding;
				result[result.length - 1] = last;
			}
			else if ( sum > 100 ) {
				padding = number.parse( number.diff( sum, 100 ).toFixed( precision ) );
				last    = number.parse( ( array.last( result ) - padding ).toFixed( precision ) );
				result[result.length - 1] = last;
			}
		}

		return result;
	},

	/**
	 * Finds the range of the Array ( of numbers ) values
	 *
	 * @method range
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Range of the array ( float or integer )
	 */
	range : function ( obj ) {
		return array.max( obj ) - array.min( obj );
	},

	/**
	 * Searches a 2D Array `obj` for the first match of `arg` as a second index
	 *
	 * @method rassoc
	 * @memberOf abaaso.array
	 * @param  {Array} obj 2D Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Array or undefined
	 */
	rassoc : function ( obj, arg ) {
		var result;

		array.each( obj, function ( i, idx ) {
			if ( i[1] === arg ) {
				result = obj[idx];

				return false;
			}
		} );

		return result;
	},

	/**
	 * Returns Array containing the items in `obj` for which `fn()` is not true
	 *
	 * @method reject
	 * @memberOf abaaso.array
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against `obj` indices
	 * @return {Array}        Array of indices which fn() is not true
	 */
	reject : function ( obj, fn ) {
		return array.diff( obj, obj.filter( fn ) );
	},
	
	/**
	 * Replaces the contents of `obj` with `arg`
	 *
	 * @method replace
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to modify
	 * @param  {Array} arg Array to become `obj`
	 * @return {Array}     New version of `obj`
	 */
	replace : function ( obj, arg ) {
		array.remove( obj, 0, obj.length );
		array.each( arg, function ( i ) {
			obj.push( i );
		} );

		return obj;
	},

	/**
	 * Removes indices from an Array without recreating it
	 *
	 * @method remove
	 * @memberOf abaaso.array
	 * @param  {Array}  obj   Array to remove from
	 * @param  {Mixed}  start Starting index, or value to find within obj
	 * @param  {Number} end   [Optional] Ending index
	 * @return {Array}        Modified Array
	 */
	remove : function ( obj, start, end ) {
		if ( isNaN( start ) ) {
			start = array.index( obj, start );

			if ( start === -1 ) {
				return obj;
			}
		}
		else {
			start = start || 0;
		}

		var length    = obj.length,
		    remaining = obj.slice( ( end || start ) + 1 || length );

		obj.length = start < 0 ? ( length + start ) : start;
		obj.push.apply( obj, remaining );

		return obj;
	},

	/**
	 * Deletes every element of `obj` for which `fn` evaluates to true
	 *
	 * @method removeIf
	 * @memberOf abaaso.array
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	removeIf : function ( obj, fn ) {
		var remove;

		if ( typeof fn != "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		remove = obj.filter( fn );

		array.each( remove, function ( i ) {
			array.remove( obj, array.index ( obj, i ) );
		} );

		return obj;
	},

	/**
	 * Deletes elements of `obj` until `fn` evaluates to false
	 *
	 * @method removeWhile
	 * @memberOf abaaso.array
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	removeWhile : function ( obj, fn ) {
		if ( typeof fn != "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		var remove = [];

		array.each( obj, function ( i ) {
			if ( fn( i ) !== false ) {
				remove.push( i );
			}
			else {
				return false;
			}
		} );

		array.each( remove, function ( i ) {
			array.remove( obj, array.index( obj, i) );
		} );

		return obj;
	},

	/**
	 * Returns the "rest" of `obj` from `arg`
	 *
	 * @method rest
	 * @memberOf abaaso.array
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg [Optional] Start position of subset of `obj` ( positive number only )
	 * @return {Array}      Array of a subset of `obj`
	 */
	rest : function ( obj, arg ) {
		arg = arg || 1;

		if ( arg < 1 ) {
			arg = 1;
		}

		return array.limit( obj, arg, obj.length );
	},

	/**
	 * Finds the last index of `arg` in `obj`
	 *
	 * @method rindex
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Index or undefined
	 */
	rindex : function ( obj, arg ) {
		var result = -1;

		array.each( obj, function ( i, idx ) {
			if ( i === arg ) {
				result = idx;
			}
		} );

		return result;
	},

	/**
	 * Returns new Array with `arg` moved to the first index
	 *
	 * @method rotate
	 * @memberOf abaaso.array
	 * @param  {Array}  obj Array to rotate
	 * @param  {Number} arg Index to become the first index, if negative the rotation is in the opposite direction
	 * @return {Array}      Newly rotated Array
	 */
	rotate : function ( obj, arg ) {
		var nth = obj.length,
		    result;

		if ( arg === 0 ) {
			result = obj;
		}
		else {
			if ( arg < 0 ) {
				arg += nth;
			}
			else {
				arg--;
			}

			result = array.limit( obj, arg, nth );
			result = result.concat( array.limit( obj, 0, arg ) );
		}

		return result;
	},

	/**
	 * Generates a series Array
	 *
	 * @method series
	 * @memberOf abaaso.array
	 * @param  {Number} start  Start value the series
	 * @param  {Number} end    [Optional] The end of the series
	 * @param  {Number} offset [Optional] Offset for indices, default is 1
	 * @return {Array}         Array of new series
	 */
	series : function ( start, end, offset ) {
		start      = start  || 0;
		end        = end    || start;
		offset     = offset || 1;
		var result = [],
		    n      = -1,
		    nth    = Math.max( 0, Math.ceil( ( end - start ) / offset ) );

		while ( ++n < nth ) {
			result[n]  = start;
			start     += offset;
		}

		return result;
	},

	/**
	 * Splits an Array by divisor
	 *
	 * @method split
	 * @memberOf abaaso.array
	 * @param  {Array}  obj     Array to parse
	 * @param  {Number} divisor Integer to divide the Array by
	 * @return {Array}          Split Array
	 */
	split : function ( obj, divisor ) {
		var result  = [],
		    total   = obj.length,
		    nth     = Math.ceil( total / divisor ),
		    low     = Math.floor( total / divisor ),
		    lower   = Math.ceil( total / nth ),
		    lowered = false,
		    start   = 0,
		    i       = -1;

		// Finding the fold
		if ( number.diff( total, ( divisor * nth ) ) > nth ) {
			lower = total - ( low * divisor ) + low - 1;
		}

		while ( ++i < divisor ) {
			if ( !lowered && lower < divisor && i === lower ) {
				--nth;
				lowered = true;
			}

			if ( i > 0 ) {
				start = start + nth;
			}

			result.push( array.limit( obj, start, nth ) );
		}

		return result;
	},

	/**
	 * Sorts the Array by parsing values
	 *
	 * @method sort
	 * @memberOf abaaso.array
	 * @param  {Mixed} a Argument to compare
	 * @param  {Mixed} b Argument to compare
	 * @return {Number}  Number indicating sort order
	 */
	sort : function ( a, b ) {
		var types = {a: typeof a, b: typeof b},
		    c, d, result;

		if ( types.a === "number" && types.b === "number" ) {
			result = a - b;
		}
		else {
			c = a.toString();
			d = b.toString();

			if ( c < d ) {
				result = -1;
			}
			else if ( c > d ) {
				result = 1;
			}
			else if ( types.a === types.b ) {
				result = 0;
			}
			else if ( types.a === "boolean" ) {
				result = -1;
			}
			else {
				result = 1;
			}
		}

		return result;
	},

	/**
	 * Sorts `obj` using `array.sort`
	 *
	 * @method sorted
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to sort
	 * @return {Array}     Sorted Array
	 */
	sorted : function ( obj ) {
		return obj.sort( array.sort );
	},

	/**
	 * Gets the summation of an Array of numbers
	 *
	 * @method sum
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to sum
	 * @return {Number}    Summation of Array
	 */
	sum : function ( obj ) {
		var result = 0;

		if ( obj.length > 0 ) {
			result = obj.reduce( function ( prev, cur ) {
				return prev + cur;
			} );
		}

		return result;
	},

	/**
	 * Takes the first `arg` indices from `obj`
	 *
	 * @method take
	 * @memberOf abaaso.array
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg Offset from 0 to return
	 * @return {Array}      Subset of `obj`
	 */
	take : function ( obj, arg ) {
		return array.limit( obj, 0, arg );
	},

	/**
	 * Gets the total keys in an Array
	 *
	 * @method total
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to find the length of
	 * @return {Number}    Number of keys in Array
	 */
	total : function ( obj ) {
		return array.indexed( obj ).length;
	},

	/**
	 * Casts an Array to Object
	 *
	 * @method toObject
	 * @memberOf abaaso.array
	 * @param  {Array} ar Array to transform
	 * @return {Object}   New object
	 */
	toObject : function ( ar ) {
		var obj = {},
		    i   = ar.length;

		while ( i-- ) {
			obj[i.toString()] = ar[i];
		}

		return obj;
	},

	/**
	 * Returns an Array of unique indices of `obj`
	 *
	 * @method unique
	 * @memberOf abaaso.array
	 * @param  {Array} obj Array to parse
	 * @return {Array}     Array of unique indices
	 */
	unique : function ( obj ) {
		var result = [];

		array.each( obj, function ( i ) {
			array.add( result, i );
		} );

		return result;
	},

	/**
	 * Converts any arguments to Arrays, then merges elements of `obj` with corresponding elements from each argument
	 *
	 * @method zip
	 * @memberOf abaaso.array
	 * @param  {Array} obj  Array to transform
	 * @param  {Mixed} args Argument instance or Array to merge
	 * @return {Array}      Array
	 */
	zip : function ( obj, args ) {
		var result = [];

		// Preparing args
		if ( !(args instanceof Array) ) {
			args = typeof args == "object" ? array.cast( args ) : [args];
		}

		array.each( args, function ( i, idx ) {
			if ( !( i instanceof Array ) ) {
				this[idx] = [i];
			}
		} );

		// Building result Array
		array.each( obj, function ( i, idx ) {
			result[idx] = [i];
			array.each( args, function ( x ) {
				result[idx].push( x[idx] || null );
			} );
		} );

		return result;
	}
};
