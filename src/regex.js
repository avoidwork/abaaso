/**
 * Regex patterns used through abaaso
 * 
 * @class regex
 * @namespace abaaso
 */
var regex = {
	hash             : /\#/,
	hyphen           : /-/g,
	jsonp_1          : /]|'|"/g,
	jsonp_2          : /\./g,
	number           : /^\d+$/,
	object_undefined : /object|undefined/,
	reflect          : /function\s+\w*\s*\((.*?)\)/,
	selector_many    : /\:|\./,
	selector_complex : /\s|\>/,
	string_boolean   : /^(true|false)$/i,
	string_true      : /^true$/i,
	walk_1           : /\]$/,
	walk_2           : /\]/g,
	walk_3           : /\.|\[/
};
