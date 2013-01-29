// concated before outro.js
error     = utility.error;
bootstrap = function () {
	var cleanup, fn;

	if (typeof abaaso.bootstrap === "function") delete abaaso.bootstrap;

	// Describing the Client
	abaaso.client.size = client.size();
	client.version();
	client.mobile();
	client.tablet();

	// IE7 and older is not supported
	if (client.ie && client.version < 8) throw Error(label.error.upgrade);
	
	cleanup = function (obj) {
		var nodes = [];

		observer.remove(obj);
		if (obj.childNodes.length > 0) nodes = array.cast(obj.childNodes);
		if (nodes.length > 0) nodes.each(function (i) { cleanup(i); });
	};

	fn = function (e) {
		if (regex.complete_loaded.test(document.readyState)) {
			if (typeof abaaso.init === "function") abaaso.init();
			return false;
		}
	};

	if (Array.prototype.filter === undefined) {
		Array.prototype.filter = function (fn) {
			if (this === void 0 || this === null || typeof fn !== "function") throw Error(label.error.invalidArguments);

			var i      = null,
			    t      = Object(this),
			    nth    = t.length >>> 0,
			    result = [],
			    prop   = arguments[1],
			    val    = null;

			for (i = 0; i < nth; i++) {
				if (i in t) {
					val = t[i];
					if (fn.call(prop, val, i, t)) result.push(val);
				}
			}

			return result;
		};
	}

	if (Array.prototype.forEach === undefined) {
		Array.prototype.forEach = function (callback, thisArg) {
			if (this === null || typeof callback !== "function") throw Error(label.error.invalidArguments);

			var T,
			    k   = 0,
			    O   = Object(this),
			    len = O.length >>> 0;

			if (thisArg) T = thisArg;

			while (k < len) {
				var kValue;
				if (k in O) {
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}
				k++;
			}
		};
	}

	if (Array.prototype.indexOf === undefined) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
				if (this[i] === obj) return i;
			}

			return -1;
		}
	}

	if (Array.prototype.map === undefined) {
		Array.prototype.map = function (callback, thisArg) {
			var T, A, k;

			if (this == null) throw new TypeError(" this is null or not defined");

			var O = Object(this);
			var len = O.length >>> 0;

			if ({}.toString.call(callback) != "[object Function]") throw new TypeError(callback + " is not a function");
			if (thisArg) T = thisArg;

			A = new Array(len);
			k = 0;

			while(k < len) {
				var kValue, mappedValue;
				if (k in O) {
					kValue = O[k];
					mappedValue = callback.call(T, kValue, k, O);
					A[k] = mappedValue;
				}
				k++;
			}

			return A;
		}
	}

	if (Array.prototype.reduce === undefined) {
		Array.prototype.reduce = function (accumulator) {
			if (this === null || this === undefined) throw new TypeError("Object is null or undefined");

			var i = 0, l = this.length >> 0, curr;

			if (typeof accumulator !== "function") throw new TypeError("First argument is not callable");

			if (arguments.length < 2) {
				if (l === 0) throw new TypeError("Array length is 0 and no second argument");
				curr = this[0];
				i = 1; // start accumulating at the second element
			}
			else curr = arguments[1];

			while (i < l) {
				if (i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
				++i;
			}

			return curr;
		};
	}

	if (!server && document.documentElement.classList === undefined) {
		(function (view) {
			var ClassList, getter, proto, target, descriptor;

			if (!("HTMLElement" in view) && !("Element" in view)) return;

			ClassList = function (obj) {
				var classes = !obj.className.isEmpty() ? obj.className.explode(" ") : [],
				    self    = this;

				classes.each(function (i) { self.push(i); });
				this.updateClassName = function () { obj.className = this.join(" "); };
			};

			getter = function () {
				return new ClassList(this);
			};

			proto  = ClassList["prototype"] = [];
			target = (view.HTMLElement || view.Element)["prototype"];

			proto.add = function (arg) {
				if (!array.contains(this, arg)) {
					this.push(arg);
					this.updateClassName();
				}
			};

			proto.contains = function (arg) {
				return array.contains(this, arg);
			};

			proto.remove = function (arg) {
				if (array.contains(this, arg)) {
					array.remove(this, arg);
					this.updateClassName();
				}
			};

			proto.toggle = function (arg) {
				array[array.contains(this, arg) ? "remove" : "add"](this, arg);
				this.updateClassName();
			};

			if (Object.defineProperty) {
				descriptor = {
					get          : getter,
					enumerable   : !client.ie || client.version > 8 ? true : false,
					configurable : true
				};

				Object.defineProperty(target, "classList", descriptor);
			}
			else if (Object.prototype.__defineGetter__) target.__defineGetter__("classList", getter);
			else throw Error("Could not create classList shim");
		})(global);
	}

	if (Function.prototype.bind === undefined) {
		Function.prototype.bind = function (arg) {
			var fn    = this,
			    slice = Array.prototype.slice,
			    args  = slice.call(arguments, 1);
			
			return function () {
				return fn.apply(arg, args.concat(slice.call(arguments)));
			};
		};
	}

	// Cookie class is not relevant for server environment
	if (server) {
		delete abaaso.cookie;
		XMLHttpRequest = xhr();
	}

	// Binding helper & namespace to $
	$ = abaaso.$.bind($);
	utility.alias($, abaaso);
	delete $.$;
	delete $.bootstrap;
	delete $.callback;
	delete $.init;
	delete $.loading;

	// Setting default routes
	route.reset();

	// Creating route.initial after alias() so it's not assumed
	abaaso.route.initial = null;

	// Short cut to loading.create
	$.loading = abaaso.loading.create.bind($.loading);

	// Unbinding observer methods to maintain scope
	$.fire      = abaaso.fire;
	$.on        = abaaso.on;
	$.once      = abaaso.once;
	$.un        = abaaso.un;
	$.listeners = abaaso.listeners;

	// Setting initial application state
	abaaso.state._current = abaaso.state.current = "active";
	$.state._current      = $.state.current      = abaaso.state.current;

	// Setting sugar
	if (!server) {
		if (typeof global.$ === "undefined" || global.$ === null) global.$ = $;
		else {
			global.a$      = $;
			abaaso.aliased = "a$";
		}
	}

	// Hooking abaaso into native Objects
	utility.proto(Array, "array");
	if (typeof Element !== "undefined") utility.proto(Element, "element");
	if (client.ie && client.version === 8) utility.proto(HTMLDocument, "element");
	utility.proto(Function, "function");
	utility.proto(Number, "number");
	utility.proto(String, "string");

	// Creating error log
	$.error.log = abaaso.error.log = [];

	// Setting events & garbage collection
	$.on(global, "error", function (e) {
		$.fire("error", e);
	}, "error", global, "all");

	if (!server) {
		$.on(global, "hashchange", function (e)  {
			var hash = location.hash.replace(/\#|\!\/|\?.*/g, "");

			if ($.route.current !== hash || abaaso.route.current !== hash) {
				abaaso.route.current = hash;
				if ($.route.current !== abaaso.route.current) $.route.current = abaaso.route.current; // IE8 specific
				$.fire("beforeHash, hash, afterHash", location.hash);
			}
		}, "hash", global, "all");
		
		$.on(global, "resize", function (e)  {
			$.client.size = abaaso.client.size = client.size();
			$.fire("resize", abaaso.client.size);
		}, "resize", global, "all");
		
		$.on(global, "load", function (e)  {
			$.fire("render").un("render").un(this, "load");
		});
		
		if (typeof Object.observe === "function") {
			$.on(global, "DOMNodeInserted", function (e) {
				var obj = utility.target(e);

				Object.observe(obj, function (arg) {
					obj.fire("change", arg);
				});
			}, "mutation", global, "all");
		}

		$.on(global, "DOMNodeRemoved", function (e) {
			cleanup(utility.target(e));
		}, "mutation", global, "all");

		// Routing listener
		$.on("hash", function (arg) {
			if ($.route.enabled || abaaso.route.enabled) route.load(arg);
		}, "route", abaaso.route, "all");
	}

	// abaaso.state.current getter/setter
	var getter, setter;
	getter = function () { return this._current; };
	setter = function (arg) {
		if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

		abaaso.state.previous = abaaso.state._current;
		abaaso.state._current = arg;
		return abaaso.fire(arg);
	};

	if (!client.ie || client.version > 8) {
		utility.property(abaaso.state, "current", {enumerable: true, get: getter, set: setter});
		utility.property($.state,      "current", {enumerable: true, get: getter, set: setter});
	}
	// Pure hackery, only exists when needed
	else {
		abaaso.state.change = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
		$.state.change      = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
	}

	$.ready = true;

	// Preparing init()
	switch (true) {
		case server:
			abaaso.init();
			break;
		case typeof global.define === "function":
			global.define(function () { return abaaso.init(); });
			break;
		case (regex.complete_loaded.test(document.readyState)):
			abaaso.init();
			break;
		case typeof document.addEventListener === "function":
			document.addEventListener("DOMContentLoaded", abaaso.init, false);
			break;
		case typeof document.attachEvent === "function":
			document.attachEvent("onreadystatechange", fn);
			break;
		default:
			utility.repeat(fn);
	}
};
