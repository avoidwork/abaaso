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

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
	 * @return {Object}  mouse
	 */
	track : function (e) {
		var m = mouse,
		    e = "mousemove",
		    n = "tracking";

		if (!server) {
			if (typeof e === "object") {
				var view = document[client.ie && client.version < 9 ? "documentElement" : "body"],
				    x    = e.pageX ? e.pageX : (view.scrollLeft + e.clientX),
				    y    = e.pageY ? e.pageY : (view.scrollTop  + e.clientY),
				    c    = false;

				if (m.pos.x !== x) c = true;
				$.mouse.prev.x = m.prev.x = Number(m.pos.x);
				$.mouse.pos.x  = m.pos.x  = x;
				$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

				if (m.pos.y !== y) c = true;
				$.mouse.prev.y = m.prev.y = Number(m.pos.y);
				$.mouse.pos.y  = m.pos.y  = y;
				$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

				if (c && m.log) utility.log(m.pos.x + " [" + m.diff.x + "], " + m.pos.y + " [" + m.diff.y + "]");
			}
			else if (typeof e === "boolean") {
				e ? observer.add(document, e, mouse.track, n) : observer.remove(document, e, n);
				$.mouse.enabled = m.enabled = e;
			}
		}

		return m;
	}
};
