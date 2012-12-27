/**
 * Utilities
 *
 * @class utility
 * @namespace abaaso
 */
var utility = {
	// Collection of timers
	timer : {},

	/**
	 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
	 * 
	 * Accepts comma delimited queries
	 *
	 * @method $
	 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
	 * @param  {Boolean} nodelist [Optional] True will return a NodeList (by reference) for tags & classes
	 * @return {Mixed}            Element or Array of Elements
	 */
	$ : function (arg, nodelist) {
		var result = [],
		    tmp    = [],
		    obj, sel;

		// Blocking node or DOM query of unique URIs via $.on()
		if (server || typeof arg === "undefined" || String(arg).indexOf("?") > -1) return undefined;

		arg      = arg.trim();
		nodelist = (nodelist === true);

		// Recursive processing, ends up below
		if (arg.indexOf(",") > -1) arg = arg.explode();
		if (arg instanceof Array) {
			array.each(arg, function (i) { tmp.push($(i, nodelist)); });
			array.each(tmp, function (i) { result = result.concat(i); });
			return result;
		}

		// Getting Element(s)
		if (/\s|>/.test(arg)) {
			sel = array.last(arg.split(" ").filter(function (i) { if (string.trim(i) !== "" && i !== ">") return true; }));
			obj = document[sel.indexOf("#") > -1 && sel.indexOf(":") === -1 ? "querySelector" : "querySelectorAll"](arg);
		}
		else if (arg.indexOf("#") === 0 && arg.indexOf(":") === -1) obj = isNaN(arg.charAt(1)) ? document.querySelector(arg) : document.getElementById(arg.substring(1));
		else if (arg.indexOf("#") > -1 && arg.indexOf(":") === -1) obj = document.querySelector(arg);
		else obj = document.querySelectorAll(arg);

		// Transforming obj if required
		if (typeof obj !== "undefined" && obj !== null && !(obj instanceof Element) && !nodelist) obj = array.cast(obj);
		if (obj === null) obj = undefined;

		return obj;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @param  {Object} obj    Object receiving aliasing
	 * @param  {Object} origin Object providing structure to obj
	 * @return {Object}        Object receiving aliasing
	 */
	alias : function (obj, origin) {
		var o = obj,
		    s = origin;

		utility.iterate(s, function (v, k) {
			var getter, setter;

			if (!(v instanceof RegExp) && typeof v === "function") o[k] = v.bind(o[k]);
			else if (!(v instanceof RegExp) && !(v instanceof Array) && v instanceof Object) {
				if (typeof o[k] === "undefined") o[k] = {};
				utility.alias(o[k], s[k]);
			}
			else {
				getter = function () { return s[k]; },
				setter = function (arg) { s[k] = arg; };
				utility.property(o, k, {enumerable: true, get: getter, set: setter, value: s[k]});
			}
		});
		return obj;
	},

	/**
	 * Clears deferred & repeating functions
	 * 
	 * @param  {String} id ID of timer(s)
	 * @return {Undefined} undefined
	 */
	clearTimers : function (id) {
		if (typeof id === "undefined" || String(id).isEmpty()) throw Error(label.error.invalidArguments);

		// deferred
		if (typeof utility.timer[id] !== "undefined") {
			clearTimeout(utility.timer[id]);
			delete utility.timer[id];
		}

		// repeating
		if (typeof $.repeating[id] !== "undefined") {
			clearTimeout($.repeating[id]);
			delete $.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @param {Object}  obj Object to clone
	 * @return {Object}     Clone of obj
	 */
	clone : function (obj) {
		var clone;

		if (obj instanceof Array) return [].concat(obj);
		else if (typeof obj === "boolean") return Boolean(obj);
		else if (typeof obj === "function") return obj;
		else if (typeof obj === "number") return Number(obj);
		else if (typeof obj === "string") return String(obj);
		else if (!client.ie && !server && obj instanceof Document) return xml.decode(xml.encode(obj));
		else if (obj instanceof Object) {
			clone = json.decode(json.encode(obj));
			if (typeof clone !== "undefined") {
				if (obj.hasOwnProperty("constructor")) clone.constructor = obj.constructor;
				if (obj.hasOwnProperty("prototype"))   clone.prototype   = obj.prototype;
			}
			return clone;
		}
		else return obj;
	},

	/**
	 * Coerces a String to a Type
	 * 
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Typed version of the String
	 */
	coerce : function (value) {
		var result = utility.clone(value),
		    tmp;

		if (/^\d$/.test(result)) result = number.parse(result);
		else if (/^(true|false)$/i.test(result)) result = /true/i.test(result);
		else if (result === "undefined") result = undefined;
		else if (result === "null") result = null;
		else if ((tmp = json.decode(result, true)) && typeof tmp !== "undefined") result = tmp;
		return result;
	},

	/**
	 * Recompiles a RegExp by reference
	 *
	 * This is ideal when you need to recompile a regex for use within a conditional statement
	 * 
	 * @param  {Object} regex     RegExp
	 * @param  {String} pattern   Regular expression pattern
	 * @param  {String} modifiers Modifiers to apply to the pattern
	 * @return {Boolean}          true
	 */
	compile : function (regex, pattern, modifiers) {
		regex.compile(pattern, modifiers);
		return true;
	},

	/**
	 * Creates a CSS stylesheet in the View
	 *
	 * @method css
	 * @param  {String} content CSS to put in a style tag
	 * @param  {String} media   [Optional] Medias the stylesheet applies to
	 * @return {Object}         Element created or undefined
	 */
	css : function (content, media) {
		var ss, css;

		ss = $("head")[0].create("style", {type: "text/css", media: media || "print, screen"});
		if (ss.styleSheet) ss.styleSheet.cssText = content;
		else {
			css = document.createTextNode(content);
			ss.appendChild(css);
		}
		return ss;
	},

	/**
	 * Debounces a function
	 * 
	 * @method debounce
	 * @param  {Function} fn    Function to execute
	 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {Mixed}    scope `this` context during execution, default is `global`
	 * @return {Undefined}      undefined
	 */
	debounce : function (fn, ms, scope) {
		if (typeof fn !== "function") throw Error(label.error.invalidArguments);

		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			utility.defer(function () {
				fn.apply(scope, arguments);
			}, ms);
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
	 * @param  {String} args  Dot delimited string of the structure
	 * @param  {Mixed}  value Value to set
	 * @param  {Object} obj   Object receiving value
	 * @return {Object}       Object receiving value
	 */
	define : function (args, value, obj) {
		args    = args.split(".");
		var p   = obj,
		    nth = args.length;

		if (typeof obj   === "undefined") obj   = this;
		if (typeof value === "undefined") value = null;
		if (obj === $) obj = abaaso;

		array.each(args, function (i, idx) {
			var num = idx + 1 < nth && !isNaN(parseInt(args[idx + 1])),
			    val = value;

			if (!isNaN(parseInt(i))) i = parseInt(i);
			
			// Creating or casting
			if (typeof p[i] === "undefined") p[i] = num ? [] : {};
			else if (p[i] instanceof Object && num) p[i] = array.cast(p[i]);
			else if (p[i] instanceof Object) void 0;
			else if (p[i] instanceof Array && !num) p[i] = p[i].toObject();
			else p[i] = {};

			// Setting reference or value
			idx + 1 === nth ? p[i] = val : p = p[i];
		});

		return obj;
	},

	/**
	 * Defers the execution of Function by at least the supplied milliseconds
	 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
	 *
	 * @method defer
	 * @param  {Function} fn Function to defer execution of
	 * @param  {Number}   ms Milliseconds to defer execution
	 * @param  {Number}   id [Optional] ID of the deferred function
	 * @return {Object}      undefined
	 */
	defer : function (fn, ms, id) {
		var op;

		ms = ms || 0;
		id = id || utility.guid(true);

		op = function () {
			clearTimeout(utility.timer[id]);
			delete utility.timer[id];
			fn();
		};

		utility.timer[id] = setTimeout(op, ms);
		return undefined;
	},

	/**
	 * Encodes a GUID to a DOM friendly ID
	 *
	 * @method domId
	 * @param  {String} GUID
	 * @return {String} DOM friendly ID
	 * @private
	 */
	domId : function (arg) {
		return "a" + arg.replace(/-/g, "").slice(1);
	},

	/**
	 * Error handling, with history in .log
	 *
	 * @method error
	 * @param  {Mixed}   e       Error object or message to display
	 * @param  {Array}   args    Array of arguments from the callstack
	 * @param  {Mixed}   scope   Entity that was "this"
	 * @param  {Boolean} warning [Optional] Will display as console warning if true
	 * @return {Undefined}       undefined
	 */
	error : function (e, args, scope, warning) {
		var o;

		if (typeof e !== "undefined") {
			warning = (warning === true);
			o = {
				arguments : args,
				message   : typeof e.message !== "undefined" ? e.message : e,
				number    : typeof e.number !== "undefined" ? (e.number & 0xFFFF) : undefined,
				scope     : scope,
				stack     : typeof e.stack === "string" ? e.stack : undefined,
				timestamp : new Date().toUTCString(),
				type      : typeof e.type !== "undefined" ? e.type : "TypeError"
			};

			utility.log(o.stack || o.message, !warning ? "error" : "warn");
			$.error.log.push(o);
			observer.fire(abaaso, "error", o);
		}

		return undefined;
	},

	/**
	 * Creates a class extending obj, with optional decoration
	 *
	 * @method extend
	 * @param  {Object} obj Object to extend
	 * @param  {Object} arg [Optional] Object for decoration
	 * @return {Object}     Decorated obj
	 */
	extend : function (obj, arg) {
		var o, f;

		if (typeof obj === "undefined") throw Error(label.error.invalidArguments);
		if (typeof arg === "undefined") arg = {};

		if (typeof Object.create === "function") o = Object.create(obj);
		else {
			f = function () {};
			f.prototype = obj;
			o = new f();
		}

		utility.merge(o, arg);
		return o;
	},

	/**
	 * Generates an ID value
	 *
	 * @method genId
	 * @param  {Mixed}   obj [Optional] Object to receive id
	 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {Mixed}       Object or id
	 */
	genId : function (obj, dom) {
		dom = (dom === true);
		var id;

		if (typeof obj !== "undefined" && ((typeof obj.id !== "undefined" && obj.id !== "") || (obj instanceof Array) || (obj instanceof String || typeof obj === "string"))) return obj;

		if (dom) {
			do id = utility.domId(utility.guid(true));
			while (typeof $("#" + id) !== "undefined");
		}
		else id = utility.domId(utility.guid(true));

		if (typeof obj === "object") {
			obj.id = id;
			return obj;
		}
		else return id;
	},

	/**
	 * Generates a GUID
	 *
	 * @method guid
	 * @param {Boolean} safe [Optional] Strips - from GUID
	 * @return {String}      GUID
	 */
	guid : function (safe) {
		var s = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); },
		    r = [8, 9, "a", "b"],
		    o;

		safe  = (safe === true);

		o = (s() + s() + "-" + s() + "-4" + s().substr(0, 3) + "-" + r[Math.floor(Math.random() * r.length)] + s().substr(0, 3) + "-" + s() + s() + s()).toLowerCase();
		if (safe) o = o.replace(/-/gi, "");
		return o;
	},

	/**
	 * Iterates an Object and executes a function against the properties
	 *
	 * Iteration can be stopped by returning false from fn
	 * 
	 * @method iterate
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	iterate : function (obj, fn) {
		var has = Object.prototype.hasOwnProperty,
		    i, result;

		if (typeof fn !== "function") throw Error(label.error.invalidArguments);

		for (i in obj) {
			if (has.call(obj, i)) {
				result = fn.call(obj, obj[i], i);
				if (result === false) break;
			}
		}
		return obj;
	},

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @param  {Mixed} obj Entity or Array of Entities or $ queries
	 * @return {Mixed}     Entity, Array of Entities or undefined
	 */
	loading : function (obj) {
		var l = abaaso.loading;

		obj = utility.object(obj);
		if (obj instanceof Array) return array.each(obj, function (i) { utility.loading(i); });

		if (l.url === null) throw Error(label.error.elementNotFound);

		if (typeof obj === "undefined") throw Error(label.error.invalidArguments);

		// Setting loading image
		if (typeof l.image === "undefined") {
			l.image     = new Image();
			l.image.src = l.url;
		}

		// Clearing target element
		obj.clear();

		// Creating loading image in target element
		obj.create("div", {"class": "loading"}).create("img", {alt: label.common.loading, src: l.image.src});

		return obj;
	},

	/**
	 * Writes argument to the console
	 *
	 * @method log
	 * @private
	 * @param  {String} arg    String to write to the console
	 * @param  {String} target [Optional] Target console, default is "log"
	 * @return {Undefined}     undefined
	 */
	log : function (arg, target) {
		target =  target || "log";
		var ts = !server || typeof arg !== "object";

		if (typeof console !== "undefined") console[target]((ts ? "[" + new Date().toLocaleTimeString() + "] " : "") + arg);
		return undefined;
	},

	/**
	 * Merges obj with arg
	 * 
	 * @method merge
	 * @param  {Object} obj Object to decorate
	 * @param  {Object} arg Object to decorate with
	 * @return {Object}     Object to decorate
	 */
	merge : function (obj, arg) {
		utility.iterate(arg, function (v, k) {
			obj[k] = utility.clone(v);
		});
		return obj;
	},
	
	/**
	 * Registers a module in the abaaso namespace
	 *
	 * IE8 will have factories (functions) duplicated onto $ because it will not respect the binding
	 * 
	 * @method module
	 * @param  {String} arg Module name
	 * @param  {Object} obj Module structure
	 * @return {Object}     Module registered
	 */
	module : function (arg, obj) {
		if (typeof $[arg] !== "undefined" || typeof abaaso[arg] !== "undefined" || !obj instanceof Object) throw Error(label.error.invalidArguments);
		
		abaaso[arg] = obj;
		if (typeof obj === "function") $[arg] = !client.ie || client.version > 8 ? abaaso[arg].bind($[arg]) : abaaso[arg];
		else {
			$[arg] = {};
			utility.alias($[arg], abaaso[arg]);
		}
		return $[arg];
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @param  {Mixed} obj Entity or $ query
	 * @return {Mixed}     Entity
	 * @private
	 */
	object : function (obj) {
		return typeof obj === "object" ? obj : (obj.toString().charAt(0) === "#" ? $(obj) : obj);
	},

	/**
	 * Parses a URI into an Object
	 * 
	 * @method parse
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function (uri) {
		var obj    = {},
		    parsed = {};

		if (!server) {
			obj = document.createElement("a");
			obj.href = uri;
		}
		else obj = url.parse(uri);

		parsed = {
			protocol : obj.protocol,
			hostname : obj.hostname,
			port     : !String(obj.port).isEmpty() ? parseInt(obj.port) : "",
			pathname : obj.pathname,
			search   : obj.search,
			hash     : obj.hash,
			host     : obj.host
		};

		// 'cause IE is ... IE; required for data.batch()
		if (client.ie) {
			if (parsed.protocol === ":")           parsed.protocol = location.protocol;
			if (parsed.hostname.isEmpty())         parsed.hostname = location.hostname;
			if (parsed.host.isEmpty())             parsed.host     = location.host;
			if (parsed.pathname.charAt(0) !== "/") parsed.pathname = "/" + parsed.pathname;
		}

		return parsed;
	},

	/**
	 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
	 * 
	 * @method property
	 * @param  {Object} obj        Object to decorate
	 * @param  {String} prop       Name of property to set
	 * @param  {Object} descriptor Descriptor of the property
	 * @return {Object}            Object receiving the property
	 */
	property : function (obj, prop, descriptor) {
		var define;

		if (!(descriptor instanceof Object)) throw Error(label.error.invalidArguments);

		define = (!client.ie || client.version > 8) && typeof Object.defineProperty === "function";
		if (define && typeof descriptor.value !== "undefined" && typeof descriptor.get !== "undefined") delete descriptor.value;
		define ? Object.defineProperty(obj, prop, descriptor) : obj[prop] = descriptor.value;
		return obj;
	},

	/**
	 * Sets methods on a prototype object
	 *
	 * @method proto
	 * @param  {Object} obj  Object receiving prototype extension
	 * @param  {String} type Identifier of obj, determines what Arrays to apply
	 * @return {Object}      obj or undefined
	 * @private
	 */
	proto : function (obj, type) {
		// Collection of methods to add to prototypes
		var i,
		    methods = {
			array   : {add      : function (arg) { return array.add(this, arg); },
			           addClass : function (arg) { return array.each(this, function (i) { i.addClass(arg); }); },
			           after    : function (type, args) { var a = []; array.each(this, function (i) { a.push(i.after(type, args)); }); return a; },
			           append   : function (type, args) { var a = []; array.each(this, function (i) { a.push(i.append(type, args)); }); return a; },
			           attr     : function (key, value) { var a = []; array.each(this, function (i) { a.push(i.attr(key, value)); }); return a; },
			           before   : function (type, args) { var a = []; array.each(this, function (i) { a.push(i.before(type, args)); }); return a; },
			           chunk    : function (size) { return array.chunk(this, size); },
			           clear    : function () { return !server && this[0] instanceof Element ? array.each(this, function (i) { i.clear(); }) : array.clear(this); },
			           clone    : function () { return utility.clone(this); },
			           collect  : function (arg) { return array.collect(this, arg); },
			           compact  : function () { return array.compact(this); },
			           contains : function (arg) { return array.contains(this, arg); },
			           create   : function (type, args, position) { var a = []; array.each(this, function (i) { a.push(i.create(type, args, position)); }); return a; },
			           css      : function (key, value) { return array.each(this, function (i) { i.css(key, value); }); },
			           data     : function (key, value) { var a = []; array.each(this, function (i) { a.push(i.data(key, value)); }); return a; },
			           diff     : function (arg) { return array.diff(this, arg); },
			           disable  : function () { return array.each(this, function (i) { i.disable(); }); },
			           destroy  : function () { array.each(this, function (i) { i.destroy(); }); return []; },
			           each     : function (arg) { return array.each(this, arg); },
			           empty    : function () { return array.empty(this); },
			           enable   : function () { return array.each(this, function (i) { i.enable(); }); },
			           equal    : function (arg) { return array.equal(this, arg); },
			           fill     : function (arg, start, offset) { return array.fill(this, arg, start, offset); },
			           find     : function (arg) { var a = []; array.each(this, function (i) { i.find(arg).each(function (r) { if (!a.contains(r)) a.push(r); }); }); return a; },
			           fire     : function () { var args = arguments; return array.each(this, function (i) { observer.fire.apply(observer, args); }); },
			           first    : function () { return array.first(this); },
			           flat     : function () { return array.flat(this); },
			           get      : function (uri, headers) { array.each(this, function (i) { i.get(uri, headers); }); return []; },
			           has      : function (arg) { var a = []; array.each(this, function (i) { a.push(i.has(arg)); }); return a; },
			           hasClass : function (arg) { var a = []; array.each(this, function (i) { a.push(i.hasClass(arg)); }); return a; },
			           hide     : function () { return array.each(this, function (i){ i.hide(); }); },
			           html     : function (arg) {
			           		if (typeof arg !== "undefined") return array.each(this, function (i){ i.html(arg); });
			           		else {
			           			var a = []; array.each(this, function (i) { a.push(i.html()); }); return a;
			           		}
			           },
			           index    : function (arg) { return array.index(this, arg); },
			           indexed  : function () { return array.indexed(this); },
			           intersect: function (arg) { return array.intersect(this, arg); },
			           is       : function (arg) { var a = []; array.each(this, function (i) { a.push(i.is(arg)); }); return a; },
			           isAlphaNum: function () { var a = []; array.each(this, function (i) { a.push(i.isAlphaNum()); }); return a; },
			           isBoolean: function () { var a = []; array.each(this, function (i) { a.push(i.isBoolean()); }); return a; },
			           isChecked: function () { var a = []; array.each(this, function (i) { a.push(i.isChecked()); }); return a; },
			           isDate   : function () { var a = []; array.each(this, function (i) { a.push(i.isDate()); }); return a; },
			           isDisabled: function () { var a = []; array.each(this, function (i) { a.push(i.isDisabled()); }); return a; },
			           isDomain : function () { var a = []; array.each(this, function (i) { a.push(i.isDomain()); }); return a; },
			           isEmail  : function () { var a = []; array.each(this, function (i) { a.push(i.isEmail()); }); return a; },
			           isEmpty  : function () { var a = []; array.each(this, function (i) { a.push(i.isEmpty()); }); return a; },
			           isHidden : function () { var a = []; array.each(this, function (i) { a.push(i.isHidden()); }); return a; },
			           isIP     : function () { var a = []; array.each(this, function (i) { a.push(i.isIP()); }); return a; },
			           isInt    : function () { var a = []; array.each(this, function (i) { a.push(i.isInt()); }); return a; },
			           isNumber : function () { var a = []; array.each(this, function (i) { a.push(i.isNumber()); }); return a; },
			           isPhone  : function () { var a = []; array.each(this, function (i) { a.push(i.isPhone()); }); return a; },
			           isUrl    : function () { var a = []; array.each(this, function (i) { a.push(i.isUrl()); }); return a; },
			           keep_if  : function (fn) { return array.keep_if(this, fn); },
			           keys     : function () { return array.keys(this); },
			           last     : function (arg) { return array.last(this, arg); },
			           limit    : function (start, offset) { return array.limit(this, start, offset); },
			           listeners: function (event) { var a = []; array.each(this, function (i) { a = a.concat(i.listeners(event)); }); return a; },
			           loading  : function () { return array.each(this, function (i) { i.loading(); }); },
			           max      : function () { return array.max(this); },
			           mean     : function () { return array.mean(this); },
			           median   : function () { return array.median(this); },
			           min      : function () { return array.min(this); },
			           mode     : function () { return array.mode(this); },
			           on       : function (event, listener, id, scope, state) { return array.each(this, function (i) { i.on(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
			           once     : function (event, listener, id, scope, state) { return array.each(this, function (i) { i.once(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
			           position : function () { var a = []; array.each(this, function (i) { a.push(i.position()); }); return a; },
			           prepend  : function (type, args) { var a = []; array.each(this, function (i) { a.push(i.prepend(type, args)); }); return a; },
			           range    : function () { return array.range(this); },
			           rassoc   : function (arg) { return array.rassoc(this, arg); },
			           reject   : function (fn) { return array.reject(this, fn); },
			           remove   : function (start, end) { return array.remove(this, start, end); },
			           remove_if: function (fn) { return array.remove_if(this, fn); },
			           remove_while: function (fn) { return array.remove_while(this, fn); },
			           removeClass: function (arg) { return array.each(this, function (i) { i.removeClass(arg); }); },
			           replace  : function (arg) { return array.replace(this, arg); },
			           rest     : function (arg) { return array.rest(this, arg); },
			           rindex   : function (arg) { return array.rindex(this, arg); },
			           rotate   : function (arg) { return array.rotate(this, arg); },
			           serialize: function (string, encode) { return element.serialize(this, string, encode); },
			           series   : function (start, end, offset) { return array.series(start, end, offset); },
			           show     : function () { return array.each(this, function (i){ i.show(); }); },
			           size     : function () { var a = []; array.each(this, function (i) { a.push(i.size()); }); return a; },
			           split    : function (size) { return array.split(this, size); },
			           sum      : function () { return array.sum(this); },
			           take     : function (arg) { return array.take(this, arg); },
			           text     : function (arg) {
			           		return array.each(this, function (node) {
			           			if (typeof node !== "object") node = utility.object(node);
			           			if (typeof node.text === "function") node.text(arg);
			           		});
			           },
			           tpl      : function (arg) { return array.each(this, function (i) { i.tpl(arg); }); },
			           toggleClass: function (arg) { return array.each(this, function (i) { i.toggleClass(arg); }); },
			           total    : function () { return array.total(this); },
			           toObject : function () { return array.toObject(this); },
			           un       : function (event, id, state) { return array.each(this, function (i) { i.un(event, id, state); }); },
			           unique   : function () { return array.unique(this); },
			           update   : function (arg) { return array.each(this, function (i) { element.update(i, arg); }); },
			           val      : function (arg) {
			           		var a    = [],
			           		    type = null,
			           		    same = true;

			           		array.each(this, function (i) {
			           			if (type !== null) same = (type === i.type);
			           			type = i.type;
			           			if (typeof i.val === "function") a.push(i.val(arg));
			           		});
			           		return same ? a[0] : a;
			           	},
			           validate : function () { var a = []; array.each(this, function (i) { a.push(i.validate()); }); return a; },
			           zip      : function () { return array.zip(this, arguments); }},
			element : {addClass : function (arg) { return element.klass(this, arg, true); },
			           after    : function (type, args) { return element.create(type, args, this, "after"); },
			           append   : function (type, args) { return element.create(type, args, this, "last"); },
			           attr     : function (key, value) { return element.attr(this, key, value); },
			           before   : function (type, args) { return element.create(type, args, this, "before"); },
			           clear    : function () { return element.clear(this); },
			           create   : function (type, args, position) { return element.create(type, args, this, position); },
			           css       : function (key, value) { return element.css(this, key, value); },
			           data      : function (key, value) { return element.data(this, key, value); },
			           destroy   : function () { return element.destroy(this); },
			           disable   : function () { return element.disable(this); },
			           enable    : function () { return element.enable(this); },
			           find      : function (arg) { return element.find(this, arg); },
			           fire     : function () { return observer.fire.apply(observer, [this].concat(array.cast(arguments))); },
			           genId    : function () { return utility.genId(this); },
			           get      : function (uri, success, failure, headers, timeout) {
			           		var deferred = promise.factory(),
			           		    self     = this;

			           		deferred.then(function (arg) {
			           			element.update(self, {innerHTML: arg});
			           			observer.fire(self, "afterGet");
			           			if (typeof success === "function") success.call(self, arg);
			           			return arg;
			           		}, function (arg) {
			           			element.update(self, {innerHTML: arg || label.error.serverError});
			           			observer.fire(self, "failedGet");
			           			if (typeof failure === "function") failure.call(self, arg);
			           			return arg;
			           		});

			           		observer.fire(this, "beforeGet");

			           		uri.get(function (arg) { 
			           			deferred.resolve(arg);
			           		}, function (arg) {
			           			deferred.reject(arg);
			           		}, headers, timeout);

			           		return this;
			           },
			           has      : function (arg) { return element.has(this, arg); },
			           hasClass : function (arg) { return element.hasClass(this, arg); },
			           hide     : function () { return element.hide(this); },
			           html     : function (arg) { return typeof arg === "undefined" ? string.trim(this.innerHTML) : this.update({innerHTML: arg}); },
			           is       : function (arg) { return element.is(this, arg); },
			           isAlphaNum: function () { return this.nodeName === "FORM" ? false : validate.test({alphanum: typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
			           isBoolean: function () { return this.nodeName === "FORM" ? false : validate.test({"boolean": typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
			           isChecked: function () { return this.nodeName !== "INPUT" ? false : this.attr("checked"); },
			           isDate   : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : element.text(this).isDate(); },
			           isDisabled: function () { return this.nodeName !== "INPUT" ? false : this.attr("disabled"); },
			           isDomain : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : element.text(this).isDomain(); },
			           isEmail  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : element.text(this).isEmail(); },
			           isEmpty  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : element.text(this).isEmpty(); },
			           isHidden : function (arg) { return element.hidden(this); },
			           isIP     : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isIP()     : element.text(this).isIP(); },
			           isInt    : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isInt()    : element.text(this).isInt(); },
			           isNumber : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isNumber() : element.text(this).isNumber(); },
			           isPhone  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isPhone()  : element.text(this).isPhone(); },
			           isUrl    : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isUrl()    : element.text(this).isUrl(); },
			           jsonp    : function (uri, property, callback) {
			           		var target = this,
			           		    arg    = property, fn;

			           		fn = function (response) {
			           			var self = target,
			           			    node = response,
			           			    prop = arg,
			           			    i, nth, result;

			           			try {
			           				if (typeof prop !== "undefined") {
			           					prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
			           					prop.each(function (i) {
			           						node = node[!!isNaN(i) ? i : parseInt(i)];
			           						if (typeof node === "undefined") throw Error(label.error.propertyNotFound);
			           					});
			           					result = node;
			           				}
			           				else result = response;
			           			}
			           			catch (e) {
			           				result = label.error.serverError;
			           				error(e, arguments, this);
			           			}

			           			self.text(result);
			           		};
			           		client.jsonp(uri, fn, function () { target.text(label.error.serverError); }, callback);
			           		return this;
			           },
			           listeners: function (event) { return observer.list(this, event); },
			           loading  : function () { return utility.loading(this); },
			           on       : function (event, listener, id, scope, state) { return observer.add(this, event, listener, id, scope, state); },
			           once     : function (event, listener, id, scope, state) { return observer.once(this, event, listener, id, scope, state); },
			           prepend  : function (type, args) { return element.create(type, args, this, "first"); },
			           prependChild: function (child) { return element.prependChild(this, child); },
			           position : function () { return element.position(this); },
			           removeClass : function (arg) { return element.klass(this, arg, false); },
			           serialize: function (string, encode) { return element.serialize(this, string, encode); },
			           show     : function () { return element.show(this); },
			           size     : function () { return element.size(this); },
			           text     : function (arg) { return element.text(this, arg); },
			           toggleClass: function (arg) { return element.toggleClass(this, arg); },
			           tpl      : function (arg) { return utility.tpl(arg, this); },
			           un       : function (event, id, state) { return observer.remove(this, event, id, state); },
			           update   : function (args) { return element.update(this, args); },
			           val      : function (arg) { return element.val(this, arg); },
			           validate : function () { return this.nodeName === "FORM" ? validate.test(this) : typeof this.value !== "undefined" ? !this.value.isEmpty() : !element.text(this).isEmpty(); }},
			"function": {reflect: function () { return utility.reflect(this); },
			           debounce : function (ms) { return utility.debounce(this, ms); }},
			number  : {diff     : function (arg) { return number.diff (this, arg); },
			           fire     : function () { return observer.fire.apply(observer, [this.toString()].concat(array.cast(arguments))); },
			           format   : function (delimiter, every) { return number.format(this, delimiter, every); },
			           half     : function (arg) { return number.half(this, arg); },
			           isEven   : function () { return number.even(this); },
			           isOdd    : function () { return number.odd(this); },
			           listeners: function (event) { return observer.list(this.toString(), event); },
			           on       : function (event, listener, id, scope, state) { observer.add(this.toString(), event, listener, id, scope || this, state); return this; },
			           once     : function (event, listener, id, scope, state) { observer.once(this.toString(), event, listener, id, scope || this, state); return this; },
			           random   : function () { return number.random(this); },
			           roundDown: function () { return number.round(this, "down"); },
			           roundUp  : function () { return number.round(this, "up"); },
			           un       : function (event, id, state) { observer.remove(this.toString(), event, id, state); return this; }},
			string  : {allows   : function (arg) { return client.allows(this, arg); },
			           capitalize: function () { return string.capitalize(this); },
			           del      : function (success, failure, headers) { return client.request(this, "DELETE", success, failure, null, headers); },
			           escape   : function () { return string.escape(this); },
			           expire   : function (silent) { return cache.expire(this, silent); },
			           explode  : function (arg) { return string.explode(this, arg); },
			           fire     : function () { return observer.fire.apply(observer, [this].concat(array.cast(arguments))); },
			           get      : function (success, failure, headers) { return client.request(this, "GET", success, failure, null, headers); },
			           headers  : function (success, failure) { return client.request(this, "HEAD", success, failure); },
			           hyphenate: function (camel) { return string.hyphenate(this, camel); },
			           isAlphaNum: function () { return validate.test({alphanum: this}).pass; },
			           isBoolean: function () { return validate.test({"boolean": this}).pass; },
			           isDate   : function () { return validate.test({date: this}).pass; },
			           isDomain : function () { return validate.test({domain: this}).pass; },
			           isEmail  : function () { return validate.test({email: this}).pass; },
			           isEmpty  : function () { return (string.trim(this) === ""); },
			           isIP     : function () { return validate.test({ip: this}).pass; },
			           isInt    : function () { return validate.test({integer: this}).pass; },
			           isNumber : function () { return validate.test({number: this}).pass; },
			           isPhone  : function () { return validate.test({phone: this}).pass; },
			           isUrl    : function () { return validate.test({url: this}).pass; },
			           jsonp    : function (success, failure, callback) { return client.jsonp(this, success, failure, callback); },
			           listeners: function (event) { return observer.list(this, event); },
			           post     : function (success, failure, args, headers) { return client.request(this, "POST", success, failure, args, headers); },
			           put      : function (success, failure, args, headers) { return client.request(this, "PUT", success, failure, args, headers); },
			           on       : function (event, listener, id, scope, state) { return observer.add(this, event, listener, id, scope, state); },
			           once     : function (event, listener, id, scope, state) { return observer.add(this, event, listener, id, scope, state); },
			           options  : function (success, failure) { return client.request(this, "OPTIONS", success, failure); },
			           permissions: function () { return client.permissions(this); },
			           singular : function () { return string.singular(this); },
			           toCamelCase: function () { return string.toCamelCase(this); },
			           toNumber : function (base) { return number.parse(this, base); },
			           trim     : function () { return string.trim(this); },
			           un       : function (event, id, state) { return observer.remove(this, event, id, state); },
			           uncapitalize: function () { return string.uncapitalize(this); }}
		};

		utility.iterate(methods[type], function (v, k) {
			// Allowing hooks to be overwritten for libs like d3 that require it
			utility.property(obj.prototype, k, {value: v, configurable: true, writable: true});
		});
		return obj;
	},

	/**
	 * Returns an Object containing 1 or all key:value pairs from the querystring
	 *
	 * @method queryString
	 * @param  {String} arg [Optional] Key to find in the querystring
	 * @return {Object}     Object of 1 or all key:value pairs in the querystring
	 */
	queryString : function (arg) {
		var obj    = {},
		    result = location.search.isEmpty() ? null : location.search.replace("?", ""),
		    item;

		arg = arg || ".*";

		if (result !== null) {
			result = result.split("&");
			array.each(result, function (prop) {
				item = prop.split("=");

				if (item[0].isEmpty()) return;

				if (typeof item[1] === "undefined" || item[1].isEmpty()) item[1] = "";
				else if (item[1].isNumber()) item[1] = Number(item[1]);
				else if (item[1].isBoolean()) item[1] = (item[1] === "true");

				if (typeof obj[item[0]] === "undefined") obj[item[0]] = item[1];
				else if (!(obj[item[0]] instanceof Array)) {
					obj[item[0]] = [obj[item[0]]];
					obj[item[0]].push(item[1]);
				}
				else obj[item[0]].push(item[1]);
			});
		}
		return obj;
	},

	/**
	 * Returns an Array of parameters of a Function
	 * 
	 * @method reflect
	 * @param  {Function} arg Function to reflect
	 * @return {Array}        Array of parameters
	 */
	reflect : function (arg) {
		if (typeof arg === "undefined") arg = this;
		if (typeof arg === "undefined") arg = $;
		arg = arg.toString().match(/function\s+\w*\s*\((.*?)\)/)[1];
		return arg !== "" ? arg.explode() : [];
	},

	/**
	 * Creates a recursive function
	 * 
	 * Return false from the function to halt recursion
	 * 
	 * @method repeat
	 * @param  {Function} fn  Function to execute repeatedly
	 * @param  {Number}   ms  Milliseconds to stagger the execution
	 * @param  {String}   id  [Optional] Timeout ID
	 * @param  {Boolean}  now Executes `fn` and then setup repetition, default is `true`
	 * @return {String}       Timeout ID
	 */
	repeat : function (fn, ms, id, now) {
		ms  = ms || 10;
		id  = id || utility.guid(true);
		now = (now !== false);

		// Could be valid to return false from initial execution
		if (now) if (fn() === false) return;

		utility.defer(function () {
			var recursive = function (fn, ms, id) {
				var recursive = this;

				if (fn() !== false) {
					$.repeating[id] = setTimeout(function () {
						recursive.call(recursive, fn, ms, id);
					}, ms);
				}
				else delete $.repeating[id];
			};

			recursive.call(recursive, fn, ms, id);
		}, ms, id);

		return id;
	},

	/**
	 * Creates a script Element to load an external script
	 * 
	 * @method script
	 * @param  {String} arg    URL to script
	 * @param  {Object} target [Optional] Element to receive the script
	 * @param  {String} pos    [Optional] Position to create the script at within the target
	 * @return {Object}        Script
	 */
	script : function (arg, target, pos) {
		return element.create("script", {type: "application/javascript", src: arg}, target || $("head")[0], pos);
	},

	/**
	 * Creates a link Element to load an external stylesheet
	 * 
	 * @method stylesheet
	 * @param  {String} arg   URL to stylesheet
	 * @param  {String} media [Optional] Medias the stylesheet applies to
	 * @return {Objecct}      Stylesheet
	 */
	stylesheet : function (arg, media) {
		return element.create("link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, $("head")[0]);
	},

	/**
	 * Stops an Event from bubbling
	 * 
	 * @method stop
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	stop : function (e) {
		if (typeof e.cancelBubble    !== "undefined") e.cancelBubble = true;
		if (typeof e.preventDefault  === "function")  e.preventDefault();
		if (typeof e.stopPropagation === "function")  e.stopPropagation();

		// Assumed to always be valid, even if it's not decorated on `e` (I'm looking at you IE8)
		e.returnValue = false;

		return e;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @param  {Object} data   JSON Object describing HTML
	 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {Object}        New Element created from the template
	 */
	tpl : function (arg, target) {
		var frag;

		if (typeof arg !== "object" || (!(/object|undefined/.test(typeof target)) && typeof (target = target.charAt(0) === "#" ? $(target) : $(target)[0]) === "undefined")) throw Error(label.error.invalidArguments);

		if (typeof target === "undefined") target = $("body")[0];

		frag  = document.createDocumentFragment();
		if (arg instanceof Array) {
			array.each(arg, function (i, idx) {
				element.create(array.cast(i, true)[0], frag).html(array.cast(i)[0]);
			});
		}
		else {
			utility.iterate(arg, function (i, k) {
				if (typeof i === "string") element.create(k, frag).html(i);
				else if ((i instanceof Array) || (i instanceof Object)) utility.tpl(i, element.create(k, frag));
			});
		}
		target.appendChild(frag);
		return array.last(target.childNodes);
	},

	/**
	 * Walks a structure and returns arg
	 * 
	 * @method  walk
	 * @param  {Mixed}  obj  Object or Array
	 * @param  {String} arg  String describing the property to return
	 * @return {Mixed}       arg
	 */
	walk : function (obj, arg) {
		array.each(arg.replace(/\]$/, "").replace(/\]/g, ".").split(/\.|\[/), function (i) {
			obj = obj[i];
		});
		return obj;
	}
};
