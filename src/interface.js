return {
	// Classes
	array           : array,
	callback        : {},
	client          : {
		activex    : client.activex,
		android    : client.android,
		blackberry : client.blackberry,
		chrome     : client.chrome,
		firefox    : client.firefox,
		ie         : client.ie,
		ios        : client.ios,
		linux      : client.linux,
		mobile     : client.mobile,
		opera      : client.opera,
		osx        : client.osx,
		playbook   : client.playbook,
		safari     : client.safari,
		tablet     : client.tablet,
		version    : 0,
		webos      : client.webos,
		windows    : client.windows,
		del        : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "DELETE", success, failure, null, headers, timeout );
		},
		get        : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "GET", success, failure, null, headers, timeout );
		},
		headers    : function ( uri, success, failure, timeout ) {
			return client.request( uri, "HEAD", success, failure, null, null, timeout );
		},
		patch      : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PATCH", success, failure, args, headers, timeout );
		},
		post       : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "POST", success, failure, args, headers, timeout );
		},
		put        : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PUT", success, failure, args, headers, timeout );
		},
		jsonp      : function ( uri, success, failure, callback ) {
			return client.jsonp(uri, success, failure, callback );
		},
		options    : function ( uri, success, failure, timeout ) {
			return client.request(uri, "OPTIONS", success, failure, null, null, timeout );
		},
		permissions: client.permissions,
		scrollPos  : client.scrollPos,
		size       : client.size
	},
	cookie          : cookie,
	element         : element,
	json            : json,
	label           : label,
	loading         : {
		create  : utility.loading,
		url     : null
	},
	math            : math,
	message         : message,
	mouse           : mouse,
	number          : number,
	regex           : regex,
	state           : {},
	string          : string,
	xml             : xml,

	// Methods & Properties
	alias           : utility.alias,
	allows          : client.allows,
	append          : function ( type, args, obj ) {
		if ( obj instanceof Element ) {
			obj.genId();
		}

		return element.create( type, args, obj, "last" );
	},
	bootstrap       : bootstrap,
	channel         : channel,
	clear           : element.clear,
	clearTimer      : utility.clearTimers,
	clone           : utility.clone,
	coerce          : utility.coerce,
	compile         : utility.compile,
	create          : element.create,
	css             : utility.css,
	data            : data,
	datalist        : datalist.factory,
	discard         : function ( arg ) {
		return observer.discard( arg );
	},
	debounce        : utility.debounce,
	decode          : json.decode,
	defer           : deferred,
	define          : utility.define,
	del             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "DELETE", success, failure, null, headers, timeout );
	},
	delay           : utility.defer,
	destroy         : element.destroy,
	each            : array.each,
	encode          : json.encode,
	error           : utility.error,
	expire          : cache.clean,
	expires         : 120000,
	fib             : utility.fib,
	extend          : utility.extend,
	filter          : filter,
	fire            : function ( obj, event ) {
		var all  = typeof obj === "object",
		    o    = all ? obj   : this,
		    e    = all ? event : obj,
		    args = [o, e].concat( array.remove( array.cast( arguments ), 0, !all ? 0 : 1 ) );

		return observer.fire.apply( observer, args );
	},
	frag            : element.frag,
	genId           : utility.genId,
	get             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "GET", success, failure, null, headers, timeout );
	},
	grid            : grid,
	guid            : function () {
		return utility.uuid().toUpperCase();
	},
	hash            : utility.hash,
	headers         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "HEAD", success, failure, null, {}, timeout );
	},
	hex             : utility.hex,
	hidden          : element.hidden,
	hook            : observer.decorate,
	id              : "abaaso",
	init            : function () {
		// Stopping multiple executions
		delete abaaso.init;

		// Cache garbage collector (every minute)
		utility.repeat( function () {
			cache.clean();
		}, 60000, "cacheGarbageCollector");

		// Firing events to setup
		return observer.fire( this, "init, ready" ).un( this, "init, ready" );
	},
	iterate         : utility.iterate,
	jsonp           : function ( uri, success, failure, callback) {
		return client.jsonp( uri, success, failure, callback );
	},
	listeners       : function ( obj, event ) {
		return observer.list( typeof obj === "object" ? obj : this, event );
	},
	listenersTotal  : observer.sum,
	log             : utility.log,
	logging         : observer.log,
	lru             : lru,
	merge           : utility.merge,
	module          : utility.module,
	object          : utility.object,
	observerable    : observer.decorate,
	on              : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = this;
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) {
			s = o;
		}

		return observer.add( o, e, l, i, s, st );
	},
	once            : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = this;
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) {
			s = o;
		}

		return observer.once( o, e, l, i, s, st );
	},
	options         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
	},
	parse           : utility.parse,
	patch           : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PATCH", success, failure, args, headers, timeout );
	},
	pause           : function ( arg ) {
		return observer.pause( ( arg !== false ) );
	},
	permissions     : client.permissions,
	position        : element.position,
	post            : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "POST", success, failure, args, headers, timeout );
	},
	prepend         : function ( type, args, obj ) {
		if ( obj instanceof Element ) {
			obj.genId();
		}

		return element.create( type, args, obj, "first" );
	},
	promise         : promise.factory,
	property        : utility.property,
	put             : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PUT", success, failure, args, headers, timeout );
	},
	queryString     : function ( key, string ) {
		return utility.queryString( key, string );
	},
	random          : number.random,
	ready           : false,
	reflect         : utility.reflect,
	repeat          : utility.repeat,
	repeating       : function () {
		return array.keys( utility.repeating );
	},
	script          : client.script,
	scroll          : client.scroll,
	scrollTo        : element.scrollTo,
	stylesheet      : client.stylesheet,
	stop            : utility.stop,
	store           : data,
	target          : utility.target,
	tpl             : utility.tpl,
	un              : function ( obj, event, id, state ) {
		var all = typeof obj === "object",
		    o, e, i, s;

		if ( all ) {
			o = obj;
			e = event;
			i = id;
			s = state;
		}
		else {
			o = this;
			e = obj;
			i = event;
			s = id;
		}

		return observer.remove( o, e, i, s );
	},
	update          : element.update,
	uuid            : utility.uuid,
	validate        : validate.test,
	version         : "{{VERSION}}",
	walk            : utility.walk,
	when            : utility.when
};
