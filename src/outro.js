})();

// Conditional bootstrap incase of multiple loading
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();

// Node, AMD & window supported
switch (true) {
	case typeof exports !== "undefined":
		module.exports = abaaso;
		break;
	case typeof define === "function":
		define("abaaso", function () { return abaaso; });
		break;
	default:
		global.abaaso = abaaso;
}

})(this);
