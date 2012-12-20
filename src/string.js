/**
 * String methods
 * 
 * @class string
 * @namespace abaaso
 */
var string = {
	/**
	 * Capitalizes the String
	 * 
	 * @param  {String} obj String to capitalize
	 * @return {String}     Capitalized String
	 */
	capitalize : function (obj) {
		obj = string.trim(obj);
		return obj.charAt(0).toUpperCase() + obj.slice(1);
	},

	/**
	 * Escapes meta characters within a string
	 * 
	 * @param  {String} obj String to escape
	 * @return {String}     Escaped string
	 */
	escape : function (obj) {
		return obj.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	},

	/**
	 * Splits a string on comma, or a parameter, and trims each value in the resulting Array
	 * 
	 * @param  {String} obj String to capitalize
	 * @param  {String} arg String to split on
	 * @return {Array}      Array of the exploded String
	 */
	explode : function (obj, arg) {
		if (typeof arg === "undefined" || arg.toString() === "") arg = ",";
		return string.trim(obj).split(new RegExp("\\s*" + arg + "\\s*"));
	},

	/**
	 * Replaces all spaces in a string with dashes
	 * 
	 * @param  {String} obj   String to hyphenate
	 * @param {Boolean} camel [Optional] Hyphenate camelCase
	 * @return {String}       String with dashes instead of spaces
	 */
	hyphenate : function (obj, camel) {
		var result;

		camel = (camel === true);

		result = string.trim(obj).replace(/\s+/g, "-");
		if (camel) result = result.replace(/([A-Z])/g, "-\$1").toLowerCase();
		return result;
	},

	/**
	 * Returns singular form of the string
	 * 
	 * @param  {String} obj String to transform
	 * @return {String}     Transformed string
	 */
	singular : function (obj) {
		return /s$/.test(obj) ? obj.slice(0, -1) : obj;
	},

	/**
	 * Transforms the case of a String into CamelCase
	 * 
	 * @param  {String} obj String to capitalize
	 * @return {String}     Camel case String
	 */
	toCamelCase : function (obj) {
		var s = string.trim(obj).toLowerCase().split(/\s|-/),
		    r = [];

		array.each(s, function (i, idx) {
			i = string.trim(i);
			if (i.isEmpty()) return;
			r.push(idx === 0 ? i : string.capitalize(i));
		});
		return r.join("");
	},

	/**
	 * Trims the whitespace around a String
	 * 
	 * @param  {String} obj String to capitalize
	 * @return {String}     Trimmed String
	 */
	trim : function (obj) {
		return obj.replace(/^\s+|\s+$/g, "");
	},

	/**
	 * Uncapitalizes the String
	 * 
	 * @param  {String} obj String to capitalize
	 * @return {String}     Uncapitalized String
	 */
	uncapitalize : function (obj) {
		obj = string.trim(obj);
		return obj.charAt(0).toLowerCase() + obj.slice(1);
	}
};
