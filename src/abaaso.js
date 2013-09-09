/**
 * Abaaso factory
 *
 * @method abaaso
 * @param  {String} query Comma delimited DOM query
 * @return {Object}       Abaaso instance
 */
function abaaso ( query ) {
	return new Abaaso( query );
}

// Setting prototype & constructor loop (move to Abaaso)
abaaso.prototype.constructor = abaaso;

// Classes
abaaso.array           = array;
abaaso.callback        = {};
abaaso.client          = {
	activex     : client.activex,
	android     : client.android,
	blackberry  : client.blackberry,
	chrome      : client.chrome,
	firefox     : client.firefox,
	ie          : client.ie,
	ios         : client.ios,
	linux       : client.linux,
	mobile      : client.mobile,
	opera       : client.opera,
	osx         : client.osx,
	playbook    : client.playbook,
	safari      : client.safari,
	tablet      : client.tablet,
	version     : 0,
	webos       : client.webos,
	windows     : client.windows,
	del         : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "DELETE", success, failure, null, headers, timeout );
	},
	get         : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "GET", success, failure, null, headers, timeout );
	},
	headers     : function ( uri, success, failure, timeout ) {
		return client.request( uri, "HEAD", success, failure, null, null, timeout );
	},
	patch       : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PATCH", success, failure, args, headers, timeout );
	},
	post        : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "POST", success, failure, args, headers, timeout );
	},
	put         : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PUT", success, failure, args, headers, timeout );
	},
	jsonp       : function ( uri, success, failure, callback ) {
		return client.jsonp(uri, success, failure, callback );
	},
	options     : function ( uri, success, failure, timeout ) {
		return client.request(uri, "OPTIONS", success, failure, null, null, timeout );
	},
	permissions : client.permissions,
	scrollPos   : client.scrollPos,
	size        : client.size
};
abaaso.cookie          = cookie;
abaaso.element         = element;
abaaso.json            = json;
abaaso.label           = label;
abaaso.loading         = {
	create  : utility.loading,
	url     : null
};
abaaso.math            = math;
abaaso.message         = message;
abaaso.mouse           = mouse;
abaaso.number          = number;
abaaso.regex           = regex;
abaaso.state           = {};
abaaso.string          = string;
abaaso.xml             = xml;

// Methods & Properties
abaaso.alias           = utility.alias;
abaaso.allows          = client.allows;
abaaso.append          = function ( type, args, obj ) {
	if ( obj instanceof Element ) {
		utility.genId( obj );
	}

	return element.create( type, args, obj, "last" );
};
abaaso.bootstrap       = bootstrap;
abaaso.channel         = channel;
abaaso.clear           = element.clear;
abaaso.clearTimer      = utility.clearTimers;
abaaso.clone           = utility.clone;
abaaso.coerce          = utility.coerce;
abaaso.compile         = utility.compile;
abaaso.create          = element.create;
abaaso.css             = utility.css;
abaaso.data            = data;
abaaso.datalist        = datalist.factory;
abaaso.discard         = function ( arg ) {
	return observer.discard( arg );
};
abaaso.debounce        = utility.debounce;
abaaso.decode          = json.decode;
abaaso.defer           = deferred;
abaaso.define          = utility.define;
abaaso.del             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "DELETE", success, failure, null, headers, timeout );
};
abaaso.delay           = utility.defer;
abaaso.destroy         = element.destroy;
abaaso.each            = array.each;
abaaso.encode          = json.encode;
abaaso.error           = utility.error;
abaaso.expire          = cache.clean;
abaaso.expires         = 120000;
abaaso.fib             = utility.fib;
abaaso.extend          = utility.extend;
abaaso.filter          = filter;
abaaso.fire            = function ( obj, event ) {
	var all  = typeof obj === "object",
	    o    = all ? obj   : this,
	    e    = all ? event : obj,
	    args = [o, e].concat( array.remove( array.cast( arguments ), 0, !all ? 0 : 1 ) );

	return observer.fire.apply( observer, args );
};
abaaso.frag            = element.frag;
abaaso.genId           = utility.genId;
abaaso.get             = function ( uri, success, failure, headers, timeout ) {
	return client.request( uri, "GET", success, failure, null, headers, timeout );
};
abaaso.grid            = grid,
abaaso.guid            = function () {
	return utility.uuid().toUpperCase();
};
abaaso.hash            = utility.hash,
abaaso.headers         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "HEAD", success, failure, null, {}, timeout );
};
abaaso.hex             = utility.hex;
abaaso.hidden          = element.hidden;
abaaso.hook            = observer.decorate;
abaaso.id              = "abaaso";
abaaso.iterate         = utility.iterate;
abaaso.jsonp           = function ( uri, success, failure, callback) {
	return client.jsonp( uri, success, failure, callback );
};
abaaso.listeners       = function ( obj, event ) {
	return observer.list( typeof obj === "object" ? obj : this, event );
};
abaaso.listenersTotal  = observer.sum;
abaaso.log             = utility.log;
abaaso.logging         = observer.log;
abaaso.lru             = lru;
abaaso.merge           = utility.merge;
abaaso.module          = utility.module;
abaaso.object          = utility.object;
abaaso.observerable    = observer.decorate;
abaaso.on              = function ( obj, event, listener, id, scope, state ) {
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
};
abaaso.once            = function ( obj, event, listener, id, scope, state ) {
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
};
abaaso.options         = function ( uri, success, failure, timeout ) {
	return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
};
abaaso.parse           = utility.parse;
abaaso.patch           = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PATCH", success, failure, args, headers, timeout );
};
abaaso.pause           = function ( arg ) {
	return observer.pause( ( arg !== false ) );
};
abaaso.permissions     = client.permissions;
abaaso.position        = element.position;
abaaso.post            = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "POST", success, failure, args, headers, timeout );
};
abaaso.prepend         = function ( type, args, obj ) {
	if ( obj instanceof Element ) {
		obj.genId();
	}

	return element.create( type, args, obj, "first" );
};
abaaso.promise         = promise.factory;
abaaso.property        = utility.property;
abaaso.put             = function ( uri, success, failure, args, headers, timeout ) {
	return client.request( uri, "PUT", success, failure, args, headers, timeout );
};
abaaso.queryString     = function ( key, string ) {
	return utility.queryString( key, string );
};
abaaso.random          = number.random;
abaaso.ready           = false;
abaaso.reflect         = utility.reflect;
abaaso.repeat          = utility.repeat;
abaaso.repeating       = function () {
	return array.keys( utility.repeating );
};
abaaso.script          = client.script;
abaaso.scroll          = client.scroll;
abaaso.scrollTo        = element.scrollTo;
abaaso.stylesheet      = client.stylesheet;
abaaso.stop            = utility.stop;
abaaso.store           = data;
abaaso.sugar           = utility.sugar;
abaaso.target          = utility.target;
abaaso.tpl             = utility.tpl;
abaaso.un              = function ( obj, event, id, state ) {
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
};
abaaso.update          = element.update;
abaaso.uuid            = utility.uuid;
abaaso.validate        = validate.test;
abaaso.version         = "{{VERSION}}";
abaaso.walk            = utility.walk;
abaaso.when            = utility.when;

/**
 * Abaaso
 *
 * @constructor
 * @param {String} query Comma delimited DOM query
 */
function Abaaso ( query ) {
	var self = this;

	if ( !string.isEmpty( query ) ) {
		array.each( utility.$( query ), function ( i ) {
			self.push( i );
		} );
	}
}

// Extending Array
Abaaso.prototype = [];

// Setting prototype & constructor loop
Abaaso.prototype.constructor = Abaaso;

Abaaso.prototype.addClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg );
	});
};

Abaaso.prototype.after = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "after" ) );
	});

	return result;
};

Abaaso.prototype.append = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "last" ) );
	});

	return result;
};

Abaaso.prototype.attr = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.attr( i, key, value );
	});
};

Abaaso.prototype.before = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "before" ) );
	});

	return result;
};

Abaaso.prototype.clear = function () {
	return array.each( this, function ( i ) {
		element.clear( i );
	});
};

Abaaso.prototype.create = function ( type, args, position ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, position ) );
	});

	return result;
};

Abaaso.prototype.css = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.css( i, key, value );
	});
};

Abaaso.prototype.data = function ( key, value ) {
	return array.each( this, function (i) {
		element.data( i, key, value );
	});
};

Abaaso.prototype.disable = function () {
	return array.each( this, function ( i ) {
		element.disable( i );
	});
};

Abaaso.prototype.dispatch = function ( event, data, bubbles, cancelable ) {
	return array.each( this, function ( i ) {
		element.dispatch( i, event, data, bubbles, cancelable );
	});
};

Abaaso.prototype.destroy = function () {
	array.each( this, function ( i ) {
		element.destroy( i );
	});

	return new Abaaso();
};

Abaaso.prototype.each = function ( arg, async, size ) {
	return array.each( this, arg, async, size );
};

Abaaso.prototype.enable = function () {
	return array.each( this, function ( i ) {
		element.enable( i );
	});
};

Abaaso.prototype.find = function ( arg ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		array.each( element.find( i, arg ), function ( r ) {
			result.push( r );
		});
	});

	return result;
};

Abaaso.prototype.fire = function () {
	var args = arguments;

	return array.each( this, function ( i ) {
		observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
	});
};

Abaaso.prototype.genId = function () {
	return array.each( this, function ( i ) {
		utility.genId( i );
	});
};

Abaaso.prototype.get = function ( uri, headers ) {
	return array.each( this, function ( i ) {
		client.request( "GET", uri, headers, function ( arg ) {
			element.html( i, arg );
		}, function ( e ) {
			element.html( i, e );
		});
	});
};

Abaaso.prototype.has = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.has( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.hasClass = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.hasClass( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.html = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		array.each( this, function ( i ) {
			element.html( i, arg );
		});

		return this;
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( element.html( i ) );
		});

		return result;
	}
};

Abaaso.prototype.is = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.is( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isAlphaNum = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isAlphaNum( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isBoolean = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isBoolean( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isChecked = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isChecked( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDate = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDate( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDisabled = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDisabled( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDomain = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDomain( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmail = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmail( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmpty = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmpty( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isHidden = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isHidden( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isIP = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isIP( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isInt = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isInt( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isNumber = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isNumber( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isPhone = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isPhone( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isUrl = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isUrl( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.last = function ( arg ) {
	var result = new Abaaso();

	array.each( array.last( this, arg ), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.limit = function ( start, offset ) {
	var result = new Abaaso();

	array.each( array.limit( this, start, offset ), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.listeners = function ( event ) {
	var result = [];

	array.each( this, function ( i ) {
		array.merge( result, observer.listeners( i, event ) );
	});

	return result;
};

Abaaso.prototype.loading = function () {
	return array.each( this, function ( i ) {
		utility.loading( i );
	});
};

Abaaso.prototype.on = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.add( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.once = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.once( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.position = function () {
	var result = [];

	array.each( this, function ( i ) {
		result.push( element.position( i ) );
	});

	return result;
};

Abaaso.prototype.prepend = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "first" ) );
	});

	return result;
};

Abaaso.prototype.remove = function ( start, end ) {
	return array.remove( this, start, end );
};

Abaaso.prototype.removeIf = function ( fn ) {
	return array.removeIf( this, fn );
};

Abaaso.prototype.removeWhile= function ( fn ) {
	return array.removeWhile( this, fn );
};

Abaaso.prototype.removeAttr = function ( key ) {
	return array.each( this, function ( i ) {
		element.removeAttr( i, key );
	});
};

Abaaso.prototype.removeClass= function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg, false );
	});
};

Abaaso.prototype.serialize = function ( string, encode ) {
	return this.map( function ( i ) {
		element.serialize( i, string, encode );
	});
};

Abaaso.prototype.size = function () {
	return this.map( function ( i ) {
		return element.size( i );
	});
};

Abaaso.prototype.text = function ( arg ) {
	return array.each( this, function ( node ) {
		if ( typeof node !== "object") {
			node = utility.object( node );
		}

		if ( typeof node.text === "function") {
			node.text( arg );
		}
	});
};

Abaaso.prototype.tpl = function ( arg ) {
	return array.each( this, function ( i ) {
		utility.tpl ( arg, i );
	});
};

Abaaso.prototype.toggleClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.toggleClass( i, arg );
	});
};

Abaaso.prototype.un = function ( event, id, state ) {
	return array.each( this, function ( i ) {
		observer.remove( i, event, id, state );
	});
};

Abaaso.prototype.update = function ( arg ) {
	return array.each( this, function ( i ) {
		element.update( i, arg );
	});
};

Abaaso.prototype.val = function ( arg ) {
	var a    = [],
	    type = null,
	    same = true;

	array.each( this, function ( i ) {
		if ( type !== null ) {
			same = ( type === i.type );
		}

		type = i.type;

		if ( typeof i.val === "function" ) {
			a.push( element.val( i, arg ) );
		}
	});

	return same ? a[0] : a;
};

Abaaso.prototype.validate = function () {
	return this.map( function ( i ) {
		return element.validate( i );
	});
};
