/**
 * OAuth 2
 *
 * @class oauth
 * @namespace abaaso
 */
var oauth = {
	methods : {
		del : function () {

		},

		get : function () {

		},

		post : function () {

		},

		put : function () {

		},

		sync : function () {

		}
	},

	/**
	 * OAuth Factory
	 * 
	 * @param  {Object} args Optional properties to set
	 * @return {Object}      Instance
	 */
	factory : function (args) {
		if (!(args instanceof Object)) args = {};
		var instance = {},
		    params   = {};

		params = {

		}

		utility.merge(params, args);
		instance = utility.extend(methods, params);
		return instance;
	}
};
