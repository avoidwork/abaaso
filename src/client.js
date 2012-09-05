/**
 * Client properties and methods
 *
 * @class client
 * @namespace abaaso
 */
var client = {
	android : (function () { return !server && /android/i.test(navigator.userAgent); })(),
	blackberry : (function () { return !server && /blackberry/i.test(navigator.userAgent); })(),
	chrome  : (function () { return !server && /chrome/i.test(navigator.userAgent); })(),
	firefox : (function () { return !server && /firefox/i.test(navigator.userAgent); })(),
	ie      : (function () { return !server && /msie/i.test(navigator.userAgent); })(),
	ios     : (function () { return !server && /ipad|iphone/i.test(navigator.userAgent); })(),
	linux   : (function () { return !server && /linux|bsd|unix/i.test(navigator.userAgent); })(),
	mobile  : (function () { abaaso.client.mobile = this.mobile = !server && (/blackberry|iphone|webos/i.test(navigator.userAgent) || (/android/i.test(navigator.userAgent) && (abaaso.client.size.height < 720 || abaaso.client.size.width < 720))); }),
	playbook: (function () { return !server && /playbook/i.test(navigator.userAgent); })(),
	opera   : (function () { return !server && /opera/i.test(navigator.userAgent); })(),
	osx     : (function () { return !server && /macintosh/i.test(navigator.userAgent); })(),
	safari  : (function () { return !server && /safari/i.test(navigator.userAgent.replace(/chrome.*/i, "")); })(),
	tablet  : (function () { abaaso.client.tablet = this.tablet = !server && (/ipad|playbook|webos/i.test(navigator.userAgent) || (/android/i.test(navigator.userAgent) && (abaaso.client.size.width >= 720 || abaaso.client.size.width >= 720))); }),
	webos   : (function () { return !server && /webos/i.test(navigator.userAgent); })(),
	windows : (function () { return !server && /windows/i.test(navigator.userAgent); })(),
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
				version = (typeof navigator !== "undefined") ? navigator.appVersion : 0;
		}
		version = !isNaN(parseInt(version)) ? parseInt(version) : 0;
		abaaso.client.version = this.version = version;
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

		command = command.toLowerCase();
		var result;

		switch (true) {
			case command === "delete":
				result = !((client.permissions(uri, command).bit & 1) === 0);
				break;
			case command === "get":
				result = !((client.permissions(uri, command).bit & 4) === 0);
				break;
			case (/post|put/.test(command)):
				result = !((client.permissions(uri, command).bit & 2) === 0);
				break;
			default:
				result = false;
		}
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

		args.each(function (a) {
			switch (a.toLowerCase()) {
				case "get":
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
		var headers = String(xhr.getAllResponseHeaders()).split("\n"),
		    items   = {},
		    o       = {},
		    allow   = null,
		    expires = new Date(),
		    cors    = client.cors(uri),
		    header, value;

		headers.each(function (h) {
			if (!h.isEmpty()) {
				header        = h.toString();
				value         = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");
				header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
				header        = (function () { var x = []; header.explode("-").each(function (i) { x.push(i.capitalize()) }); return x.join("-"); })();
				items[header] = value;
				if (allow === null) {
					if (cors && /^access-control-allow-methods$/i.test(header)) allow = value;
					else if (/^allow$/i.test(header)) allow = value;
				}
			}
		});

		switch (true) {
			case typeof items["Cache-Control"] !== "undefined" && /no/.test(items["Cache-Control"]):
			case typeof items["Pragma"] !== "undefined" && /no/.test(items["Pragma"]):
				break;
			case typeof items["Cache-Control"] !== "undefined" && /\d/.test(items["Cache-Control"]):
				expires = expires.setSeconds(expires.getSeconds() + parseInt(/\d{1,}/.exec(items["Cache-Control"])[0]));
				break;
			case typeof items["Expires"] !== "undefined":
				expires = new Date(items["Expires"]);
				break;
			default:
				expires = expires.setSeconds(expires.getSeconds() + $.expires);
		}

		o.expires    = expires;
		o.headers    = items;
		o.permission = client.bit(allow !== null ? allow.explode() : [type]);

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
			case (/json|plain|javascript/.test(type) || type.isEmpty()) && Boolean(obj = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText), true)):
				result = obj;
				break;
			case (/xml/.test(type) && String(xhr.responseText).isEmpty() && xhr.responseXML !== null):
				result = xml.decode(typeof xhr.responseXML.xml !== "undefined" ? xhr.responseXML.xml : xhr.responseXML);
				break;
			case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
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
	 * @return {String}           URI to query
	 */
	jsonp : function (uri, success, failure, args) {
		var curi = uri,
		    guid = utility.guid(true),
		    callback, cbid, s;

		// Utilizing the sugar if namespace is not global
		if (typeof external === "undefined") {
			if (typeof global.abaaso === "undefined") utility.define("abaaso.callback", {}, global);
			external = "abaaso";
		}

		switch (true) {
			case typeof args === "undefined":
			case args === null:
			case args instanceof Object && (args.callback === null || typeof args.callback === "undefined"):
			case typeof args === "string" && args.isEmpty():
				callback = "callback";
				break;
			case args instanceof Object && typeof args.callback !== "undefined":
				callback = args.callback;
				break;
			default:
				callback = "callback";
		}

		curi = curi.replace(callback + "=?", "");

		curi.once("afterJSONP", function (arg) {
			this.un("failedJSONP", guid);
			if (typeof success === "function") success(arg);
		}, guid).once("failedJSONP", function () {
			this.un("failedJSONP", guid);
			if (typeof failure === "function") failure();
		}, guid);

		do cbid = utility.genId().slice(0, 10);
		while (typeof global.abaaso.callback[cbid] !== "undefined");

		uri = uri.replace(callback + "=?", callback + "=" + external + ".callback." + cbid);

		global.abaaso.callback[cbid] = function (arg) {
			s.destroy();
			clearTimeout(utility.timer[cbid]);
			delete utility.timer[cbid];
			delete global.abaaso.callback[cbid];
			curi.fire("afterJSONP", arg);
		};

		s = $("head")[0].create("script", {src: uri, type: "text/javascript"});
		utility.defer(function () { curi.fire("failedJSONP"); }, 30000, cbid);
		return uri;
	},

	/**
	 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
	 *
	 * Events: beforeXHR             Fires before the XmlHttpRequest is made
	 *         before[type]          Fires before the XmlHttpRequest is made, type specific
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
	 * @param  {Mixed}    args    Data to send with the request
	 * @param  {Object}   headers Custom request headers (can be used to set withCredentials)
	 * @return {String}           URI to query
	 * @private
	 */
	request : function (uri, type, success, failure, args, headers) {
		var cors, xhr, payload, cached, typed, guid, contentType, doc, ab, blob;

		if (/post|put/i.test(type) && typeof args === "undefined") throw Error(label.error.invalidArguments);

		type         = type.toLowerCase();
		headers      = headers instanceof Object ? headers : null;
		cors         = client.cors(uri);
		xhr          = (client.ie && client.version < 10 && cors) ? new XDomainRequest() : new XMLHttpRequest();
		payload      = /post|put/i.test(type) && typeof args !== "undefined" ? args : null;
		cached       = type === "get" ? cache.get(uri) : false;
		typed        = type.capitalize();
		guid         = utility.guid(true);
		contentType  = null;
		doc          = (typeof Document !== "undefined");
		ab           = (typeof ArrayBuffer !== "undefined");
		blob         = (typeof Blob !== "undefined");

		if (type === "delete") uri.once("afterDelete", function () { cache.expire(this); });

		uri.once("after" + typed, function (arg) {
			uri.un("failed" + typed, guid);
			if (typeof success === "function") success(arg);
		}, guid).once("failed" + typed, function (arg) {
			uri.un("after" + typed, guid);
			if (typeof failure === "function") failure(arg);
		}, guid).fire("before" + typed);

		if (type !== "head" && uri.allows(type) === false) return uri.fire("failed" + typed);

		if (type === "get" && Boolean(cached)) uri.fire("afterGet", cached.response);
		else {
			xhr[xhr instanceof XMLHttpRequest ? "onreadystatechange" : "onload"] = function () { client.response(xhr, uri, type); };

			// Setting events
			if (typeof xhr.ontimeout  !== "undefined") xhr.ontimeout  = function (e) { uri.fire("timeout" + typed, e); };
			if (typeof xhr.onprogress !== "undefined") xhr.onprogress = function (e) { uri.fire("progress" + typed, e); };
			if (typeof xhr.upload     !== "undefined" && typeof xhr.upload.onprogress !== "undefined") xhr.upload.onprogress = function (e) { uri.fire("progressUpload" + typed, e); };

			try {
				xhr.open(type.toUpperCase(), uri, true);

				// Setting Content-Type value
				if (headers !== null && headers.hasOwnProperty("Content-Type")) contentType = headers["Content-Type"];
				if (cors && contentType === null) contentType = "text/plain";

				// Transforming payload
				if (payload !== null) {
					if (payload.hasOwnProperty("xml")) payload = payload.xml;
					if (doc && payload instanceof Document) payload = xml.decode(payload);
					if (typeof payload === "string" && /<[^>]+>[^<]*]+>/.test(payload)) contentType = "application/xml";
					if (!(ab && payload instanceof ArrayBuffer) && !(blob && payload instanceof Blob) && payload instanceof Object) {
						contentType = "application/json";
						payload = json.encode(payload);
					}
					if (contentType === null && ((ab && payload instanceof ArrayBuffer) || (blob && payload instanceof Blob))) contentType = "application/octet-stream";
					if (contentType === null) contentType = "application/x-www-form-urlencoded; charset=UTF-8";
				}

				// Setting headers
				if (typeof xhr.setRequestHeader !== "undefined") {
					if (typeof cached === "object" && cached.headers.hasOwnProperty("ETag")) xhr.setRequestHeader("ETag", cached.headers.ETag);
					if (headers === null) headers = {};
					if (contentType !== null) headers["Content-Type"] = contentType;
					if (headers.hasOwnProperty("callback")) delete headers.callback;
					utility.iterate(headers, function (v, k) { if (v !== null && k !== "withCredentials") xhr.setRequestHeader(k, v); });
				}

				// Cross Origin Resource Sharing (CORS)
				if (typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean") xhr.withCredentials = headers.withCredentials;

				// Firing event & sending request
				uri.fire("beforeXHR", {xhr: xhr, uri: uri});
				payload !== null ? xhr.send(payload) : xhr.send();
			}
			catch (e) {
				error(e, arguments, this, true);
				uri.fire("failed" + typed, {response: client.parse(xhr), xhr: xhr});
			}
		}
		return uri;
	},

	/**
	 * Caches the URI headers & response if received, and fires the relevant events
	 *
	 * If abaaso.state.header is set, an application state change is possible
	 *
	 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
	 * resource
	 *
	 * Events: afterXHR     Fires after the XmlHttpRequest response is received
	 *         after[type]  Fires after the XmlHttpRequest response is received, type specific
	 *         reset        Fires if a 206 response is received
	 *         moved        Fires if a 301 response is received
	 *         failure      Fires if an exception is thrown
	 *         headers      Fires after a possible state change, with the headers from the response
	 *
	 * @method response
	 * @param  {Object} xhr  XMLHttpRequest Object
	 * @param  {String} uri  URI to query
	 * @param  {String} type Type of request
	 * @return {String} uri  URI to query
	 * @private
	 */
	response : function (xhr, uri, type) {
		var typed = type.toLowerCase().capitalize(),
		    l     = location,
		    state = null,
		    s, o, cors, r, t;

		switch (true) {
			case xhr.readyState === 2:
				uri.fire("received" + typed);
				break;
			case xhr.readyState === 4:
				uri.fire("afterXHR", {xhr: xhr, uri: uri});
				try {
					switch (xhr.status) {
						case 200:
						case 201:
						case 202:
						case 203:
						case 204:
						case 205:
						case 206:
						case 301:
							s    = abaaso.state;
							o    = client.headers(xhr, uri, type);
							cors = client.cors(uri);

							switch (true) {
								case type === "head":
									return uri.fire("afterHead", o.headers);
								case type !== "delete" && /200|201/.test(xhr.status):
									t = typeof o.headers["Content-Type"] !== "undefined" ? o.headers["Content-Type"] : "";
									r = client.parse(xhr, t);
									if (typeof r === "undefined") throw Error(label.error.serverError);
									cache.set(uri, "response", (o.response = utility.clone(r)));
									break;
							}

							// Application state change triggered by hypermedia (HATEOAS)
							if (s.header !== null && Boolean(state = o.headers[s.header]) && s.current !== state) typeof s.change === "function" ? s.change(state) : s.current = state;

							uri.fire("headers", o.headers);

							switch (xhr.status) {
								case 200:
								case 201:
									uri.fire("after" + typed, r);
									break;
								case 202:
								case 203:
								case 204:
								case 206:
									uri.fire("after" + typed);
									break;
								case 205:
									uri.fire("reset");
									break;
								case 301:
									uri.fire("moved", r);
									break;
							}
							break;
						case 401:
							throw Error(label.error.serverUnauthorized);
							break;
						case 403:
							cache.set(uri, "!permission", client.bit([type]));
							throw Error(label.error.serverForbidden);
							break;
						case 405:
							cache.set(uri, "!permission", client.bit([type]));
							throw Error(label.error.serverInvalidMethod);
							break
						case 0:
						default:
							throw Error(label.error.serverError);
					}
				}
				catch (e) {
					error(e, arguments, this, true);
					uri.fire("failed" + typed, {response: client.parse(xhr), xhr: xhr});
				}
				break;
			case client.ie && client.cors(uri): // XDomainRequest
				var r, x;

				switch (true) {
					case Boolean(x = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText))):
						r = x;
						break;
					case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
						r = xml.decode(xhr.responseText);
						break;
					default:
						r = xhr.responseText;
				}

				cache.set(uri, "permission", client.bit(["get"]));
				cache.set(uri, "response", r);
				uri.fire("afterGet", r);
				break;
		}
		return uri;
	},


	/**
	 * Returns the visible area of the View
	 *
	 * @method size
	 * @return {Object} Describes the View {x: ?, y: ?}
	 */
	size : function () {
		var view = !server ? (typeof document.documentElement !== "undefined" ? document.documentElement : document.body) : {clientHeight: 0, clientWidth: 0};

		return {height: view.clientHeight, width: view.clientWidth};
	}
};
