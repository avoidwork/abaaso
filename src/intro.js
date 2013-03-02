(function () {

var global = this,
    server = typeof exports !== "undefined",
    http, https, document, location, navigator, url;

if (global.abaaso !== undefined) return;

if (server) {
	url   = require("url");
	http  = require("http");
	https = require("https");

	if (typeof Storage === "undefined")        localStorage   = require("localStorage");
	if (typeof XMLHttpRequest === "undefined") XMLHttpRequest = null;
}
else {
	document  = global.document;
	location  = global.location;
	navigator = global.navigator;
}

(function () {
"use strict";

var $, bootstrap, error, external;
