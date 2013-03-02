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
		del     : function (uri, success, failure, headers, timeout) { return client.request(uri, "DELETE", success, failure, null, headers, timeout); },
		get     : function (uri, success, failure, headers, timeout) { return client.request(uri, "GET", success, failure, null, headers, timeout); },
		headers : function (uri, success, failure, timeout) { return client.request(uri, "HEAD", success, failure, null, null, timeout); },
		post    : function (uri, success, failure, args, headers, timeout) { return client.request(uri, "POST", success, failure, args, headers, timeout); },
		put     : function (uri, success, failure, args, headers, timeout) { return client.request(uri, "PUT", success, failure, args, headers, timeout); },
		jsonp   : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
		options : function (uri, success, failure, timeout) { return client.request(uri, "OPTIONS", success, failure, null, null, timeout); },
		permissions : client.permissions
	},
	cookie          : cookie,
	element         : element,
	json            : json,
	label           : label,
	loading         : {
		create  : utility.loading,
		url     : null
	},
	message         : message,
	mouse           : mouse,
	number          : number,
	regex           : regex,
	repeating       : {},
	route           : {
		enabled : false,
		current : route.current,
		del     : route.del,
		hash    : route.hash,
		init    : route.init,
		initial : route.initial,
		list    : route.list,
		load    : route.load,
		reset   : route.reset,
		server  : route.server,
		set     : route.set
	},
	state           : state,
	string          : string,
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
	clearTimer      : utility.clearTimers,
	clone           : utility.clone,
	coerce          : utility.coerce,
	compile         : utility.compile,
	create          : element.create,
	css             : utility.css,
	data            : data.decorator,
	datalist        : datalist.factory,
	discard         : function (arg) { return observer.discard(arg); },
	debounce        : utility.debounce,
	decode          : json.decode,
	defer           : utility.defer,
	define          : utility.define,
	del             : function (uri, success, failure, headers, timeout) { return client.request(uri, "DELETE", success, failure, null, headers, timeout); },
	destroy         : element.destroy,
	encode          : json.encode,
	error           : utility.error,
	expire          : cache.clean,
	expires         : 120000,
	extend          : utility.extend,
	filter          : filter.factory,
	fire            : function (obj, event) {
		var all  = typeof obj === "object",
		    o    = all ? obj   : (this !== $ ? this : global.abaaso),
		    e    = all ? event : obj,
		    args = [o, e].concat(array.cast(arguments).remove(0, !all ? 0 : 1));

		return observer.fire.apply(observer, args);
	},
	genId           : utility.genId,
	get             : function (uri, success, failure, headers, timeout) { return client.request(uri, "GET", success, failure, null, headers, timeout); },
	guid            : function () { return utility.uuid().toUpperCase(); },
	hash            : route.hash,
	headers         : function (uri, success, failure, timeout) { return client.request(uri, "HEAD", success, failure, null, {}, timeout); },
	hidden          : element.hidden,
	hook            : observer.decorate,
	id              : "abaaso",
	init            : function () {
		return observer.fire(this, "init, ready").un(this, "init, ready");
	},
	iterate         : utility.iterate,
	jsonp           : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
	listeners       : function (obj, event) {
		obj = typeof obj === "object" ? obj : (this !== $ ? this : abaaso);
		return observer.list(obj, event);
	},
	listenersTotal  : observer.sum,
	log             : utility.log,
	logging         : observer.log,
	merge           : utility.merge,
	module          : utility.module,
	object          : utility.object,
	observerable    : observer.decorate,
	on              : function (obj, event, listener, id, scope, state) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if (all) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = (this !== $ ? this : abaaso);
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if (typeof s === "undefined") s = o;

		return observer.add(o, e, l, i, s, st);
	},
	once            : function (obj, event, listener, id, scope, state) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if (all) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = (this !== $ ? this : abaaso);
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if (typeof s === "undefined") s = o;

		return observer.once(o, e, l, i, s, st);
	},
	options         : function (uri, success, failure, timeout) { return client.request(uri, "OPTIONS", success, failure, null, null, timeout); },
	parse           : utility.parse,
	pause           : function (arg) { return observer.pause((arg !== false)); },
	permissions     : client.permissions,
	position        : element.position,
	post            : function (uri, success, failure, args, headers, timeout) { return client.request(uri, "POST", success, failure, args, headers, timeout); },
	prepend         : function (type, args, obj) {
		if (obj instanceof Element) obj.genId();
		return element.create(type, args, obj, "first");
	},
	promise         : promise.factory,
	property        : utility.property,
	put             : function (uri, success, failure, args, headers, timeout) { return client.request(uri, "PUT", success, failure, args, headers, timeout); },
	queryString     : function (key, string) { return utility.queryString(key, string); },
	random          : number.random,
	ready           : false,
	reflect         : utility.reflect,
	repeat          : utility.repeat,
	stylesheet      : utility.stylesheet,
	script          : utility.script,
	stop            : utility.stop,
	store           : data.decorator,
	target          : utility.target,
	tpl             : utility.tpl,
	un              : function (obj, event, id, state) {
		var all = typeof obj === "object",
		    o, e, i, s;

		if (all) {
			o = obj;
			e = event;
			i = id;
			s = state;
		}
		else {
			o = (this !== $ ? this : abaaso);
			e = obj;
			i = event;
			s = id;
		}

		return observer.remove(o, e, i, s);
	},
	update          : element.update,
	uuid            : utility.uuid,
	validate        : validate.test,
	version         : "{{VERSION}}",
	walk            : utility.walk
};
