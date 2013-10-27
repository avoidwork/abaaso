/**
 * Prototype hooks
 *
 * @private
 * @type {Object}
 */
var prototypes = {
	// Array.prototype
	array : {
		add : function ( arg ) {
			return array.add( this, arg );
		},
		addClass : function ( arg ) {
			return array.each( this, function ( i ) {
				element.klass( i, arg );
			});
		},
		after : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "after" ) );
			});

			return result;
		},
		append : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "last" ) );
			});

			return result;
		},
		attr : function ( key, value ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.attr( i, key, value ) );
			});

			return result;
		},
		before : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "before" ) );
			});

			return result;
		},
		binIndex : function ( arg ) {
			return array.binIndex( this, arg );
		},
		chunk : function ( size ) {
			return array.chunk( this, size );
		},
		clear : function () {
			return !server && ( this[0] instanceof Element ) ? array.each( this, function ( i ) {
				element.clear(i);
			}) : array.clear( this );
		},
		clone : function () {
			return utility.clone( this );
		},
		collect : function ( arg ) {
			return array.collect( this, arg );
		},
		compact : function () {
			return array.compact( this );
		},
		contains : function ( arg ) {
			return array.contains( this, arg );
		},
		count : function ( arg ) {
			return array.count( this, arg );
		},
		create : function ( type, args, position ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, position ) );
			});

			return result;
		},
		css : function ( key, value ) {
			return array.each( this, function ( i ) {
				element.css( i, key, value );
			});
		},
		data : function ( key, value ) {
			var result = [];

			array.each( this, function (i) {
				result.push( element.data( i, key, value ) );
			});

			return result;
		},
		diff : function ( arg ) {
			return array.diff( this, arg );
		},
		disable : function () {
			return array.each( this, function ( i ) {
				element.disable( i );
			});
		},
		dispatch : function ( event, data, bubbles, cancelable ) {
			return array.each( this, function ( i ) {
				element.dispatch( i, event, data, bubbles, cancelable );
			});
		},
		destroy : function () {
			array.each( this, function ( i ) {
				element.destroy( i );
			});

			return [];
		},
		each : function ( arg, async, size ) {
			return array.each( this, arg, async, size );
		},
		empty : function () {
			return array.empty( this );
		},
		enable : function () {
			return array.each( this, function ( i ) {
				element.enable( i );
			});
		},
		equal : function ( arg ) {
			return array.equal( this, arg );
		},
		fib : function ( arg ) {
			return array.fib( arg );
		},
		fill : function ( arg, start, offset ) {
			return array.fill( this, arg, start, offset );
		},
		find : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				i.find( arg ).each( function ( r ) {
					result.add( r );
				});
			});

			return result;
		},
		fire : function () {
			var args = arguments;

			return array.each( this, function ( i ) {
				observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
			});
		},
		first : function () {
			return array.first( this );
		},
		flat : function () {
			return array.flat( this );
		},
		fromObject : function ( arg ) {
			return array.fromObject( arg );
		},
		genId : function () {
			return array.each( this, function ( i ) {
				utility.genId( i );
			});
		},
		get : function ( uri, headers ) {
			var result = [];

			array.each( this, function ( i, idx ) {
				i.get( uri, headers, function ( arg ) {
					result[idx] = arg;
				}, function ( e ) {
					result[idx] = e;
				});
			});

			return result;
		},
		has : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.has( i, arg ) );
			});

			return result;
		},
		hasClass : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.hasClass( i, arg ) );
			});

			return result;
		},
		html : function ( arg ) {
			var result;

			if ( arg !== undefined ) {
				return array.each( this, function ( i ) {
					element.html( i, arg );
				});
			}
			else {
				result = [];
				array.each( this, function ( i ) {
					result.push( element.html( i ) );
				});

				return result;
			}
		},
		index : function ( arg ) {
			return array.index( this, arg );
		},
		indexed : function () {
			return array.indexed( this );
		},
		intersect : function ( arg ) {
			return array.intersect( this, arg );
		},
		is : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.is( i, arg ) );
			});

			return result;
		},
		isAlphaNum : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isAlphaNum() );
			});

			return result;
		},
		isBoolean : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isBoolean() );
			});

			return result;
		},
		isChecked : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isChecked() );
			});

			return result;
		},
		isDate : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isDate() );
			});

			return result;
		},
		isDisabled : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.isDisabled( i ) );
			});

			return result;
		},
		isDomain : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isDomain() );
			});

			return result;
		},
		isEmail : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isEmail() );
			});

			return result;
		},
		isEmpty : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isEmpty() );
			});

			return result;
		},
		isHidden : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.isHidden( i ) );
			});

			return result;
		},
		isIP : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isIP() );
			});

			return result;
		},
		isInt : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isInt() );
			});

			return result;
		},
		isNumber : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isNumber() );
			});

			return result;
		},
		isPhone : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isPhone() );
			});

			return result;
		},
		isUrl : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isUrl() );
			});

			return result;
		},
		keepIf : function ( fn ) {
			return array.keepIf( this, fn );
		},
		keySort : function ( query, sub ) {
			return array.keySort( this, query, sub );
		},
		keys : function () {
			return array.keys( this );
		},
		last : function ( arg ) {
			return array.last( this, arg );
		},
		limit : function ( start, offset ) {
			return array.limit( this, start, offset );
		},
		listeners: function ( event ) {
			var result = [];

			array.each( this, function ( i ) {
				array.merge(result, observer.listeners( i, event ) );
			});

			return result;
		},
		loading : function () {
			return array.each( this, function ( i ) {
				utility.loading( i );
			});
		},
		max : function () {
			return array.max( this );
		},
		mean : function () {
			return array.mean( this );
		},
		median : function () {
			return array.median( this );
		},
		merge : function ( arg ) {
			return array.merge( this, arg );
		},
		min : function () {
			return array.min( this );
		},
		mingle : function ( arg ) {
			return array.mingle( this, arg );
		},
		mode : function () {
			return array.mode( this );
		},
		on : function ( event, listener, id, scope, state ) {
			return array.each( this, function ( i ) {
				observer.add( i, event, listener, id, scope || i, state );
			});
		},
		once : function ( event, listener, id, scope, state ) {
			return array.each( this, function ( i ) {
				observer.once( i, event, listener, id, scope || i, state );
			});
		},
		percents : function ( precision, total ) {
			return array.percents( this, precision, total );
		},
		position : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.position( i ) );
			});

			return result;
		},
		prepend : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "first" ) );
			});

			return result;
		},
		range : function () {
			return array.range( this );
		},
		rassoc : function ( arg ) {
			return array.rassoc( this, arg );
		},
		reject : function ( fn ) {
			return array.reject( this, fn );
		},
		remove : function ( start, end ) {
			return array.remove( this, start, end );
		},
		removeIf : function ( fn ) {
			return array.removeIf( this, fn );
		},
		removeWhile: function ( fn ) {
			return array.removeWhile( this, fn );
		},
		removeAttr : function ( key ) {
			array.each( this, function ( i ) {
				element.removeAttr( i, key );
			});

			return this;
		},
		removeClass: function ( arg ) {
			return array.each( this, function ( i ) {
				element.klass( i, arg, false );
			});
		},
		replace : function ( arg ) {
			return array.replace( this, arg );
		},
		rest : function ( arg ) {
			return array.rest( this, arg );
		},
		rindex : function ( arg ) {
			return array.rindex( this, arg );
		},
		rotate : function ( arg ) {
			return array.rotate( this, arg );
		},
		serialize : function ( string, encode ) {
			return element.serialize( this, string, encode );
		},
		series : function ( start, end, offset ) {
			return array.series( start, end, offset );
		},
		size : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.size( i ) );
			});

			return result;
		},
		sorted : function () {
			return array.sorted( this );
		},
		split : function ( size ) {
			return array.split( this, size );
		},
		stddev : function () {
			return array.stddev( this );
		},
		sum : function () {
			return array.sum( this );
		},
		take : function ( arg ) {
			return array.take( this, arg );
		},
		text : function ( arg ) {
			return array.each( this, function ( node ) {
				if ( typeof node !== "object") {
					node = utility.object( node );
				}

				if ( typeof node.text === "function") {
					node.text( arg );
				}
			});
		},
		tpl : function ( arg ) {
			return array.each( this, function ( i ) {
				utility.tpl ( arg, i );
			});
		},
		toggleClass : function ( arg ) {
			return array.each( this, function ( i ) {
				element.toggleClass( i, arg );
			});
		},
		total : function () {
			return array.total( this );
		},
		toObject : function () {
			return array.toObject( this );
		},
		un : function ( event, id, state ) {
			return array.each( this, function ( i ) {
				observer.remove( i, event, id, state );
			});
		},
		unique : function () {
			return array.unique( this );
		},
		update : function ( arg ) {
			return array.each( this, function ( i ) {
				element.update( i, arg );
			});
		},
		val : function ( arg ) {
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
		},
		validate : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.validate( i ) );
			});

			return result;
		},
		variance : function () {
			return array.variance( this );
		},
		zip : function () {
			return array.zip( this, arguments );
		}
	},
	// Element.prototype
	element : {
		addClass : function ( arg ) {
			return element.klass( this, arg, true );
		},
		after : function ( type, args ) {
			return element.create( type, args, this, "after" );
		},
		append : function ( type, args ) {
			return element.create( type, args, this, "last" );
		},
		attr : function ( key, value ) {
			return element.attr( this, key, value );
		},
		before : function ( type, args ) {
			return element.create( type, args, this, "before" );
		},
		clear : function () {
			return element.clear( this );
		},
		create : function ( type, args, position ) {
			return element.create( type, args, this, position );
		},
		css : function ( key, value ) {
			return element.css( this, key, value );
		},
		data : function ( key, value ) {
			return element.data( this, key, value );
		},
		destroy : function () {
			return element.destroy( this );
		},
		disable : function () {
			return element.disable( this );
		},
		dispatch : function ( event, data, bubbles, cancelable ) {
			return element.dispatch( this, event, data, bubbles, cancelable );
		},
		enable : function () {
			return element.enable( this );
		},
		find : function ( arg ) {
			return element.find( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
		},
		genId : function () {
			return utility.genId( this );
		},
		get : function ( uri, success, failure, headers, timeout ) {
			var self  = this,
			    defer = deferred();

			defer.then( function ( arg ) {
				element.html( self, arg );
				observer.fire( self, "afterGet" );

				if ( typeof success === "function") {
					success.call( self, arg );
				}
			}, function ( e ) {
				element.html( self, e || label.error.serverError );
				observer.fire( self, "failedGet" );

				if ( typeof failure === "function") {
					failure.call( self, e );
				}

				throw e;
			});

			observer.fire( this, "beforeGet" );

			uri.get( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			}, headers, timeout);

			return defer;
		},
		has : function ( arg ) {
			return element.has( this, arg );
		},
		hasClass : function ( arg ) {
			return element.hasClass( this, arg );
		},
		html : function ( arg ) {
			return element.html( this, arg );
		},
		is : function ( arg ) {
			return element.is( this, arg );
		},
		isAlphaNum : function () {
			return element.isAlphaNum( this );
		},
		isBoolean : function () {
			return element.isBoolean( this );
		},
		isChecked : function () {
			return element.isChecked( this );
		},
		isDate : function () {
			return element.isDate( this );
		},
		isDisabled : function () {
			return element.isDisabled( this );
		},
		isDomain : function () {
			return element.isDomain( this );
		},
		isEmail : function () {
			return element.isEmail( this );
		},
		isEmpty : function () {
			return element.isEmpty( this );
		},
		isHidden : function () {
			return element.hidden( this );
		},
		isIP : function () {
			return element.isIP( this );
		},
		isInt : function () {
			return element.isInt( this );
		},
		isNumber : function () {
			return element.isNumber( this );
		},
		isPhone : function () {
			return element.isPhone( this );
		},
		isUrl : function () {
			return element.isUrl( this );
		},
		jsonp : function ( uri, property, callback ) {
			var target = this,
			    arg    = property;

			return client.jsonp( uri, function ( response ) {
				var self = target,
				    node = response,
				    prop = arg,
				    result;

				try {
					if ( prop !== undefined ) {
						prop = prop.replace( /\]|'|"/g , "" ).replace( /\./g, "[" ).split( "[" );

						prop.each( function ( i ) {
							node = node[!!isNaN( i ) ? i : number.parse( i, 10 )];

							if ( node === undefined ) {
								throw new Error( label.error.propertyNotFound );
							}
						});

						result = node;
					}
					else {
						result = response;
					}
				}
				catch ( e ) {
					result = label.error.serverError;
					utility.error( e, arguments, this );
				}

				element.html( self, result );
			}, function ( e ) {
				element.html( target, label.error.serverError );

				throw e;
			}, callback );
		},
		listeners : function ( event ) {
			return observer.list( this, event );
		},
		loading : function () {
			return utility.loading( this );
		},
		on : function ( event, listener, id, scope, state ) {
			return observer.add(  this, event, listener, id, scope || this, state );
		},
		once : function ( event, listener, id, scope, state ) {
			return observer.once( this, event, listener, id, scope || this, state );
		},
		prepend : function ( type, args ) {
			return element.create( type, args, this, "first" );
		},
		prependChild : function ( child ) {
			return element.prependChild( this, child );
		},
		position : function () {
			return element.position( this );
		},
		removeAttr : function ( key ) {
			return element.removeAttr( this, key );
		},
		removeClass : function ( arg ) {
			return element.klass( this, arg, false );
		},
		scrollTo  : function ( ms ) {
			return element.scrollTo( this, ms );
		},
		serialize : function ( string, encode ) {
			return element.serialize( this, string, encode );
		},
		size : function () {
			return element.size( this );
		},
		text : function ( arg ) {
			return element.text( this, arg );
		},
		toggleClass : function ( arg ) {
			return element.toggleClass( this, arg );
		},
		tpl : function ( arg ) {
			return utility.tpl( arg, this );
		},
		un : function ( event, id, state ) {
			return observer.remove( this, event, id, state );
		},
		update : function ( args ) {
			return element.update( this, args );
		},
		val : function ( arg ) {
			return element.val( this, arg );
		},
		validate : function () {
			return element.validate( this );
		}
	},
	// Function.prototype
	"function": {
		reflect : function () {
			return utility.reflect( this );
		},
		debounce : function ( ms ) {
			return utility.debounce( this, ms );
		}
	},
	// Math
	math : {
		bezier : math.bezier,
		dist   : math.dist,
		sqr    : math.sqr
	},
	// Number.prototype
	number : {
		diff : function ( arg ) {
			return number.diff( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this.toString()].concat( array.cast( arguments ) ) );
		},
		format : function ( delimiter, every ) {
			return number.format( this, delimiter, every );
		},
		half : function ( arg ) {
			return number.half( this, arg );
		},
		isEven : function () {
			return number.even( this );
		},
		isOdd : function () {
			return number.odd( this );
		},
		listeners : function ( event ) {
			return observer.list( this.toString(), event );
		},
		on : function ( event, listener, id, scope, state ) {
			observer.add(  this.toString(), event, listener, id, scope || this, state );

			return this;
		},
		once : function ( event, listener, id, scope, state ) {
			observer.once( this.toString(), event, listener, id, scope || this, state );

			return this;
		},
		random : function () {
			return number.random( this );
		},
		round : function () {
			return number.round( this );
		},
		roundDown : function () {
			return number.round( this, "down" );
		},
		roundUp : function () {
			return number.round( this, "up" );
		},
		un : function ( event, id, state ) {
			observer.remove( this.toString(), event, id, state );

			return this;
		}
	},
	// String.prototype
	string : {
		allows : function ( arg ) {
			return client.allows( this, arg );
		},
		capitalize: function ( arg ) {
			return string.capitalize( this, arg );
		},
		del : function ( success, failure, headers ) {
			return client.request( this, "DELETE", success, failure, null, headers );
		},
		escape : function () {
			return string.escape( this );
		},
		expire : function ( silent ) {
			return cache.expire( this, silent );
		},
		explode : function ( arg ) {
			return string.explode( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
		},
		get : function ( success, failure, headers ) {
			return client.request( this, "GET", success, failure, null, headers );
		},
		headers : function ( success, failure ) {
			return client.request( this, "HEAD", success, failure );
		},
		hyphenate : function ( camel ) {
			return string.hyphenate( this, camel );
		},
		isAlphaNum : function () {
			return string.isAlphaNum( this );
		},
		isBoolean : function () {
			return string.isBoolean( this );
		},
		isDate : function () {
			return string.isDate( this );
		},
		isDomain : function () {
			return string.isDomain( this );
		},
		isEmail : function () {
			return string.isEmail( this );
		},
		isEmpty : function () {
			return string.isEmpty( this );
		},
		isIP : function () {
			return string.isIP( this );
		},
		isInt : function () {
			return string.isInt( this );
		},
		isNumber : function () {
			return string.isNumber( this );
		},
		isPhone : function () {
			return string.isPhone( this );
		},
		isUrl : function () {
			return string.isUrl( this );
		},
		jsonp : function ( success, failure, callback ) {
			return client.jsonp( this, success, failure, callback );
		},
		listeners : function ( event ) {
			return observer.list( this, event );
		},
		patch : function ( success, failure, args, headers ) {
			return client.request( this, "PATCH", success, failure, args, headers );
		},
		post : function ( success, failure, args, headers ) {
			return client.request( this, "POST", success, failure, args, headers );
		},
		put : function ( success, failure, args, headers ) {
			return client.request( this, "PUT", success, failure, args, headers );
		},
		on : function ( event, listener, id, scope, state ) {
			return observer.add( this, event, listener, id, scope, state );
		},
		once : function ( event, listener, id, scope, state ) {
			return observer.add( this, event, listener, id, scope, state );
		},
		options : function ( success, failure ) {
			return client.request( this, "OPTIONS", success, failure );
		},
		permissions : function () {
			return client.permissions( this );
		},
		singular : function () {
			return string.singular( this );
		},
		toCamelCase : function () {
			return string.toCamelCase( this );
		},
		toNumber : function ( base ) {
			return number.parse( this, base );
		},
		trim : function () {
			return string.trim( this );
		},
		un : function ( event, id, state ) {
			return observer.remove( this, event, id, state );
		},
		unCamelCase : function () {
			return string.unCamelCase( this );
		},
		uncapitalize : function () {
			return string.uncapitalize( this );
		},
		unhyphenate: function ( arg ) {
			return string.unhyphenate( this, arg );
		}
	}
};
