/**
 * Mouse tracking
 *
 * @class mouse
 * @namespace abaaso
 */
var mouse = {
	//Indicates whether mouse tracking is enabled
	enabled : false,

	// Indicates whether to try logging co-ordinates to the console
	log     : false,

	// Mouse coordinates
	diff    : {x: null, y: null},
	pos     : {x: null, y: null},
	prev    : {x: null, y: null},

	// Caching the view
	view    : function () {
		return client.ie && client.version < 9 ? "documentElement" : "body";
	},

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
	 * @return {Object}  mouse
	 */
	track : function ( e ) {
		var m  = mouse,
		    ev = "mousemove",
		    n  = "tracking";

		if ( typeof e === "object" ) {
			var v = document[m.view],
			    x = e.pageX ? e.pageX : ( v.scrollLeft + e.clientX ),
			    y = e.pageY ? e.pageY : ( v.scrollTop  + e.clientY ),
			    c = false;

			if ( m.pos.x !== x ) c = true;
			$.mouse.prev.x = m.prev.x = number.parse( m.pos.x, 10 );
			$.mouse.pos.x  = m.pos.x  = x;
			$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

			if ( m.pos.y !== y ) c = true;
			$.mouse.prev.y = m.prev.y = number.parse( m.pos.y, 10 );
			$.mouse.pos.y  = m.pos.y  = y;
			$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

			if ( c && m.log ) utility.log( [m.pos.x, m.pos.y, m.diff.x, m.diff.y] );
		}
		else if ( typeof e === "boolean" ) {
			e ? observer.add( document, ev, mouse.track, n ) : observer.remove( document, ev, n );
			$.mouse.enabled = m.enabled = e;
		}

		return m;
	}
};
