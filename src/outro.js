})();

// Bootstrapping the framework
$ = abaaso.bootstrap();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = $;
}
else if ( typeof define === "function") {
	define( "abaaso", function () {
		return $;
	});
}
else {
	if ( !server ) {
		if ( global.$ === undefined || global.$ === null ) {
			global.$ = $;
		}
		else {
			global.a$ = $;
			$.aliased = "a$";
		}
	}
}
})( this );
