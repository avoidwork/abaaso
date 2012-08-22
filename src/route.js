/**
 * URI routing via hashtag
 *
 * Client side routes will be in routes.all
 * 
 * @class route
 * @namespace abaaso
 */
var route = {
	bang  : /\#|\!\//g,
	regex : new RegExp(),

	// Routing listeners
	routes : {
		all   : {
			error : function () {
				if (!server) {
					if (route.hash() === "") return history.go(-1);
					else {
						utility.error(label.error.invalidRoute);
						if (abaaso.route.initial !== null) route.hash(abaaso.route.initial);
					}
				}
				else throw Error(label.error.invalidRoute);
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
	method : function (arg) {
		return /all|del|get|put|post/gi.test(arg) ? arg.toLowerCase() : "all";
	},

	/**
	 * Deletes a route
	 * 
	 * @method del
	 * @param  {String} name  Route name
	 * @param  {String} verb  HTTP method
	 * @return {Mixed}        True or undefined
	 */
	del : function (name, verb) {
		verb      = route.method(verb);
		var error = (name === "error");

		if ((error && verb !== "all") || (!error && route.routes[verb].hasOwnProperty(name))) {
			if (abaaso.route.initial === name) abaaso.route.initial = null;
			return (delete route.routes[verb][name]);
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

		val.isEmpty() ? route.hash(abaaso.route.initial !== null ? abaaso.route.initial : array.cast(route.routes.all, true).remove("error").first()) : route.load(val);
		return val.replace(route.bang, "");
	},

	/**
	 * Lists all routes
	 * 
	 * @set list
	 * @param {String} verb  HTTP method
	 * @return {Mixed}       Hash of routes if not specified, else an Array of routes for a method
	 */
	list : function (verb) {
		var result;

		switch (true) {
			case !server:
				result = array.cast(route.routes.all, true);
				break;
			case typeof verb !== "undefined":
				result = array.cast(route.routes[route.method(verb)], true);
				break;
			default:
				result = {};
				utility.iterate(route.routes, function (v, k) {
					result[k] = [];
					utility.iterate(v, function (fn, r) { result[k].push(r); });
				});
		}

		return result;
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
		verb = route.method(verb);
		var active = "",
		    path   = "",
		    result = true,
		    find;

		name = name.replace(route.bang, "");
		find = function (pattern, method, arg) {
			if (utility.compile(route.regex, "^" + pattern + "$", "i") && route.regex.test(arg)) {
				active = pattern;
				path   = method;
				return false;
			}
		}

		switch (true) {
			case typeof route.routes[verb][name] !== "undefined":
				active = name;
				path   = verb;
				break;
			case verb !== "all" && typeof route.routes.all[name] !== "undefined":
				active = name;
				path   = "all";
				break;
			default:
				utility.iterate(route.routes[verb], function (v, k) { return find(k, verb, name); });
				if (active.isEmpty() && verb !== "all") utility.iterate(route.routes.all, function (v, k) { return find(k, "all", name); });
		}

		if (active.isEmpty()) {
			active = "error";
			path   = "all";
			result = false;
		}

		route.routes[path][active](arg || active);
		return result;
	},

	/**
	 * Creates a Server with URI routing
	 * 
	 * @method server
	 * @param  {Object}   arg  Server options
	 * @param  {Function} fn   Error handler
	 * @param  {Boolean}  ssl  Determines if HTTPS server is created
	 * @return {Undefined}     undefined
	 */
	server : function (args, fn, ssl) {
		args = args || {};
		ssl  = (ssl === true || args.port === 443);

		if (!server) throw Error(label.error.notSupported);

		// Enabling routing, in case it's not explicitly enabled prior to route.server()
		$.route.enabled = abaaso.route.enabled = true;

		// Server parameters
		args.host = args.host           || "127.0.0.1";
		args.port = parseInt(args.port) || 8000;

		if (!ssl) {
			http.createServer(function (req, res) {
				route.load(require("url").parse(req.url).pathname, res, req.method);
			}).on("error", function (e) {
				error(e, this, arguments);
				if (typeof fn === "function") fn(e);
			}).listen(args.port, args.host);
		}
		else {
			https.createServer(args, function (req, res) {
				route.load(require("url").parse(req.url).pathname, res, req.method);
			}).on("error", function (e) {
				error(e, this, arguments);
				if (typeof fn === "function") fn(e);
			}).listen(args.port);
		}
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
		verb = server ? route.method(verb) : "all";
		if (typeof name !== "string" || name.isEmpty() || typeof fn !== "function") throw Error(label.error.invalidArguments);
		route.routes[verb][name] = fn;
		return true;
	}
};
