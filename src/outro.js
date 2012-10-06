// @constructor
return {
	// Classes
	array           : array,
	callback        : {},
	client          : {
		// Properties
		android : client.android,
		blackberry : client.blackberry,
		chrome  : client.chrome,
		firefox : client.firefox,
		ie      : client.ie,
		ios     : client.ios,
		linux   : client.linux,
		mobile  : client.mobile,
		opera   : client.opera,
		osx     : client.osx,
		playbook: client.playbook,
		safari  : client.safari,
		tablet  : client.tablet,
		size    : {height: 0, width: 0},
		version : 0,
		webos   : client.webos,
		windows : client.windows,

		// Methods
		delete  : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
		get     : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
		headers : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
		post    : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
		put     : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
		jsonp   : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
		options : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
		permissions : client.permissions
	},
	cookie          : cookie,
	data            : data,
	datalist        : datalist,
	element         : element,
	filter          : filter,
	json            : json,
	label           : label,
	loading         : {
		create  : utility.loading,
		url     : null
	},
	message         : message,
	mouse           : mouse,
	number          : number,
	observer        : {
		log     : observer.log,
		add     : observer.add,
		fire    : observer.fire,
		hook    : observer.hook,
		list    : observer.list,
		once    : observer.once,
		remove  : observer.remove
	},
	state           : {
		_current    : null,
		header      : null,
		previous    : null
	},
	string          : string,
	validate        : validate,
	xml             : xml,

	// Methods & Properties
	$               : utility.$,
	alias           : utility.alias,
	aliased         : "$",
	allows          : client.allows,
	append          : function (type, args, obj) {
		if (obj instanceof Element) obj.genId();
		return element.create(type, args, obj, "last");
	},
	bootstrap       : bootstrap,
	clear           : element.clear,
	clone           : utility.clone,
	coerce          : utility.coerce,
	compile         : utility.compile,
	create          : element.create,
	css             : utility.css,
	decode          : json.decode,
	defer           : utility.defer,
	define          : utility.define,
	delete          : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
	destroy         : element.destroy,
	encode          : json.encode,
	error           : utility.error,
	expire          : cache.clean,
	expires         : 120000,
	extend          : utility.extend,
	fire            : function (arg) {
		var local = (typeof arg === "string"),
		    args  = array.cast(arguments),
		    obj   = this;

		if (local) {
			if (obj === $) obj = abaaso;
			args = [obj].concat(args);
		}

		observer.fire.apply(observer, args);
		return this;
	},
	genId           : utility.genId,
	get             : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
	guid            : utility.guid,
	headers         : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
	hidden          : element.hidden,
	id              : "abaaso",
	init            : function () {
		// Stopping multiple executions
		delete abaaso.init;

		// Firing events to setup
		return $.fire("init").un("init").fire("ready").un("ready");
	},
	iterate         : utility.iterate,
	jsonp           : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
	listeners       : function (event) {
		var obj = this;

		if (typeof obj === "undefined" || obj === $) obj = abaaso;
		return observer.list(obj, event);
	},
	log             : utility.log,
	merge           : utility.merge,
	module          : utility.module,
	object          : utility.object,
	on              : function (obj, event, listener, id, scope, state) {
		var all = typeof listener === "function",
		    o, e, l, i, s, st;

		o  = all ? obj      : this;
		e  = all ? event    : obj;
		l  = all ? listener : event;
		i  = all ? id       : listener;
		s  = all ? scope    : id;
		st = all ? state    : scope;

		if (typeof o === "undefined" || o === $) o = abaaso;
		if (typeof s === "undefined") s = o;
		return observer.add(o, e, l, i, s, st);
	},
	once            : function (obj, event, listener, id, scope, state) {
		var all = typeof listener === "function",
		    o, e, l, i, s, st;

		o  = all ? obj      : this;
		e  = all ? event    : obj;
		l  = all ? listener : event;
		i  = all ? id       : listener;
		s  = all ? scope    : id;
		st = all ? state    : scope;

		if (typeof o === "undefined" || o === $) o = abaaso;
		if (typeof s === "undefined") s = o;
		return observer.once(o, e, l, i, s, st);
	},
	options         : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
	permissions     : client.permissions,
	position        : element.position,
	post            : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
	prepend         : function (type, args, obj) {
		if (obj instanceof Element) obj.genId();
		return element.create(type, args, obj, "first");
	},
	property        : utility.property,
	put             : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
	queryString     : utility.queryString,
	ready           : false,
	reflect         : utility.reflect,
	repeat          : utility.repeat,
	route           : {
		enabled : false,
		del     : route.del,
		hash    : route.hash,
		init    : route.init,
		list    : route.list,
		load    : route.load,
		server  : route.server,
		set     : route.set
	},
	stylesheet      : utility.stylesheet,
	script          : utility.script,
	stop            : utility.stop,
	store           : function (obj, arg, args) { return data.register.call(data, obj, arg, args); },
	tpl             : utility.tpl,
	un              : function (obj, event, id, state) {
		var all = typeof id !== "undefined",
		    o, e, i, s;

		o = all ? obj   : this;
		e = all ? event : obj;
		i = all ? id    : event;
		s = all ? state : id;

		if (typeof o === "undefined" || o === $) o = abaaso;
		return observer.remove(o, e, i, s);
	},
	update          : element.update,
	version         : "{{VERSION}}",
	walk            : utility.walk
};
})();

// Conditional bootstrap incase of multiple loading
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();

// Node, AMD & window supported
switch (true) {
	case typeof exports !== "undefined":
		module.exports = abaaso;
		break;
	case typeof define === "function":
		define("abaaso", function () { return abaaso; });
		break;
	default:
		global.abaaso = abaaso;
}
})(this);
