/**
 * Array methods
 *
 * @class array
 * @namespace abaaso
 */
var array = {
	/**
	 * Adds 'arg' to 'obj' if it is not found
	 * 
	 * @method add
	 * @param  {Array} obj Array to receive 'arg'
	 * @param  {Mixed} arg Argument to set in 'obj'
	 * @return {Array}     Array that was queried
	 */
	add : function (obj, arg) {
		if (!array.contains(obj, arg)) obj.push(arg);
		return obj;
	},

	/**
	 * Returns an Object (NodeList, etc.) as an Array
	 *
	 * @method cast
	 * @param  {Object}  obj Object to cast
	 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
	 * @return {Array}       Object as an Array
	 */
	cast : function (obj, key) {
		key   = (key === true);
		var o = [];

		switch (true) {
			case !isNaN(obj.length):
				if (!client.ie || client.version > 8) o = Array.prototype.slice.call(obj);
				else {
					try { o = Array.prototype.slice.call(obj); }
					catch (e) { utility.iterate(obj, function (i, idx) { if (idx !== "length") o.push(i); }); }
				}
				break;
			default:
				key ? o = array.keys(obj) : utility.iterate(obj, function (i) { o.push(i); });
		}
		return o;
	},

	/**
	 * Transforms an Array to a 2D Array of chunks
	 * 
	 * @param  {Array}  obj  Array to parse
	 * @param  {Number} size Chunk size (integer)
	 * @return {Array}       Chunked Array
	 */
	chunk : function (obj, size) {
		var result = [],
		    nth    = number.round((obj.length / size), "up"),
		    start  = 0,
		    i      = -1;

		while (++i < nth) {
			start = i * size;
			result.push(array.limit(obj, start, (size - 1)));
		}

		return result;
	},

	/**
	 * Clones an Array
	 * 
	 * @method clone
	 * @param  {Array} obj Array to clone
	 * @return {Array}     Clone of Array
	 */
	clone : function (obj) {
		return utility.clone(obj);
	},

	/**
	 * Determines if obj contains arg
	 * 
	 * @method contains
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to look for
	 * @return {Boolean}   True if found, false if not
	 */
	contains : function (obj, arg) {
		return (array.index(obj, arg) > -1);
	},

	/**
	 * Finds the difference between array1 and array2
	 *
	 * @method diff
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the differences
	 */
	diff : function (array1, array2) {
		var result = [];

		array1.each(function (i) { if (!array2.contains(i)) result.add(i); });
		array2.each(function (i) { if (!array1.contains(i)) result.add(i); });
		return result;
	},

	/**
	 * Iterates obj and executes fn
	 * Parameters for fn are 'value', 'key'
	 * 
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute on index values
	 * @return {Array}        Array
	 */
	each : function (obj, fn) {
		var nth = obj.length,
		    i   = -1,
		    r;

		while (++i < nth) {
			r = fn.call(obj, obj[i], i);
			if (r === false) break;
		}
		return obj;
	},

	/**
	 * Returns the first Array node
	 *
	 * @method first
	 * @param  {Array} obj The array
	 * @return {Mixed}     The first node of the array
	 */
	first : function (obj) {
		return obj[0];
	},

	/**
	 * Facade to indexOf for shorter syntax
	 *
	 * @method index
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    The position of arg in instance
	 */
	index : function (obj, arg) {
		return obj.indexOf(arg);
	},

	/**
	 * Returns an Associative Array as an Indexed Array
	 *
	 * @method indexed
	 * @param  {Array} obj Array to index
	 * @return {Array}     Indexed Array
	 */
	indexed : function (obj) {
		var indexed = [];

		utility.iterate(obj, function (v, k) {
			typeof v === "object" ? indexed = indexed.concat(array.indexed(v)) : indexed.push(v);
		});
		return indexed;
	},

	/**
	 * Finds the intersections between array1 and array2
	 *
	 * @method intersect
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the intersections
	 */
	intersect : function (array1, array2) {
		var a = array1.length > array2.length ? array1 : array2,
		    b = a === array1 ? array2 : array1;

		return a.filter(function (key) { return array.contains(b, key); });
	},

	/**
	 * Returns the keys in an Associative Array
	 *
	 * @method keys
	 * @param  {Array} obj Array to extract keys from
	 * @return {Array}     Array of the keys
	 */
	keys : function (obj) {
		var keys = [];

		if (typeof Object.keys === "function") keys = Object.keys(obj)
		else utility.iterate(obj, function (v, k) {
			keys.push(k);
		});
		return keys;
	},

	/**
	 * Returns the last index of the Array
	 *
	 * @method last
	 * @param  {Array} obj Array
	 * @return {Mixed}     Last index of Array
	 */
	last : function (obj) {
		return obj[obj.length - 1];
	},

	/**
	 * Returns a limited range of indices from the Array
	 * 
	 * @param  {Array}  obj    Array to iterate
	 * @param  {Number} start  Starting index
	 * @param  {Number} offset Number of indices to return
	 * @return {Array}         Array of indices
	 */
	limit : function (obj, start, offset) {
		var result = [],
		    i      = start - 1,
		    nth    = start + offset;

		while (++i <= nth) {
			if (typeof obj[i] !== "undefined") result.push(obj[i]);
		}

		return result;
	},

	/**
	 * Finds the maximum value in an Array
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	max : function (obj) {
		return array.last(obj.sort(array.sort));
	},

	/**
	 * Finds the mean of an Array (of numbers)
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Mean of the Array (float or integer)
	 */
	mean : function (obj) {
		return (array.sum(obj) / obj.length);
	},

	/**
	 * Finds the median value of an Array (of numbers)
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Median number of the Array (float or integer)
	 */
	median : function (obj) {
		var nth    = obj.length,
		    mid    = number.round(nth / 2, "down"),
		    sorted = obj.sort(array.sort);

		return number.odd(nth) ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2);
	},

	/**
	 * Finds the minimum value in an Array
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	min : function (obj) {
		return obj.sort(array.sort)[0];
	},

	/**
	 * Finds the mode value of an Array
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Mode value of the Array
	 */
	mode : function (obj) {
		var values = {},
		    count  = 0,
		    nth    = 0,
		    mode   = [],
		    result;

		// Counting values
		array.each(obj, function (i) {
			!values.hasOwnProperty(i) ? values[i] = 1 : values[i]++;
		});

		// Finding the highest occurring count
		utility.iterate(values, function (v, k) {
			if (v > count) count = v;
		});

		// Finding values that match the count
		utility.iterate(values, function (v, k) {
			if (v === count) mode.push(number.parse(k));
		});

		nth = mode.length;

		if (nth > 0) {
			switch (true) {
				case nth === 1:
					result = mode[0];
					break;
				case nth > 1:
					result = mode;
					break;
			}
		}

		return result;
	},

	/**
	 * Finds the range of the Array (of numbers) values
	 * 
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Range of the array (float or integer)
	 */
	range : function (obj) {
		return array.max(obj) - array.min(obj);
	},

	/**
	 * Removes indices from an Array without recreating it
	 *
	 * @method remove
	 * @param  {Array}  obj   Array to remove from
	 * @param  {Mixed}  start Starting index, or value to find within obj
	 * @param  {Number} end   [Optional] Ending index
	 * @return {Array}        Modified Array
	 */
	remove : function (obj, start, end) {
		if (isNaN(start)) {
			start = obj.index(start);
			if (start === -1) return obj;
		}
		else start = start || 0;

		var length    = obj.length,
		    remaining = obj.slice((end || start) + 1 || length);

		obj.length = start < 0 ? (length + start) : start;
		obj.push.apply(obj, remaining);
		return obj;
	},

	/**
	 * Sorts the Array by parsing values
	 * 
	 * @param  {Mixed} a Argument to compare
	 * @param  {Mixed} b Argument to compare
	 * @return {Boolean} Boolean indicating sort order
	 */
	sort : function (a, b) {
		var nums = false,
		    result;

		if (!isNaN(a) && !isNaN(b)) nums = true;

		a = nums ? number.parse(a) : String(a);
		b = nums ? number.parse(b) : String(b);

		switch (true) {
			case a < b:
				result = -1;
				break;
			case a > b:
				result = 1;
				break;
			default:
				result = 0;
		}
		return result;
	},

	/**
	 * Gets the summation of an Array of numbers
	 * 
	 * @param  {Array} obj Array to sum
	 * @return {Number}    Summation of Array
	 */
	sum : function (obj) {
		var result = 0;

		array.each(obj, function (i) {
			if (typeof i !== "number") return;

			result += number.parse(i);
		});

		return result;
	},

	/**
	 * Gets the total keys in an Array
	 *
	 * @method total
	 * @param  {Array} obj Array to find the length of
	 * @return {Number}    Number of keys in Array
	 */
	total : function (obj) {
		return array.indexed(obj).length;
	},

	/**
	 * Casts an Array to Object
	 * 
	 * @param  {Array} ar Array to transform
	 * @return {Object}   New object
	 */
	toObject : function (ar) {
		var obj = {},
		    i   = ar.length;

		while (i--) obj[i.toString()] = ar[i];
		return obj;
	}
};
