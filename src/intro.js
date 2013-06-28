( function ( global ) {

var document  = global.document,
    location  = global.location,
    navigator = global.navigator,
    server    = typeof exports !== "undefined",
    $, abaaso, http, https, url;

if ( global.abaaso !== undefined ) {
	return;
}

if ( server ) {
	url   = require( "url" );
	http  = require( "http" );
	https = require( "https" );

	if ( typeof Storage === "undefined" ) {
		localStorage = require( "localStorage" );
	}

	if ( typeof XMLHttpRequest === "undefined" ) {
		XMLHttpRequest = null;
	}
}

abaaso = (function () {
"use strict";

var bootstrap, external;
