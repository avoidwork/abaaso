/**
 * URI routing via hashtag
 * 
 * @class route
 * @namespace abaaso
 */
var route = {
	bang  : /\#|\!\//g,
	regex : new RegExp(),
	word  : /\w/,

	// Routing listeners
	routes : {
		all   : {
			error : function () {
				utility.error(label.error.invalidArguments);
				if (abaaso.route.initial !== null) route.hash(abaaso.route.initial);
			}
		},
		del   : {},
		get   : {},
		put   : {},
		post  : {}
	},

	/**
	 * Determines which HTTP method to use
	 * 
	 * @param  {String} arg HTTP method
	 * @return {[type]}     HTTP method to utilize
	 */
	method = function (arg) {
		return /all|del|get|put|post/gi.test(arg) ? arg.toLowerCase() : "all";
	};

	/**
	 * Deletes a route
	 * 
	 * @method del
	 * @param  {String} name Route name
	 * @return {Mixed} True or undefined
	 */
	del : function (name) {
		if (name !== "error" && route.routes.hasOwnProperty(name)) {
			if (abaaso.route.initial === name) abaaso.route.initial = null;
			return (delete route.routes[name]);
		}
		else throw Error(label.error.invalidArguments);
	},

	/**
	 * Getter / setter for the hashbang
	 * 
	 * @method hash
	 * @param  {String} arg Route to set
	 * @return {String}     Current route
	 */
	hash : function (arg) {
		var output = "";

		if (typeof arg === "undefined") output = document.location.hash.replace(route.bang, "");
		else {
			output = arg.replace(route.bang, "");
			document.location.hash = "!/" + output;
		}
		return output;
	},

	/**
	 * Initializes the routing by loading the initial OR the first route registered
	 * 
	 * @method init
	 * @return {String} Route being loaded
	 */
	init : function () {
		var val = document.location.hash;

		!route.word.test(val) ? route.hash(abaaso.route.initial !== null ? abaaso.route.initial : array.cast(route.routes, true).remove("error").first()) : route.load(val);
		return val.replace(route.bang, "");
	},

	/**
	 * Lists all routes
	 * 
	 * @set list
	 * @return {Array} Array of registered routes
	 */
	list : function () {
		return array.cast(route.routes, true);
	},

	/**
	 * Loads the hash into the view
	 * 
	 * @method load
	 * @param  {String} name  Route to load
	 * @param  {Object} arg   HTTP response (node)
	 * @param  {String} verb  HTTP method
	 * @return {Mixed}        True or undefined
	 */
	load : function (name, arg, verb) {
		verb = method(verb);
		var active = "error";

		name = name.replace(route.bang, "");
		if (typeof route.routes[verb][name] !== "undefined") active = name;
		else utility.iterate(route.routes[verb], function (v, k) { if (utility.compile(route.regex, "^" + k + "$", "i") && route.regex.test(name)) return !(active = k); });
		route.routes[active](arg || name);
		return true;
	},

	/**
	 * Creates a Server with URI routing
	 * 
	 * @method server
	 * @param  {Object} arg  Server options
	 * @return {fn}     fn   Error handler
	 * @todo  Add SSL support
	 */
	server : function (args, fn) {
		args    = args || {};
		var ssl = (args.port === 443);

		if (!server || ssl) throw Error(label.error.notSupported);

		// Route parameters
		args.host = args.host           || "127.0.0.1";
		args.port = parseInt(args.port) || 8000;
		args.verb = args.verb           || "GET";

		http.createServer(function (req, res) {
			route.load(req.url, res, req.method);
		}).on("error", function (e) {
			error(e, this, arguments);
			if (typeof fn === "function") fn(e);
		}).listen(args.port, args.host);
	},

	/**
	 * Sets a route for a URI
	 * 
	 * @method set
	 * @param  {String}   name  Regex pattern for the route
	 * @param  {Function} fn    Route listener
	 * @param  {String}   verb  HTTP method the route is for (default is GET)
	 * @return {Mixed}          True or undefined
	 */
	set : function (name, fn, verb) {
		if (typeof name !== "string" || name.isEmpty() || typeof fn !== "function") throw Error(label.error.invalidArguments);

		route.routes[method(verb)][name] = fn;
		return true;
	}
};
