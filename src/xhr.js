/**
 * XMLHttpRequest facade for node.js
 * 
 * @return {Object} Instance of xhr
 */
var xhr = (function () {
	var url              = require("url"),
	    spawn            = require("child_process").spawn,
		fs               = require("fs"),
		UNSENT           = 0,
	    OPENED           = 1,
	    HEADERS_RECEIVED = 2,
	    LOADING          = 3,
	    DONE             = 4,
		XMLHttpRequest, headers, state;

	headers = {
		"User-Agent" : "node/" + process.version.replace(/^v/, ""),
		"Accept"     : "*/*"
	};

	state = function (arg) {
		if (this.readyState !== arg) this.readyState = arg;
		if (this._params.async || this.readyState < OPENED || this.readyState === DONE) this.dispatchEvent("readystatechange");
		if (this.readyState === DONE && !this._error) this.dispatchEvent("load, loadend");
	};

	XMLHttpRequest = function () {
		this.onabort            = null;
		this.onerror            = null;
		this.onload             = null;
		this.onloadend          = null;
		this.onloadstart        = null;
		this.onprogress         = null;
		this.onreadystatechange = null;
		this.readyState         = UNSENT;
		this.response           = null;
		this.responseText       = "";
		this.responseType       = "";
		this.responseXML        = null;
		this.status             = UNSENT;
		this.statusText         = "";

		// Psuedo private for prototype chain
		this._id                = utility.genId();
		this._error             = false;
		this._headers           = headers;
		this._listeners         = {};
		this._params            = {};
		this._request           = null;
		this._response          = null;
		this._send              = false;
		return this;
	};

	XMLHttpRequest.prototype.abort = function () {
		if (this._request !== "null") {
			if (typeof this._request.abort === "function") this._request.abort();
			this._request = null;
		}

		this._headers     = headers;
		this.responseText = "";
		this.responseXML  = "";
		this._error       = true;

		if (this._send === true || RegExp(HEADERS_RECEIVED + "|" + LOADING).test(this.readyState)) {
			this._send = false;
			state.call(this, DONE)
		}

		this.readyState = UNSENT;
		return this;
	};

	XMLHttpRequest.prototype.addEventListener = function (type, fn) {
		if (!this._listeners.hasOwnProperty(type)) this._listeners[type] = [];
		this._listeners[type].add(fn);
		return this;
    };

	XMLHttpRequest.prototype.dispatchEvent = function (event) {
		var self = this;

		if (this["on" + event] === "function") this["on" + event]();
		if (this._listeners.hasOwnProperty(type)) this._listeners[event].each(function (i) { i.call(self); });
		return this;
	};

	XMLHttpRequest.prototype.getAllResponseHeaders = function () {
		return this;	
	};

	XMLHttpRequest.prototype.getResponseHeader = function (header) {
		return this;
	};

	XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
		this.abort();
	    this._error  = false;
	    this._params = {
	    	method   : method,
	    	url      : url,
	    	user     : user || null,
	    	password : password || null
	    };
	    this.readyState = OPENED;
	    return this;
	};

	XMLHttpRequest.prototype.overrideMimeType = function (mime) {
		this._headers["Content-Type"] = mime;
		return this;
	};

	XMLHttpRequest.prototype.removeEventListener = function (type, type) {
		if (!this._listeners.hasOwnProperty(type)) return;
		this._listeners[type].remove(type);
		return this;
	};

	XMLHttpRequest.prototype.send = function (data) {

	};

	XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
		switch (true) {
			case this.readyState !== OPENED:
				throw Error("INVALID_STATE_ERR: Object is not usable");
			case this._send:
				throw Error("INVALID_STATE_ERR: Object is sending");
		}
		this._headers[header] = value;
		return this;
	};

	return XMLHttpRequest;
}();

