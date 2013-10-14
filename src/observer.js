/** @namespace abaaso.observer */
var observer = {
	/**
	 * Collection of external event listeners
	 *
	 * @memberOf abaaso.observer
	 * @type {Object}
	 */
	elisteners : {},

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
	 * @param  {Mixed}    obj    Primitive
	 * @param  {String}   events Comma delimited string of events
	 * @param  {Function} fn     Event handler
	 * @param  {String}   id     [Optional / Recommended] ID for the listener
	 * @param  {String}   scope  [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st     [Optional] Application state, default is current
	 * @return {Mixed}           Primitive
	 */
	add : function ( obj, events, fn, id, scope, st ) {
		var oId      = observer.id( obj ),
		    instance = regex.observer_globals.test( oId ) || ( !/\//g.test( oId ) && oId !== "abaaso" ) ? obj : null,
		    jsonp    = /^afterjsonp$/i,
		    add      = false,
		    reg      = false;

		if ( !oId || !events || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		// Preparing variables
		id    = id    || utility.uuid();
		scope = scope || obj;
		st    = st    || state.getCurrent();

		// Preparing
		if ( !observer.listeners[oId] ) {
			observer.listeners[oId]     = {};
			observer.listeners[oId].all = {};
		}

		if ( st !== "all" && !observer.listeners[oId][st] ) {
			observer.listeners[oId][st] = {};
		}

		if ( instance ) {
			add = typeof instance.addEventListener === "function";
			reg = typeof instance.attachEvent === "object" || add;
		}

		// Setting event listeners (with DOM hooks if applicable)
		array.each( string.explode( events ), function ( ev ) {
			var eId = oId + "_" + ev;

			// Creating caches if not present
			if ( !observer.listeners[oId].all[ev] ) {
				observer.listeners[oId].all[ev] = lru( observer.maxListeners );
			}

			if ( st !== "all" && !observer.listeners[oId][st][ev] ) {
				observer.listeners[oId][st][ev] = lru( observer.maxListeners );
			}

			// Hooking event listener
			if ( reg && !jsonp.test( ev ) && !observer.elisteners[eId] ) {
				observer.elisteners[eId] = function ( e ) {
					observer.fire( oId, ev, e );
				};

				instance[add ? "addEventListener" : "attachEvent"]( ( add ? "" : "on" ) + ev, observer.elisteners[eId], false );
			}

			observer.listeners[oId][st][ev].set( id, {fn: fn, scope: scope} );
		} );

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
	decorate : function () {
		var methods = [
			[
				"fire",
				function () {
					return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
				}
			],
			[
				"listeners",
				function ( e ) {
					return observer.list( this, e );
				}
			],
			[
				"on",
				function ( e, listener, id, scope, standby ) {
					return observer.add( this, e, listener, id, scope, standby );
				}
			],
			[
				"once",
				function ( e, listener, id, scope, standby ) {
					return observer.once( this, e, listener, id, scope, standby );
				}
			],
			[
				"un",
				function ( e, id ) {
					return observer.remove( this, e, id );
				}
			]
		];

		array.each( methods, function ( i ) {
			utility.property( obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true} );
		} );

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
	 * @param  {Mixed}  obj    Primitive
	 * @param  {String} events Comma delimited string of events
	 * @return {Mixed}         Primitive
	 */
	fire : function ( obj, events ) {
		var args, log, cache, item, oId;

		if ( !observer.ignore ) {
			if ( observer.silent ) {
				observer.queue.push( array.cast( arguments ) );
			}
			else {
				oId  = observer.id( obj );

				if ( observer.listeners[oId] ) {
					args = array.remove( array.cast( arguments ), 0, 1 );
					log  = abaaso.logging;

					array.each( string.explode( events ), function ( ev ) {
						if ( log ) {
							utility.log( oId + " fired " + ev );
						}

						array.each( observer.states(), function ( st ) {
							if ( observer.listeners[oId][st] && observer.listeners[oId][st][ev] ) {
								cache = observer.listeners[oId][st][ev];

								if ( cache.length > 0 ) {
									item  = cache.cache[cache.last];

									do {
										if ( item.value.fn.apply( item.value.scope, args ) !== false && item.next ) {
											item = cache.cache[item.next];
										}
										else {
											return false;
										}
									}
									while ( item );
								}
							}
						} );
					} );
				}
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
	 * @param  {Mixed}  obj Primitive
	 * @param  {String} ev  Event being queried
	 * @return {Mixed}      Primitive
	 */
	list : function ( obj, ev ) {
		var oId    = observer.id( obj ),
		    states = observer.states(),
		    result = {};

		if ( !observer.listeners[oId] ) {
			// do nothing
		}
		else if ( !ev || string.isEmpty( ev ) ) {
			array.each( observer.states(), function ( st ) {
				if ( observer.listeners[oId][st] ) {
					array.each( array.keys( observer.listeners[oId][st] ), function ( ev ) {
						result[st] = observer.listeners[oId][st][ev].cache;
					} );
				}
			} );
		}
		else {
			array.each( observer.states(), function ( st ) {
				if ( observer.listeners[oId][st] && observer.listeners[oId][st][ev] ) {
					result[st] = observer.listeners[oId][st][ev].cache;
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
	 * @param  {Mixed}    obj    Primitive
	 * @param  {String}   events Comma delimited string of events being fired
	 * @param  {Function} fn     Event handler
	 * @param  {String}   id     [Optional / Recommended] ID for the listener
	 * @param  {String}   scope  [Optional / Recommended] ID of the object or element to be set as 'this'
	 * @param  {String}   st     [Optional] Application state, default is current
	 * @return {Mixed}           Primitive
	 */
	once : function ( obj, events, fn, id, scope, st ) {
		id    = id    || utility.uuid();
		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( !obj || !events || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		array.each( string.explode( events ), function ( ev ) {
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

	/**
	 * Removes listeners
	 *
	 * @method remove
	 * @memberOf abaaso.observer
	 * @param  {Mixed}  obj    Primitive
	 * @param  {String} events [Optional] Comma delimited string of events being removed
	 * @param  {String} id     [Optional] Listener id
	 * @param  {String} st     [Optional] Application state, default is current
	 * @return {Mixed}         Primitive
	 */
	remove : function ( obj, events, id, st ) {
		var oId   = observer.id( obj ),
		    add   = typeof obj.addEventListener === "function",
		    reg   = typeof obj.attachEvent === "object" || add,
		    regex = /.*_/,
		    states, total, unhook;

		st = st || state.getCurrent();

		/**
		 * Removes DOM event hook
		 *
		 * @method unhook
		 * @memberOf abaaso.observer.remove
		 * @private
		 * @param  {Mixed}  eId Event ID
		 * @param  {Number} ev  Event
		 * @return {Undefined}  undefined
		 */
		unhook = function ( eId, ev ) {
			if ( reg ) {
				obj[add ? "removeEventListener" : "detachEvent"]( ( add ? "" : "on" ) + ev, this[eId], false );
			}

			delete this[eId];
		};

		if ( observer.listeners[oId] ) {
			if ( !events ) {
				utility.iterate( observer.elisteners, function ( v, k ) {
					if ( k.indexOf( oId + "_" ) === 0 ) {
						unhook.call( this, k, k.replace( regex, "" ) );
					}
				} );

				delete observer.listeners[oId];
			}
			else {
				events = string.explode( events );
				states = array.keys( observer.listeners[oId] );
				total  = 0;

				// Total listeners
				array.each( states, function ( s ) {
					array.each( events, function ( e ) {
						if ( observer.listeners[oId][s][e] ) {
							total += observer.listeners[oId][s][e].length;
						}
					} );
				} );

				array.each( events, function ( ev ) {
					if ( observer.listeners[oId][st][ev] ) {
						// Specific listener
						if ( id ) {
							observer.listeners[oId][st][ev].remove( id );
							total--;

							if ( total === 0 ) {
								array.each( states, function ( s ) {
									delete observer.listeners[oId][s][ev];
								} );

								unhook.call( observer.elisteners, oId + "_" + ev, ev );
							}
						}
						// All listeners for the event
						else {
							array.each( states, function ( s ) {
								delete observer.listeners[oId][s][ev];
							} );

							unhook.call( observer.elisteners, oId + "_" + ev, ev );
						}
					}
				} );
			}
		}

		return obj;
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
};
