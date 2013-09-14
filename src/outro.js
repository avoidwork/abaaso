// Bootstrapping
bootstrap();

// DataStore Worker "script"
WORKER = "var " + string.fromObject( array, "array" ) + ", " + string.fromObject( regex, "regex" ) + ", " + string.fromObject( string, "string" ) + ", " + string.fromObject( utility, "utility" ) + "; onmessage = " + data.worker.toString() + ";";

// Returning factory
return abaaso;
})();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = framework;
}
else if ( typeof define === "function" ) {
	define( function () {
		return framework;
	});
}
else {
	global.abaaso = framework;
}
})( this );
