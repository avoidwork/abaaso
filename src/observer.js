var observer = {
	/**
	 * If `true`, events are ignored
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	ignore : false,

	/**
	 * Collection of listeners
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	listeners : {},

	/**
	 * Boolean indicating if events are logged to the console
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	log : false,

	/**
	 * Maximum amount of handlers per event
	 *
	 * @memberOf abaaso.observer
	 * @type {Number}
	 */
	maxListeners : 10,

	/**
	 * Queue of events to fire
	 *
	 * @memberOf abaaso.observer
	 * @type {Array}
	 */
	queue : [],

	/**
	 * If `true`, events are queued
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	silent : false,

	/**
	 * Adds a handler for an event
	 *
	 * @method add
	 * @memberOf abaaso.observer
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Comma delimited string of events
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] ID for the listener
	 * @param  {String}   scope [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	add : function ( obj, event, fn, id, scope, st ) {
		var oId      = observer.id( obj ),
		    instance = ( regex.observer_globals.test( oId ) || ( !/\//g.test( oId ) && oId !== "abaaso" ) ) ? obj : null,
		    cache, instance;

		// Preparing variables
		id      = id    || utility.genId();
		scope   = scope || obj;
		st      = st    || state.getCurrent();

		// Preparing
		if ( !observer.listeners[oId] ) {
			observer.listeners[oId]     = {};
			observer.listeners[oId].all = {};
		}

		if ( st !== "all" && !observer.listeners[oId][st] ) {
			observer.listeners[oId][st] = {};
		}

		// Setting event listeners (with DOM hooks if applicable)
		array.each( array.explode( event ), function ( ev ) {
			var eId = oId + "_" + ev,
			    add, reg;

			// Creating caches if not present
			if ( !observer.listeners[oId].all[ev] ) {
				observer.listeners[oId].all[ev] = lru( observer.maxListeners );
			}

			if ( st !== "all" && !observer.listeners[oId][st][ev] ) {
				observer.listeners[oId][st][ev] = lru( observer.maxListeners );
			}

			if ( instance && ev.toLowerCase() !== "afterjsonp" && !observer.listeners[oId].all[ev].get( eId ) && !observer.listeners[oId][st][ev].get( eId ) && ( regex.observer_globals.test( o ) ) {
				add = ( typeof instance.addEventListener === "function" );
				reg = ( typeof instance.attachEvent === "object" || add );

				if ( reg ) {
					// Registering event listener
					observer.listeners[oId][st].set( eId, function ( e ) {
						if ( !regex.observer_allowed.test( e.type ) ) {
							utility.stop( e );
						}

						observer.fire( oId, ev, e );
					} );

					// Hooking event listener
					instance[add ? "addEventListener" : "attachEvent"]( ( add ? "" : "on" ) + ev, observer.listeners[oId][st].cache[eId].value.fn, false );
				}
			}

			observer.listeners[oId][st].set( id, {fn: fn, scope: scope} );
		} );
	},

	/**
	 * Decorates `obj` with `observer` methods
	 *
	 * @method decorate
	 * @memberOf abaaso.observer
	 * @param  {Object} obj Object to decorate
	 * @return {Object}     Object to decorate
	 */
	decorate : function () {
		var methods = [
			["fire",      function () { return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) ); }],
			["listeners", function ( event ) { return observer.list(this, event ); }],
			["on",        function ( event, listener, id, scope, standby ) { return observer.add( this, event, listener, id, scope, standby ); }],
			["once",      function ( event, listener, id, scope, standby ) { return observer.once( this, event, listener, id, scope, standby ); }],
			["un",        function ( event, id ) { return observer.remove( this, event, id ); }]
		];

		array.each( methods, function ( i ) {
			utility.property( obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Discard observer events
	 *
	 * @method discard
	 * @memberOf abaaso.observer
	 * @param  {Boolean} arg [Optional] Boolean indicating if events will be ignored
	 * @return {Boolean}     Current setting
	 */
	discard : function ( arg ) {
		return arg === undefined ? observer.ignore : ( observer.ignore = ( arg === true ) );
	},

	/**
	 * Fires an event
	 *
	 * @method fire
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event Comma delimited string of events
	 * @return {Mixed}        Primitive
	 */
	fire : function ( obj, event ) {
		var quit, args, log, done, cache, item, oId;

		if ( !observer.ignore ) {
			quit = false;
			oId  = observer.id( obj );
			args = array.remove( array.cast( arguments ), 0, 1 );
			log  = abaaso.logging;
			done = false;

			if ( observer.silent ) {
				observer.queue.push( {obj: obj, event: event, args: args} );
			}
			else {
				array.each( string.explode( event ), function ( e ) {
					if ( log ) {
						utility.log( oId + " fired " + e );
					}

					if ( observer.listeners[oId] ) {
						array.each( observer.states(), function ( st ) {
							if ( !done && observer.listeners[oId][st] && observer.listeners[oId][st][e] ) {
								cache = observer.listeners[oId][st][e];
								item  = cache.get( cache.last );

								do {
									if ( item.fn.apply( item.scope, args ) !== false ) {
										item = cache.get( item.previous );
									}
									else {
										done = true;
										break;
									}
								}
								while ( item );
							}
						} );
					}
				} );
			}
		}

		return obj;
	},

	/**
	 * Gets the Observer id of arg
	 *
	 * @method id
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  Object or String
	 * @return {String} Observer id
	 */
	id : function ( arg ) {
		var id;

		if ( arg === global ) {
			id = "window";
		}
		else if ( !server && arg === document ) {
			id = "document";
		}
		else if ( !server && arg === document.body ) {
			id = "body";
		}
		else {
			utility.genId( arg );
			id = arg.id || ( typeof arg.toString === "function" ? arg.toString() : arg );
		}

		return id;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event Event being queried
	 * @return {Mixed}        Primitive
	 */
	list : function ( obj, event ) {
		var oId    = observer.id( obj ),
		    states = observer.states(),
		    result = {};

		if ( !observer.listeners[oId] ) {
			// do nothing
		}
		else if ( !event || string.isEmpty( event ) ) {
			array.each( observer.states(), function ( st ) {
				if ( observer.listeners[oId][st] ) {
					array.each( array.keys( observer.listeners[oId][st] ), function ( event ) {
						result[st] = observer.listeners[oId][st][event].cache;
					} );
				}
			} );
		}
		else {
			array.each( observer.states(), function ( st ) {
				if ( observer.listeners[oId][st] && observer.listeners[oId][st][event] ) {
					result[st] = observer.listeners[oId][st][event].cache;
				}
			} );
		}

		return result;
	},

	/**
	 * Adds a listener for a single execution
	 *
	 * @method once
	 * @memberOf abaaso.observer
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Comma delimited string of events being fired
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] ID for the listener
	 * @param  {String}   scope [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	once : function ( obj, event, fn, id, scope, st ) {
		// Preparing variables
		id    = id    || utility.genId();
		scope = scope || obj;
		st    = st    || state.getCurrent();

		array.each( array.explode( event ), function ( ev ) {
			observer.add( obj, ev, function () {
				fn.apply( scope, arguments );
				observer.remove( obj, ev, id, st );
			}, id, scope, st);
		} );

		return obj;
	},

	/**
	 * Pauses observer events, and queues them
	 *
	 * @method pause
	 * @memberOf abaaso.observer
	 * @param  {Boolean} arg Boolean indicating if events will be queued
	 * @return {Boolean}     Current setting
	 */
	pause : function ( arg ) {
		if ( arg === true ) {
			observer.silent = arg;
		}
		else if ( arg === false ) {
			observer.silent = arg;

			array.each( observer.queue, function ( i ) {
				observer.fire.apply( observer, i );
			} );

			observer.queue = [];
		}

		return observer.silent;
	},

	remove : function () {

	},

	/**
	 * Returns an Array of active observer states
	 *
	 * @method states
	 * @memberOf abaaso.observer
	 * @return {Array} Array of active states
	 */
	states : function () {
		return ["all", state.getCurrent()];
	}
}


/** @namespace abaaso.observer */
var observer = {
	/**
	 * Collection of listeners
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	listeners  : {},

	/**
	 * Array copy of listeners for observer.fire()
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	alisteners : {},

	/**
	 * Event listeners
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	elisteners : {},

	/**
	 * Tracks count of listeners per event across all states
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	clisteners : {},

	/**
	 * Boolean indicating if events are logged to the console
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	log : false,

	/**
	 * Queue of events to fire
	 *
	 * @memberOf abaaso.observer
	 * @type {Array}
	 */
	queue : [],

	/**
	 * If `true`, events are queued
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	silent : false,

	/**
	 * If `true`, events are ignored
	 *
	 * @memberOf abaaso.observer
	 * @type {Boolean}
	 */
	ignore : false,

	/**
	 * Adds a handler for an event
	 *
	 * @method add
	 * @memberOf abaaso.observer
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Event, or Events being fired ( comma delimited supported )
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] ID for the listener
	 * @param  {String}   scope [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	add : function ( obj, event, fn, id, scope, st ) {
		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( event !== undefined ) {
			event = string.explode( event );
		}

		id = id || utility.genId();

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    ev       = observer.elisteners,
		    cl       = observer.clisteners,
		    gr       = regex.observer_globals,
		    ar       = regex.observer_allowed,
		    o        = observer.id( obj ),
		    add, reg;

		if ( o === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( l[o] === undefined ) {
			l[o]  = {};
			a[o]  = {};
			cl[o] = {};
		}

		array.each( event, function ( i ) {
			var eid = o + "_" + i;

			if ( l[o][i] === undefined ) {
				l[o][i]  = {};
				a[o][i]  = {};
				cl[o][i] = 0;
			}

			if ( l[o][i][st] === undefined ) {
				l[o][i][st] = {};
				a[o][i][st] = [];
			}

			instance = ( gr.test( o ) || (!/\//g.test( o ) && o !== "abaaso" ) ) ? obj : null;

			// Setting up event listener if valid
			if ( instance !== null && instance !== undefined && i.toLowerCase() !== "afterjsonp" && ev[eid] === undefined && ( gr.test( o ) || typeof instance.listeners === "function" ) ) {
				add = ( typeof instance.addEventListener === "function" );
				reg = ( typeof instance.attachEvent === "object" || add );

				if ( reg ) {
					// Registering event listener
					ev[eid] = function ( e ) {
						if ( !ar.test( e.type ) ) {
							utility.stop( e );
						}

						observer.fire( obj, i, e );
					};

					// Hooking event listener
					instance[add ? "addEventListener" : "attachEvent"]( ( add ? "" : "on" ) + i, ev[eid], false );
				}
			}

			l[o][i][st][id] = {fn: fn, scope: scope};
			observer.sync( o, i, st );
			cl[o][i]++;
		});

		return obj;
	},

	/**
	 * Decorates `obj` with `observer` methods
	 *
	 * @method decorate
	 * @memberOf abaaso.observer
	 * @param  {Object} obj Object to decorate
	 * @return {Object}     Object to decorate
	 */
	decorate : function ( obj ) {
		var methods = [
			["fire",      function () { return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) ); }],
			["listeners", function ( event ) { return observer.list(this, event ); }],
			["on",        function ( event, listener, id, scope, standby ) { return observer.add( this, event, listener, id, scope, standby ); }],
			["once",      function ( event, listener, id, scope, standby ) { return observer.once( this, event, listener, id, scope, standby ); }],
			["un",        function ( event, id ) { return observer.remove( this, event, id ); }]
		];

		array.each( methods, function ( i ) {
			utility.property( obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Discard observer events
	 *
	 * @method discard
	 * @memberOf abaaso.observer
	 * @param  {Boolean} arg [Optional] Boolean indicating if events will be ignored
	 * @return {Boolean}     Current setting
	 */
	discard : function ( arg ) {
		return arg === undefined ? observer.ignore : ( observer.ignore = ( arg === true ) );
	},

	/**
	 * Fires an event
	 *
	 * @method fire
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event Event, or Events being fired ( comma delimited supported )
	 * @return {Mixed}        Primitive
	 */
	fire : function ( obj, event ) {
		var quit = false,
		    a    = array.remove( array.cast( arguments ), 0, 1 ),
		    o, s, log, list;

		if ( observer.ignore ) {
			return obj;
		}

		o = observer.id( obj );

		if ( o === undefined || event === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( observer.silent ) {
			observer.queue.push( {obj: obj, event: event} );
		}
		else {
			s   = state.getCurrent();
			log = abaaso.logging;

			array.each( string.explode( event ), function ( e ) {
				if ( log ) {
					utility.log(o + " firing " + e );
				}

				list = observer.list( obj, e, observer.alisteners );

				if ( list.all !== undefined ) {
					array.each( list.all, function ( i ) {
						var result = i.fn.apply( i.scope, a );

						if ( result === false ) {
							quit = true;

							return result;
						}
					});
				}

				if ( !quit && s !== "all" && list[s] !== undefined ) {
					array.each( list[s], function ( i ) {
						return i.fn.apply( i.scope, a );
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
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  Object or String
	 * @return {String} Observer id
	 */
	id : function ( arg ) {
		var id;

		if ( arg === global ) {
			id = "window";
		}
		else if ( !server && arg === document ) {
			id = "document";
		}
		else if ( !server && arg === document.body ) {
			id = "body";
		}
		else {
			utility.genId( arg );
			id = arg.id || ( typeof arg.toString === "function" ? arg.toString() : arg );
		}

		return id;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj    Primitive
	 * @param  {String} event  Event being queried
	 * @param  {Object} target [Optional] Listeners collection to access, default is `observer.listeners`
	 * @return {Mixed}         Primitive
	 */
	list : function ( obj, event, target ) {
		var l = target || observer.listeners,
		    o = observer.id( obj ),
		    r;

		if ( l[o] === undefined && event === undefined ) {
			r = {};
		}
		else if ( l[o] !== undefined && ( event === undefined || string.isEmpty( event ) ) ) {
			r = l[o];
		}
		else if ( l[o] !== undefined && l[o][event] !== undefined ) {
			r = l[o][event];
		}
		else {
			r = {};
		}

		return r;
	},

	/**
	 * Adds a listener for a single execution
	 *
	 * @method once
	 * @memberOf abaaso.observer
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Event being fired
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] ID for the listener
	 * @param  {String}   scope [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	once : function ( obj, event, fn, id, scope, st ) {
		var uuid = id || utility.genId();

		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( obj === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		observer.add( obj, event, function () {
			fn.apply( scope, arguments );
			observer.remove( obj, event, uuid, st );
		}, uuid, scope, st);

		return obj;
	},

	/**
	 * Pauses observer events, and queues them
	 *
	 * @method pause
	 * @memberOf abaaso.observer
	 * @param  {Boolean} arg Boolean indicating if events will be queued
	 * @return {Boolean}     Current setting
	 */
	pause : function ( arg ) {
		if ( arg === true ) {
			observer.silent = arg;
		}
		else if ( arg === false ) {
			observer.silent = arg;

			array.each( observer.queue, function ( i ) {
				observer.fire( i.obj, i.event );
			});

			observer.queue = [];
		}

		return arg;
	},

	/**
	 * Removes listeners
	 *
	 * @method remove
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event [Optional] Event, or Events being fired ( comma delimited supported )
	 * @param  {String} id    [Optional] Listener id
	 * @param  {String} st    [Optional] Application state, default is current
	 * @return {Mixed}        Primitive
	 */
	remove : function ( obj, event, id, st ) {
		st = st || state.getCurrent();

		var l   = observer.listeners,
		    a   = observer.alisteners,
		    ev  = observer.elisteners,
		    cl  = observer.clisteners,
		    o   = observer.id( obj ),
		    add = ( typeof obj.addEventListener === "function" ),
		    reg = ( typeof obj.attachEvent === "object" || add ),
		    fn;

		/**
		 * Removes DOM event hook
		 *
		 * @method fn
		 * @memberOf abaaso.observer.remove
		 * @private
		 * @param  {Mixed}  event String or null
		 * @param  {Number} i     Amount of listeners being removed
		 * @return {Undefined}    undefined
		 */
		fn = function ( event, i ) {
			var unhook = ( typeof i === "number" && ( cl[o][event] = ( cl[o][event] - i ) ) === 0 );

			if ( unhook && reg ) {
				obj[add ? "removeEventListener" : "detachEvent"]( ( add ? "" : "on" ) + event, ev[o + "_" + event], false );
				delete ev[o + "_" + event];
			}
		};

		if ( l[o] === undefined ) {
			return obj;
		}

		if ( event === undefined || event === null ) {
			if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
				utility.iterate( ev, function ( v, k ) {
					if ( k.indexOf( o + "_" ) === 0) {
						fn( k.replace( /.*_/, "" ), 1 );
					}
				});
			}

			delete l[o];
			delete a[o];
			delete cl[o];
		}
		else {
			array.each( string.explode( event ), function ( e ) {
				var sync = false;

				if ( l[o][e] === undefined ) {
					return;
				}

				if ( id === undefined ) {
					if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
						fn( e, array.keys( l[o][e][st] ).length );
					}

					l[o][e][st] = {};
					sync = true;
				}
				else if ( l[o][e][st][id] !== undefined ) {
					fn( e, 1 );
					delete l[o][e][st][id];
					sync = true;
				}

				if ( sync ) {
					observer.sync( o, e, st );
				}
			});
		}

		return obj;
	},

	/**
	 * Returns the sum of active listeners for one or all Objects
	 *
	 * @method sum
	 * @memberOf abaaso.observer
	 * @param  {Mixed} obj [Optional] Entity
	 * @return {Object}    Object with total listeners per event
	 */
	sum : function ( obj ) {
		return obj ? observer.clisteners[observer.id( obj )] : array.keys( observer.clisteners ).length;
	},

	/**
	 * Syncs `alisteners` with `listeners`
	 *
	 * @method sync
	 * @memberOf abaaso.observer
	 * @param  {String} obj   Object ID
	 * @param  {String} event Event
	 * @param  {String} st    Application state
	 * @return {Undefined}    undefined
	 */
	sync : function ( obj, event, st ) {
		observer.alisteners[obj][event][st] = array.cast( observer.listeners[obj][event][st] );
	}
};
