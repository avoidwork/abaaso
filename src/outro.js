}();

// Bootstrapping the framework
abaaso.bootstrap();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = abaaso;
}
else if ( typeof define === "function") {
	define( "abaaso", function () {
		return abaaso;
	});
}
else {
	global.abaaso = abaaso;
}
})( this );
