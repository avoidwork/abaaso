/**
 * Global Observer wired to a State Machine
 *
 * @class observer
 * @namespace abaaso
 */
var observer = {
	// Collection of listeners
	listeners  : {},

	// Array copy of listeners for observer.fire()
	alisteners : {},

	// Event listeners
	elisteners : {},

	// Tracks count of listeners per event across all states
	clisteners : {},

	// Boolean indicating if events are logged to the console
	log : false,

	// Queue of events to fire
	queue : [],

	// If `true`, events are queued
	silent : false,

	// If `true`, events are ignored
	ignore : false,

	/**
	 * Adds a handler to an event
	 *
	 * @method add
	 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
	 * @param  {String}   event Event, or Events being fired (comma delimited supported)
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   state [Optional] The state the listener is for
	 * @return {Mixed}          Entity, Array of Entities or undefined
	 */
	add : function (obj, event, fn, id, scope, state) {
		obj   = utility.object(obj);
		scope = scope || obj;
		state = state || abaaso.state.current;

		if (obj instanceof Array) {
			return array.each(obj, function (i) {
				observer.add(i, event, fn, id, scope, state);
			});
		}

		if (event !== undefined) event = string.explode(event);
		id = id || utility.genId();

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    ev       = observer.elisteners,
		    cl       = observer.clisteners,
		    gr       = regex.observer_globals,
		    ar       = regex.observer_allowed,
		    o        = observer.id(obj),
		    n        = false,
		    c        = abaaso.state.current,
		    add, reg;

		if (o === undefined || event === null || event === undefined || typeof fn !== "function") throw Error(label.error.invalidArguments);

		if (l[o] === undefined) {
			l[o]  = {};
			a[o]  = {};
			cl[o] = {};
		}

		array.each(event, function (i) {
			var eid = o + "_" + i;

			if (l[o][i] === undefined) {
				l[o][i]  = {};
				a[o][i]  = {};
				cl[o][i] = 0;
			}

			if (l[o][i][state] === undefined) {
				l[o][i][state] = {};
				a[o][i][state] = [];
			}

			instance = (gr.test(o) || (!/\//g.test(o) && o !== "abaaso")) ? obj : null;

			// Setting up event listener if valid
			if (instance !== null && instance !== undefined && i.toLowerCase() !== "afterjsonp" && ev[eid] === undefined && (gr.test(o) || typeof instance.listeners === "function")) {
				add = (typeof instance.addEventListener === "function");
				reg = (typeof instance.attachEvent === "object" || add);
				if (reg) {
					// Registering event listener
					ev[eid] = function (e) {
						if (!ar.test(e.type)) utility.stop(e);
						observer.fire(obj, i, e);
					};

					// Hooking event listener
					instance[add ? "addEventListener" : "attachEvent"]((add ? "" : "on") + i, ev[eid], false);
				}
			}

			l[o][i][state][id] = {fn: fn, scope: scope};
			observer.sync(o, i, state);
			cl[o][i]++;
		});

		return obj;
	},

	/**
	 * Decorates `obj` with `observer` methods
	 * 
	 * @param  {Object} obj Object to decorate
	 * @return {Object}     Object to decorate
	 */
	decorate : function (obj) {
		var methods = [
			["fire",      function () { return observer.fire.apply(observer, [this].concat(array.cast(arguments))); }],
			["listeners", function (event) { return observer.list(this, event); }],
			["on",        function (event, listener, id, scope, standby) { return observer.add(this, event, listener, id, scope, standby); }],
			["once",      function (event, listener, id, scope, standby) { return observer.once(this, event, listener, id, scope, standby); }],
			["un",        function (event, id) { return observer.remove(this, event, id); }]
		];

		array.each(methods, function (i) {
			utility.property(obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true});
		});

		return obj;
	},

	/**
	 * Discard observer events
	 *
	 * @param {Boolean} arg [Optional] Boolean indicating if events will be ignored
	 * @return              Current setting
	 */
	discard : function (arg) {
		return arg === undefined ? observer.ignore : (observer.ignore = (arg === true));
	},

	/**
	 * Fires an event
	 *
	 * @method fire
	 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
	 * @param  {String} event Event, or Events being fired (comma delimited supported)
	 * @return {Mixed}        Entity, Array of Entities or undefined
	 */
	fire : function (obj, event) {
		obj      = utility.object(obj);
		var quit = false,
		    a    = array.cast(arguments).remove(0, 1),
		    o, a, s, log, c, l, list;

		if (observer.ignore) return obj;

		if (obj instanceof Array) {
			array.each(obj, function (i) {
				a = [i, event].concat(a);
				observer.fire.apply(observer, a);
			});

			return obj;
		}

		o = observer.id(obj);
		if (o === undefined || event === undefined) throw Error(label.error.invalidArguments);

		if (observer.silent) observer.queue.push({obj: obj, event: event});
		else {
			s   = abaaso.state.current;
			log = ($.logging || abaaso.logging);

			array.each(string.explode(event), function (e) {
				if (log) utility.log(o + " firing " + e);
				list = observer.list(obj, e, observer.alisteners);
				if (list.all !== undefined) {
					array.each(list.all, function (i) {
						var result = i.fn.apply(i.scope, a);

						if (result === false) {
							quit = true;
							return result;
						}
					});
				}
				if (!quit && s !== "all" && list[s] !== undefined) {
					array.each(list[s], function (i) {
						return i.fn.apply(i.scope, a);
					});
				}
			});
		}
		return obj;
	},

	/**
	 * Gets the Observer id of arg
	 *
	 * @method id
	 * @param  {Mixed}  Object or String
	 * @return {String} Observer id
	 * @private
	 */
	id : function (arg) {
		var id;

		if (arg === abaaso) id = "abaaso";
		else if (arg === global) id = "window";
		else if (arg === !server && document) id = "document";
		else if (arg === !server && document.body) id = "body";
		else {
			utility.genId(arg);
			id = arg.id || (typeof arg.toString === "function" ? arg.toString() : arg);
		}
		return id;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @param  {Mixed}  obj    Entity or Array of Entities or $ queries
	 * @param  {String} event  Event being queried
	 * @param  {Object} target [Optional] Listeners collection to access, default is `observer.listeners`
	 * @return {Mixed}         Object or Array of listeners for the event
	 */
	list : function (obj, event, target) {
		obj   = utility.object(obj);
		var l = target || observer.listeners,
		    o = observer.id(obj),
		    r;

		if (l[o] === undefined && event === undefined) r = {};
		else if (l[o] !== undefined && (event === undefined || String(event).isEmpty())) r = l[o];
		else if (l[o] !== undefined && l[o][event] !== undefined) r = l[o][event];
		else r = {};
		return r;
	},

	/**
	 * Adds a listener for a single execution
	 * 
	 * @method once
	 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
	 * @param  {String}   event Event being fired
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   state [Optional] The state the listener is for
	 * @return {Mixed}          Entity, Array of Entities or undefined
	 */
	once : function (obj, event, fn, id, scope, state) {
		var uuid = id || utility.genId();

		obj   = utility.object(obj);
		scope = scope || obj;
		state = state || abaaso.state.current;

		if (obj === undefined || event === null || event === undefined || typeof fn !== "function") throw Error(label.error.invalidArguments);

		if (obj instanceof Array) {
			array.each(obj, function (i) {
				observer.once(i, event, fn, id, scope, state);
			});

			return obj;
		}

		observer.add(obj, event, function () {
			fn.apply(scope, arguments);
			observer.remove(obj, event, uuid, state);
		}, uuid, scope, state);

		return obj;
	},

	/**
	 * Pauses observer events, and queues them
	 * 
	 * @param  {Boolean} arg Boolean indicating if events will be queued
	 * @return {Boolean}     Current setting
	 */
	pause : function (arg) {
		if (arg === true) observer.silent = arg;
		else if (arg === false) {
			observer.silent = arg;
			array.each(observer.queue, function (i) {
				observer.fire(i.obj, i.event);
			});
			observer.queue = [];
		}
		return arg;
	},

	/**
	 * Removes listeners
	 *
	 * @method remove
	 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
	 * @param  {String} event [Optional] Event, or Events being fired (comma delimited supported)
	 * @param  {String} id    [Optional] Listener id
	 * @param  {String} state [Optional] The state the listener is for
	 * @return {Mixed}        Entity, Array of Entities or undefined
	 */
	remove : function (obj, event, id, state) {
		obj   = utility.object(obj);
		state = state || abaaso.state.current;

		if (obj instanceof Array) return array.each(obj, function (i) { observer.remove(i, event, id, state); });

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    e        = observer.elisteners,
		    c        = observer.clisteners,
		    o        = observer.id(obj),
		    add      = (typeof obj.addEventListener === "function"),
		    reg      = (typeof obj.attachEvent === "object" || add),
		    fn;

		/**
		 * Removes DOM event hook
		 * 
		 * @param  {Mixed}  event String or null
		 * @param  {Number} i     Amount of listeners being removed
		 * @return {Undefined}    undefined
		 */
		fn = function (event, i) {
			var unhook = (typeof i === "number" && (c[o][event] = (c[o][event] - i)) === 0);

			if (unhook && reg) {
				obj[add ? "removeEventListener" : "detachEvent"]((add ? "" : "on") + event, e[o + "_" + event], false);
				delete e[o + "_" + event];
			}
		}

		if (o === undefined || l[o] === undefined) return obj;

		if (event === undefined || event === null) {
			if (regex.observer_globals.test(o) || typeof o.listeners === "function") {
				utility.iterate(e, function (v, k) {
					if (k.indexOf(o + "_") === 0) fn(k.replace(/.*_/, ""), 1);
				});
			}

			delete l[o];
			delete a[o];
			delete c[o];
		}
		else {
			array.each(string.explode(event), function (e) {
				var sync = false;

				if (l[o][e] === undefined) return obj;

				if (id === undefined) {
					if (regex.observer_globals.test(o) || typeof o.listeners === "function") fn(e, array.keys(l[o][e][state]).length);
					l[o][e][state] = {};
					sync = true;
				}
				else if (l[o][e][state][id] !== undefined) {
					fn(e, 1);
					delete l[o][e][state][id];
					sync = true;
				}

				if (sync) observer.sync(o, e, state);
			});
		}
		return obj;
	},

	/**
	 * Returns the sum of active listeners for one or all Objects
	 * 
	 * @param  {Mixed} obj [Optional] Entity
	 * @return {Object}     Object with total listeners per event
	 */
	sum : function (obj) {
		var result = {},
		    o;

		if (obj !== undefined) {
			obj    = utility.object(obj);
			o      = observer.id(obj);
			result = utility.clone(observer.clisteners[o]);
		}
		else result = utility.clone(observer.clisteners);

		return result;
	},

	/**
	 * Syncs `alisteners` with `listeners`
	 * 
	 * @param  {String} obj   Object ID 
	 * @param  {String} event Event
	 * @param  {String} state Application state
	 * @return {Undefined}    undefined
	 */
	sync : function (obj, event, state) {
		observer.alisteners[obj][event][state] = array.cast(observer.listeners[obj][event][state]);
	}
};
