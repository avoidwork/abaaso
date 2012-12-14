/**
 * Global Observer wired to a State Machine
 *
 * @class observer
 * @namespace abaaso
 */
var observer = {
	// Collection of listeners
	listeners : {},

	// Boolean indicating if events are logged to the console
	log : false,

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
		scope = scope || abaaso;
		state = state || abaaso.state.current;

		if (obj instanceof Array) return obj.each(function (i) { observer.add(i, event, fn, id, scope, state); });

		if (typeof event !== "undefined") event = event.explode();
		if (typeof id === "undefined" || !/\w/.test(id)) id = utility.guid(true);

		var instance = null,
		    l        = observer.listeners,
		    o        = observer.id(obj),
		    n        = false,
		    c        = abaaso.state.current,
		    globals  = /body|document|window/i,
		    allowed  = /click|error|key|mousedown|mouseup|submit/i,
		    item, add, reg, handler;

		if (typeof o === "undefined" || event === null || typeof event === "undefined" || typeof fn !== "function") throw Error(label.error.invalidArguments);

		handler = function (e, i) {
			if (!allowed.test(e.type)) utility.stop(e);
			observer.fire(obj, i, e);
		};

		event.each(function (i) {
			n = false;
			if (typeof l[o] === "undefined")                  l[o]           = {};
			if (typeof l[o][i] === "undefined" && (n = true)) l[o][i]        = {};
			if (typeof l[o][i][state] === "undefined")        l[o][i][state] = {};

			if (n) {
				instance = (globals.test(o) || (!/\//g.test(o) && o !== "abaaso")) ? obj : null;

				if (instance !== null && typeof instance !== "undefined" && i.toLowerCase() !== "afterjsonp" && (globals.test(o) || typeof instance.listeners === "function")) {
					add = (typeof instance.addEventListener === "function");
					reg = (typeof instance.attachEvent === "object" || add);
					if (reg) instance[add ? "addEventListener" : "attachEvent"]((add ? "" : "on") + i, function (e) { handler(e, i); }, false);
				}
			}

			item = {fn: fn, scope: scope};
			l[o][i][state][id] = item;
		});

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
		else id = typeof arg.id !== "undefined" ? arg.id : (typeof arg.toString === "function" ? arg.toString() : arg);
		return id;
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
		if (obj instanceof Array) return obj.each(function (i) { observer.fire(obj[i], event, array.cast(arguments).remove(1).remove(0)); });

		var o    = observer.id(obj),
		    a    = array.cast(arguments).remove(1).remove(0),
		    s    = abaaso.state.current,
		    log  = ($.observer.log || abaaso.observer.log),
		    c, l, list;

		if (typeof o === "undefined" || String(o).isEmpty() || typeof obj === "undefined" || typeof event === "undefined") throw Error(label.error.invalidArguments);

		event.explode().each(function (e) {
			if (log) utility.log(o + " firing " + e);
			list = observer.list(obj, e);
			array.each(array.cast(list.all), function (i) {
				return i.fn.apply(i.scope, a);
			});
			if (s !== "all") {
				array.each(array.cast(list[s]), function (i) {
					return i.fn.apply(i.scope, a);
				});
			}
		});
		return obj;
	},

	/**
	 * Provides observer hooks on obj
	 * 
	 * @param  {Object} obj Object to receive hooks
	 * @return {Object}     Object that received hooks
	 */
	hook : function (obj) {
		obj.fire      = function () { observer.fire.apply(observer, [this].concat(array.cast(arguments))); return this; };
		obj.listeners = function (event) { return $.listeners.call(this, event); };
		obj.on        = function (event, listener, id, scope, standby) { return $.on.call(this, event, listener, id, scope, standby); };
		obj.once      = function (event, listener, id, scope, standby) { return $.once.call(this, event, listener, id, scope, standby); };
		obj.un        = function (event, id) { return $.un.call(this, event, id); };
		return obj;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
	 * @param  {String} event Event being queried
	 * @return {Mixed}        Object or Array of listeners for the event
	 */
	list : function (obj, event) {
		obj   = utility.object(obj);
		var l = observer.listeners,
		    o = observer.id(obj),
		    r;

		if (typeof l[o] === "undefined" && typeof event === "undefined") r = {};
		else if (typeof l[o] !== "undefined" && (typeof event === "undefined" || String(event).isEmpty())) r = l[o];
		else if (typeof l[o] !== "undefined" && typeof l[o][event] !== "undefined") r = l[o][event];
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
		var guid = id || utility.genId();

		obj   = utility.object(obj);
		scope = scope || abaaso;
		state = state || abaaso.state.current;

		if (typeof obj === "undefined" || event === null || typeof event === "undefined" || typeof fn !== "function") throw Error(label.error.invalidArguments);

		if (obj instanceof Array) return obj.each(function (i) { observer.once(i, event, fn, id, scope, state); });

		observer.add(obj, event, function () {
			observer.remove(obj, event, guid, state);
			fn.apply(scope, arguments);
		}, guid, scope, state);

		return obj;
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

		if (obj instanceof Array) return obj.each(function (i) { observer.remove(i, event, id, state); });

		var instance = null,
		    l = observer.listeners,
		    o = observer.id(obj);

		if (typeof o === "undefined" || typeof l[o] === "undefined") return obj;

		if (typeof event === "undefined" || event === null) delete l[o];
		else event.explode().each(function (e) {
			if (typeof l[o][e] === "undefined") return obj;
			typeof id === "undefined" ? l[o][e][state] = {} : delete l[o][e][state][id];
		});
		return obj;
	}
};
