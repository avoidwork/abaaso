// Bootstrapping
bootstrap();

// DataStore Worker "script"
WORKER = "var " + string.fromObject( array, "array" ) + ", " + string.fromObject( regex, "regex" ) + ", " + string.fromObject( string, "string" ) + ", " + string.fromObject( utility, "utility" ) + "; onmessage = " + data.worker.toString() + ";";

// Returning namespace
return abaaso;
})();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = abaaso;
}
else if ( typeof define === "function" ) {
	define( "abaaso", function () {
		return abaaso;
	});
}
else {
	global.abaaso = abaaso;
}
})( this );
