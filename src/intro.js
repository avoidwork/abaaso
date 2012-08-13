(function (global) {

var document  = global.document,
    location  = global.location,
    navigator = global.navigator,
    server    = typeof navigator === "undefined",
    abaaso;

if (server) {
	if (typeof Storage === "undefined")        localStorage   = require("localStorage");
	if (typeof XMLHttpRequest === "undefined") XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}

abaaso = global.abaaso || (function () {
"use strict";

var $, bootstrap, error, external;
