/** @namespace mouse */
var mouse = {
	//Indicates whether mouse tracking is enabled
	enabled : false,

	// Indicates whether to try logging co-ordinates to the console
	log : false,

	// Mouse coordinates
	diff : {x: null, y: null},
	pos  : {x: null, y: null},
	prev : {x: null, y: null},

	// Caching the view
	view    : function () {
		return client.ie && client.version < 9 ? "documentElement" : "body";
	},

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @param  {Mixed} arg Boolean to enable/disable tracking, or Mouse Event
	 * @return {Object}    $.mouse
	 */
	track : function ( arg ) {
		var type = typeof arg;

		if ( type === "object" ) {
			var v = document[mouse.view],
			    x = arg.pageX ? arg.pageX : ( v.scrollLeft + arg.clientX ),
			    y = arg.pageY ? arg.pageY : ( v.scrollTop  + arg.clientY ),
			    c = false;

			if ( mouse.pos.x !== x ) {
				c = true;
			}

			$.mouse.prev.x = mouse.prev.x = number.parse( mouse.pos.x, 10 );
			$.mouse.pos.x  = mouse.pos.x  = x;
			$.mouse.diff.x = mouse.diff.x = mouse.pos.x - mouse.prev.x;

			if ( mouse.pos.y !== y ) {
				c = true;
			}

			$.mouse.prev.y = mouse.prev.y = number.parse( mouse.pos.y, 10 );
			$.mouse.pos.y  = mouse.pos.y  = y;
			$.mouse.diff.y = mouse.diff.y = mouse.pos.y - mouse.prev.y;

			if ( c && $.mouse.log ) {
				utility.log( [mouse.pos.x, mouse.pos.y, mouse.diff.x, mouse.diff.y] );
			}
		}
		else if ( type === "boolean" ) {
			arg ? observer.add( document, "mousemove", mouse.track, "tracking" ) : observer.remove( document, "mousemove", "tracking" );
			$.mouse.enabled = mouse.enabled = arg;
		}

		return $.mouse;
	}
};
