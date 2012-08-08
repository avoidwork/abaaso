/**
 * abaaso
 *
 * Events: init           Fires when abaaso is ready; register modules on this event
 *         ready          Fires when the DOM is available
 *         render         Fires when the window resources have loaded
 *         resize         Fires when the window resizes; parameter for listeners is abaaso.client.size
 *         afterCreate    Fires after an Element is created; parameter for listeners is the (new) Element
 *         afterDestroy   Fires after an Element is destroyed; parameter for listeners is the (removed) Element.id value
 *         beforeCreate   Fires when an Element is about to be created; parameter for listeners is the (new) Element.id value
 *         beforeDestroy  Fires when an Element is about to be destroyed; parameter for listeners is the (to be removed) Element
 *         error          Fires when an Error is caught; parameter for listeners is the logged Object (abaaso.error.log[n])
 *         beforeHash     Fires before the hash event; parameter for listeners is the hash value
 *         hash           Fires when window.location.hash changes; parameter for listeners is the hash value
 *         afterHash      Fires after the hash event; parameter for listeners is the hash value
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @license BSD-3 http://opensource.org/licenses/BSD-3-Clause
 * @module abaaso
 * @version 2.8.0
 */
(function (global) {
"use strict";

var document  = global.document,
    location  = global.location,
    navigator = global.navigator,
    server    = typeof navigator === "undefined",
    $, abaaso, external;

abaaso = global.abaaso || (function () {
	var bootstrap, array, cache, client, cookie, data, element, json, label,
	    message, mouse, number, observer, route, string, utility, validate, xml,
	    error;

	/**
	 * Array methods
	 *
	 * @class array
	 * @namespace abaaso
	 */
	array = {
		/**
		 * Adds 'arg' to 'obj' if it is not found
		 * 
		 * @method add
		 * @param  {Array} obj Array to receive 'arg'
		 * @param  {Mixed} arg Argument to set in 'obj'
		 * @return {Array}     Array that was queried
		 */
		add : function (obj, arg) {
			if (!array.contains(obj, arg)) obj.push(arg);
			return obj;
		},

		/**
		 * Returns an Object (NodeList, etc.) as an Array
		 *
		 * @method cast
		 * @param  {Object}  obj Object to cast
		 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
		 * @return {Array}       Object as an Array
		 */
		cast : function (obj, key) {
			key   = (key === true);
			var o = [], i, nth;

			switch (true) {
				case !isNaN(obj.length):
					(!client.ie || client.version > 8) ? o = Array.prototype.slice.call(obj) : utility.iterate(obj, function (i, idx) { if (idx !== "length") o.push(i); });
					break;
				default:
					key ? o = array.keys(obj) : utility.iterate(obj, function (i) { o.push(i); });
			}
			return o;
		},

		/**
		 * Clones an Array
		 * 
		 * @method clone
		 * @param  {Array} obj Array to clone
		 * @return {Array}     Clone of Array
		 */
		clone : function (obj) {
			return utility.clone(obj);
		},

		/**
		 * Determines if obj contains arg
		 * 
		 * @method contains
		 * @param  {Array} obj Array to search
		 * @param  {Mixed} arg Value to look for
		 * @return {Boolean}   True if found, false if not
		 */
		contains : function (obj, arg) {
			return (array.index(obj, arg) > -1);
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @method diff
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array}        Array of the differences
		 */
		diff : function (array1, array2) {
			var result = [];

			array1.each(function (i) { if (!array2.contains(i)) result.add(i); });
			array2.each(function (i) { if (!array1.contains(i)) result.add(i); });
			return result;
		},

		/**
		 * Iterates obj and executes fn
		 * Parameters for fn are 'value', 'key'
		 * 
		 * @param  {Array}    obj Array to iterate
		 * @param  {Function} fn  Function to execute on index values
		 * @return {Array}        Array
		 */
		each : function (obj, fn) {
			var nth = obj.length,
			    i, r;

			for (i = 0; i < nth; i++) {
				r = fn.call(obj, obj[i], i);
				if (r === false) break;
			}
			return obj;
		},

		/**
		 * Returns the first Array node
		 *
		 * @method first
		 * @param  {Array} obj The array
		 * @return {Mixed}     The first node of the array
		 */
		first : function (obj) {
			return obj[0];
		},

		/**
		 * Facade to indexOf for shorter syntax
		 *
		 * @method index
		 * @param  {Array} obj Array to search
		 * @param  {Mixed} arg Value to find index of
		 * @return {Number}    The position of arg in instance
		 */
		index : function (obj, arg) {
			return obj.indexOf(arg);
		},

		/**
		 * Returns an Associative Array as an Indexed Array
		 *
		 * @method indexed
		 * @param  {Array} obj Array to index
		 * @return {Array}     Indexed Array
		 */
		indexed : function (obj) {
			var indexed = [];

			utility.iterate(obj, function (v, k) { typeof v === "object" ? indexed = indexed.concat(array.indexed(v)) : indexed.push(v); });
			return indexed;
		},

		/**
		 * Finds the intersections between array1 and array2
		 *
		 * @method intersect
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array}        Array of the intersections
		 */
		intersect : function (array1, array2) {
			var a = array1.length > array2.length ? array1 : array2,
			    b = a === array1 ? array2 : array1;

			return a.filter(function (key) { return array.contains(b, key); });
		},

		/**
		 * Returns the keys in an Associative Array
		 *
		 * @method keys
		 * @param  {Array} obj Array to extract keys from
		 * @return {Array}     Array of the keys
		 */
		keys : function (obj) {
			var keys = [];

			typeof Object.keys === "function" ? keys = Object.keys(obj) : utility.iterate(obj, function (v, k) { keys.push(k); });
			return keys;
		},

		/**
		 * Returns the last index of the Array
		 *
		 * @method last
		 * @param  {Array} obj Array
		 * @return {Mixed}     Last index of Array
		 */
		last : function (obj) {
			return obj[obj.length - 1];
		},

		/**
		 * Returns a range of indices from the Array
		 * 
		 * @param  {Array}  obj   Array to iterate
		 * @param  {Number} start Starting index
		 * @param  {Number} end   Ending index
		 * @return {Array}        Array of indices
		 */
		range : function (obj, start, end) {
			var result = [],
			    i;

			for (i = start; i <= end; i++) if (typeof obj[i] !== "undefined") result.push(obj[i]);
			return result;
		},

		/**
		 * Removes indices from an Array without recreating it
		 *
		 * @method remove
		 * @param  {Array}  obj   Array to remove from
		 * @param  {Number} start Starting index
		 * @param  {Number} end   [Optional] Ending index
		 * @return {Array}        Modified Array
		 */
		remove : function (obj, start, end) {
			if (typeof start === "string") {
				start = obj.index(start);
				if (start === -1) return obj;
			}
			else start = start || 0;

			var length    = obj.length,
			    remaining = obj.slice((end || start) + 1 || length);

			obj.length = start < 0 ? (length + start) : start;
			obj.push.apply(obj, remaining);
			return obj;
		},

		/**
		 * Sorts the Array by parsing values
		 * 
		 * @param  {Mixed} a Argument to compare
		 * @param  {Mixed} b Argument to compare
		 * @return {Boolean} Boolean indicating sort order
		 */
		sort : function (a, b) {
			var nums = false,
			    result;

			if (!isNaN(a) && !isNaN(b)) nums = true;

			a = nums ? number.parse(a) : String(a);
			b = nums ? number.parse(b) : String(b);

			switch (true) {
				case a < b:
					result = -1;
					break;
				case a > b:
					result = 1;
					break;
				default:
					result = 0;
			}
			return result;
		},

		/**
		 * Gets the total keys in an Array
		 *
		 * @method total
		 * @param  {Array} obj Array to find the length of
		 * @return {Number}    Number of keys in Array
		 */
		total : function (obj) {
			return array.indexed(obj).length;
		},

		/**
		 * Casts an Array to Object
		 * 
		 * @param  {Array} ar Array to transform
		 * @return {Object}   New object
		 */
		toObject : function (ar) {
			var obj = {},
			    i   = ar.length;

			while (i--) obj[i.toString()] = ar[i];
			return obj;
		}
	};

	/**
	 * Cache for RESTful behavior
	 *
	 * @class cache
	 * @namespace abaaso
	 * @private
	 */
	cache = {
		// Collection URIs
		items : {},

		/**
		 * Garbage collector for the cached items
		 *
		 * @method clean
		 * @return {Undefined} undefined
		 */
		clean : function () {
			return utility.iterate(cache.items, function (v, k) { if (cache.expired(k)) cache.expire(k); });
		},

		/**
		 * Expires a URI from the local cache
		 * 
		 * Events: expire    Fires when the URI expires
		 *
		 * @method expire
		 * @param  {String}  uri    URI of the local representation
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Undefined}      undefined
		 */
		expire : function (uri, silent) {
			silent = (silent === true);
			if (typeof cache.items[uri] !== "undefined") {
				delete cache.items[uri];
				if (!silent) uri.fire("beforeExpire, expire, afterExpire");
				return true;
			}
			else return false;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @method expired
		 * @param  {Object} uri Cached URI object
		 * @return {Boolean}    True if the URI has expired
		 */
		expired : function (uri) {
			var item = cache.items[uri];
			return typeof item !== "undefined" && typeof item.expires !== "undefined" && item.expires < new Date();
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @method get
		 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
		 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Mixed}          URI Object {headers, response} or False
		 */
		get : function (uri, expire) {
			expire = (expire !== false);
			if (typeof cache.items[uri] === "undefined") return false;
			if (expire && cache.expired(uri)) {
				cache.expire(uri);
				return false;
			}
			return utility.clone(cache.items[uri]);
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @method set
		 * @param  {String} uri      URI to set or update
		 * @param  {String} property Property of the cached URI to set
		 * @param  {Mixed} value     Value to set
		 * @return {Mixed}           URI Object {headers, response} or undefined
		 */
		set : function (uri, property, value) {
			if (typeof cache.items[uri] === "undefined") {
				cache.items[uri] = {};
				cache.items[uri].permission = 0;
			}
			property === "permission" ? cache.items[uri].permission |= value
			                          : (property === "!permission" ? cache.items[uri].permission &= ~value
			                                                        : cache.items[uri][property]   =  value);
			return cache.items[uri];
		}
	};

	/**
	 * Client properties and methods
	 *
	 * @class client
	 * @namespace abaaso
	 */
	client = {
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
			    header, value;

			headers.each(function (h) {
				if (!h.isEmpty()) {
					header        = h.toString();
					value         = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");
					header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
					header        = (function () { var x = []; header.explode("-").each(function (i) { x.push(i.capitalize()) }); return x.join("-"); })();
					items[header] = value;
					if (/allow|access-control-allow-methods/i.test(header)) allow = value;
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
		 *         timeout[type]         Fires 30s after XmlHttpRequest is made
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

			type    = type.toLowerCase();
			headers = headers instanceof Object ? headers : null;

			// Catching Errors from incomplete node environments
			try {
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
			}
			catch (e) {
				error(e, arguments, this, true);
				if (typeof failure === "function") failure(e);
				return uri;
			}

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
		 *         success      Fires if a 400 response is received
		 *         failure      Fires if an exception is thrown
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

	/**
	 * Cookie methods
	 *
	 * @class cookie
	 * @namespace abaaso
	 */
	cookie = {
		/**
		 * Expires a cookie if it exists
		 *
		 * @method expire
		 * @param  {String} name   Name of the cookie to expire
		 * @param  {String} domain [Optional] Domain to set the cookie for
		 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
		 * @return {String}        Name of the expired cookie
		 */
		expire : function (name, domain, secure) {
			if (typeof cookie.get(name) !== "undefined") cookie.set(name, "", "-1s", domain, secure);
			return name;
		},

		/**
		 * Gets a cookie
		 *
		 * @method get
		 * @param  {String} name Name of the cookie to get
		 * @return {Mixed}       Cookie or undefined
		 */
		get : function (name) {
			return cookie.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @method list
		 * @return {Object} Collection of cookies
		 */
		list : function () {
			var result = {},
			    item, items;

			if (typeof document.cookie !== "undefined" && !document.cookie.isEmpty()) {
				items = document.cookie.explode(";");
				items.each(function (i) {
					item = i.explode("=");
					result[decodeURIComponent(item[0].toString().trim())] = decodeURIComponent(item[1].toString().trim());
				});
			}
			return result;
		},

		/**
		 * Creates a cookie
		 *
		 * The offset specifies a positive or negative span of time as day, hour, minute or second
		 *
		 * @method set
		 * @param  {String} name   Name of the cookie to create
		 * @param  {String} value  Value to set
		 * @param  {String} offset A positive or negative integer followed by "d", "h", "m" or "s"
		 * @param  {String} domain [Optional] Domain to set the cookie for
		 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
		 * @return {Object}        The new cookie
		 */
		set : function (name, value, offset, domain, secure) {
			if (typeof value === "undefined") value = "";
			value     += ";";
			if (typeof offset === "undefined") offset = "";
			domain     = (typeof domain === "string") ? (" domain=" + domain + ";") : "";
			secure     = (secure === true) ? "; secure" : "";
			var expire = "",
			    span   = null,
			    type   = null,
			    types  = ["d", "h", "m", "s"],
			    regex  = new RegExp(),
			    i      = types.length;

			if (!offset.isEmpty()) {
				while (i--) {
					utility.compile(regex, types[i]);
					if (regex.test(offset)) {
						type = types[i];
						span = parseInt(offset);
						break;
					}
				}

				if (isNaN(span)) throw Error(label.error.invalidArguments);

				expire = new Date();
				switch (type) {
					case "d":
						expire.setDate(expire.getDate() + span);
						break;
					case "h":
						expire.setHours(expire.getHours() + span);
						break;
					case "m":
						expire.setMinutes(expire.getMinutes() + span);
						break;
					case "s":
						expire.setSeconds(expire.getSeconds() + span);
						break;
				}
			}
			if (expire instanceof Date) expire = " expires=" + expire.toUTCString() + ";";
			document.cookie = (name.toString().trim() + "=" + value + expire + domain + " path=/" + secure);
			return cookie.get(name);
		}
	};

	/**
	 * Template data store, use $.store(obj), abaaso.store(obj) or abaaso.data.register(obj)
	 * to register it with an Object
	 *
	 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
	 *
	 * Do not use this directly!
	 *
	 * @class data
	 * @namespace abaaso
	 */
	data = {
		// Inherited by data stores
		methods : {
			/**
			 * Batch sets or deletes data in the store
			 *
			 * Events: beforeDataBatch  Fires before the batch is queued
			 *         afterDataBatch   Fires after the batch is queued
			 *         failedDataBatch  Fires when an exception occurs
			 *
			 * @method batch
			 * @param  {String}  type Type of action to perform
			 * @param  {Mixed}   data Array of keys or indices to delete, or Object containing multiple records to set
			 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
			 * @return {Object}       Data store
			 */
			batch : function (type, data, sync) {
				type = type.toString().toLowerCase();
				sync = (sync === true);

				if (!/^(set|del)$/.test(type) || typeof data !== "object") throw Error(label.error.invalidArguments);

				var obj  = this.parentNode,
				    self = this,
				    r    = 0,
				    nth  = 0,
				    f    = false,
				    guid = utility.genId(true),
				    completed, failure, key, set, success;

				completed = function () {
					if (type === "del") self.reindex();
					self.loaded = true;
					obj.fire("afterDataBatch");
				};

				failure = function (arg) {
					obj.fire("failedDataSet, failedDataBatch", arg);
				};

				set = function (data, key) {
					var guid = utility.genId(),
					    rec  = {};

					if (typeof rec.batch !== "function") rec = utility.clone(data);
					else $.iterate(data, function (v, k) { if (!self.collections.contains(k)) rec[k] = utility.clone(v); });

					if (self.key !== null && typeof rec[self.key] !== "undefined") {
						key = rec[self.key];
						delete rec[self.key];
					}

					obj.once("afterDataSet", function () {
						this.un("failedDataSet", guid);
						if (++r && r === nth) completed();
					}, guid).once("failedDataSet", function () {
						this.un("afterDataSet", guid)
						if (!f) {
							f = true;
							this.fire("failedDataBatch");
						}
					}, guid);

					self.set(key, rec, sync);
				};

				obj.fire("beforeDataBatch", data);

				if (type === "del") {
					obj.on("afterDataDelete", function () {
						if (r++ && r === nth) {
							obj.un("afterDataDelete, failedDataDelete", guid);
							completed();
						}
					}, guid).once("failedDataDelete", function () {
						obj.un("afterDataDelete", guid);
						if (!f) {
							f = true;
							obj.fire("failedDataBatch");
						}
					}, guid);
				}

				if (data instanceof Array) {
					nth = data.length;
					switch (nth) {
						case 0:
							completed();
							break;
						default:
							data.each(function (i, idx) {
								idx = idx.toString();
								if (type === "set") switch (true) {
									case typeof i === "object":
										set(i, idx);
										break;
									case i.indexOf("//") === -1:
										i = self.uri + i;
									default:
										i.get(function (arg) { set(self.source === null ? arg : utility.walk(arg, self.source), idx); }, failure, utility.merge({withCredentials: self.credentials}, self.headers));
										break;
								}
								else self.del(i, false, sync);
							});
					}
				}
				else {
					nth = array.cast(data, true).length;
					utility.iterate(data, function (v, k) {
						if (type === "set") {
							if (self.key !== null && typeof v[self.key] !== "undefined") {
								key = v[self.key];
								delete v[self.key];
							}
							else key = k.toString();
							self.set(key, v, sync);
						}
						else self.del(v, false, sync);
					});
				}

				return this;
			},

			/**
			 * Clears the data object, unsets the uri property
			 *
			 * Events: beforeDataClear  Fires before the data is cleared
			 *         afterDataClear   Fires after the data is cleared
			 *
			 * @method clear
			 * @param {Boolean} sync [Optional] Boolean to limit clearing of properties
			 * @return {Object}      Data store
			 */
			clear : function (sync) {
				sync    = (sync === true);
				var obj = this.parentNode;

				if (!sync) {
					obj.fire("beforeDataClear");
					this.callback    = null;
					this.collections = [];
					this.crawled     = false;
					this.credentials = null;
					this.expires     = null;
					this._expires    = null;
					this.headers     = {Accept: "application/json"};
					this.ignore      = [];
					this.key         = null;
					this.keys        = {};
					this.loaded      = false;
					this.pointer     = null;
					this.records     = [];
					this.recursive   = false;
					this.retrieve    = false;
					this.source      = null;
					this.total       = 0;
					this.views       = {};
					this.uri         = null;
					this._uri        = null;
					obj.fire("afterDataClear");
				}
				else {
					this.collections = [];
					this.crawled     = false;
					this.keys        = {};
					this.loaded      = false;
					this.records     = [];
					this.total       = 0;
					this.views       = {};
				}
				return this;
			},

			/**
			 * Crawls a record's properties and creates data stores when URIs are detected
			 *
			 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
			 * 
			 * @method crawl
			 * @param  {Mixed}  arg    Record key or index
			 * @param  {String} ignore [Optional] Comma delimited fields to ignore
			 * @param  {String} key    [Optional] data.key property to set on new stores, defaults to record.key
			 * @return {Object}        Record
			 */
			crawl : function (arg, ignore, key) {
				var ignored = false,
				    self    = this,
				    record;

				if (typeof arg !== "number" && typeof arg !== "string") throw Error(label.error.invalidArguments);

				this.crawled = true;
				this.loaded  = false;
				record       = this.get(arg);
				record       = this.records[this.keys[record.key].index];
				key          = key || this.key;

				if (typeof ignore === "string") {
					ignored = true;
					ignore  = ignore.explode();
				}

				utility.iterate(record.data, function (v, k) {
					if (typeof v !== "string" || (ignored && ignore.contains(k))) return;
					if (v.indexOf("//") >= 0) {
						if (!self.collections.contains(k)) self.collections.push(k);
						record.data[k] = data.register({id: record.key + "-" + k});
						record.data[k].once("afterDataSync", function () { this.fire("afterDataRetrieve"); }, "dataRetrieve");
						record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
						ignore.each(function (i) { record.data[k].data.ignore.add(i); });
						record.data[k].data.key     = key;
						record.data[k].data.pointer = self.pointer;
						record.data[k].data.source  = self.source;
						if (self.recursive && self.retrieve) {
							record.data[k].data.recursive = true;
							record.data[k].data.retrieve  = true;
						}
						typeof record.data[k].data.setUri === "function" ? record.data[k].data.setUri(v) : record.data[k].data.uri = v;
					}
				});
				return this.get(arg);
			},

			/**
			 * Deletes a record based on key or index
			 *
			 * Events: beforeDataDelete  Fires before the record is deleted
			 *         afterDataDelete   Fires after the record is deleted
			 *         syncDataDelete    Fires when the local store is updated
			 *         failedDataDelete  Fires if the store is RESTful and the action is denied
			 *
			 * @method del
			 * @param  {Mixed}   record  Record key or index
			 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
			 * @param  {Boolean} sync    [Optional] True if called by data.sync
			 * @return {Object}          Data store
			 */
			del : function (record, reindex, sync) {
				if (typeof record === "undefined" || !/number|string/.test(typeof record)) throw Error(label.error.invalidArguments);

				reindex  = (reindex !== false);
				sync     = (sync === true);
				var obj  = this.parentNode,
				    r    = /true|undefined/,
				    key, args, uri, p;

				switch (typeof record) {
					case "string":
						key    = record;
						record = this.keys[key];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						record = record.index;
						break;
					default:
						key = this.records[record];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						key = key.key;
				}

				args   = {key: key, record: record, reindex: reindex};

				if (!sync && this.callback === null && this.uri !== null) {
					uri = this.uri + "/" + key;
					p   = uri.allows("delete");
				}

				obj.fire("beforeDataDelete", args);
				switch (true) {
					case sync:
					case this.callback !== null:
					case this.uri === null:
						obj.fire("syncDataDelete", args);
						break;
					case r.test(p):
						uri.del(function () { obj.fire("syncDataDelete", args); }, function () { obj.fire("failedDataDelete", args); }, utility.merge({withCredentials: this.credentials}, this.headers));
						break;
					default:
						obj.fire("failedDataDelete", args);
				}
				return this;
			},

			/**
			 * Finds needle in the haystack
			 *
			 * @method find
			 * @param  {Mixed}  needle    String, Number or Pattern to test for
			 * @param  {String} haystack  [Optional] Commma delimited string of the field(s) to search
			 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
			 * @return {Array}            Array of results
			 */
			find : function (needle, haystack, modifiers) {
				if (typeof needle === "undefined") throw Error(label.error.invalidArguments);

				needle     = typeof needle   === "string" ? needle.explode() : [needle];
				haystack   = typeof haystack === "string" ? haystack.explode() : null;

				var result = [],
				    obj    = this.parentNode,
				    keys   = [],
				    regex  = new RegExp();

				if (this.total === 0) return result;

				switch (true) {
					case typeof modifiers === "undefined":
					case String(modifiers).isEmpty():
						modifiers = "gi";
						break;
					case modifiers === null:
						modifiers = "";
						break;
				}

				// No haystack, testing everything
				if (haystack === null) {
					this.records.each(function (r) {
						utility.iterate(r.data, function (v, k) {
							if (keys.contains(r.key)) return false;
							if (typeof v.data === "object") return;

							needle.each(function (n) {
								utility.compile(regex, n, modifiers);
								if (regex.test(v)) {
									keys.push(r.key);
									result.add(r);
									return false;
								}
							});
						});
					});
				}
				// Looking through the haystack
				else this.records.each(function (r) {
					haystack.each(function (h) {
						if (keys.contains(r.key)) return false;
						if (typeof r.data[h] === "undefined" || typeof r.data[h].data === "object") return;

						needle.each(function (n) {
							utility.compile(regex, n, modifiers);
							if (regex.test(r.data[h])) {
								keys.push(r.key);
								result.add(r);
								return false;
							}
						});
					});
				});

				return result;
			},

			/**
			 * Generates a micro-format form from a record
			 * 
			 * If record is null, an empty form based on the first record is generated.
			 * The submit action is data.set() which triggers a POST or PUT
			 * from the data store.
			 * 
			 * @method form
			 * @param  {Mixed}   record null, record, key or index
			 * @param  {Object}  target Target HTML Element
			 * @param  {Boolean} test   [Optional] Test form before setting values
			 * @return {Object}         Generated HTML form
			 */
			form : function (record, target, test) {
				test      = (test !== false);
				var empty = (record === null),
				    self  = this,
				    entity, obj, handler, structure, key, data;

				switch (true) {
					case empty:
						record = this.get(0);
						break;
					case !(record instanceof Object):
						record = this.get(record);
						break;
				}

				switch (true) {
					case typeof record === "undefined":
						throw Error(label.error.invalidArguments);
					case this.uri !== null && !this.uri.allows("post"): // POST & PUT are interchangable for this bit
						throw Error(label.error.serverInvalidMethod);
				}

				key  = record.key;
				data = record.data;

				if (typeof target !== "undefined") target = utility.object(target);
				if (this.uri !== null) {
					entity = this.uri.replace(/.*\//, "").replace(/\?.*/, "")
					if (entity.isDomain()) entity = entity.replace(/\..*/g, "");
				}
				else entity = "record";

				/**
				 * Button handler
				 * 
				 * @method handler
				 * @param  {Object} event Window event
				 * @return {Undefined}    undefined
				 */
				handler = function (event) {
					var form    = event.srcElement.parentNode,
					    nodes   = $("#" + form.id + " input"),
					    entity  = nodes[0].name.match(/(.*)\[/)[1],
					    result  = true,
					    newData = {},
					    guid;

					self.parentNode.fire("beforeDataFormSubmit");

					if (test) result = form.validate();

					switch (result) {
						case false:
							self.parentNode.fire("failedDataFormSubmit");
							break;
						case true:
							nodes.each(function (i) {
								if (typeof i.type !== "undefined" && /button|submit|reset/.test(i.type)) return;
								utility.define(i.name.replace("[", ".").replace("]", ""), i.value, newData);
							});
							guid = utility.genId(true);
							self.parentNode.once("afterDataSet", function () { form.destroy(); });
							self.set(key, newData[entity]);
							break;
					}

					self.parentNode.fire("afterDataFormSubmit", key);
				};

				/**
				 * Data structure in micro-format
				 * 
				 * @method structure
				 * @param  {Object} record Data store record
				 * @param  {Object} obj    [description]
				 * @param  {String} name   [description]
				 * @return {Undefined}     undefined
				 */
				structure = function (record, obj, name) {
					var x, id;
					utility.iterate(record, function (v, k) {
						switch (true) {
							case v instanceof Array:
								x = 0;
								v.each(function (o) { structure(o, obj, name + "[" + k + "][" + (x++) + "]"); });
								break;
							case v instanceof Object:
								structure(v, obj, name + "[" + k + "]");
								break;
							default:
								id = (name + "[" + k + "]").replace(/\[|\]/g, "");
								obj.create("label", {"for": id}).html(k.capitalize());
								obj.create("input", {id: id, name: name + "[" + k + "]", type: "text", value: empty ? "" : v});
						}
					});
				};

				this.parentNode.fire("beforeDataForm");
				obj = element.create("form", {style: "display:none;"}, target);
				structure(data, obj, entity);
				obj.create("input", {type: "button", value: label.common.submit}).on("click", function(e) { handler(e); });
				obj.create("input", {type: "reset", value: label.common.reset});
				obj.css("display", "inherit");
				this.parentNode.fire("afterDataForm", obj);
				return obj;
			},

			/**
			 * Retrieves a record based on key or index
			 *
			 * If the key is an integer, cast to a string before sending as an argument!
			 *
			 * @method get
			 * @param  {Mixed}  record Key, index or Array of pagination start & end
			 * @param  {Number} end    [Optional] Ceiling for pagination
			 * @return {Mixed}         Individual record, or Array of records
			 */
			get : function (record, end) {
				var records = this.records,
				    obj     = this.parentNode,
				    r;

				switch (true) {
					case typeof record === "undefined":
					case String(record).length === 0:
						r = records;
						break;
					case typeof record === "string" && typeof this.keys[record] !== "undefined":
						r = records[this.keys[record].index];
						break;
					case typeof record === "number" && typeof end === "undefined":
						r = records[parseInt(record)];
						break;
					case typeof record === "number" && typeof end === "number":
						r = records.range(parseInt(record), parseInt(end));
						break;
					default:
						r = undefined;
				}

				return r;
			},

			/**
			 * Reindices the data store
			 *
			 * @method reindex
			 * @return {Object} Data store
			 */
			reindex : function () {
				var nth = this.total,
				    obj = this.parentNode,
				    key = (this.key !== null),
				    i;

				this.views = {};
				if (nth === 0) return this;
				for(i = 0; i < nth; i++) {
					if (!key && this.records[i].key.isNumber()) {
						delete this.keys[this.records[i].key];
						this.keys[i.toString()] = {};
						this.records[i].key = i.toString();
					}
					this.keys[this.records[i].key].index = i;
				}
				return this;
			},

			/**
			 * Creates or updates an existing record
			 *
			 * If a POST is issued, and the data.key property is not set the
			 * first property of the response object will be used as the key
			 *
			 * Events: beforeDataSet  Fires before the record is set
			 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
			 *         syncDataSet    Fires when the local store is updated
			 *         failedDataSet  Fires if the store is RESTful and the action is denied
			 *
			 * @method set
			 * @param  {Mixed}   key  Integer or String to use as a Primary Key
			 * @param  {Object}  data Key:Value pairs to set as field values
			 * @param  {Boolean} sync [Optional] True if called by data.sync
			 * @return {Object}       The data store
			 */
			set : function (key, data, sync) {
				if (key === null) key = undefined;
				sync = (sync === true);

				switch (true) {
					case (typeof key === "undefined" || String(key).isEmpty()) && this.uri === null:
					case typeof data === "undefined":
					case data instanceof Array:
					case data instanceof Number:
					case data instanceof String:
					case typeof data !== "object":
						throw Error(label.error.invalidArguments);
				}

				var record = typeof key === "undefined" ? undefined : this.get(key),
				    obj    = this.parentNode,
				    method = typeof key === "undefined" ? "post" : "put",
				    args   = {data: typeof record !== "undefined" ? utility.merge(record.data, data) : data, key: key, record: undefined},
				    uri    = this.uri,
				    r      = /true|undefined/,
				    p;

				if (typeof record !== "undefined") args.record = this.records[this.keys[record.key].index];

				this.collections.each(function (i) { if (typeof args.data[i] === "object") delete args.data[i]; });

				if (!sync && this.callback === null && uri !== null) {
					if (typeof record !== "undefined") uri += "/" + record.key;
					p = uri.allows(method);
				}

				obj.fire("beforeDataSet", {key: key, data: data});
				switch (true) {
					case sync:
					case this.callback !== null:
					case this.uri === null:
						obj.fire("syncDataSet", args);
						break;
					case r.test(p):
						uri[method](function (arg) { args["result"] = arg; obj.fire("syncDataSet", args); }, function (e) { obj.fire("failedDataSet"); }, data, utility.merge({withCredentials: this.credentials}, this.headers));
						break;
					default:
						obj.fire("failedDataSet", args);
				}
				return this;
			},

			/**
			 * Returns a view, or creates a view and returns it
			 *
			 * @method sort
			 * @param  {String} query       SQL (style) order by
			 * @param  {String} create      [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
			 * @param  {String} sensitivity [Optional] Sort sensitivity, defaults to "ci" (insensitive = "ci", sensitive = "cs", mixed = "ms")
			 * @return {Array}               View of data
			 */
			sort : function (query, create, sensitivity) {
				if (typeof query === "undefined" || String(query).isEmpty()) throw Error(label.error.invalidArguments);
				if (!/ci|cs|ms/.test(sensitivity)) sensitivity = "ci";

				create       = (create === true);
				var view     = (query.replace(/\s*asc/g, "").replace(/,/g, " ").toCamelCase()) + sensitivity.toUpperCase(),
				    queries  = query.explode(),
				    needle   = /:::(.*)$/,
				    asc      = /\s*asc$/i,
				    desc     = /\s*desc$/i,
				    nil      = /^null/,
				    key      = this.key,
				    result   = [],
				    bucket, sort, crawl;

				queries.each(function (query) { if (String(query).isEmpty()) throw Error(label.error.invalidArguments); });

				if (!create && this.views[view] instanceof Array) return this.views[view];
				if (this.total === 0) return [];

				crawl = function (q, data) {
					var queries = q.clone(),
					    query   = q.first(),
					    sorted  = {},
					    result  = [];

					queries.remove(0);
					sorted = bucket(query, data, desc.test(query));
					sorted.order.each(function (i) {
						if (sorted.registry[i].length < 2) return;
						if (queries.length > 0) sorted.registry[i] = crawl(queries, sorted.registry[i]);
					});
					sorted.order.each(function (i) { result = result.concat(sorted.registry[i]); });
					return result;
				}

				bucket = function (query, records, reverse) {
					query        = query.replace(asc, "");
					var prop     = query.replace(desc, ""),
					    pk       = (key === prop),
					    order    = [],
					    registry = {};

					records.each(function (r) {
						var val = pk ? r.key : r.data[prop],
						    k   = val === null ? "null" : String(val);

						switch (sensitivity) {
							case "ci":
								k = k.toCamelCase();
								break;
							case "cs":
								k = k.trim();
								break;
							case "ms":
								k = k.trim().slice(0, 1).toLowerCase();
								break;
						}

						if (!(registry[k] instanceof Array)) {
							registry[k] = [];
							order.push(k);
						}
						registry[k].push(r);
					});

					order.sort(array.sort);
					if (reverse) order.reverse();
					
					order.each(function (k) {
						if (registry[k].length === 1) return;
						registry[k] = sort(registry[k], query, prop, reverse, pk);
					});

					return {order: order, registry: registry};
				};

				sort = function (data, query, prop, reverse, pk) {
					var tmp    = [],
					    sorted = [];

					data.each(function (i, idx) {
						var v  = pk ? i.key : i.data[prop];

						v = String(v).trim() + ":::" + idx;
						tmp.push(v.replace(nil, "\"\""));
					});

					if (tmp.length > 1) {
						tmp.sort(array.sort);
						if (reverse) tmp.reverse();
					}

					tmp.each(function (v) { sorted.push(data[needle.exec(v)[1]]); });
					return sorted;
				};

				result           = crawl(queries, this.records);
				this.views[view] = result;
				return result;
			},

			/**
			 * Syncs the data store with a URI representation
			 *
			 * Events: beforeDataSync  Fires before syncing the data store
			 *         afterDataSync   Fires after syncing the data store
			 *         failedDataSync  Fires when an exception occurs
			 *
			 * @method sync
			 * @param {Boolean} reindex [Optional] True will reindex the data store
			 * @return {Object}         Data store
			 */
			sync : function (reindex) {
				if (this.uri === null || this.uri.isEmpty()) throw Error(label.error.invalidArguments);

				reindex  = (reindex === true);
				var self = this,
				    obj  = self.parentNode,
				    guid = utility.guid(true),
				    success, failure;

				success = function (arg) {
					try {
						if (typeof arg !== "object") throw Error(label.error.expectedObject);

						var data, found = false, guid = utility.genId(true);

						if (self.source !== null) arg = utility.walk(arg, self.source);

						if (arg instanceof Array) data = arg;
						else utility.iterate(arg, function (i) {
							if (!found && i instanceof Array) {
								found = true;
								data  = i;
							}
						});

						if (typeof data === "undefined") data = [arg];

						obj.once("afterDataBatch", function (arg) {
							if (reindex) self.reindex();
							this.un("failedDataBatch", guid).fire("afterDataSync", self.get());
						}, guid);

						obj.once("failedDataBatch", function (arg) {
							self.clear(true);
							this.un("afterDataBatch", guid).fire("failedDataSync");
						}, guid);

						self.batch("set", data, true);
					}
					catch (e) {
						error(e, arguments, this);
						obj.fire("failedDataSync", arg);
					}
				};

				failure = function (e) { obj.fire("failedDataSync", e); };

				obj.fire("beforeDataSync");
				this.callback !== null ? this.uri.jsonp(success, failure, {callback: this.callback}) : this.uri.get(success, failure, utility.merge({withCredentials: this.credentials}, this.headers));
				return this;
			},

			/**
			 * Tears down a store & expires all records associated to an API
			 * 
			 * @return {Undefined} undefined
			 */
			teardown : function () {
				var uri = this.uri,
				    records, id;

				if (uri !== null) {
					cache.expire(uri, true);
					observer.remove(uri);
					id = this.parentNode.id + "DataExpire";

					if (typeof $.repeating[id] !== "undefined") {
						clearTimeout($.repeating[id]);
						delete $.repeating[id];
					}

					records = this.get();
					records.each(function (i) {
						cache.expire((uri + "/" + i.key), true);
						observer.remove(uri + "/" + i.key);
						utility.iterate(i.data, function (v, k) {
							if (v === null) return;
							if (v.hasOwnProperty("data") && typeof v.data.teardown === "function") {
								observer.remove(v.id);
								v.data.teardown();
							}
						});
					});
				}
				this.clear(true);
				return this;
			}
		},

		/**
		 * Registers a data store on an Object
		 *
		 * Events: beforeDataStore  Fires before registering the data store
		 *         afterDataStore   Fires after registering the data store
		 *
		 * @method register
		 * @param  {Object} obj  Object to register with
		 * @param  {Mixed}  data [Optional] Data to set with this.batch
		 * @return {Object}      Object registered with
		 */
		register : function (obj, data) {
			if (obj instanceof Array) return obj.each(function (i) { data.register(i, data); });

			var methods = {
				expires : {
					getter : function () { return this._expires; },
					setter : function (arg) {
						if (arg !== null && this.uri === null  && isNaN(arg)) throw Error(label.error.invalidArguments);

						if (this._expires === arg) return;
						this._expires = arg;

						var id      = this.parentNode.id + "DataExpire",
						    expires = arg,
						    self    = this;

						clearTimeout($.repeating[id]);
						delete $.repeating[id];

						if (arg === null) return;

						utility.defer(function () {
							utility.repeat(function () {
								if (self.uri === null) {
									typeof self.setExpires === "function" ? self.setExpires(null) : self.expires = null;
									return false;
								}
								if (!cache.expire(self.uri)) self.uri.fire("beforeExpire, expire, afterExpire");
							}, expires, id);
						}, expires);
					}
				},
				uri : {
					getter : function () { return this._uri; },
					setter : function (arg) {
						if (arg !== null && arg.isEmpty()) throw Error(label.error.invalidArguments);

						switch (true) {
							case this._uri === arg:
								return;
							case this._uri !== null:
								this._uri.un("expire", "dataSync");
								this.teardown(true);
							default:
								this._uri = arg;
						}

						if (arg !== null) {
							arg.on("expire", function () { this.sync(true); }, "dataSync", this);
							cache.expire(arg, true);
							this.sync();
						}
					}
				}
			};

			obj = utility.object(obj);
			utility.genId(obj);

			// Hooking observer if not present in prototype chain
			if (typeof obj.fire === "undefined")      obj.fire      = function (event, arg) { return $.fire.call(this, event, arg); };
			if (typeof obj.listeners === "undefined") obj.listeners = function (event) { return $.listeners.call(this, event); };
			if (typeof obj.on === "undefined")        obj.on        = function (event, listener, id, scope, standby) { return $.on.call(this, event, listener, id, scope, standby); };
			if (typeof obj.once === "undefined")      obj.once      = function (event, listener, id, scope, standby) { return $.once.call(this, event, listener, id, scope, standby); };
			if (typeof obj.un === "undefined")        obj.un        = function (event, id) { return $.un.call(this, event, id); };

			obj.fire("beforeDataStore");

			obj.data = utility.extend(this.methods);
			obj.data.parentNode = obj; // Recursion, useful
			obj.data.clear();          // Setting properties

			obj.on("syncDataDelete", function (data) {
				var record = this.get(data.record);

				this.records.remove(data.record);
				delete this.keys[data.key];
				this.total--;
				this.views = {};
				if (data.reindex) this.reindex();
				utility.iterate(record.data, function (v, k) {
					if (v === null) return;
					if (typeof v.data !== "undefined" && typeof v.data.teardown === "function") v.data.teardown();
				});
				this.parentNode.fire("afterDataDelete", record);
				return this.parentNode;
			}, "recordDelete", obj.data);

			obj.on("syncDataSet", function (arg) {
				var data = typeof arg.record === "undefined" ? utility.clone(arg) : arg,
				    fire = true,
				    self = this,
				    record, uri;

				switch (true) {
					case typeof data.record === "undefined":
						var index = this.total;
						this.total++;
						if (typeof data.key === "undefined") {
							if (typeof data.result === "undefined") {
								this.fire("failedDataSet");
								throw Error(label.error.expectedObject);
							}
							if (this.source !== null) data.result = utility.walk(data.result, this.source);
							if (this.key === null) data.key = array.cast(data.result).first();
							else {
								data.key = data.result[this.key];
								delete data.result[this.key];
							}
							if (typeof data.key !== "string") data.key = data.key.toString();
							data.data = data.result;
						}
						this.keys[data.key] = {};
						this.keys[data.key].index = index;
						this.records[index] = {};
						record     = this.records[index];
						record.key = data.key;
						if (this.pointer === null || typeof data.data[this.pointer] === "undefined") {
							record.data = data.data;
							if (this.key !== null && this.records[index].data.hasOwnProperty(this.key)) delete this.records[index].data[this.key];
						}
						else {
							fire = false;
							uri  = data.data[this.pointer];
							if (typeof uri === "undefined" || uri === null) {
								delete this.records[index];
								delete this.keys[data.key];
								this.fire("failedDataSet");
								throw Error(label.error.expectedObject);
							}
							record.data = {};
							uri.get(function (args) {
								if (self.source !== null) args = utility.walk(args, self.source);
								if (typeof args[self.key] !== "undefined") delete args[self.key];
								utility.merge(record.data, args);
								if (self.retrieve) {
									self.crawl(record.key, self.ignore.length > 0 ? self.ignore.join(",") : undefined, self.key);
									self.loaded = true;
								}
								self.parentNode.fire("afterDataSet", record);
							}, function () { self.parentNode.fire("failedDataSet"); }, self.headers);
						}
						break;
					default:
						data.record.data = data.data;
						record = data.record;
				}
				this.views = {};
				if (this.retrieve) this.crawl(record.key, this.ignore.length > 0 ? this.ignore.join(",") : undefined, this.key);
				if (fire) this.parentNode.fire("afterDataSet", record);
			}, "recordSet", obj.data);

			// Getters & setters
			switch (true) {
				case (!client.ie || client.version > 8):
					utility.property(obj.data, "uri",     {enumerable: true, get: methods.uri.getter,     set: methods.uri.setter});
					utility.property(obj.data, "expires", {enumerable: true, get: methods.expires.getter, set: methods.expires.setter});
					break;
				default: // Only exists when no getters/setters (IE8)
					obj.data.setExpires = function (arg) {
						obj.data.expires = arg;
						methods.expires.setter.call(obj.data, arg);
					};
					obj.data.setUri = function (arg) {
						obj.data.uri = arg;
						methods.uri.setter.call(obj.data, arg);
					};
			}

			if (typeof data === "object") obj.data.batch("set", data);
			obj.fire("afterDataStore");
			return obj;
		}
	};

	/**
	 * Element methods
	 *
	 * @class el
	 * @namespace abaaso
	 */
	element = {
		/**
		 * Gets or sets attributes of Element
		 * 
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {String} name  Attribute name
		 * @param  {Mixed}  value Attribute value
		 * @return {Object}       Element or Array of Elements
		 */
		attr : function (obj, key, value) {
			if (typeof value === "string") value = value.trim();

			var regex = /checked|disabled/,
			    target;

			obj = utility.object(obj);
			if (obj instanceof Array) return obj.attr(key, value);

			if (!(obj instanceof Element) || typeof key == "undefined" || String(key).isEmpty()) throw Error(label.error.invalidArguments);

			switch (true) {
				case regex.test(key) && typeof value === "undefined":
					return obj[key];
				case regex.test(key) && typeof value !== "undefined":
					obj[key] = value;
					return obj;
				case obj.nodeName === "SELECT" && key === "selected" && typeof value === "undefined":
					return $("#" + obj.id + " option[selected=\"selected\"]").first() || $("#" + obj.id + " option").first();
				case obj.nodeName === "SELECT" && key === "selected" && typeof value !== "undefined":
					target = $("#" + obj.id + " option[selected=\"selected\"]").first();
					if (typeof target !== "undefined") {
						target.selected = false;
						target.removeAttribute("selected");
					}
					target = $("#" + obj.id + " option[value=\"" + value + "\"]").first();
					target.selected = true;
					target.setAttribute("selected", "selected");
					return obj;
				case typeof value === "undefined":
					return obj.getAttribute(key);
				case value === null:
					obj.removeAttribute(key);
					return obj;
				default:
					obj.setAttribute(key, value);
					return obj;
			}
		},

		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * Events: beforeClear  Fires before the Object is cleared
		 *         afterClear   Fires after the Object is cleared
		 *
		 * @method clear
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element or Array of Elements
		 */
		clear : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.clear(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			obj.fire("beforeClear");
			switch (true) {
				case typeof obj.reset === "function":
					obj.reset();
					break;
				case typeof obj.value !== "undefined":
					obj.update({innerHTML: "", value: ""});
					break;
				default:
					obj.update({innerHTML: ""});
			}
			obj.fire("afterClear");
			return obj;
		},

		/**
		 * Creates an Element in document.body or a target Element
		 *
		 * An id is generated if not specified with args
		 *
		 * Events: beforeCreate  Fires before the Element has been created, but not set
		 *         afterCreate   Fires after the Element has been appended to it's parent
		 *
		 * @method create
		 * @param  {String} type   Type of Element to create
		 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
		 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
		 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
		 * @return {Object}        Element that was created or undefined
		 */
		create : function (type, args, target, pos) {
			if (typeof type === "undefined" || String(type).isEmpty()) throw Error(label.error.invalidArguments);

			var obj, uid, frag;

			switch (true) {
				case typeof target !== "undefined":
					target = utility.object(target);
					break;
				case typeof args !== "undefined" && (typeof args === "string" || typeof args.childNodes !== "undefined"):
					target = utility.object(args);
					break;
				default:
					target = document.body;
			}

			if (typeof target === "undefined") throw Error(label.error.invalidArguments);
			
			frag = !(target instanceof Element);
			uid  = typeof args !== "undefined"
			        && typeof args !== "string"
			        && typeof args.childNodes === "undefined"
			        && typeof args.id !== "undefined"
			        && typeof $("#" + args.id) === "undefined" ? args.id : utility.genId();

			if (typeof args !== "undefined" && typeof args.id !== "undefined") delete args.id;

			$.fire("beforeCreate", uid);
			if (!frag) target.fire("beforeCreate", uid);
			else if (frag && target.parentNode !== null) target.parentNode.fire("beforeCreate", uid);

			obj = document.createElement(type);
			obj.id = uid;
			if (typeof args === "object" && typeof args.childNodes === "undefined") obj.update(args);
			switch (true) {
				case typeof pos === "undefined":
				case pos === "last":
					target.appendChild(obj);
					break;
				case pos === "first":
					target.prependChild(obj);
					break;
				case pos === "after":
					pos = {};
					pos.after = target;
					target    = target.parentNode;
				case typeof pos.after !== "undefined":
					target.insertBefore(obj, pos.after.nextSibling);
					break;
				case pos === "before":
					pos = {};
					pos.before = target;
					target     = target.parentNode;
				case typeof pos.before !== "undefined":
					target.insertBefore(obj, pos.before);
					break;
				default:
					target.appendChild(obj);
			}

			if (!frag) target.fire("afterCreate", obj);
			else if (frag && target.parentNode !== null) target.parentNode.fire("afterCreate", obj);
			$.fire("afterCreate", obj);
			
			return obj;
		},

		/**
		 * Creates a CSS stylesheet in the View
		 *
		 * @method css
		 * @param  {String} content CSS to put in a style tag
		 * @return {Object}         Element created or undefined
		 */
		css : function (content) {
			var ss, css;
			ss = $("head").first().create("style", {type: "text/css"});
			if (ss.styleSheet) ss.styleSheet.cssText = content;
			else {
				css = document.createTextNode(content);
				ss.appendChild(css);
			}
			return ss;
		},

		/**
		 * Data attribute facade acting as a getter (with coercion) & setter
		 *
		 * @method  data
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {String} key   Data key
		 * @param  {Mixed}  value Boolean, Number or String to set
		 * @return {Mixed}        undefined, Element or value
		 */
		data : function (obj, key, value) {
			var result;

			if (typeof value !== "undefined") {
				typeof obj.dataset === "object" ? obj.dataset[key] = value : element.attr(obj, "data-" + key, value);
				result = obj;
			}
			else result = utility.coerce(typeof obj.dataset === "object" ? obj.dataset[key] : element.attr(obj, "data-" + key));
			return result;
		},

		/**
		 * Destroys an Element
		 *
		 * Events: beforeDestroy  Fires before the destroy starts
		 *         afterDestroy   Fires after the destroy ends
		 *
		 * @method destroy
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		destroy : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) {
				obj.each(function (i) { element.destroy(i); });
				return [];
			}

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			$.fire("beforeDestroy", obj);
			obj.fire("beforeDestroy");
			observer.remove(obj.id);
			if (obj.parentNode !== null) obj.parentNode.removeChild(obj);
			obj.fire("afterDestroy");
			$.fire("afterDestroy", obj.id);
			return undefined;
		},

		/**
		 * Disables an Element
		 *
		 * Events: beforeDisable  Fires before the disable starts
		 *         afterDisable   Fires after the disable ends
		 *
		 * @method disable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		disable : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.disable(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			if (typeof obj.disabled === "boolean" && !obj.disabled) {
				obj.fire("beforeDisable");
				obj.disabled = true;
				obj.fire("afterDisable");
			}
			return obj;
		},

		/**
		 * Enables an Element
		 *
		 * Events: beforeEnable  Fires before the enable starts
		 *         afterEnable   Fires after the enable ends
		 *
		 * @method enable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		enable : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.enable(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			if (typeof obj.disabled === "boolean" && obj.disabled) {
				obj.fire("beforeEnable");
				obj.disabled = false;
				obj.fire("afterEnable");
			}
			return obj;
		},

		/**
		 * Finds descendant childNodes of Element matched by arg
		 *
		 * @method find
		 * @param  {Mixed}  obj Element to search
		 * @param  {String} arg Comma delimited string of descendant selectors
		 * @return {Mixed}      Array of Elements or undefined
		 */
		find : function (obj, arg) {
			var result = [];

			obj = utility.object(obj);
			if (!(obj instanceof Element) || typeof arg !== "string") throw Error(label.error.invalidArguments);
			utility.genId(obj);
			arg.explode().each(function (i) {
				 $("#" + obj.id + " " + i).each(function (o) {
				 	result.add(o);
				 });
			});
			return result;
		},

		/**
		 * Determines if Element has descendants matching arg
		 *
		 * @method has
		 * @param  {Mixed}   obj Element or Array of Elements or $ queries
		 * @param  {String}  arg Type of Element to find
		 * @return {Boolean}     True if 1 or more Elements are found
		 */
		has : function (obj, arg) {
			var result = element.find(obj, arg);
			return (!isNaN(result.length) && result.length > 0);
		},

		/**
		 * Determines if obj has a specific CSS class
		 * 
		 * @method hasClass
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		hasClass : function (obj, klass) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.hide(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			return obj.className.explode(" ").contains(klass);
		},

		/**
		 * Hides an Element if it's visible
		 *
		 * Events: beforeHide  Fires before the object is hidden
		 *         afterHide   Fires after the object is hidden
		 *
		 * @method hide
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		hide : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.hide(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			obj.fire("beforeHide");
			switch (true) {
				case typeof obj.hidden === "boolean":
					obj.hidden = true;
					break;
				default:
					obj["data-display"] = obj.style.display;
					obj.style.display = "none";
			}
			obj.fire("afterHide");
			return obj;
		},

		/**
		 * Returns a Boolean indidcating if the Object is hidden
		 *
		 * @method hidden
		 * @param  {Mixed} obj Element or $ query
		 * @return {Mixed}     Boolean indicating if Object is hidden
		 */
		hidden : function (obj) {
			obj = utility.object(obj);

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			return obj.style.display === "none" || (typeof obj.hidden === "boolean" && obj.hidden);
		},

		/**
		 * Determines if Element is equal to arg, supports nodeNames & CSS2+ selectors
		 *
		 * @method is
		 * @param  {Mixed}   obj Element or Array of Elements or $ queries
		 * @param  {String}  arg Property to query
		 * @return {Mixed}       Boolean or undefined
		 */
		is : function (obj, arg) {
			obj = utility.object(obj);

			if (!(obj instanceof Element) || typeof arg !== "string") throw Error(label.error.invalidArguments);

			utility.genId(obj);
			return /^:/.test(arg) ? (element.find(obj.parentNode, obj.nodeName.toLowerCase() + arg).contains(obj)) : new RegExp(arg, "i").test(obj.nodeName);
		},

		/**
		 * Adds or removes a CSS class
		 *
		 * Events: beforeClassChange  Fires before the Object's class is changed
		 *         afterClassChange   Fires after the Object's class is changed
		 *
		 * @method clear
		 * @param  {Mixed}   obj Element or Array of Elements or $ queries
		 * @param  {String}  arg Class to add or remove (can be a wildcard)
		 * @param  {Boolean} add Boolean to add or remove, defaults to true
		 * @return {Mixed}       Element or Array of Elements
		 */
		klass : function (obj, arg, add) {
			var classes;

			obj = utility.object(obj);

			if (obj instanceof Array) return obj.each(function (i) { element.klass(i, arg, add); });

			if (!(obj instanceof Element) || String(arg).isEmpty()) throw Error(label.error.invalidArguments);

			obj.fire("beforeClassChange");
			add     = (add !== false);
			arg     = arg.explode();
			classes = obj.className.explode(" ");
			arg.each(function (i) { add ? classes.add(i) : (arg === "*" ? classes = [] : classes.remove(i)); });
			classes = classes.join(" ");
			client.ie && client.version < 9 ? obj.className = classes : obj.attr("class", classes);
			obj.fire("afterClassChange");
			return obj;
		},

		/**
		 * Finds the position of an element
		 *
		 * @method position
		 * @param  {Mixed} obj Element or $ query
		 * @return {Object}    Object {left: n, top: n}
		 */
		position : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.position();

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			var left, top, height, width;

			left   = top = 0;
			width  = obj.offsetWidth;
			height = obj.offsetHeight;

			if (obj.offsetParent) {
				top    = obj.offsetTop;
				left   = obj.offsetLeft;

				while (obj = obj.offsetParent) {
					left += obj.offsetLeft;
					top  += obj.offsetTop;
				}
			}

			return {
				top    : top,
				right  : document.documentElement.clientWidth  - (left + width),
				bottom : document.documentElement.clientHeight + global.scrollY - (top + height),
				left   : left
			};
		},

		/**
		 * Prepends an Element to an Element
		 * 
		 * @method prependChild
		 * @param  {Object} obj   Target Element
		 * @param  {Object} child Child Element
		 * @return {Object}       Target Element
		 */
		prependChild : function (obj, child) {
			obj = utility.object(obj);

			if (!(obj instanceof Element) || !(child instanceof Element)) throw Error(label.error.invalidArguments);
			
			return obj.childNodes.length === 0 ? obj.appendChild(child) : obj.insertBefore(child, obj.childNodes[0]);
		},

		/**
		 * Shows an Element if it's not visible
		 *
		 * Events: beforeEnable  Fires before the object is visible
		 *         afterEnable   Fires after the object is visible
		 *
		 * @method show
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed}     Element, Array of Elements or undefined
		 */
		show : function (obj) {
			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.show(i); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			obj.fire("beforeShow");
			switch (true) {
				case typeof obj.hidden === "boolean":
					obj.hidden = false;
					break;
				default:
					obj.style.display = obj.getAttribute("data-display") !== null ? obj.getAttribute("data-display") : "inherit";
			}
			obj.fire("afterShow");
			return obj;
		},

		/**
		 * Returns the size of the Object
		 *
		 * @method size
		 * @param  {Mixed} obj Instance, Array of Instances of $() friendly ID
		 * @return {Object}    Size {x:, y:}, Array of sizes or undefined
		 */
		size : function (obj) {
			var num, height, width;

			obj = utility.object(obj);
			if (obj instanceof Array) {
				var result = [];
				obj.each(function (i) { result.push(element.size(i)); });
				return result;
			}

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			/**
			 * Casts n to a number or returns zero
			 *
			 * @param  {Mixed} n The value to cast
			 * @return {Number}  The casted value or zero
			 */
			num = function (n) {
				return !isNaN(parseInt(n)) ? parseInt(n) : 0;
			};

			height = obj.offsetHeight + num(obj.style.paddingTop)  + num(obj.style.paddingBottom) + num(obj.style.borderTop)  + num(obj.style.borderBottom);
			width  = obj.offsetWidth  + num(obj.style.paddingLeft) + num(obj.style.paddingRight)  + num(obj.style.borderLeft) + num(obj.style.borderRight);

			return {height: height, width: width};
		},

		/**
		 * Getter / setter for an Element's text
		 * 
		 * @param  {Object} obj Element
		 * @param  {String} arg [Optional] Value to set
		 * @return {Object}     Element
		 */
		text : function (obj, arg) {
			var key     = typeof obj.textContent !== "undefined" ? "textContent" : "innerText",
			    payload = {},
			    set     = false;

			if (typeof arg !== "undefined") {
				set          = true;
				payload[key] = arg;
			}

			return set ? element.update(obj, payload) : obj[key];
		},

		/**
		 * Updates an Element
		 *
		 * Events: beforeUpdate  Fires before the update starts
		 *         afterUpdate   Fires after the update ends
		 *
		 * @method update
		 * @param  {Mixed}  obj  Element or Array of Elements or $ queries
		 * @param  {Object} args Collection of properties
		 * @return {Mixed}       Element, Array of Elements or undefined
		 */
		update : function (obj, args) {
			obj  = utility.object(obj);
			args = args || {};
			var regex;

			if (obj instanceof Array) return obj.each(function (i) { element.update(i, args); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			obj.fire("beforeUpdate");
			regex = /innerHTML|innerText|textContent|type|src/;

			utility.iterate(args, function (v, k) {
				switch (true) {
					case regex.test(k):
						obj[k] = v;
						break;
					case k === "class":
						!v.isEmpty() ? obj.addClass(v) : obj.removeClass("*");
						break;
					case k.indexOf("data-") === 0:
						element.data(obj, k.replace("data-", ""), v);
						break;
					case "id":
						var o = observer.listeners;
						if (typeof o[obj.id] !== "undefined") {
							o[k] = utility.clone(o[obj.id]);
							delete o[obj.id];
						}
					default:
						obj.attr(k, v);
				}
			});

			obj.fire("afterUpdate");
			return obj;
		},

		/**
		 * Gets or sets the value of Element
		 *
		 * Events: beforeValue  Fires before the object receives a new value
		 *         afterValue   Fires after the object receives a new value
		 * 
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {Mixed}  value [Optional] Value to set
		 * @return {Object}       Element or Array of Elements
		 */
		val : function (obj, value) {
			var output = null, items;

			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { element.val(i, value); });

			if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

			switch (true) {
				case typeof value === "undefined":
					switch (true) {
						case (/radio|checkbox/gi.test(obj.type)):
							if (obj.name.isEmpty()) throw Error(label.error.expectedProperty);
							items = $("input[name='" + obj.name + "']");
							items.each(function (i) {
								if (output !== null) return;
								if (i.checked) output = i.value;
							});
							break;
						case (/select/gi.test(obj.type)):
							output = obj.options[obj.selectedIndex].value;
							break;
						default:
							output = typeof obj.value !== "undefined" ? obj.value : element.text(obj);
					}
					break;
				default:
					value = String(value);
					obj.fire("beforeValue");
					switch (true) {
						case (/radio|checkbox/gi.test(obj.type)):
							items = $("input[name='" + obj.name + "']");
							items.each(function (i) {
								if (output !== null) return;
								if (i.value === value) {
									i.checked = true;
									output    = i;
								}
							});
							break;
						case (/select/gi.test(obj.type)):
							array.cast(obj.options).each(function (i) {
								if (output !== null) return;
								if (i.value === value) {
									i.selected = true;
									output     = i;
								}
							});
							break;
						default:
							typeof obj.value !== "undefined" ? obj.value = value : element.text(obj, value);
					}
					obj.fire("afterValue");
					output = obj;
			}
			return output;
		}
	};

	/**
	 * JSON methods
	 *
	 * @class json
	 * @namespace abaaso
	 */
	json = {
		/**
		 * Decodes the argument
		 *
		 * @method decode
		 * @param  {String}  arg    String to parse
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {Mixed}          Entity resulting from parsing JSON, or undefined
		 */
		decode : function (arg, silent) {
			try {
				return JSON.parse(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Encodes the argument as JSON
		 *
		 * @method encode
		 * @param  {Mixed}   arg    Entity to encode
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {String}         JSON, or undefined
		 */
		encode : function (arg, silent) {
			try {
				return JSON.stringify(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Labels for localization
	 *
	 * Override this with another language pack
	 *
	 * @class label
	 * @namespace abaaso
	 */
	label = {
		// Common labels
		common : {
			back    : "Back",
			cancel  : "Cancel",
			clear   : "Clear",
			close   : "Close",
			cont    : "Continue",
			create	: "Create",
			del     : "Delete",
			edit    : "Edit",
			find    : "Find",
			gen     : "Generate",
			go      : "Go",
			loading : "Loading",
			next    : "Next",
			login   : "Login",
			ran     : "Random",
			reset   : "Reset",
			save    : "Save",
			search  : "Search",
			submit  : "Submit"
		},

		// Days of the week
		day : {
			0 : "Sunday",
			1 : "Monday",
			2 : "Tuesday",
			3 : "Wednesday",
			4 : "Thursday",
			5 : "Friday",
			6 : "Saturday"
		},

		// Error messages
		error : {
			databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
			databaseNotSupported  : "Client does not support local database storage",
			databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
			elementNotCreated     : "Could not create the Element",
			elementNotFound       : "Could not find the Element",
			expectedArray         : "Expected an Array",
			expectedArrayObject   : "Expected an Array or Object",
			expectedBoolean       : "Expected a Boolean value",
			expectedNumber        : "Expected a Number",
			expectedProperty      : "Expected a property, and it was not set",
			expectedObject        : "Expected an Object",
			invalidArguments      : "One or more arguments is invalid",
			invalidDate           : "Invalid Date",
			invalidFields         : "The following required fields are invalid: ",
			notAvailable          : "Requested method is not available",
			propertyNotFound      : "Could not find the requested property",
			serverError           : "Server error has occurred",
			serverForbidden       : "Forbidden to access URI",
			serverInvalidMethod   : "Method not allowed",
			serverUnauthorized    : "Authorization required to access URI"
		},

		// Months of the Year
		month : {
			0  : "January",
			1  : "February",
			2  : "March",
			3  : "April",
			4  : "May",
			5  : "June",
			6  : "July",
			7  : "August",
			8  : "September",
			9  : "October",
			10 : "November",
			11 : "December"
		}
	};

	/**
	 * Messaging between iframes
	 *
	 * @class abaaso
	 * @namespace abaaso
	 */
	message = {
		/**
		 * Clears the message listener
		 *
		 * @method clear
		 * @return {Object} abaaso
		 */
		clear : function (state) {
			if (typeof state === "undefined") state = "all";
			return $.un(global, "message", "message", state);
		},

		/**
		 * Posts a message to the target
		 *
		 * @method send
		 * @param  {Object} target Object to receive message
		 * @param  {Mixed}  arg    Entity to send as message
		 * @return {Object}        target
		 */
		send : function (target, arg) {
			try {
				target.postMessage(arg, "*");
			}
			catch (e) {
				error(e, arguments, this);
			}
			return target;
		},

		/**
		 * Sets a handler for recieving a message
		 *
		 * @method recv
		 * @param  {Function} fn Callback function
		 * @return {Object}      abaaso
		 */
		recv : function (fn, state) {
			if (typeof state === "undefined") state = "all";
			return $.on(global, "message", fn, "message", global, state);
		}
	};

	/**
	 * Mouse tracking
	 *
	 * @class mouse
	 * @namespace abaaso
	 */
	mouse = {
		//Indicates whether mouse tracking is enabled
		enabled : false,

		// Indicates whether to try logging co-ordinates to the console
		log     : false,

		// Mouse coordinates
		diff    : {x: null, y: null},
		pos     : {x: null, y: null},
		prev    : {x: null, y: null},

		/**
		 * Enables or disables mouse co-ordinate tracking
		 *
		 * @method track
		 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
		 * @return {Object}  abaaso.mouse
		 */
		track : function (e) {
			var m = abaaso.mouse;
			switch (true) {
				case typeof e === "object":
					var view = document[client.ie && client.version < 9 ? "documentElement" : "body"],
					    x    = e.pageX ? e.pageX : (view.scrollLeft + e.clientX),
					    y    = e.pageY ? e.pageY : (view.scrollTop  + e.clientY),
					    c    = false;

					if (m.pos.x !== x) c = true;
					$.mouse.prev.x = m.prev.x = Number(m.pos.x);
					$.mouse.pos.x  = m.pos.x  = x;
					$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

					if (m.pos.y !== y) c = true;
					$.mouse.prev.y = m.prev.y = Number(m.pos.y);
					$.mouse.pos.y  = m.pos.y  = y;
					$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

					if (c && m.log) utility.log(m.pos.x + " [" + m.diff.x + "], " + m.pos.y + " [" + m.diff.y + "]");
					break;
				case typeof e === "boolean":
					e ? observer.add(document, "mousemove", abaaso.mouse.track) : observer.remove(document, "mousemove");
					$.mouse.enabled = m.enabled = e;
					break;
			}
			return m;
		}
	};


	/**
	 * Number methods
	 *
	 * @class number
	 * @namespace abaaso
	 */
	number = {
		/**
		 * Returns the difference of arg
		 *
		 * @method odd
		 * @param {Number} arg Number to compare
		 * @return {Number}    The absolute difference
		 */
		diff : function (num1, num2) {
			if (isNaN(num1) || isNaN(num2)) throw Error(label.error.expectedNumber);

			return Math.abs(num1 - num2);
		},

		/**
		 * Tests if an number is even
		 *
		 * @method even
		 * @param {Number} arg Number to test
		 * @return {Boolean}   True if even, or undefined
		 */
		even : function (arg) {
			return arg % 2 === 0;
		},

		/**
		 * Formats a Number to a delimited String
		 * 
		 * @method format
		 * @param  {Number} arg       Number to format
		 * @param  {String} delimiter [Optional] String to delimit the Number with
		 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
		 * @return {String}           Number represented as a comma delimited String
		 */
		format : function (arg, delimiter, every) {
			if (isNaN(arg)) throw Error(label.error.expectedNumber);

			arg       = arg.toString();
			delimiter = delimiter || ",";
			every     = every     || 3;

			var d = arg.indexOf(".") > -1 ? "." + arg.replace(/.*\./, "") : "",
			    a = arg.replace(/\..*/, "").split("").reverse(),
			    p = Math.floor(a.length / every),
			    i = 1, n, b;

			for (b = 0; b < p; b++) {
				n = i === 1 ? every : (every * i) + (i === 2 ? 1 : (i - 1));
				a.splice(n, 0, delimiter);
				i++;
			}

			a = a.reverse().join("");
			if (a.charAt(0) === delimiter) a = a.substring(1);
			return a + d;
		},

		/**
		 * Returns half of a, or true if a is half of b
		 * 
		 * @param  {Number} a Number to divide
		 * @param  {Number} b [Optional] Number to test a against
		 * @return {Mixed}    Boolean if b is passed, Number if b is undefined
		 */
		half : function (a, b) {
			return typeof b !== "undefined" ? ((a / b) === .5) : (a / 2);
		},

		/**
		 * Tests if a number is odd
		 *
		 * @method odd
		 * @param {Number} arg Number to test
		 * @return {Boolean}   True if odd, or undefined
		 */
		odd : function (arg) {
			return !(arg % 2 === 0);
		},

		/**
		 * Parses the number
		 * 
		 * @param  {Mixed} arg Number to parse
		 * @return {Number}    Integer or float
		 */
		parse : function (arg) {
			return String(arg).indexOf(".") < 0 ? parseInt(arg) : parseFloat(arg);
		},

		/**
		 * Rounds a number up or down
		 * 
		 * @param  {Number} arg       Float to round
		 * @param  {String} direction [Optional] "up" or "down", defaults to "down"
		 * @return {Number}           Rounded interger
		 */
		round : function (arg, direction) {
			if (String(arg).indexOf(".") < 0) return arg;
			if (!/down|up/.test(direction)) direction = "down";
			return Math[direction === "down" ? "floor" : "ceil"](arg);
		}
	};

	/**
	 * Global Observer wired to a State Machine
	 *
	 * @class observer
	 * @namespace abaaso
	 */
	observer = {
		// Collection of listeners
		listeners : {},

		// Boolean indicating if events are logged to the console
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @method add
		 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
		 * @param  {String}   event Event, or Events being fired (comma delimited supported)
		 * @param  {Function} fn    Event handler
		 * @param  {String}   id    [Optional / Recommended] The id for the listener
		 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param  {String}   state [Optional] The state the listener is for
		 * @return {Mixed}          Entity, Array of Entities or undefined
		 */
		add : function (obj, event, fn, id, scope, state) {
			obj   = utility.object(obj);
			scope = scope || abaaso;
			state = state || abaaso.state.current;

			if (obj instanceof Array) return obj.each(function (i) { observer.add(i, event, fn, id, scope, state); });

			if (typeof event !== "undefined") event = event.explode();
			if (typeof id === "undefined" || !/\w/.test(id)) id = utility.guid(true);

			var instance = null,
			    l        = observer.listeners,
			    o        = observer.id(obj),
			    n        = false,
			    c        = abaaso.state.current,
			    globals  = /body|document|window/i,
			    allowed  = /click|key|mousedown|mouseup/i,
			    item, add, reg;

			if (typeof o === "undefined" || event === null || typeof event === "undefined" || typeof fn !== "function") throw Error(label.error.invalidArguments);

			event.each(function (i) {
				n = false;
				if (typeof l[o] === "undefined")                  l[o]           = {};
				if (typeof l[o][i] === "undefined" && (n = true)) l[o][i]        = {};
				if (typeof l[o][i][state] === "undefined")        l[o][i][state] = {};

				if (n) {
					switch (true) {
						case globals.test(o):
						case !/\//g.test(o) && o !== "abaaso":
							instance = obj;
							break;
						default:
							instance = null;
					}

					if (instance !== null && typeof instance !== "undefined" && i.toLowerCase() !== "afterjsonp" && (globals.test(o) || typeof instance.listeners === "function")) {
						add = (typeof instance.addEventListener === "function");
						reg = (typeof instance.attachEvent === "object" || add);
						if (reg) instance[add ? "addEventListener" : "attachEvent"]((add ? "" : "on") + i, function (e) {
							if (!globals.test(e.type) && !allowed.test(e.type)) utility.stop(e);
							observer.fire(obj, i, e);
						}, false);
					}
				}

				item = {fn: fn, scope: scope};
				l[o][i][state][id] = item;
			});

			return obj;
		},

		/**
		 * Gets the Observer id of arg
		 *
		 * @method id
		 * @param  {Mixed}  Object or String
		 * @return {String} Observer id
		 * @private
		 */
		id : function (arg) {
			var id;

			switch (true) {
				case arg === abaaso:
					id = "abaaso";
					break;
				case arg === global:
					id = "window";
					break;
				case arg === !server && document:
					id = "document";
					break;
				case arg === !server && document.body:
					id = "body";
					break;
				default:
					id = typeof arg.id !== "undefined" ? arg.id : (typeof arg.toString === "function" ? arg.toString() : arg);
			}
			return id;
		},

		/**
		 * Fires an event
		 *
		 * @method fire
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event, or Events being fired (comma delimited supported)
		 * @param  {Mixed}  arg   [Optional] Argument supplied to the listener
		 * @return {Mixed}        Entity, Array of Entities or undefined
		 */
		fire : function (obj, event, arg) {
			obj      = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { observer.fire(obj[i], event, arg); });
			if (typeof event === "string") event = event.explode();

			var o    = observer.id(obj),
			    a    = arg,
			    s    = abaaso.state.current,
			    log  = ($.observer.log || abaaso.observer.log),
			    c, l, list;

			if (typeof o === "undefined" || String(o).isEmpty() || typeof obj === "undefined" || typeof event === "undefined") throw Error(label.error.invalidArguments);

			event.each(function (e) {
				list = observer.list(obj, e);
				l = list.all;
				if (typeof l !== "undefined") utility.iterate(l, function (i, k) {
					i.fn.call(i.scope, a);
				});
				if (s !== "all") {
					l = list[s];
					if (typeof l !== "undefined") utility.iterate(l, function (i, k) {
						i.fn.call(i.scope, a);
					});
				}
				if (log) utility.log(o + " fired " + e);
			});
			return obj;
		},

		/**
		 * Gets the listeners for an event
		 *
		 * @method list
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being queried
		 * @return {Mixed}        Object or Array of listeners for the event
		 */
		list : function (obj, event) {
			obj   = utility.object(obj);
			var l = observer.listeners,
			    o = observer.id(obj),
			    r;

			switch (true) {
				case typeof l[o] === "undefined" && typeof event === "undefined":
					r = {};
					break;
				case typeof l[o] !== "undefined" && (typeof event === "undefined" || String(event).isEmpty()):
					r = l[o];
					break;
				case typeof l[o] !== "undefined" && typeof l[o][event] !== "undefined":
					r = l[o][event];
					break;
				default:
					r = {};
			}
			return r;
		},

		/**
		 * Adds a listener for a single execution
		 * 
		 * @method once
		 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
		 * @param  {String}   event Event being fired
		 * @param  {Function} fn    Event handler
		 * @param  {String}   id    [Optional / Recommended] The id for the listener
		 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param  {String}   state [Optional] The state the listener is for
		 * @return {Mixed}          Entity, Array of Entities or undefined
		 */
		once : function (obj, event, fn, id, scope, state) {
			var guid = id || utility.genId();

			obj   = utility.object(obj);
			scope = scope || abaaso;
			state = state || abaaso.state.current;

			if (typeof obj === "undefined" || event === null || typeof event === "undefined" || typeof fn !== "function") throw Error(label.error.invalidArguments);

			if (obj instanceof Array) return obj.each(function (i) { observer.once(i, event, fn, id, scope, state); });

			observer.add(obj, event, function (arg) {
				observer.remove(obj, event, guid, state);
				fn.call(scope, arg);
			}, guid, scope, state);

			return obj;
		},

		/**
		 * Removes listeners
		 *
		 * @method remove
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event [Optional] Event, or Events being fired (comma delimited supported)
		 * @param  {String} id    [Optional] Listener id
		 * @param  {String} state [Optional] The state the listener is for
		 * @return {Mixed}        Entity, Array of Entities or undefined
		 */
		remove : function (obj, event, id, state) {
			obj   = utility.object(obj);
			state = state || abaaso.state.current;

			if (obj instanceof Array) return obj.each(function (i) { observer.remove(i, event, id, state); });

			var instance = null,
			    l = observer.listeners,
			    o = observer.id(obj);

			switch (true) {
				case typeof o === "undefined":
				case typeof l[o] === "undefined":
					return obj;
			}

			if (typeof event === "undefined" || event === null) delete l[o];
			else event.explode().each(function (e) {
				if (typeof l[o][e] === "undefined") return obj;
				typeof id === "undefined" ? l[o][e][state] = {} : delete l[o][e][state][id];
			});

			return obj;
		}
	};

	/**
	 * URI routing via hashtag
	 * 
	 * @class route
	 * @namespace abaaso
	 */
	route = {
		bang  : /\#|\!\//g,
		regex : new RegExp(),
		word  : /\w/,

		// Routing listeners
		routes : {
			error : function () {
				utility.error(label.error.invalidArguments);
				if (abaaso.route.initial !== null) route.hash(abaaso.route.initial);
			}
		},

		/**
		 * Deletes a route
		 * 
		 * @method del
		 * @param  {String} name Route name
		 * @return {Mixed} True or undefined
		 */
		del : function (name) {
			if (name !== "error" && route.routes.hasOwnProperty(name)) {
				if (abaaso.route.initial === name) abaaso.route.initial = null;
				return (delete route.routes[name]);
			}
			else throw Error(label.error.invalidArguments);
		},

		/**
		 * Getter / setter for the hashbang
		 * 
		 * @method hash
		 * @param  {String} arg Route to set
		 * @return {String}     Current route
		 */
		hash : function (arg) {
			var output = "";

			if (typeof arg === "undefined") output = document.location.hash.replace(route.bang, "");
			else {
				output = arg.replace(route.bang, "");
				document.location.hash = "!/" + output;
			}
			return output;
		},

		/**
		 * Initializes the routing by loading the initial OR the first route registered
		 * 
		 * @method init
		 * @return {String} Route being loaded
		 */
		init : function () {
			var val = document.location.hash;

			!route.word.test(val) ? route.hash(abaaso.route.initial !== null ? abaaso.route.initial : array.cast(route.routes, true).remove("error").first()) : route.load(val);
			return val.replace(route.bang, "");
		},

		/**
		 * Lists all routes
		 * 
		 * @set list
		 * @return {Array} Array of registered routes
		 */
		list : function () {
			return array.cast(route.routes, true);
		},

		/**
		 * Loads the hash into the view
		 * 
		 * @method load
		 * @param  {String} name Route to load
		 * @return {Mixed}       True or undefined
		 */
		load : function (name) {
			var active = "error";

			name = name.replace(route.bang, "");
			if (typeof route.routes[name] !== "undefined") active = name;
			else utility.iterate(route.routes, function (v, k) { if (utility.compile(route.regex, "^" + k + "$", "i") && route.regex.test(name)) return !(active = k); });
			route.routes[active](name);
			return true;
		},

		/**
		 * Sets a route for a URI
		 * 
		 * @method set
		 * @param  {String}   name Regex pattern for the route
		 * @param  {Function} fn   Route listener
		 * @return {Mixed}         True or undefined
		 */
		set : function (name, fn) {
			if (typeof name !== "string" || name.isEmpty() || typeof fn !== "function") throw Error(label.error.invalidArguments);

			route.routes[name] = fn;
			return true;
		}
	};

	/**
	 * String methods
	 * 
	 * @class string
	 * @namespace abaaso
	 */
	string = {
		/**
		 * Capitalizes the String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String}     Capitalized String
		 */
		capitalize : function (obj) {
			obj = string.trim(obj);
			return obj.charAt(0).toUpperCase() + obj.slice(1);
		},

		/**
		 * Escapes meta characters within a string
		 * 
		 * @param  {String} obj String to escape
		 * @return {String}     Escaped string
		 */
		escape : function (obj) {
			return obj.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		},

		/**
		 * Splits a string on comma, or a parameter, and trims each value in the resulting Array
		 * 
		 * @param  {String} obj String to capitalize
		 * @param  {String} arg String to split on
		 * @return {Array}      Array of the exploded String
		 */
		explode : function (obj, arg) {
			if (typeof arg === "undefined" || arg.toString() === "") arg = ",";
			return string.trim(obj).split(new RegExp("\\s*" + arg + "\\s*"));
		},

		/**
		 * Replaces all spaces in a string with dashes
		 * 
		 * @param  {String} obj String to hyphenate
		 * @return {String}     String with dashes instead of spaces
		 */
		hyphenate : function (obj) {
			return string.trim(obj).replace(/\s+/g, "-");
		},

		/**
		 * Returns singular form of the string
		 * 
		 * @param  {String} obj String to transform
		 * @return {String}     Transformed string
		 */
		singular : function (obj) {
			return /s$/.test(obj) ? obj.slice(0, -1) : obj;
		},

		/**
		 * Transforms the case of a String into CamelCase
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String}     Camel case String
		 */
		toCamelCase : function (obj) {
			var s = string.trim(obj).toLowerCase().split(" "),
			    r = [],
			    x = 0,
			    i, nth;

			s.each(function (i) {
				i = string.trim(i);
				if (i.isEmpty()) return;
				r.push(x++ === 0 ? i : string.capitalize(i));
			});
			return r.join("");
		},

		/**
		 * Trims the whitespace around a String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String}     Trimmed String
		 */
		trim : function (obj) {
			return obj.replace(/^\s+|\s+$/g, "");
		},

		/**
		 * Uncapitalizes the String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String}     Uncapitalized String
		 */
		uncapitalize : function (obj) {
			obj = string.trim(obj);
			return obj.charAt(0).toLowerCase() + obj.slice(1);
		}
	};

	/**
	 * Utility methods
	 *
	 * @class utility
	 * @namespace abaaso
	 */
	utility = {
		// Collection of timers
		timer : {},

		/**
		 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
		 * 
		 * Accepts comma delimited queries
		 *
		 * @method $
		 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
		 * @param  {Boolean} nodelist [Optional] True will return a NodeList (by reference) for tags & classes
		 * @return {Mixed}            Element or Array of Elements
		 */
		$ : function (arg, nodelist) {
			// Blocking node or DOM query of unique URIs via $.on()
			if (server || String(arg).indexOf("?") > -1) return undefined;

			var result = [],
			    tmp    = [],
			    obj, sel;

			arg      = arg.trim();
			nodelist = (nodelist === true);

			// Recursive processing, ends up below
			if (arg.indexOf(",") > -1) arg = arg.explode();
			if (arg instanceof Array) {
				arg.each(function (i) { tmp.push($(i, nodelist)); });
				tmp.each(function (i) { result = result.concat(i); });
				return result;
			}

			// Getting Element(s)
			switch (true) {
				case (/\s|>/.test(arg)):
					sel = arg.split(" ").filter(function (i) { if (i.trim() !== "" && i !== ">") return true; }).last();
					obj = document[sel.indexOf("#") > -1 && sel.indexOf(":") === -1 ? "querySelector" : "querySelectorAll"](arg);
					break;
				case arg.indexOf("#") === 0 && arg.indexOf(":") === -1:
					obj = isNaN(arg.charAt(1)) ? document.querySelector(arg) : document.getElementById(arg.substring(1));
					break;
				case arg.indexOf("#") > -1 && arg.indexOf(":") === -1:
					obj = document.querySelector(arg);
					break;
				default:
					obj = document.querySelectorAll(arg);
			}

			// Transforming obj if required
			if (typeof obj !== "undefined" && obj !== null && !(obj instanceof Element) && !nodelist) obj = array.cast(obj);
			if (obj === null) obj = undefined;

			return obj;
		},

		/**
		 * Aliases origin onto obj
		 *
		 * @method alias
		 * @param  {Object} obj    Object receiving aliasing
		 * @param  {Object} origin Object providing structure to obj
		 * @return {Object}        Object receiving aliasing
		 */
		alias : function (obj, origin) {
			var o = obj,
			    s = origin;

			utility.iterate(s, function (v, k) {
				var getter, setter;

				switch (true) {
					case !(v instanceof RegExp) && typeof v === "function":
						o[k] = v.bind(o[k]);
						break;
					case !(v instanceof RegExp) && !(v instanceof Array) && v instanceof Object:
						if (typeof o[k] === "undefined") o[k] = {};
						utility.alias(o[k], s[k]);
						break;
					default:
						getter = function () { return s[k]; },
						setter = function (arg) { s[k] = arg; };
						utility.property(o, k, {enumerable: true, get: getter, set: setter, value: s[k]});
				}
			});
			return obj;
		},

		/**
		 * Clones an Object
		 *
		 * @method clone
		 * @param {Object}  obj Object to clone
		 * @return {Object}     Clone of obj
		 */
		clone : function (obj) {
			var clone;

			switch (true) {
				case obj instanceof Array:
					return [].concat(obj);
				case typeof obj === "boolean":
					return Boolean(obj);
				case typeof obj === "function":
					return obj;
				case typeof obj === "number":
					return Number(obj);
				case typeof obj === "string":
					return String(obj);
				case !client.ie && !server && obj instanceof Document:
					return xml.decode(xml.encode(obj));
				case obj instanceof Object:
					clone = json.decode(json.encode(obj));
					if (typeof clone !== "undefined") {
						if (obj.hasOwnProperty("constructor")) clone.constructor = obj.constructor;
						if (obj.hasOwnProperty("prototype"))   clone.prototype   = obj.prototype;
					}
					return clone;
				default:
					return obj;
			}
		},

		/**
		 * Coerces a String to a Type
		 * 
		 * @param  {String} value String to coerce
		 * @return {Mixed}        Typed version of the String
		 */
		coerce : function (value) {
			var result = utility.clone(value),
			    tmp;

			switch (true) {
				case (/^\d$/.test(result)):
					result = number.parse(result);
					break;
				case (/^(true|false)$/i.test(result)):
					result = /true/i.test(result);
					break;
				case result === "undefined":
					result = undefined;
					break;
				case result === "null":
					result = null;
					break;
				case (tmp = json.decode(result, true)) && typeof tmp !== "undefined":
					result = tmp;
					break;
			}
			return result;
		},

		/**
		 * Recompiles a RegExp by reference
		 *
		 * This is ideal when you need to recompile a regex for use within a conditional statement
		 * 
		 * @param  {Object} regex     RegExp
		 * @param  {String} pattern   Regular expression pattern
		 * @param  {String} modifiers Modifiers to apply to the pattern
		 * @return {Boolean}          true
		 */
		compile : function (regex, pattern, modifiers) {
			regex.compile(pattern, modifiers);
			return true;
		},

		/**
		 * Allows deep setting of properties without knowing
		 * if the structure is valid
		 *
		 * @method define
		 * @param  {String} args  Dot delimited string of the structure
		 * @param  {Mixed}  value Value to set
		 * @param  {Object} obj   Object receiving value
		 * @return {Object}       Object receiving value
		 */
		define : function (args, value, obj) {
			args  = args.split(".");
			if (typeof obj   === "undefined") obj   = this;
			if (typeof value === "undefined") value = null;
			if (obj === $) obj = abaaso;

			var p   = obj,
			    nth = args.length;

			args.each(function (i, idx) {
				var num = idx + 1 < nth && !isNaN(parseInt(args[idx + 1])),
				    val = value;

				if (!isNaN(parseInt(i))) i = parseInt(i);
				
				// Creating or casting
				switch (true) {
					case typeof p[i] === "undefined":
						p[i] = num ? [] : {};
						break;
					case p[i] instanceof Object && num:
						p[i] = array.cast(p[i]);
						break;
					case p[i] instanceof Object:
						break;
					case p[i] instanceof Array && !num:
						p[i] = p[i].toObject();
						break;
					default:
						p[i] = {};
				}

				// Setting reference or value
				idx + 1 === nth ? p[i] = val : p = p[i];
			});

			return obj;
		},

		/**
		 * Defers the execution of Function by at least the supplied milliseconds
		 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
		 *
		 * @method defer
		 * @param  {Function} fn Function to defer execution of
		 * @param  {Number}   ms Milliseconds to defer execution
		 * @param  {Number}   id [Optional] ID of the deferred function
		 * @return {Object}      undefined
		 */
		defer : function (fn, ms, id) {
			ms = ms || 10;
			id = id || utility.guid(true);

			var op = function () {
				delete utility.timer[id];
				fn();
			};

			utility.timer[id] = setTimeout(op, ms);
			return undefined;
		},

		/**
		 * Encodes a GUID to a DOM friendly ID
		 *
		 * @method domId
		 * @param  {String} GUID
		 * @return {String} DOM friendly ID
		 * @private
		 */
		domId : function (arg) {
			return "a" + arg.replace(/-/g, "").slice(1);
		},

		/**
		 * Error handling, with history in .log
		 *
		 * @method error
		 * @param  {Mixed}   e       Error object or message to display
		 * @param  {Array}   args    Array of arguments from the callstack
		 * @param  {Mixed}   scope   Entity that was "this"
		 * @param  {Boolean} warning [Optional] Will display as console warning if true
		 * @return {Undefined}       undefined
		 */
		error : function (e, args, scope, warning) {
			var o;

			if (typeof e !== "undefined") {
				warning = (warning === true);
				o = {
					arguments : args,
					message   : typeof e.message !== "undefined" ? e.message : e,
					number    : typeof e.number !== "undefined" ? (e.number & 0xFFFF) : undefined,
					scope     : scope,
					stack     : typeof e.stack === "string" ? e.stack : undefined,
					timestamp : new Date().toUTCString(),
					type      : typeof e.type !== "undefined" ? e.type : "TypeError"
				};

				if (typeof console !== "undefined") console[!warning ? "error" : "warn"](o.message);
				$.error.log.push(o);
				$.fire("error", o);
			}

			return undefined;
		},

		/**
		 * Creates a class extending obj, with optional decoration
		 *
		 * @method extend
		 * @param  {Object} obj Object to extend
		 * @param  {Object} arg [Optional] Object for decoration
		 * @return {Object}     Decorated obj
		 */
		extend : function (obj, arg) {
			var o, f;

			if (typeof obj === "undefined") throw Error(label.error.invalidArguments);

			if (typeof arg === "undefined") arg = {};

			switch (true) {
				case typeof Object.create === "function":
					o = Object.create(obj);
					break;
				default:
					f = function () {};
					f.prototype = obj;
					o = new f();
			}

			utility.merge(o, arg);
			return o;
		},

		/**
		 * Generates an ID value
		 *
		 * @method genId
		 * @param  {Mixed} obj [Optional] Object to receive id
		 * @return {Mixed}     Object or id
		 */
		genId : function (obj) {
			var id;

			switch (true) {
				case obj instanceof Array:
				case obj instanceof String:
				case typeof obj === "string":
				case typeof obj !== "undefined" && typeof obj.id !== "undefined" && obj.id !== "":
					return obj;
			}

			do id = utility.domId(utility.guid(true));
			while (typeof $("#" + id) !== "undefined");

			if (typeof obj === "object") {
				obj.id = id;
				return obj;
			}
			else return id;
		},

		/**
		 * Generates a GUID
		 *
		 * @method guid
		 * @param {Boolean} safe [Optional] Strips - from GUID
		 * @return {String}      GUID
		 */
		guid : function (safe) {
			safe  = (safe === true);
			var s = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); },
			    o;

			o = (s() + s() + "-" + s() + "-4" + s().substr(0,3) + "-" + s() + "-" + s() + s() + s()).toLowerCase();
			if (safe) o = o.replace(/-/gi, "");
			return o;
		},

		/**
		 * Iterates an Object and executes a function against the properties
		 *
		 * Iteration can be stopped by returning false from fn
		 * 
		 * @param  {Object}   obj Object to iterate
		 * @param  {Function} fn  Function to execute against properties
		 * @return {Object}       Object
		 */
		iterate : function (obj, fn) {
			var i, result;

			if (typeof fn !== "function") throw Error(label.error.invalidArguments);

			for (i in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, i)) {
					result = fn.call(obj, obj[i], i);
					if (result === false) break;
				}
			}
			return obj;
		},

		/**
		 * Renders a loading icon in a target element,
		 * with a class of "loading"
		 *
		 * @method loading
		 * @param  {Mixed} obj Entity or Array of Entities or $ queries
		 * @return {Mixed}     Entity, Array of Entities or undefined
		 */
		loading : function (obj) {
			var l = abaaso.loading;

			obj = utility.object(obj);
			if (obj instanceof Array) return obj.each(function (i) { utility.loading(i); });

			if (l.url === null) throw Error(label.error.elementNotFound);

			if (typeof obj === "undefined") throw Error(label.error.invalidArguments);

			// Setting loading image
			if (typeof l.image === "undefined") {
				l.image     = new Image();
				l.image.src = l.url;
			}

			// Clearing target element
			obj.clear();

			// Creating loading image in target element
			obj.create("div", {"class": "loading"}).create("img", {alt: label.common.loading, src: l.image.src});

			return obj;
		},

		/**
		 * Writes argument to the console
		 *
		 * @method log
		 * @param  {String} arg String to write to the console
		 * @return undefined;
		 * @private
		 */
		log : function (arg) {
			try {
				console.log("[" + new Date().toLocaleTimeString() + "] " + arg);
			}
			catch (e) {
				error(e, arguments, this);
			}
			return undefined;
		},

		/**
		 * Merges obj with arg
		 * 
		 * @param  {Object} obj Object to decorate
		 * @param  {Object} arg Object to decorate with
		 * @return {Object}     Object to decorate
		 */
		merge : function (obj, arg) {
			utility.iterate(arg, function (v, k) {
				obj[k] = utility.clone(v);
			});
			return obj;
		},
		
		/**
		 * Registers a module in the abaaso namespace
		 *
		 * IE8 will have factories (functions) duplicated onto $ because it will not respect the binding
		 * 
		 * @method module
		 * @param  {String} arg Module name
		 * @param  {Object} obj Module structure
		 * @return {Object}     Module registered
		 */
		module : function (arg, obj) {
			if (typeof $[arg] !== "undefined" || typeof abaaso[arg] !== "undefined" || !obj instanceof Object) throw Error(label.error.invalidArguments);
			
			abaaso[arg] = obj;
			if (typeof obj === "function") $[arg] = !client.ie || client.version > 8 ? abaaso[arg].bind($[arg]) : abaaso[arg];
			else {
				$[arg] = {};
				utility.alias($[arg], abaaso[arg]);
			}
			return $[arg];
		},

		/**
		 * Returns Object, or reference to Element
		 *
		 * @method object
		 * @param  {Mixed} obj Entity or $ query
		 * @return {Mixed}     Entity
		 * @private
		 */
		object : function (obj) {
			return typeof obj === "object" ? obj : (obj.toString().charAt(0) === "#" ? $(obj) : obj);
		},

		/**
		 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
		 * 
		 * @method property
		 * @param  {Object} obj        Object to decorate
		 * @param  {String} prop       Name of property to set
		 * @param  {Object} descriptor Descriptor of the property
		 * @return {Object}            Object receiving the property
		 */
		property : function (obj, prop, descriptor) {
			if (!(descriptor instanceof Object)) throw Error(label.error.invalidArguments);

			var define;

			define = (!client.ie || client.version > 8) && typeof Object.defineProperty === "function";
			if (define && typeof descriptor.value !== "undefined" && typeof descriptor.get !== "undefined") delete descriptor.value;
			define ? Object.defineProperty(obj, prop, descriptor) : obj[prop] = descriptor.value;
			return obj;
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @method proto
		 * @param  {Object} obj  Object receiving prototype extension
		 * @param  {String} type Identifier of obj, determines what Arrays to apply
		 * @return {Object}      obj or undefined
		 * @private
		 */
		proto : function (obj, type) {
			// Collection of methods to add to prototypes
			var i,
			    methods = {
				array   : {add      : function (arg) { return array.add(this, arg); },
				           addClass : function (arg) { return this.each(function (i) { i.addClass(arg); }); },
				           after    : function (type, args) { var a = []; this.each(function (i) { a.push(i.after(type, args)); }); return a; },
				           append   : function (type, args) { var a = []; this.each(function (i) { a.push(i.append(type, args)); }); return a; },
				           attr     : function (key, value) { var a = []; this.each(function (i) { a.push(i.attr(key, value)); }); return a; },
				           before   : function (type, args) { var a = []; this.each(function (i) { a.push(i.before(type, args)); }); return a; },
				           clear    : function (arg) { return this.each(function (i) { i.clear(); }); },
				           clone    : function () { return utility.clone(this); },
				           contains : function (arg) { return array.contains(this, arg); },
				           create   : function (type, args, position) { var a = []; this.each(function (i) { a.push(i.create(type, args, position)); }); return a; },
				           css      : function (key, value) { return this.each(function (i) { i.css(key, value); }); },
				           data     : function (key, value) { var a = []; this.each(function (i) { a.push(i.data(key, value)); }); return a; },
				           diff     : function (arg) { return array.diff(this, arg); },
				           disable  : function () { return this.each(function (i) { i.disable(); }); },
				           destroy  : function () { this.each(function (i) { i.destroy(); }); return []; },
				           each     : function (arg) { return array.each(this, arg); },
				           enable   : function () { return this.each(function (i) { i.enable(); }); },
				           find     : function (arg) { var a = []; this.each(function (i) { i.find(arg).each(function (r) { if (!a.contains(r)) a.push(r); }); }); return a; },
				           fire     : function (event, arg) { return this.each(function (i) { i.fire(event, arg); }); },
				           first    : function () { return array.first(this); },
				           get      : function (uri, headers) { this.each(function (i) { i.get(uri, headers); }); return []; },
				           has      : function (arg) { var a = []; this.each(function (i) { a.push(i.has(arg)); }); return a; },
				           hasClass : function (arg) { var a = []; this.each(function (i) { a.push(i.hasClass(arg)); }); return a; },
				           hide     : function () { return this.each(function (i){ i.hide(); }); },
				           html     : function (arg) {
				           		if (typeof arg !== "undefined") return this.each(function (i){ i.html(arg); });
				           		else {
				           			var a = []; this.each(function (i) { a.push(i.html()); }); return a;
				           		}
				           },
				           index    : function (arg) { return array.index(this, arg); },
				           indexed  : function () { return array.indexed(this); },
				           intersect: function (arg) { return array.intersect(this, arg); },
				           is       : function (arg) { var a = []; this.each(function (i) { a.push(i.is(arg)); }); return a; },
				           isAlphaNum: function () { var a = []; this.each(function (i) { a.push(i.isAlphaNum()); }); return a; },
				           isBoolean: function () { var a = []; this.each(function (i) { a.push(i.isBoolean()); }); return a; },
				           isChecked: function () { var a = []; this.each(function (i) { a.push(i.isChecked()); }); return a; },
				           isDate   : function () { var a = []; this.each(function (i) { a.push(i.isDate()); }); return a; },
				           isDisabled: function () { var a = []; this.each(function (i) { a.push(i.isDisabled()); }); return a; },
				           isDomain : function () { var a = []; this.each(function (i) { a.push(i.isDomain()); }); return a; },
				           isEmail  : function () { var a = []; this.each(function (i) { a.push(i.isEmail()); }); return a; },
				           isEmpty  : function () { var a = []; this.each(function (i) { a.push(i.isEmpty()); }); return a; },
				           isHidden : function () { var a = []; this.each(function (i) { a.push(i.isHidden()); }); return a; },
				           isIP     : function () { var a = []; this.each(function (i) { a.push(i.isIP()); }); return a; },
				           isInt    : function () { var a = []; this.each(function (i) { a.push(i.isInt()); }); return a; },
				           isNumber : function () { var a = []; this.each(function (i) { a.push(i.isNumber()); }); return a; },
				           isPhone  : function () { var a = []; this.each(function (i) { a.push(i.isPhone()); }); return a; },
				           keys     : function () { return array.keys(this); },
				           last     : function (arg) { return array.last(this); },
				           listeners: function (event) { var a = []; this.each(function (i) { a = a.concat(i.listeners(event)); }); return a; },
				           loading  : function () { return this.each(function (i) { i.loading(); }); },
				           on       : function (event, listener, id, scope, state) { return this.each(function (i) { i.on(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
				           once     : function (event, listener, id, scope, state) { return this.each(function (i) { i.once(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
				           position : function () { var a = []; this.each(function (i) { a.push(i.position()); }); return a; },
				           prepend  : function (type, args) { var a = []; this.each(function (i) { a.push(i.prepend(type, args)); }); return a; },
				           range    : function (start, end) { return array.range(this, start, end); },
				           remove   : function (start, end) { return array.remove(this, start, end); },
				           removeClass: function (arg) { return this.each(function (i) { i.removeClass(arg); }); },
				           show     : function () { return this.each(function (i){ i.show(); }); },
				           size     : function () { var a = []; this.each(function (i) { a.push(i.size()); }); return a; },
				           text     : function (arg) {
				           		return this.each(function (node) {
				           			if (typeof node !== "object") node = utility.object(node);
				           			if (typeof node.text === "function") node.text(arg);
				           		});
				           },
				           tpl      : function (arg) { return this.each(function (i) { i.tpl(arg); }); },
				           total    : function () { return array.total(this); },
				           toObject : function () { return array.toObject(this); },
				           un       : function (event, id, state) { return this.each(function (i) { i.un(event, id, state); }); },
				           update   : function (arg) { return this.each(function (i) { element.update(i, arg); }); },
				           val      : function (arg) {
				           		var a    = [],
				           		    type = null,
				           		    same = true;

				           		this.each(function (i) {
				           			if (type !== null) same = (type === i.type);
				           			type = i.type;
				           			if (typeof i.val === "function") a.push(i.val(arg));
				           		});
				           		return same ? a[0] : a;
				           	},
				           validate : function () { var a = []; this.each(function (i) { a.push(i.validate()); }); return a; }},
				element : {addClass : function (arg) {
				           		utility.genId(this);
				           		return element.klass(this, arg, true);
				           },
				           after    : function (type, args) {
				           		utility.genId(this);
				           		return element.create(type, args, this, "after");
				           },
				           append   : function (type, args) {
				           		utility.genId(this);
				           		return element.create(type, args, this, "last");
				           },
				           attr     : function (key, value) {
				           		utility.genId(this);
				           		return element.attr(this, key, value);
				           },
				           before   : function (type, args) {
				           		utility.genId(this);
				           		return element.create(type, args, this, "before");
				           },
				           clear    : function () {
				           		utility.genId(this);
				           		return element.clear(this);
				           },
				           create   : function (type, args, position) {
				           		utility.genId(this);
				           		return element.create(type, args, this, position);
				           },
				           css       : function (key, value) {
				           		var i;
				           		utility.genId(this);
				           		if (!client.chrome && (i = key.indexOf("-")) && i > -1) {
				           			key = key.replace("-", "");
				           			key = key.slice(0, i) + key.charAt(i).toUpperCase() + key.slice(i + 1, key.length);
				           		}
				           		this.style[key] = value;
				           		return this;
				           },
				           data      : function (key, value) {
				           		utility.genId(this);
				           		return element.data(this, key, value);
				           },
				           destroy   : function () { return element.destroy(this); },
				           disable   : function () { return element.disable(this); },
				           enable    : function () { return element.enable(this); },
				           find      : function (arg) {
				           		utility.genId(this);
				           		return element.find(this, arg);
				           },
				           fire     : function (event, args) {
				           		utility.genId(this);
				           		return $.fire.call(this, event, args);
				           },
				           genId    : function () { return utility.genId(this); },
				           get      : function (uri, headers) {
				           		this.fire("beforeGet");
				           		var cached = cache.get(uri),
				           		    self   = this;

				           		!cached ? uri.get(function (arg) { self.html(arg).fire("afterGet"); }, function (arg) { self.fire("failedGet", {response: client.parse(arg), xhr: arg}); }, headers)
				           		        : this.html(cached.response).fire("afterGet");

				           		return this;
				           },
				           has      : function (arg) {
				           		utility.genId(this);
				           		return element.has(this, arg);
				           },
				           hasClass : function (arg) {
				           		utility.genId(this);
				           		return element.hasClass(this, arg);
				           },
				           hide     : function () {
				           		utility.genId(this);
				           		return element.hide(this);
				           },
				           html     : function (arg) {
				           		utility.genId(this);
				           		return typeof arg === "undefined" ? this.innerHTML : this.update({innerHTML: arg});
				           },
				           is       : function (arg) {
				           		utility.genId(this);
				           		return element.is(this, arg);
				           },
				           isAlphaNum: function () { return this.nodeName === "FORM" ? false : validate.test({alphanum: typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
				           isBoolean: function () { return this.nodeName === "FORM" ? false : validate.test({"boolean": typeof this.value !== "undefined" ? this.value : element.text(this)}).pass; },
				           isChecked: function () { return this.nodeName !== "INPUT" ? false : this.attr("checked"); },
				           isDate   : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : element.text(this).isDate(); },
				           isDisabled: function () { return this.nodeName !== "INPUT" ? false : this.attr("disabled"); },
				           isDomain : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : element.text(this).isDomain(); },
				           isEmail  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : element.text(this).isEmail(); },
				           isEmpty  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : element.text(this).isEmpty(); },
				           isHidden : function (arg) {
				           		utility.genId(this);
				           		return element.hidden(this);
				           },
				           isIP     : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isIP()     : element.text(this).isIP(); },
				           isInt    : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isInt()    : element.text(this).isInt(); },
				           isNumber : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isNumber() : element.text(this).isNumber(); },
				           isPhone  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isPhone()  : element.text(this).isPhone(); },
				           jsonp    : function (uri, property, callback) {
				           		var target = this,
				           		    arg    = property, fn;

				           		fn = function (response) {
				           			var self = target,
				           			    node = response,
				           			    prop = arg,
				           			    i, nth, result;

				           			try {
				           				if (typeof prop !== "undefined") {
				           					prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
				           					prop.each(function (i) {
				           						node = node[!!isNaN(i) ? i : parseInt(i)];
				           						if (typeof node === "undefined") throw Error(label.error.propertyNotFound);
				           					});
				           					result = node;
				           				}
				           				else result = response;
				           			}
				           			catch (e) {
				           				result = label.error.serverError;
				           				error(e, arguments, this);
				           			}

				           			self.text(result);
				           		};
				           		client.jsonp(uri, fn, function () { target.text(label.error.serverError); }, callback);
				           		return this;
				           },
				           listeners: function (event) {
				           		utility.genId(this);
				           		return $.listeners.call(this, event);
				           },
				           loading  : function () { return utility.loading(this); },
				           on       : function (event, listener, id, scope, state) {
				           		utility.genId(this);
				           		return $.on.call(this, event, listener, id, scope, state);
				           },
				           once     : function (event, listener, id, scope, state) {
				           		utility.genId(this);
				           		return $.once.call(this, event, listener, id, scope, state);
				           },
				           prepend  : function (type, args) {
				           		utility.genId(this);
				           		return element.create(type, args, this, "first");
				           },
				           prependChild: function (child) {
				           		utility.genId(this);
				           		return element.prependChild(this, child);
				           },
				           position : function () {
				           		utility.genId(this);
				           		return element.position(this);
				           },
				           removeClass : function (arg) {
				           		utility.genId(this);
				           		return element.klass(this, arg, false);
				           },
				           show     : function () {
				           		utility.genId(this);
				           		return element.show(this);
				           },
				           size     : function () {
				           		utility.genId(this);
				           		return element.size(this);
				           },
				           text     : function (arg) {
				           		utility.genId(this);
				           		return element.text(this, arg);
				           },
				           tpl      : function (arg) { return utility.tpl(arg, this); },
				           un       : function (event, id, state) {
				           		utility.genId(this);
				           		return $.un.call(this, event, id, state);
				           },
				           update   : function (args) {
				           		utility.genId(this);
				           		return element.update(this, args);
				           },
				           val      : function (arg) {
				           		utility.genId(this);
				           		return element.val(this, arg);
				           },
				           validate : function () { return this.nodeName === "FORM" ? validate.test(this) : typeof this.value !== "undefined" ? !this.value.isEmpty() : !element.text(this).isEmpty(); }},
				"function": {reflect: function () { return utility.reflect(this); }},
				number  : {diff     : function (arg) { return number.diff (this, arg); },
				           fire     : function (event, args) { $.fire.call(this.toString(), event, args); return this; },
				           format   : function (delimiter, every) { return number.format(this, delimiter, every); },
				           half     : function (arg) { return number.half(this, arg); },
				           isEven   : function () { return number.even(this); },
				           isOdd    : function () { return number.odd(this); },
				           listeners: function (event) { return $.listeners.call(this.toString(), event); },
				           on       : function (event, listener, id, scope, state) { $.on.call(this.toString(), event, listener, id, scope || this, state); return this; },
				           once     : function (event, listener, id, scope, state) { $.once.call(this.toString(), event, listener, id, scope || this, state); return this; },
				           roundDown: function () { return number.round(this, "down"); },
				           roundUp  : function () { return number.round(this, "up"); },
				           un       : function (event, id, state) { $.un.call(this.toString(), event, id, state); return this; }},
				string  : {allows   : function (arg) { return client.allows(this, arg); },
				           capitalize: function () { return string.capitalize(this); },
				           del      : function (success, failure, headers) { return client.request(this, "DELETE", success, failure, null, headers); },
				           escape   : function () { return string.escape(this); },
				           expire   : function (silent) { return cache.expire(this, silent); },
				           explode  : function (arg) { return string.explode(this, arg); },
				           fire     : function (event, args) { return $.fire.call(this, event, args); },
				           get      : function (success, failure, headers) { return client.request(this, "GET", success, failure, null, headers); },
				           headers  : function (success, failure) { return client.request(this, "HEAD", success, failure); },
				           hyphenate: function () { return string.hyphenate(this); },
				           isAlphaNum: function () { return validate.test({alphanum: this}).pass; },
				           isBoolean: function () { return validate.test({"boolean": this}).pass; },
				           isDate   : function () { return validate.test({date: this}).pass; },
				           isDomain : function () { return validate.test({domain: this}).pass; },
				           isEmail  : function () { return validate.test({email: this}).pass; },
				           isEmpty  : function () { return !validate.test({notEmpty: this}).pass; },
				           isIP     : function () { return validate.test({ip: this}).pass; },
				           isInt    : function () { return validate.test({integer: this}).pass; },
				           isNumber : function () { return validate.test({number: this}).pass; },
				           isPhone  : function () { return validate.test({phone: this}).pass; },
				           jsonp    : function (success, failure, callback) { return client.jsonp(this, success, failure, callback); },
				           listeners: function (event) { return $.listeners.call(this, event); },
				           post     : function (success, failure, args, headers) { return client.request(this, "POST", success, failure, args, headers); },
				           put      : function (success, failure, args, headers) { return client.request(this, "PUT", success, failure, args, headers); },
				           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
				           once     : function (event, listener, id, scope, state) { return $.once.call(this, event, listener, id, scope, state); },
				           options  : function (success, failure) { return client.request(this, "OPTIONS", success, failure); },
				           permissions: function () { return client.permissions(this); },
				           singular : function () { return string.singular(this); },
				           toCamelCase: function () { return string.toCamelCase(this); },
				           toNumber : function () { return number.parse(this); },
				           trim     : function () { return string.trim(this); },
				           un       : function (event, id, state) { return $.un.call(this, event, id, state); },
				           uncapitalize: function () { return string.uncapitalize(this); }}
			};

			utility.iterate(methods[type], function (v, k) { utility.property(obj.prototype, k, {value: v}); });
			return obj;
		},

		/**
		 * Returns an Object containing 1 or all key:value pairs from the querystring
		 *
		 * @method queryString
		 * @param  {String} arg [Optional] Key to find in the querystring
		 * @return {Object}     Object of 1 or all key:value pairs in the querystring
		 */
		queryString : function (arg) {
			arg        = arg || ".*";
			var obj    = {},
			    result = location.search.isEmpty() ? null : location.search.replace("?", ""),
			    item;

			if (result !== null) {
				result = result.split("&");
				result.each(function (prop) {
					item = prop.split("=");

					if (item[0].isEmpty()) return;

					switch (true) {
						case typeof item[1] === "undefined":
						case item[1].isEmpty():
							item[1] = "";
							break;
						case item[1].isNumber():
							item[1] = Number(item[1]);
							break;
						case item[1].isBoolean():
							item[1] = (item[1] === "true");
							break;
					}

					switch (true) {
						case typeof obj[item[0]] === "undefined":
							obj[item[0]] = item[1];
							break;
						case !(obj[item[0]] instanceof Array):
							obj[item[0]] = [obj[item[0]]];
						default:
							obj[item[0]].push(item[1]);
					}
				});
			}
			return obj;
		},

		/**
		 * Returns an Array of parameters of a Function
		 * 
		 * @method reflect
		 * @param  {Function} arg Function to reflect
		 * @return {Array}        Array of parameters
		 */
		reflect : function (arg) {
			if (typeof arg === "undefined") arg = this;
			if (typeof arg === "undefined") arg = $;
			arg = arg.toString().match(/function\s+\w*\s*\((.*?)\)/)[1];
			return arg !== "" ? arg.explode() : [];
		},

		/**
		 * Creates a recursive function
		 * 
		 * Return false from the function to halt recursion
		 * 
		 * @method repeat
		 * @param  {Function} fn  Function to execute repeatedly
		 * @param  {Number}   ms  Milliseconds to stagger the execution
		 * @param  {String}   id  [Optional] Timeout ID
		 * @return {String}       Timeout ID
		 */
		repeat : function (fn, ms, id) {
			ms = ms || 10;
			id = id || utility.guid(true);

			var recursive = function (fn, ms, id) {
				var recursive = this;

				if (fn() !== false) utility.defer(function () { recursive.call(recursive, fn, ms, id); }, ms);
			};

			recursive.call(recursive, fn, ms, id);
			return id;
		},

		/**
		 * Stops an Event from bubbling
		 * 
		 * @param  {Object} e Event
		 * @return {Object}   Event
		 */
		stop : function (e) {
			if (typeof e.cancelBubble    !== "undefined") e.cancelBubble = true;
			if (typeof e.preventDefault  === "function")  e.preventDefault();
			if (typeof e.stopPropagation === "function")  e.stopPropagation();
			return e;
		},

		/**
		 * Transforms JSON to HTML and appends to Body or target Element
		 *
		 * @method tpl
		 * @param  {Object} data   JSON Object describing HTML
		 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
		 * @return {Object}        New Element created from the template
		 */
		tpl : function (arg, target) {
			var frag;

			switch (true) {
				case typeof arg !== "object":
				case !(/object|undefined/.test(typeof target)) && typeof (target = target.charAt(0) === "#" ? $(target) : $(target)[0]) === "undefined":
					throw Error(label.error.invalidArguments);
			}

			if (typeof target === "undefined") target = $("body")[0];

			frag  = document.createDocumentFragment();
			switch (true) {
				case arg instanceof Array:
					arg.each(function (i, idx) { element.create(array.cast(i, true)[0], frag).html(array.cast(i)[0]); });
					break;
				default:
					utility.iterate(arg, function (i, k) {
						switch (true) {
							case typeof i === "string":
								element.create(k, frag).html(i);
								break;
							case i instanceof Array:
							case i instanceof Object:
								utility.tpl(i, element.create(k, frag));
								break;
						}
					});
			}
			target.appendChild(frag);
			return array.last(target.childNodes);
		},

		/**
		 * Walks a structure and returns arg
		 * 
		 * @method  walk
		 * @param  {Mixed}  obj  Object or Array
		 * @param  {String} arg  String describing the property to return
		 * @return {Mixed}       arg
		 */
		walk : function (obj, arg) {
			arg.replace(/\]$/, "").replace(/\]/g, ".").split(/\.|\[/).each(function (i) { obj = obj[i]; });
			return obj;
		}
	};

	/**
	 * Validation methods and patterns
	 *
	 * @class validate
	 * @namespace abaaso
	 */
	validate = {
		// Regular expression patterns to test against
		pattern : {
			alphanum : /^[a-zA-Z0-9]+$/,
			"boolean": /^(0|1|true|false)?$/,
			domain   : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
			email    : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			ip       : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
			integer  : /(^-?\d\d*$)/,
			notEmpty : /\w{1,}/,
			number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
			phone    : /^([0-9\(\)\/\+ \-\.]+)$/
		},

		/**
		 * Validates args based on the type or pattern specified
		 *
		 * @method test
		 * @param  {Object} args Object to test {(pattern[name] || /pattern/) : (value || #object.id)}
		 * @return {Object}      Results
		 */
		test : function (args) {
			var exception = false,
			    invalid   = [],
			    tracked   = {},
			    value     = null,
			    result    = [],
			    c         = [],
			    inputs    = [],
			    selects   = [],
			    i, p, o, x, nth;

			if (typeof args.nodeName !== "undefined" && args.nodeName === "FORM") {
				if (args.id.isEmpty()) args.genId();
				inputs  = $("#" + args.id + " input");
				selects = $("#" + args.id + " select");
				if (inputs.length > 0)  c = c.concat(inputs);
				if (selects.length > 0) c = c.concat(selects);
				c.each(function (i) {
					var z = {},
					    p, v, r;

					p = validate.pattern[i.nodeName.toLowerCase()] ? validate.pattern[i.nodeName.toLowerCase()] : ((!i.id.isEmpty() && validate.pattern[i.id.toLowerCase()]) ? validate.pattern[i.id.toLowerCase()] : "notEmpty");
					v = i.val();
					if (v === null) v = "";
					z[p] = v;
					r    = validate.test(z)
					if (!r.pass) {
						invalid.push({element: i, test: p, value: v});
						exception = true;
					}
				});
			}
			else {
				utility.iterate(args, function (i, k) {
					if (typeof k === "undefined" || typeof i === "undefined") {
						invalid.push({test: k, value: i});
						exception = true;
						return
					}
					value = String(i).charAt(0) === "#" ? (typeof $(i) !== "undefined" ? $(i).val() : "") : i;
					switch (k) {
						case "date":
							if (isNaN(new Date(value).getYear())) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						case "domain":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, ""))) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						case "domainip":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, "")) || !validate.pattern.ip.test(value)) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						default:
							p = typeof validate.pattern[k] !== "undefined" ? validate.pattern[k] : k;
							if (!p.test(value)) {
								invalid.push({test: k, value: value});
								exception = true;
							}
					}
				});
			}
			return {pass: !exception, invalid: invalid};
		}
	};

	/**
	 * XML methods
	 *
	 * @class xml
	 * @namespace abaaso
	 */
	xml = {
		/**
		 * Returns XML (Document) Object from a String
		 *
		 * @method decode
		 * @param  {String} arg XML String
		 * @return {Object}     XML Object or undefined
		 */
		decode : function (arg) {
			try {
				if (typeof arg !== "string" || arg.isEmpty()) throw Error(label.error.invalidArguments);

				var x;

				if (client.ie) {
					x = new ActiveXObject("Microsoft.XMLDOM");
					x.async = "false";
					x.loadXML(arg);
				}
				else x = new DOMParser().parseFromString(arg, "text/xml");
				return x;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns XML String from an Object or Array
		 *
		 * @method encode
		 * @param  {Mixed} arg Object or Array to cast to XML String
		 * @return {String}    XML String or undefined
		 */
		encode : function (arg, wrap) {
			try {
				if (typeof arg === "undefined") throw Error(label.error.invalidArguments);

				wrap = !(wrap === false);
				var x    = wrap ? "<xml>" : "",
				    top  = !(arguments[2] === false),
				    node, i;

				if (arg !== null && typeof arg.xml !== "undefined") arg = arg.xml;
				if (arg instanceof Document) arg = (new XMLSerializer()).serializeToString(arg);

				node = function (name, value) {
					var output = "<n>v</n>";
					if (/\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test(value)) output = output.replace(/v/, "<![CDATA[v]]>");
					return output.replace(/n/g, name).replace(/v/, value);
				}

				switch (true) {
					case typeof arg === "boolean":
					case typeof arg === "number":
					case typeof arg === "string":
						x += node("item", arg);
						break;
					case typeof arg === "object":
						utility.iterate(arg, function (v, k) { x += xml.encode(v, (typeof v === "object"), false).replace(/item|xml/g, isNaN(k) ? k : "item"); });
						break;
				}

				x += wrap ? "</xml>" : "";
				if (top) x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;

				return x;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	error     = utility.error;
	bootstrap = function () {
		var cleanup, fn;

		if (typeof abaaso.bootstrap === "function") delete abaaso.bootstrap;
		
		cleanup = function (obj) {
			var nodes = [];

			observer.remove(obj);
			if (obj.childNodes.length > 0) nodes = array.cast(obj.childNodes);
			if (nodes.length > 0) nodes.each(function (i) { cleanup(i); });
		};

		fn = function (e) {
			if (/complete|loaded/.test(document.readyState)) {
				if (typeof abaaso.init === "function") abaaso.init();
				return false;
			}
		};

		if (typeof Array.prototype.filter === "undefined") {
			Array.prototype.filter = function (fn) {
				if (this === void 0 || this === null || typeof fn !== "function") throw Error(label.error.invalidArguments);

				var i      = null,
					t      = Object(this),
					nth    = t.length >>> 0,
					result = [],
					prop   = arguments[1],
					val    = null;

				for (i = 0; i < nth; i++) {
					if (i in t) {
						val = t[i];
						if (fn.call(prop, val, i, t)) result.push(val);
					}
				}

				return result;
			};
		}

		if (typeof Array.prototype.forEach === "undefined") {
			Array.prototype.forEach = function (callback, thisArg) {
				if (this === null || typeof callback !== "function") throw Error(label.error.invalidArguments);

				var T,
				    k   = 0,
				    O   = Object(this),
				    len = O.length >>> 0;

				if (thisArg) T = thisArg;

				while (k < len) {
					var kValue;
					if (k in O) {
						kValue = O[k];
						callback.call(T, kValue, k, O);
					}
					k++;
				}
			};
		}

		if (typeof Array.prototype.indexOf === "undefined") {
			Array.prototype.indexOf = function(obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i++) {
					if (this[i] === obj) return i;
				}

				return -1;
			}
		}

		if (typeof Function.prototype.bind === "undefined") {
			Function.prototype.bind = function (arg) {
				var fn    = this,
				    slice = Array.prototype.slice,
				    args  = slice.call(arguments, 1);
				
				return function () {
					return fn.apply(arg, args.concat(slice.call(arguments)));
				};
			};
		}

		// Describing the Client
		abaaso.client.size = client.size();
		client.version();
		client.mobile();
		client.tablet();

		// IE7 and older is not supported
		if (client.ie && client.version < 8) return;

		// Cookie class is not relevant for server environment
		if (server) delete abaaso.cookie;

		// Binding helper & namespace to $
		$ = abaaso.$.bind($);
		utility.alias($, abaaso);
		delete $.$;
		delete $.bootstrap;
		delete $.callback;
		delete $.data;
		delete $.init;
		delete $.loading;

		// Creating route.initial after alias() so it's not assumed
		abaaso.route.initial = null;

		// Short cut to loading.create
		$.loading = abaaso.loading.create.bind($.loading);

		// Unbinding observer methods to maintain scope
		$.fire      = abaaso.fire;
		$.on        = abaaso.on;
		$.once      = abaaso.once;
		$.un        = abaaso.un;
		$.listeners = abaaso.listeners;

		// Setting initial application state
		abaaso.state._current = abaaso.state.current = "initial";
		$.state._current      = $.state.current      = abaaso.state.current;

		// Setting sugar
		if (!server) switch (true) {
			case typeof global.$ === "undefined" || global.$ === null:
				global.$ = $;
				break;
			default:
				global.a$ = $;
				abaaso.aliased = "a$";
		}

		// Hooking abaaso into native Objects
		utility.proto(Array, "array");
		if (typeof Element      !== "undefined") utility.proto(Element,      "element");
		if (typeof HTMLDocument !== "undefined") utility.proto(HTMLDocument, "element");
		utility.proto(Function, "function");
		utility.proto(Number, "number");
		utility.proto(String, "string");

		// Creating a singleton
		abaaso.constructor = abaaso;

		// Creating error log
		$.error.log = abaaso.error.log = [];

		// Setting events & garbage collection
		$.on(global, "error",      function (e) { $.fire("error", e); }, "error", global, "all");
		if (!server) {
			$.on(global, "hashchange", function ()  { $.fire("beforeHash, hash, afterHash", location.hash); }, "hash", global, "all");
			$.on(global, "resize",     function ()  { $.client.size = abaaso.client.size = client.size(); $.fire("resize", abaaso.client.size); }, "resize", global, "all");
			$.on(global, "load",       function ()  { $.fire("render").un("render"); });
			$.on(global, "DOMNodeInserted", function (e) {
				var obj = e.target;
				if (typeof obj.id !== "undefined" && obj.id.isEmpty()) {
					utility.genId(obj);
					if (obj.parentNode instanceof Element) obj.parentNode.fire("afterCreate", obj);
					$.fire("afterCreate", obj);
				}
			}, "mutation", global, "all");
			$.on(global, "DOMNodeRemoved", function (e) { cleanup(e.target); }, "mutation", global, "all");

			// Routing listener
			$.on("hash", function (arg) { if ($.route.enabled || abaaso.route.enabled) route.load(arg); }, "route", abaaso.route, "all");
		}

		// abaaso.state.current getter/setter
		var getter, setter;
		getter = function () { return this._current; };
		setter = function (arg) {
			if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

			abaaso.state.previous = abaaso.state._current;
			abaaso.state._current = arg;
			return abaaso.fire(arg);
		};

		switch (true) {
			case (!client.ie || client.version > 8):
				utility.property(abaaso.state, "current", {enumerable: true, get: getter, set: setter});
				utility.property($.state,      "current", {enumerable: true, get: getter, set: setter});
				break;
			default: // Pure hackery, only exists when needed
				abaaso.state.change = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
				$.state.change      = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
		}

		$.ready = true;

		// Preparing init()
		switch (true) {
			case server:
				abaaso.init();
				break;
			case typeof global.define === "function":
				global.define("abaaso", function () { return abaaso.init(); });
				break;
			case (/complete|loaded/.test(document.readyState)):
				abaaso.init();
				break;
			case typeof document.addEventListener === "function":
				document.addEventListener("DOMContentLoaded", abaaso.init, false);
				break;
			case typeof document.attachEvent === "function":
				document.attachEvent("onreadystatechange", fn);
				break;
			default:
				utility.timer.init = utility.repeat(fn);
		}
	};

	// @constructor
	return {
		// Classes
		array           : array,
		callback        : {},
		client          : {
			// Properties
			android : client.android,
			blackberry : client.blackberry,
			chrome  : client.chrome,
			firefox : client.firefox,
			ie      : client.ie,
			ios     : client.ios,
			linux   : client.linux,
			mobile  : client.mobile,
			opera   : client.opera,
			osx     : client.osx,
			playbook: client.playbook,
			safari  : client.safari,
			tablet  : client.tablet,
			size    : {height: 0, width: 0},
			version : 0,
			webos   : client.webos,
			windows : client.windows,

			// Methods
			del     : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
			get     : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
			headers : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
			post    : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
			put     : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
			jsonp   : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
			options : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
			permissions : client.permissions
		},
		cookie          : cookie,
		data            : data,
		element         : element,
		json            : json,
		label           : label,
		loading         : {
			create  : utility.loading,
			url     : null
		},
		message         : message,
		mouse           : mouse,
		number          : number,
		observer        : {
			log     : observer.log,
			add     : observer.add,
			fire    : observer.fire,
			list    : observer.list,
			once    : observer.once,
			remove  : observer.remove
		},
		state           : {
			_current    : null,
			header      : null,
			previous    : null
		},
		string          : string,
		validate        : validate,
		xml             : xml,

		// Methods & Properties
		$               : utility.$,
		alias           : utility.alias,
		aliased         : "$",
		allows          : client.allows,
		append          : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return element.create(type, args, obj, "last");
		},
		bootstrap       : bootstrap,
		clear           : element.clear,
		clone           : utility.clone,
		coerce          : utility.coerce,
		compile         : utility.compile,
		create          : element.create,
		css             : element.css,
		decode          : json.decode,
		defer           : utility.defer,
		define          : utility.define,
		del             : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
		destroy         : element.destroy,
		encode          : json.encode,
		error           : utility.error,
		expire          : cache.clean,
		expires         : 120000,
		extend          : utility.extend,
		fire            : function (obj, event, arg) {
			var all = typeof arg !== "undefined",
			    o, e, a;

			o = all ? obj   : this;
			e = all ? event : obj;
			a = all ? arg   : event;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.fire(o, e, a);
		},
		genId           : utility.genId,
 		get             : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
		guid            : utility.guid,
		headers         : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
		hidden          : element.hidden,
		id              : "abaaso",
		init            : function () {
			// Stopping multiple executions
			delete abaaso.init;

			// Firing events to setup
			return $.fire("init").un("init").fire("ready").un("ready");
		},
		iterate         : utility.iterate,
		jsonp           : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
		listeners       : function (event) {
			var obj = this;

			if (typeof obj === "undefined" || obj === $) obj = abaaso;
			return observer.list(obj, event);
		},
		log             : utility.log,
		merge           : utility.merge,
		module          : utility.module,
		object          : utility.object,
		on              : function (obj, event, listener, id, scope, state) {
			var all = typeof listener === "function",
			    o, e, l, i, s, st;

			o  = all ? obj      : this;
			e  = all ? event    : obj;
			l  = all ? listener : event;
			i  = all ? id       : listener;
			s  = all ? scope    : id;
			st = all ? state    : scope;

			if (typeof o === "undefined" || o === $) o = abaaso;
			if (typeof s === "undefined") s = o;
			return observer.add(o, e, l, i, s, st);
		},
		once            : function (obj, event, listener, id, scope, state) {
			var all = typeof listener === "function",
			    o, e, l, i, s, st;

			o  = all ? obj      : this;
			e  = all ? event    : obj;
			l  = all ? listener : event;
			i  = all ? id       : listener;
			s  = all ? scope    : id;
			st = all ? state    : scope;

			if (typeof o === "undefined" || o === $) o = abaaso;
			if (typeof s === "undefined") s = o;
			return observer.once(o, e, l, i, s, st);
		},
		options         : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
		permissions     : client.permissions,
		position        : element.position,
		post            : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
		prepend         : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return element.create(type, args, obj, "first");
		},
		property        : utility.property,
		put             : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
		queryString     : utility.queryString,
		ready           : false,
		reflect         : utility.reflect,
		repeat          : utility.repeat,
		route           : {
			enabled : false,
			del     : route.del,
			hash    : route.hash,
			init    : route.init,
			list    : route.list,
			load    : route.load,
			set     : route.set
		},
		stylesheet      : function (arg, media) { return element.create("link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, $("head")[0]); },
		script          : function (arg, target, pos) { return element.create("script", {type: "application/javascript", src: arg}, target || $("head")[0], pos); },
		stop            : utility.stop,
		store           : function (arg, args) { return data.register.call(data, arg, args); },
		tpl             : utility.tpl,
		un              : function (obj, event, id, state) {
			var all = typeof id !== "undefined",
			    o, e, i, s;

			o = all ? obj   : this;
			e = all ? event : obj;
			i = all ? id    : event;
			s = all ? state : id;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.remove(o, e, i, s);
		},
		update          : element.update,
		version         : "2.8.0",
		walk            : utility.walk
	};
})();

// Conditional bootstrap incase of multiple loading
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();

// Node, AMD & window supported
switch (true) {
	case typeof exports !== "undefined":
		module.exports = {$: $, abaaso: abaaso};
		break;
	case typeof define === "function":
		define(function () { return abaaso; });
		break;
	default:
		global.abaaso = abaaso;
}
})(this);
