/**
 * Client properties and methods
 *
 * @class client
 * @namespace abaaso
 */
var client = {
	android : (function () { return !server && regex.android.test(navigator.userAgent); })(),
	blackberry : (function () { return !server && regex.blackberry.test(navigator.userAgent); })(),
	chrome  : (function () { return !server && regex.chrome.test(navigator.userAgent); })(),
	firefox : (function () { return !server && regex.firefox.test(navigator.userAgent); })(),
	ie      : (function () { return !server && regex.ie.test(navigator.userAgent); })(),
	ios     : (function () { return !server && regex.ios.test(navigator.userAgent); })(),
	linux   : (function () { return !server && regex.linux.test(navigator.userAgent); })(),
	mobile  : (function () { return !server && (/blackberry|iphone|webos/i.test(navigator.userAgent) || (regex.android.test(navigator.userAgent) && (this.client.size.height < 720 || this.client.size.width < 720))); }),
	playbook: (function () { return !server && regex.playbook.test(navigator.userAgent); })(),
	opera   : (function () { return !server && regex.opera.test(navigator.userAgent); })(),
	osx     : (function () { return !server && regex.osx.test(navigator.userAgent); })(),
	safari  : (function () { return !server && regex.safari.test(navigator.userAgent.replace(/chrome.*/i, "")); })(),
	tablet  : (function () { return !server && (/ipad|playbook|webos/i.test(navigator.userAgent) || (regex.android.test(navigator.userAgent) && (this.client.size.width >= 720 || this.client.size.width >= 720))); }),
	webos   : (function () { return !server && regex.webos.test(navigator.userAgent); })(),
	windows : (function () { return !server && regex.windows.test(navigator.userAgent); })(),
	version : (function () {
		var version = 0;

		switch (true) {
			case this.chrome:
				version = navigator.userAgent.replace(/(.*chrome\/|safari.*)/gi, "");
				break;
			case this.firefox:
				version = navigator.userAgent.replace(/(.*firefox\/)/gi, "");
				break;
			case this.ie:
				version = parseInt(navigator.userAgent.replace(/(.*msie|;.*)/gi, ""));
				if (document.documentMode < version) version = document.documentMode;
				break;
			case this.opera:
				version = navigator.userAgent.replace(/(.*opera\/|\(.*)/gi, "");
				break;
			case this.safari:
				version = navigator.userAgent.replace(/(.*version\/|safari.*)/gi, "");
				break;
			default:
				version = (navigator !== undefined) ? navigator.appVersion : 0;
		}

		version = !isNaN(parseInt(version)) ? parseInt(version) : 0;
		return version;
	}),

	/**
	 * Quick way to see if a URI allows a specific command
	 *
	 * @method allows
	 * @param  {String} uri     URI to query
	 * @param  {String} command Command to query for
	 * @return {Boolean}        True if the command is allowed
	 */
	allows : function (uri, command) {
		if (uri.isEmpty() || command.isEmpty()) throw Error(label.error.invalidArguments);
		if (!cache.get(uri, false)) return undefined;

		command    = command.toLowerCase();
		var result = false,
		    bit    = 0;

		if (regex.del.test(command))              bit = 1;
		else if (regex.get_headers.test(command)) bit = 4;
		else if (regex.put_post.test(command))    bit = 2;

		result = !((client.permissions(uri, command).bit & bit) === 0);
		return result;
	},

	/**
	 * Gets bit value based on args
	 *
	 * 1 --d delete
	 * 2 -w- write
	 * 3 -wd write and delete
	 * 4 r-- read
	 * 5 r-d read and delete
	 * 6 rw- read and write
	 * 7 rwd read, write and delete
	 *
	 * @method bit
	 * @param  {Array} args Array of commands the URI accepts
	 * @return {Number} To be set as a bit
	 * @private
	 */
	bit : function (args) {
		var result = 0;

		array.each(args, function (a) {
			switch (a.toLowerCase()) {
				case "head":
				case "get":
				case "options":
					result |= 4;
					break;
				case "post":
				case "put":
					result |= 2;
					break;
				case "delete":
					result |= 1;
					break;
			}
		});
		return result;
	},

	/**
	 * Determines if a URI is a CORS end point
	 * 
	 * @method cors
	 * @param  {String} uri  URI to parse
	 * @return {Boolean}     True if CORS
	 */
	cors : function (uri) {
		return (!server && uri.indexOf("//") > -1 && uri.indexOf("//" + location.host) === -1);
	},

	/**
	 * Caches the headers from the XHR response
	 * 
	 * @method headers
	 * @param  {Object} xhr  XMLHttpRequest Object
	 * @param  {String} uri  URI to request
	 * @param  {String} type Type of request
	 * @return {Object}      Cached URI representation
	 * @private
	 */
	headers : function (xhr, uri, type) {
		var headers = string.trim(xhr.getAllResponseHeaders()).split("\n"),
		    items   = {},
		    o       = {},
		    allow   = null,
		    expires = new Date(),
		    cors    = client.cors(uri);

		array.each(headers, function (i, idx) {
			var header, value;

			value         = i.replace(regex.header_value_replace, "");
			header        = i.replace(regex.header_replace, "");
			header        = string.unhyphenate(header, true).replace(/\s+/g, "-");
			items[header] = value;

			if (allow === null) {
				if (!cors && regex.allow.test(header))          allow = value;
				else if (cors && regex.allow_cors.test(header)) allow = value;
			}
		});

		switch (true) {
			case regex.no.test(items["Cache-Control"]):
			case regex.no.test(items["Pragma"]):
				break;
			case items["Cache-Control"] !== undefined && regex.number_present.test(items["Cache-Control"]):
				expires = expires.setSeconds(expires.getSeconds() + parseInt(regex.number_present.exec(items["Cache-Control"])[0]));
				break;
			case items["Expires"] !== undefined:
				expires = new Date(items["Expires"]);
				break;
			default:
				expires = expires.setSeconds(expires.getSeconds() + $.expires);
		}

		o.expires    = expires;
		o.headers    = items;
		o.permission = client.bit(allow !== null ? string.explode(allow) : [type]);

		if (type !== "head") {
			cache.set(uri, "expires",    o.expires);
			cache.set(uri, "headers",    o.headers);
			cache.set(uri, "permission", o.permission);
		}

		return o;
	},

	/**
	 * Parses an XHR response
	 * 
	 * @param  {Object} xhr  XHR Object
	 * @param  {String} type [Optional] Content-Type header value
	 * @return {Mixed}       Array, Boolean, Document, Number, Object or String
	 */
	parse : function (xhr, type) {
		type = type || "";
		var result, obj;

		switch (true) {
			case (regex.json_maybe.test(type) || type.isEmpty()) && regex.json_wrap.test(xhr.responseText) && Boolean(obj = json.decode(xhr.responseText, true)):
			case (regex.json_maybe.test(type) || type.isEmpty()) && (obj = regex.jsonp_wrap.exec(xhr.responseText)) && obj !== null && Boolean(obj = json.decode(obj[2], true)):
				result = obj;
				break;
			case (regex.xml.test(type) && String(xhr.responseText).isEmpty() && xhr.responseXML !== undefined && xhr.responseXML !== null):
				result = xml.decode(xhr.responseXML.xml !== undefined ? xhr.responseXML.xml : xhr.responseXML);
				break;
			case regex.is_xml.test(xhr.responseText):
				result = xml.decode(xhr.responseText);
				break;
			default:
				result = xhr.responseText;
		}
		return result;
	},

	/**
	 * Returns the permission of the cached URI
	 *
	 * @method permissions
	 * @param  {String} uri URI to query
	 * @return {Object}     Contains an Array of available commands, the permission bit and a map
	 */
	permissions : function (uri) {
		var cached = cache.get(uri, false),
		    bit    = !cached ? 0 : cached.permission,
		    result = {allows: [], bit: bit, map: {read: 4, write: 2, "delete": 1}};

		if (bit & 1) result.allows.push("DELETE");
		if (bit & 2) (function () { result.allows.push("POST"); result.allows.push("PUT"); })();
		if (bit & 4) result.allows.push("GET");
		return result;
	},

	/**
	 * Creates a JSONP request
	 *
	 * Events: beforeJSONP     Fires before the SCRIPT is made
	 *         afterJSONP      Fires after the SCRIPT is received
	 *         failedJSONP     Fires on error
	 *         timeoutJSONP    Fires 30s after SCRIPT is made
	 *
	 * @method jsonp
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request (CORS)
	 * @return {Object}           Promise
	 */
	jsonp : function (uri, success, failure, args) {
		var deferred = promise.factory(),
		    callback, cbid, s;

		// Utilizing the sugar if namespace is not global
		if (external === undefined) {
			if (global.abaaso === undefined) utility.define("abaaso.callback", {}, global);
			external = "abaaso";
		}

		switch (true) {
			case args === undefined:
			case args === null:
			case args instanceof Object && (args.callback === null || args.callback === undefined):
			case typeof args === "string" && args.isEmpty():
				callback = "callback";
				break;
			case args instanceof Object && args.callback !== undefined:
				callback = args.callback;
				break;
			default:
				callback = "callback";
		}

		deferred.then(function (arg) {
			if (typeof success === "function") success(arg);
		}, function (e) {
			if (typeof failure === "function") failure(e);
			throw e;
		});

		do cbid = utility.genId().slice(0, 10);
		while (global.abaaso.callback[cbid] !== undefined);

		uri = uri.replace(callback + "=?", callback + "=" + external + ".callback." + cbid);

		global.abaaso.callback[cbid] = function (arg) {
			clearTimeout(utility.timer[cbid]);
			delete utility.timer[cbid];
			delete global.abaaso.callback[cbid];
			deferred.resolve(arg);
			s.destroy();
		};

		s = $("head")[0].create("script", {src: uri, type: "text/javascript"});
		
		utility.defer(function () {
			deferred.reject(undefined);
		}, 30000, cbid);

		return deferred;
	},

	/**
	 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
	 *
	 * Events: before[type]          Fires before the XmlHttpRequest is made, type specific
	 *         failed[type]          Fires on error
	 *         progress[type]        Fires on progress
	 *         progressUpload[type]  Fires on upload progress
	 *         received[type]        Fires on XHR readystate 2
	 *         timeout[type]         Fires when XmlHttpRequest times out
	 *
	 * @method request
	 * @param  {String}   uri     URI to query
	 * @param  {String}   type    Type of request (DELETE/GET/POST/PUT/HEAD)
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    [Optional] Data to send with the request
	 * @param  {Object}   headers [Optional] Custom request headers (can be used to set withCredentials)
	 * @param  {Number}   timeout [Optional] Timeout in milliseconds, default is 30000
	 * @return {Object}           Promise
	 * @private
	 */
	request : function (uri, type, success, failure, args, headers, timeout) {
		timeout = timeout || 30000;
		var cors, xhr, payload, cached, typed, contentType, doc, ab, blob, deferred, deferred2;

		if (regex.put_post.test(type) && args === undefined) throw Error(label.error.invalidArguments);

		type         = type.toLowerCase();
		headers      = headers instanceof Object ? headers : null;
		cors         = client.cors(uri);
		xhr          = (client.ie && client.version < 10 && cors) ? new XDomainRequest() : new XMLHttpRequest();
		payload      = regex.put_post.test(type) && args !== undefined ? args : null;
		cached       = type === "get" ? cache.get(uri) : false;
		typed        = type.capitalize();
		contentType  = null;
		doc          = (typeof Document !== "undefined");
		ab           = (typeof ArrayBuffer !== "undefined");
		blob         = (typeof Blob !== "undefined");
		deferred     = promise.factory();

		// Using a promise to resolve request
		deferred2 = deferred.then(function (arg) {
			if (type === "delete") cache.expire(uri);
			if (typeof success === "function") success.call(uri, arg, xhr);
			xhr = null;
		}, function (e) {
			if (typeof failure === "function") failure.call(uri, e, xhr);
			xhr = null;
			throw e;
		});

		uri.fire("before" + typed);

		if (!regex.get_headers.test(type) && uri.allows(type) === false) {
			xhr.status = 405;
			deferred.reject(null);
			return uri.fire("failed" + typed, null, xhr);
		}

		if (type === "get" && Boolean(cached)) {
			if (server) {
				// Decorating XHR for proxy behavior
				xhr.readyState  = 4;
				xhr.status      = 200;
				xhr._resheaders = cached.headers;
			}
			deferred.resolve(cached.response);
			uri.fire("afterGet", cached.response, xhr);
		}
		else {
			xhr[xhr instanceof XMLHttpRequest ? "onreadystatechange" : "onload"] = function (e) {
				client.response(xhr, uri, type, deferred);
			};

			// Setting timeout
			try { if (xhr.timeout !== undefined) xhr.timeout = timeout; }
			catch (e) { void 0; }

			// Setting events
			if (xhr.ontimeout  !== undefined) xhr.ontimeout  = function (e) { uri.fire("timeout"  + typed, e, xhr); };
			if (xhr.onprogress !== undefined) xhr.onprogress = function (e) { uri.fire("progress" + typed, e, xhr); };
			if (xhr.upload     !== undefined && xhr.upload.onprogress !== undefined) xhr.upload.onprogress = function (e) { uri.fire("progressUpload" + typed, e, xhr); };

			try {
				xhr.open(type.toUpperCase(), uri, true);

				// Setting Content-Type value
				if (headers !== null && headers.hasOwnProperty("Content-Type")) contentType = headers["Content-Type"];
				if (cors && contentType === null) contentType = "text/plain";

				// Transforming payload
				if (payload !== null) {
					if (payload.hasOwnProperty("xml")) payload = payload.xml;
					if (doc && payload instanceof Document) payload = xml.decode(payload);
					if (typeof payload === "string" && regex.is_xml.test(payload)) contentType = "application/xml";
					if (!(ab && payload instanceof ArrayBuffer) && !(blob && payload instanceof Blob) && payload instanceof Object) {
						contentType = "application/json";
						payload = json.encode(payload);
					}
					if (contentType === null && ((ab && payload instanceof ArrayBuffer) || (blob && payload instanceof Blob))) contentType = "application/octet-stream";
					if (contentType === null) contentType = "application/x-www-form-urlencoded; charset=UTF-8";
				}

				// Setting headers
				if (xhr.setRequestHeader !== undefined) {
					if (typeof cached === "object" && cached.headers.hasOwnProperty("ETag")) xhr.setRequestHeader("ETag", cached.headers.ETag);
					if (headers === null) headers = {};
					if (contentType !== null) headers["Content-Type"] = contentType;
					if (headers.hasOwnProperty("callback")) delete headers.callback;
					utility.iterate(headers, function (v, k) {
						if (v !== null && k !== "withCredentials") xhr.setRequestHeader(k, v);
					});
				}

				// Cross Origin Resource Sharing (CORS)
				if (typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean") xhr.withCredentials = headers.withCredentials;

				// Firing event & sending request
				payload !== null ? xhr.send(payload) : xhr.send();
			}
			catch (e) {
				error(e, arguments, this, true);
				deferred.reject(e);
				uri.fire("failed" + typed, client.parse(xhr), xhr);
			}
		}

		return deferred2;
	},

	/**
	 * Caches the URI headers & response if received, and fires the relevant events
	 *
	 * If abaaso.state.header is set, an application state change is possible
	 *
	 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
	 * resource
	 *
	 * Events: after[type]  Fires after the XmlHttpRequest response is received, type specific
	 *         reset        Fires if a 206 response is received
	 *         moved        Fires if a 301 response is received
	 *         failure      Fires if an exception is thrown
	 *         headers      Fires after a possible state change, with the headers from the response
	 *
	 * @method response
	 * @param  {Object} xhr      XMLHttpRequest Object
	 * @param  {String} uri      URI to query
	 * @param  {String} type     Type of request
	 * @param  {Object} deferred Promise to reconcile with the response
	 * @return {Undefined}       undefined
	 * @private
	 */
	response : function (xhr, uri, type, deferred) {
		var typed    = type.toLowerCase().capitalize(),
		    l        = location,
		    xhrState = null,
		    xdr      = client.ie && xhr.readyState === undefined,
		    exception, o, r, t, x;

		// server-side exception handling
		exception = function (e, xhr) {
			deferred.reject(e);
			error(e, arguments, this, true);
			uri.fire("failed" + typed, client.parse(xhr), xhr);
		};

		if (!xdr && xhr.readyState === 2) uri.fire("received" + typed, null, xhr);
		else if (!xdr && xhr.readyState === 4) {
			switch (xhr.status) {
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
				case 206:
				case 301:
					// Caching headers
					o = client.headers(xhr, uri, type);
					uri.fire("headers", o.headers, xhr);

					if (type === "head") {
						deferred.resolve(o.headers);
						return uri.fire("afterHead", o.headers);
					}
					else if (type === "options") {
						deferred.resolve(o.headers);
						return uri.fire("afterOptions", o.headers);
					}
					else if (type !== "delete" && /200|201/.test(xhr.status)) {
						t = o.headers["Content-Type"] || "";
						r = client.parse(xhr, t);
						if (r === undefined) throw Error(label.error.serverError);
						cache.set(uri, "response", (o.response = utility.clone(r)));
					}

					// Application state change triggered by hypermedia (HATEOAS)
					if (state.getHeader() !== null && Boolean(xhrState = o.headers[state.getHeader()]) && state.current !== xhrState) typeof state.change === "function" ? state.change(xhrState) : state.setCurrent(state);

					switch (xhr.status) {
						case 200:
						case 201:
							deferred.resolve(r);
							uri.fire("after" + typed, r, xhr);
							break;
						case 202:
						case 203:
						case 204:
						case 206:
							deferred.resolve(null);
							uri.fire("after" + typed, null, xhr);
							break;
						case 205:
							deferred.resolve(null);
							uri.fire("reset", null, xhr);
							break;
						case 301:
							deferred.resolve(r);
							uri.fire("moved", r, xhr);
							break;
					}
					break;
				case 401:
					exception(!server ? Error(label.error.serverUnauthorized) : label.error.serverUnauthorized, xhr);
					break;
				case 403:
					cache.set(uri, "!permission", client.bit([type]));
					exception(!server ? Error(label.error.serverForbidden) : label.error.serverForbidden, xhr);
					break;
				case 405:
					cache.set(uri, "!permission", client.bit([type]));
					exception(!server ? Error(label.error.serverInvalidMethod) : label.error.serverInvalidMethod, xhr);
					break
				default:
					exception(!server ? Error(label.error.serverError) : label.error.serverError, xhr);
			}
			xhr.onreadystatechange = null;
		}
		else if (xdr) {
			r = client.parse(xhr);
			cache.set(uri, "permission", client.bit(["get"]));
			cache.set(uri, "response", r);
			deferred.resolve(r);
			uri.fire("afterGet", r, xhr);
		}
	},


	/**
	 * Returns the visible area of the View
	 *
	 * @method size
	 * @return {Object} Describes the View {x: ?, y: ?}
	 */
	size : function () {
		var view = !server ? (document.documentElement !== undefined ? document.documentElement : document.body) : {clientHeight: 0, clientWidth: 0};

		return {height: view.clientHeight, width: view.clientWidth};
	}
};
