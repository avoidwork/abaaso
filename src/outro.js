})();

// Conditional bootstrap incase of multiple loading
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();

// Node, AMD & window supported
if (typeof exports !== "undefined") module.exports = abaaso;
else if (typeof define === "function") define("abaaso", function () { return abaaso; });
else global.abaaso = abaaso;
})(this);
