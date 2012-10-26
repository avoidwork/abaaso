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
		if (server || String(arg).indexOf("?") > -1) return undefined;

		arg      = arg.trim();
		nodelist = (nodelist === true);

		// Recursive processing, ends up below
		if (arg.indexOf(",") > -1) arg = arg.explode();
		if (arg instanceof Array) {
			arg.each(function (i) { tmp.push($(i, nodelist)); });
			tmp.each(function (i) { result = result.concat(i); });
			return result;
		}

		// Getting Element(s)
		switch (true) {
			case (/\s|>/.test(arg)):
				sel = arg.split(" ").filter(function (i) { if (i.trim() !== "" && i !== ">") return true; }).last();
				obj = document[sel.indexOf("#") > -1 && sel.indexOf(":") === -1 ? "querySelector" : "querySelectorAll"](arg);
				break;
			case arg.indexOf("#") === 0 && arg.indexOf(":") === -1:
				obj = isNaN(arg.charAt(1)) ? document.querySelector(arg) : document.getElementById(arg.substring(1));
				break;
			case arg.indexOf("#") > -1 && arg.indexOf(":") === -1:
				obj = document.querySelector(arg);
				break;
			default:
				obj = document.querySelectorAll(arg);
		}

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

			switch (true) {
				case !(v instanceof RegExp) && typeof v === "function":
					o[k] = v.bind(o[k]);
					break;
				case !(v instanceof RegExp) && !(v instanceof Array) && v instanceof Object:
					if (typeof o[k] === "undefined") o[k] = {};
					utility.alias(o[k], s[k]);
					break;
				default:
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

		switch (true) {
			case obj instanceof Array:
				return [].concat(obj);
			case typeof obj === "boolean":
				return Boolean(obj);
			case typeof obj === "function":
				return obj;
			case typeof obj === "number":
				return Number(obj);
			case typeof obj === "string":
				return String(obj);
			case !client.ie && !server && obj instanceof Document:
				return xml.decode(xml.encode(obj));
			case obj instanceof Object:
				clone = json.decode(json.encode(obj));
				if (typeof clone !== "undefined") {
					if (obj.hasOwnProperty("constructor")) clone.constructor = obj.constructor;
					if (obj.hasOwnProperty("prototype"))   clone.prototype   = obj.prototype;
				}
				return clone;
			default:
				return obj;
		}
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

		switch (true) {
			case (/^\d$/.test(result)):
				result = number.parse(result);
				break;
			case (/^(true|false)$/i.test(result)):
				result = /true/i.test(result);
				break;
			case result === "undefined":
				result = undefined;
				break;
			case result === "null":
				result = null;
				break;
			case (tmp = json.decode(result, true)) && typeof tmp !== "undefined":
				result = tmp;
				break;
		}
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
		var p   = obj,
		    nth = args.length;

		args  = args.split(".");
		if (typeof obj   === "undefined") obj   = this;
		if (typeof value === "undefined") value = null;
		if (obj === $) obj = abaaso;

		args.each(function (i, idx) {
			var num = idx + 1 < nth && !isNaN(parseInt(args[idx + 1])),
			    val = value;

			if (!isNaN(parseInt(i))) i = parseInt(i);
			
			// Creating or casting
			switch (true) {
				case typeof p[i] === "undefined":
					p[i] = num ? [] : {};
					break;
				case p[i] instanceof Object && num:
					p[i] = array.cast(p[i]);
					break;
				case p[i] instanceof Object:
					break;
				case p[i] instanceof Array && !num:
					p[i] = p[i].toObject();
					break;
				default:
					p[i] = {};
			}

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

		ms = ms || 10;
		id = id || utility.guid(true);

		op = function () {
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

			if (typeof console !== "undefined") {
				console[!warning ? "error" : "warn"](o.message);
				if (typeof o.stack !== "undefined") console[!warning ? "error" : "warn"](o.stack);
			}
			$.error.log.push(o);
			$.fire("error", o);
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

		switch (true) {
			case typeof Object.create === "function":
				o = Object.create(obj);
				break;
			default:
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
	 * @param  {Mixed} obj [Optional] Object to receive id
	 * @return {Mixed}     Object or id
	 */
	genId : function (obj) {
		var id;

		if (typeof obj !== "undefined") {
			switch (true) {
				case typeof obj.id !== "undefined" && obj.id !== "":
				case obj instanceof Array:
				case obj instanceof String || typeof obj === "string":
					return obj;
			}
		}

		do id = utility.domId(utility.guid(true));
		while (typeof $("#" + id) !== "undefined");

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
		if (obj instanceof Array) return obj.each(function (i) { utility.loading(i); });

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
	 * @param  {String} arg String to write to the console
	 * @return undefined;
	 * @private
	 */
	log : function (arg) {
		var ts = !server || typeof arg !== "object";

		try {
			console.log((ts ? "[" + new Date().toLocaleTimeString() + "] " : "") + arg);
		}
		catch (e) {
			error(e, arguments, this);
		}
		return undefined;
	},

	/**
	 * Merges obj with arg
	 * 
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
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function (uri) {
		var obj    = document.createElement("a"),
		    parsed = {};

		obj.href = uri;

		parsed = {
			protocol : obj.protocol,
			hostname : obj.hostname,
			port     : !String(obj.port).isEmpty() ? parseInt(obj.port) : "",
			pathname : obj.pathname,
			search   : obj.search,
			hash     : obj.hash,
			host     : obj.host,
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
		if (server && obj.hasOwnProperty(prop)) return;

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
			           addClass : function (arg) { return this.each(function (i) { i.addClass(arg); }); },
			           after    : function (type, args) { var a = []; this.each(function (i) { a.push(i.after(type, args)); }); return a; },
			           append   : function (type, args) { var a = []; this.each(function (i) { a.push(i.append(type, args)); }); return a; },
			           attr     : function (key, value) { var a = []; this.each(function (i) { a.push(i.attr(key, value)); }); return a; },
			           before   : function (type, args) { var a = []; this.each(function (i) { a.push(i.before(type, args)); }); return a; },
			           clear    : function (arg) { return this.each(function (i) { i.clear(); }); },
			           clone    : function () { return utility.clone(this); },
			           contains : function (arg) { return array.contains(this, arg); },
			           create   : function (type, args, position) { var a = []; this.each(function (i) { a.push(i.create(type, args, position)); }); return a; },
			           css      : function (key, value) { return this.each(function (i) { i.css(key, value); }); },
			           data     : function (key, value) { var a = []; this.each(function (i) { a.push(i.data(key, value)); }); return a; },
			           diff     : function (arg) { return array.diff(this, arg); },
			           disable  : function () { return this.each(function (i) { i.disable(); }); },
			           destroy  : function () { this.each(function (i) { i.destroy(); }); return []; },
			           each     : function (arg) { return array.each(this, arg); },
			           enable   : function () { return this.each(function (i) { i.enable(); }); },
			           find     : function (arg) { var a = []; this.each(function (i) { i.find(arg).each(function (r) { if (!a.contains(r)) a.push(r); }); }); return a; },
			           fire     : function () {
			           		var args = arguments;
			           		return this.each(function (i) { i.fire.apply(i, args); });
			           	},
			           first    : function () { return array.first(this); },
			           get      : function (uri, headers) { this.each(function (i) { i.get(uri, headers); }); return []; },
			           has      : function (arg) { var a = []; this.each(function (i) { a.push(i.has(arg)); }); return a; },
			           hasClass : function (arg) { var a = []; this.each(function (i) { a.push(i.hasClass(arg)); }); return a; },
			           hide     : function () { return this.each(function (i){ i.hide(); }); },
			           html     : function (arg) {
			           		if (typeof arg !== "undefined") return this.each(function (i){ i.html(arg); });
			           		else {
			           			var a = []; this.each(function (i) { a.push(i.html()); }); return a;
			           		}
			           },
			           index    : function (arg) { return array.index(this, arg); },
			           indexed  : function () { return array.indexed(this); },
			           intersect: function (arg) { return array.intersect(this, arg); },
			           is       : function (arg) { var a = []; this.each(function (i) { a.push(i.is(arg)); }); return a; },
			           isAlphaNum: function () { var a = []; this.each(function (i) { a.push(i.isAlphaNum()); }); return a; },
			           isBoolean: function () { var a = []; this.each(function (i) { a.push(i.isBoolean()); }); return a; },
			           isChecked: function () { var a = []; this.each(function (i) { a.push(i.isChecked()); }); return a; },
			           isDate   : function () { var a = []; this.each(function (i) { a.push(i.isDate()); }); return a; },
			           isDisabled: function () { var a = []; this.each(function (i) { a.push(i.isDisabled()); }); return a; },
			           isDomain : function () { var a = []; this.each(function (i) { a.push(i.isDomain()); }); return a; },
			           isEmail  : function () { var a = []; this.each(function (i) { a.push(i.isEmail()); }); return a; },
			           isEmpty  : function () { var a = []; this.each(function (i) { a.push(i.isEmpty()); }); return a; },
			           isHidden : function () { var a = []; this.each(function (i) { a.push(i.isHidden()); }); return a; },
			           isIP     : function () { var a = []; this.each(function (i) { a.push(i.isIP()); }); return a; },
			           isInt    : function () { var a = []; this.each(function (i) { a.push(i.isInt()); }); return a; },
			           isNumber : function () { var a = []; this.each(function (i) { a.push(i.isNumber()); }); return a; },
			           isPhone  : function () { var a = []; this.each(function (i) { a.push(i.isPhone()); }); return a; },
			           isUrl    : function () { var a = []; this.each(function (i) { a.push(i.isUrl()); }); return a; },
			           keys     : function () { return array.keys(this); },
			           last     : function (arg) { return array.last(this); },
			           listeners: function (event) { var a = []; this.each(function (i) { a = a.concat(i.listeners(event)); }); return a; },
			           loading  : function () { return this.each(function (i) { i.loading(); }); },
			           max      : function () { return array.max(this); },
			           min      : function () { return array.min(this); },
			           on       : function (event, listener, id, scope, state) { return this.each(function (i) { i.on(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
			           once     : function (event, listener, id, scope, state) { return this.each(function (i) { i.once(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
			           position : function () { var a = []; this.each(function (i) { a.push(i.position()); }); return a; },
			           prepend  : function (type, args) { var a = []; this.each(function (i) { a.push(i.prepend(type, args)); }); return a; },
			           range    : function (start, end) { return array.range(this, start, end); },
			           remove   : function (start, end) { return array.remove(this, start, end); },
			           removeClass: function (arg) { return this.each(function (i) { i.removeClass(arg); }); },
			           show     : function () { return this.each(function (i){ i.show(); }); },
			           size     : function () { var a = []; this.each(function (i) { a.push(i.size()); }); return a; },
			           text     : function (arg) {
			           		return this.each(function (node) {
			           			if (typeof node !== "object") node = utility.object(node);
			           			if (typeof node.text === "function") node.text(arg);
			           		});
			           },
			           tpl      : function (arg) { return this.each(function (i) { i.tpl(arg); }); },
			           toggleClass: function (arg) { return this.each(function (i) { i.toggleClass(arg); }); },
			           total    : function () { return array.total(this); },
			           toObject : function () { return array.toObject(this); },
			           un       : function (event, id, state) { return this.each(function (i) { i.un(event, id, state); }); },
			           update   : function (arg) { return this.each(function (i) { element.update(i, arg); }); },
			           val      : function (arg) {
			           		var a    = [],
			           		    type = null,
			           		    same = true;

			           		this.each(function (i) {
			           			if (type !== null) same = (type === i.type);
			           			type = i.type;
			           			if (typeof i.val === "function") a.push(i.val(arg));
			           		});
			           		return same ? a[0] : a;
			           	},
			           validate : function () { var a = []; this.each(function (i) { a.push(i.validate()); }); return a; }},
			element : {addClass : function (arg) {
			           		utility.genId(this);
			           		return element.klass(this, arg, true);
			           },
			           after    : function (type, args) {
			           		utility.genId(this);
			           		return element.create(type, args, this, "after");
			           },
			           append   : function (type, args) {
			           		utility.genId(this);
			           		return element.create(type, args, this, "last");
			           },
			           attr     : function (key, value) {
			           		utility.genId(this);
			           		return element.attr(this, key, value);
			           },
			           before   : function (type, args) {
			           		utility.genId(this);
			           		return element.create(type, args, this, "before");
			           },
			           clear    : function () {
			           		utility.genId(this);
			           		return element.clear(this);
			           },
			           create   : function (type, args, position) {
			           		utility.genId(this);
			           		return element.create(type, args, this, position);
			           },
			           css       : function (key, value) {
			           		utility.genId(this);
			           		return element.css(this, key, value);
			           },
			           data      : function (key, value) {
			           		utility.genId(this);
			           		return element.data(this, key, value);
			           },
			           destroy   : function () { return element.destroy(this); },
			           disable   : function () { return element.disable(this); },
			           enable    : function () { return element.enable(this); },
			           find      : function (arg) {
			           		utility.genId(this);
			           		return element.find(this, arg);
			           },
			           fire     : function () {
			           		utility.genId(this);
			           		observer.fire.apply(observer, [this].concat(array.cast(arguments)));
			           		return this;
			           },
			           genId    : function () { return utility.genId(this); },
			           get      : function (uri, headers) {
			           		this.fire("beforeGet");
			           		var cached = cache.get(uri),
			           		    self   = this;

			           		!cached ? uri.get(function (arg) { self.html(arg).fire("afterGet"); }, function (arg) { self.fire("failedGet", {response: client.parse(arg), xhr: arg}); }, headers)
			           		        : this.html(cached.response).fire("afterGet");

			           		return this;
			           },
			           has      : function (arg) {
			           		utility.genId(this);
			           		return element.has(this, arg);
			           },
			           hasClass : function (arg) {
			           		utility.genId(this);
			           		return element.hasClass(this, arg);
			           },
			           hide     : function () {
			           		utility.genId(this);
			           		return element.hide(this);
			           },
			           html     : function (arg) {
			           		utility.genId(this);
			           		return typeof arg === "undefined" ? this.innerHTML : this.update({innerHTML: arg});
			           },
			           is       : function (arg) {
			           		utility.genId(this);
			           		return element.is(this, arg);
			           },
			           isAlphaNum: function () { return this.nodeName === "FORM" ? false : validate.test({alphanum: typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
			           isBoolean: function () { return this.nodeName === "FORM" ? false : validate.test({"boolean": typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
			           isChecked: function () { return this.nodeName !== "INPUT" ? false : this.attr("checked"); },
			           isDate   : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : element.text(this).isDate(); },
			           isDisabled: function () { return this.nodeName !== "INPUT" ? false : this.attr("disabled"); },
			           isDomain : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : element.text(this).isDomain(); },
			           isEmail  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : element.text(this).isEmail(); },
			           isEmpty  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : element.text(this).isEmpty(); },
			           isHidden : function (arg) {
			           		utility.genId(this);
			           		return element.hidden(this);
			           },
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
			           listeners: function (event) {
			           		utility.genId(this);
			           		return $.listeners.call(this, event);
			           },
			           loading  : function () { return utility.loading(this); },
			           on       : function (event, listener, id, scope, state) {
			           		utility.genId(this);
			           		return $.on.call(this, event, listener, id, scope, state);
			           },
			           once     : function (event, listener, id, scope, state) {
			           		utility.genId(this);
			           		return $.once.call(this, event, listener, id, scope, state);
			           },
			           prepend  : function (type, args) {
			           		utility.genId(this);
			           		return element.create(type, args, this, "first");
			           },
			           prependChild: function (child) {
			           		utility.genId(this);
			           		return element.prependChild(this, child);
			           },
			           position : function () {
			           		utility.genId(this);
			           		return element.position(this);
			           },
			           removeClass : function (arg) {
			           		utility.genId(this);
			           		return element.klass(this, arg, false);
			           },
			           show     : function () {
			           		utility.genId(this);
			           		return element.show(this);
			           },
			           size     : function () {
			           		utility.genId(this);
			           		return element.size(this);
			           },
			           text     : function (arg) {
			           		utility.genId(this);
			           		return element.text(this, arg);
			           },
			           toggleClass: function (arg) {
			           		utility.genId(this);
			           		return element.toggleClass(this, arg);
			           },
			           tpl      : function (arg) { return utility.tpl(arg, this); },
			           un       : function (event, id, state) {
			           		utility.genId(this);
			           		return $.un.call(this, event, id, state);
			           },
			           update   : function (args) {
			           		utility.genId(this);
			           		return element.update(this, args);
			           },
			           val      : function (arg) {
			           		utility.genId(this);
			           		return element.val(this, arg);
			           },
			           validate : function () { return this.nodeName === "FORM" ? validate.test(this) : typeof this.value !== "undefined" ? !this.value.isEmpty() : !element.text(this).isEmpty(); }},
			"function": {reflect: function () { return utility.reflect(this); }},
			number  : {diff     : function (arg) { return number.diff (this, arg); },
			           fire     : function () { return observer.fire.apply(observer, [this.toString()].concat(array.cast(arguments))); return this; },
			           format   : function (delimiter, every) { return number.format(this, delimiter, every); },
			           half     : function (arg) { return number.half(this, arg); },
			           isEven   : function () { return number.even(this); },
			           isOdd    : function () { return number.odd(this); },
			           listeners: function (event) { return $.listeners.call(this.toString(), event); },
			           on       : function (event, listener, id, scope, state) { $.on.call(this.toString(), event, listener, id, scope || this, state); return this; },
			           once     : function (event, listener, id, scope, state) { $.once.call(this.toString(), event, listener, id, scope || this, state); return this; },
			           roundDown: function () { return number.round(this, "down"); },
			           roundUp  : function () { return number.round(this, "up"); },
			           un       : function (event, id, state) { $.un.call(this.toString(), event, id, state); return this; }},
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
			           listeners: function (event) { return $.listeners.call(this, event); },
			           post     : function (success, failure, args, headers) { return client.request(this, "POST", success, failure, args, headers); },
			           put      : function (success, failure, args, headers) { return client.request(this, "PUT", success, failure, args, headers); },
			           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
			           once     : function (event, listener, id, scope, state) { return $.once.call(this, event, listener, id, scope, state); },
			           options  : function (success, failure) { return client.request(this, "OPTIONS", success, failure); },
			           permissions: function () { return client.permissions(this); },
			           singular : function () { return string.singular(this); },
			           toCamelCase: function () { return string.toCamelCase(this); },
			           toNumber : function () { return number.parse(this); },
			           trim     : function () { return string.trim(this); },
			           un       : function (event, id, state) { return $.un.call(this, event, id, state); },
			           uncapitalize: function () { return string.uncapitalize(this); }}
		};

		utility.iterate(methods[type], function (v, k) { utility.property(obj.prototype, k, {value: v}); });
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
			result.each(function (prop) {
				item = prop.split("=");

				if (item[0].isEmpty()) return;

				switch (true) {
					case typeof item[1] === "undefined":
					case item[1].isEmpty():
						item[1] = "";
						break;
					case item[1].isNumber():
						item[1] = Number(item[1]);
						break;
					case item[1].isBoolean():
						item[1] = (item[1] === "true");
						break;
				}

				switch (true) {
					case typeof obj[item[0]] === "undefined":
						obj[item[0]] = item[1];
						break;
					case !(obj[item[0]] instanceof Array):
						obj[item[0]] = [obj[item[0]]];
					default:
						obj[item[0]].push(item[1]);
				}
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
	 * @return {String}       Timeout ID
	 */
	repeat : function (fn, ms, id) {
		ms = ms || 10;
		id = id || utility.guid(true);

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
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	stop : function (e) {
		if (typeof e.cancelBubble    !== "undefined") e.cancelBubble = true;
		if (typeof e.preventDefault  === "function")  e.preventDefault();
		if (typeof e.stopPropagation === "function")  e.stopPropagation();
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

		switch (true) {
			case typeof arg !== "object":
			case !(/object|undefined/.test(typeof target)) && typeof (target = target.charAt(0) === "#" ? $(target) : $(target)[0]) === "undefined":
				throw Error(label.error.invalidArguments);
		}

		if (typeof target === "undefined") target = $("body")[0];

		frag  = document.createDocumentFragment();
		switch (true) {
			case arg instanceof Array:
				arg.each(function (i, idx) {
					element.create(array.cast(i, true)[0], frag).html(array.cast(i)[0]);
				});
				break;
			default:
				utility.iterate(arg, function (i, k) {
					switch (true) {
						case typeof i === "string":
							element.create(k, frag).html(i);
							break;
						case i instanceof Array:
						case i instanceof Object:
							utility.tpl(i, element.create(k, frag));
							break;
					}
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
		arg.replace(/\]$/, "").replace(/\]/g, ".").split(/\.|\[/).each(function (i) {
			obj = obj[i];
		});
		return obj;
	}
};
