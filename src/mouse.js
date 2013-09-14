/** @namespace abaaso.mouse */
var mouse = {
	/**
	 * Indicates whether mouse tracking is enabled
	 *
	 * @name enabled
	 * @memberOf abaaso.mouse
	 * @type {boolean}
	 */
	enabled : false,

	/**
	 * Indicates whether to try logging co-ordinates to the console
	 *
	 * @name log
	 * @memberOf abaaso.mouse
	 * @type {boolean}
	 */
	log : false,

	/**
	 * Difference between mouse.pos & mouse.prev
	 *
	 * @name diff
	 * @memberOf abaaso.mouse
	 * @type {object}
	 */
	diff : {
		x: null,
		y: null
	},

	/**
	 * Cursor position
	 *
	 * @name pos
	 * @memberOf abaaso.mouse
	 * @type {object}
	 */
	pos  : {
		x: null,
		y: null
	},

	/**
	 * Previus cursor position
	 *
	 * @name prev
	 * @memberOf abaaso.mouse
	 * @type {object}
	 */
	prev : {
		x: null,
		y: null
	},

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @memberOf abaaso.mouse
	 * @param  {mixed} arg Boolean to enable/disable tracking, or Mouse Event
	 * @return {object}    abaaso.mouse
	 */
	track : function ( arg ) {
		var type = typeof arg;

		if ( type === "object" ) {
			var v = document.body,
			    x = arg.pageX ? arg.pageX : ( v.scrollLeft + arg.clientX ),
			    y = arg.pageY ? arg.pageY : ( v.scrollTop  + arg.clientY ),
			    c = false;

			if ( mouse.pos.x !== x ) {
				c = true;
			}

			abaaso.mouse.prev.x = mouse.prev.x = number.parse( mouse.pos.x, 10 );
			abaaso.mouse.pos.x  = mouse.pos.x  = x;
			abaaso.mouse.diff.x = mouse.diff.x = mouse.pos.x - mouse.prev.x;

			if ( mouse.pos.y !== y ) {
				c = true;
			}

			abaaso.mouse.prev.y = mouse.prev.y = number.parse( mouse.pos.y, 10 );
			abaaso.mouse.pos.y  = mouse.pos.y  = y;
			abaaso.mouse.diff.y = mouse.diff.y = mouse.pos.y - mouse.prev.y;

			if ( c && abaaso.mouse.log ) {
				utility.log( [mouse.pos.x, mouse.pos.y, mouse.diff.x, mouse.diff.y] );
			}
		}
		else if ( type === "boolean" ) {
			arg ? observer.add( document, "mousemove", mouse.track, "tracking" ) : observer.remove( document, "mousemove", "tracking" );
			abaaso.mouse.enabled = mouse.enabled = arg;
		}

		return abaaso.mouse;
	}
};
