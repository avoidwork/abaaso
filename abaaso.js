/**
 * Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Jason Mulligan nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * abaaso
 *
 * Events: ready          Fires when the DOM is available
 *         render         Fires when the window resources have loaded
 *         resize         Fires when the window resizes; parameter for listeners is abaaso.client.size
 *         afterCreate    Fires after an Element is created; parameter for listeners is the (new) Element
 *         afterDestroy   Fires after an Element is destroyed; parameter for listeners is the (removed) Element.id value
 *         beforeCreate   Fires when an Element is about to be created; parameter for listeners is the (new) Element.id value
 *         beforeDestroy  Fires when an Element is about to be destroyed; parameter for listeners is the (to be removed) Element
 *         error          Fires when an Error is caught; parameter for listeners is the logged Object (abaaso.error.log[n])
 *         hash           Fires when window.location.hash changes; parameter for listeners is the hash value
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @module abaaso
 * @version 1.6.103
 */
var abaaso = abaaso || (function(){
	"use strict";

	/**
	 * Array methods
	 *
	 * @class array
	 * @namespace abaaso
	 */
	var array = {
		/**
		 * Returns an Object (NodeList, etc.) as an Array
		 *
		 * @method cast
		 * @param  {Object}  obj Object to cast
		 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
		 * @return {Array}   Object as an Array
		 */
		cast : function(obj, key) {
			try {
				if (typeof obj !== "object")
					throw Error(label.error.expectedObject);

				key   = (key === true);
				var o = [], i, nth;

				switch (true) {
					case !isNaN(obj.length):
						for (i = 0, nth = obj.length; i < nth; i++) { o.push(obj[i]); }
						break;
					default:
						for (i in obj) { o.push(key ? i : obj[i]); }
				}
				return o;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the index of arg(s) in instance
		 *
		 * @method contains
		 * @param  {Array}  instance An instance of the array to search
		 * @param  {String} arg      Comma delimited string of search values
		 * @return {Mixed}  Integer or an array of integers representing the location of the arg(s)
		 */
		contains : function(instance, arg) {
			try {
				if (!instance instanceof Array)
					throw Error(label.error.expectedArray);

				if (/,/.test(arg)) arg = arg.split(/\s*,\s*/);
				if (arg instanceof Array) {
					var indexes = [],
					    nth     = args.length,
					    i       = null;

					for (i = 0; i < nth; i++) { indexes[i] = obj.index(arg[i]); }
					return indexes;
				}
				return obj.index(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @method diff
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array} Array of the differences
		 */
		diff : function(array1, array2) {
			try {
				if (!array1 instanceof Array || !array2 instanceof Array)
					throw Error(label.error.expectedArray);

				return array1.filter(function(key){return (array2.indexOf(key) < 0);});
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the first Array node
		 *
		 * @method first
		 * @param  {Array} obj The array
		 * @return {Mixed} The first node of the array
		 */
		first : function(obj) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				return obj[0];
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the index of arg in instance. Use contains() for multiple arguments
		 *
		 * @method index
		 * @param  {Array} obj Array to search
		 * @param  {Mixed} arg Value to find index of
		 * @return {Integer} The position of arg in instance
		 */
		index : function(obj, arg) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				var i = obj.length;

				while (i--) { if (obj[i] === arg) return i; }
				return -1;
			}
			catch (e) {
				$.error(e, arguments, this);
				return -1;
			}
		},

		/**
		 * Returns an Associative Array as an Indexed Array
		 *
		 * @method indexed
		 * @param  {Array} obj Array to index
		 * @return {Array} Indexed Array
		 */
		indexed : function(obj) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				var o, i = 0, indexed = [];

				for (o in obj) {
					if (typeof obj[o] !== "function") {
						indexed[i] = obj[o] instanceof Array ? obj[o].indexed() : obj[o];
						i++
					}
				}
				indexed.length = i;
				return indexed;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the keys in the array
		 *
		 * @method keys
		 * @param  {Array} obj Array to extract keys from
		 * @return {Array} Array of the keys
		 */
		keys : function(obj) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				var keys = [],
				    i    = null;

				for (i in obj) { if (typeof obj[i] !== "function") keys.push(i); }
				return keys;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the last node of the array
		 *
		 * @method last
		 * @param  {Array} obj Array
		 * @return {Mixed} Last node of Array
		 */
		last : function(obj) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				return obj.length > 1 ? obj[(obj.length - 1)] : obj.first();
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Removes indexes from an Array without recreating it
		 *
		 * @method remove
		 * @param  {Array}   obj   Array to remove from
		 * @param  {Integer} start Starting index
		 * @param  {Integer} end   [Optional] Ending index
		 * @return {Array} Modified Array
		 */
		remove : function(obj, start, end) {
			try {
				if (!obj instanceof Array || isNaN(start))
						throw Error(label.error.invalidArguments);

				start = start || 0;

				var length    = obj.length,
				    remaining = obj.slice((end || start) + 1 || length);

				obj.length = start < 0 ? (length + start) : start;
				obj.push.apply(obj, remaining);
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the total keys in an Array
		 *
		 * @method
		 * @param  {Array} obj Array to find the length of
		 * @return {Integer} Number of keys in Array
		 */
		total : function(obj) {
			try {
				if (!obj instanceof Array)
					throw Error(label.error.expectedArray);

				var i = 0, arg;

				for (arg in obj) { if (typeof obj[arg] !== "function") i++; }
				return i;
			}
			catch (e) {
				$.error(e, arguments, this);
				return -1;
			}
		}
	};

	/**
	 * Cache for RESTful behavior
	 *
	 * @class cache
	 * @namespace abaaso
	 * @private
	 */
	var cache = {
		// Collection URIs
		items : {},

		/**
		 * Garbage collector for the cached items
		 *
		 * @method clean
		 * @return {Undefined} undefined
		 */
		clean : function() {
			var uri;

			for (uri in cache.items) { if (cache.expired(uri)) cache.expire(uri); }
			return;
		},

		/**
		 * Expires a URI from the local cache
		 *
		 * @method expire
		 * @param  {String} uri URI of the local representation
		 * @return {Undefined} undefined
		 */
		expire : function(uri) {
			if (typeof cache.items[uri] !== "undefined") delete cache.items[uri];
			return;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @method expired
		 * @param  {Object} uri Cached URI object
		 * @return {Boolean} True if the URI has expired
		 */
		expired : function(uri) {
			var o      = abaaso.client,
			    c      = cache.items[uri],
			    epoch  = typeof c !== "undefined" ? new Date(c.epoch) : null,
			    expire = typeof c !== "undefined" && typeof c.headers.Expires !== "undefined" ? new Date(c.headers.Expires) : null,
			    now    = new Date(),
			    date   = typeof c !== "undefined" && typeof c.headers.Date !== "undefined" ? new Date(c.headers.Date) : null;

			return typeof c !== "undefined" && ((expire !== null && expire < now)
			                                   || (date !== null && date.setMilliseconds(date.getMilliseconds() + o.expire) < now)
			                                   || (o.expire > 0 && epoch.setMilliseconds(epoch.getMilliseconds() + o.expire) < now));
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @method get
		 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
		 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
		 * @return {Mixed} URI Object {headers, response} or False
		 */
		get : function(uri, expire) {
			try {
				expire = expire === false ? false : true;

				if (typeof cache.items[uri] === "undefined") return false;
				if (typeof cache.items[uri].headers !== "undefined") {
					if ((typeof cache.items[uri].headers.Pragma !== "undefined" && cache.items[uri].headers.Pragma === "no-cache" && expire) || cache.expired(cache.items[uri])) {
						cache.expire(uri);
						return false;
					}
					else { return cache.items[uri]; }
				}
				else { return cache.items[uri]; }
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @method set
		 * @param  {String} uri      URI to set or update
		 * @param  {String} property Property of the cached URI to set
		 * @param  {Mixed} value     Value to set
		 * @return {Mixed} URI Object {headers, response} or undefined
		 */
		set : function(uri, property, value) {
			try {
				if (typeof cache.items[uri] === "undefined") {
					cache.items[uri] = {};
					cache.items[uri].permission = 0;
				}
				property === "permission" ? cache.items[uri].permission |= value
				                         : (property === "!permission" ? cache.items[uri].permission &= ~value
				                                                      : cache.items[uri][property]   =  value);
				return cache.items[uri];
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Client properties and methods
	 *
	 * @class client
	 * @namespace abaaso
	 */
	var client = {
		// Public properties
		android : (function(){ return /android/i.test(navigator.userAgent); })(),
		blackberry : (function(){ return /blackberry/i.test(navigator.userAgent); })(),
		chrome  : (function(){ return /chrome/i.test(navigator.userAgent); })(),
		css3    : (function(){
			switch (true) {
				case this.mobile:
				case this.tablet:
				case this.chrome  && this.version > 5:
				case this.firefox && this.version > 2:
				case this.ie      && this.version > 8:
				case this.opera   && this.version > 8:
				case this.safari  && this.version > 4:
					this.css3 = true;
					return true;
				default:
					this.css3 = false;
					return false;
			}
			}),
		expire  : 0,
		firefox : (function(){ return /firefox/i.test(navigator.userAgent); })(),
		ie      : (function(){ return /msie/i.test(navigator.userAgent); })(),
		ios     : (function(){ return /ipad|iphone/i.test(navigator.userAgent); })(),
		linux   : (function(){ return /linux|bsd|unix/i.test(navigator.userAgent); })(),
		meego   : (function(){ return /meego/i.test(navigator.userAgent); })(),
		mobile  : (function(){ return /android|blackberry|ipad|iphone|meego|webos/i.test(navigator.userAgent); })(),
		playbook: (function(){ return /playbook/i.test(navigator.userAgent); })(),
		opera   : (function(){ return /opera/i.test(navigator.userAgent); })(),
		osx     : (function(){ return /macintosh/i.test(navigator.userAgent); })(),
		safari  : (function(){ return /safari/i.test(navigator.userAgent.replace(/chrome.*/i, "")); })(),
		tablet  : (function(){ return /android|ipad|playbook|meego|webos/i.test(navigator.userAgent) && (client.size.x >= 1000 || client.size.y >= 1000); }),
		webos   : (function(){ return /webos/i.test(navigator.userAgent); })(),
		windows : (function(){ return /windows/i.test(navigator.userAgent); })(),
		version : (function(){
			var version = 0;
			switch (true) {
				case this.chrome:
					version = navigator.userAgent.replace(/(.*chrome\/|safari.*)/gi, "");
					break;
				case this.firefox:
					version = navigator.userAgent.replace(/(.*firefox\/)/gi, "");
					break;
				case this.ie:
					version = navigator.userAgent.replace(/(.*msie|;.*)/gi, "");
					break;
				case this.opera:
					version = navigator.userAgent.replace(/(.*opera\/|\(.*)/gi, "");
					break;
				case this.safari:
					version = navigator.userAgent.replace(/(.*version\/|safari.*)/gi, "");
					break;
				default:
					version = navigator.appVersion;
			}
			version      = !isNaN(parseInt(version)) ? parseInt(version) : 0;
			this.version = version;
			return version;
		}),

		/**
		 * Quick way to see if a URI allows a specific command
		 *
		 * @method allow
		 * @param  {String} uri     URI to query
		 * @param  {String} command Command to query for
		 * @return {Boolean} True if the command is allowed
		 */
		allow : function(uri, command) {
			try {
				if (uri.isEmpty() || command.isEmpty())
					throw Error(label.error.invalidArguments);

				if (!cache.get(uri, false)) return undefined;

				var result;

				switch (true) {
					case command.toLowerCase() === "delete":
						result = !((uri.permission(command).bit & 1) === 0);
						break;
					case command.toLowerCase() === "get":
						result = !((uri.permission(command).bit & 4) === 0);
						break;
					case /post|put/i.test(command):
						result = !((uri.permission(command).bit & 2) === 0);
						break;
					default:
						result = false;
				}
				return result;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the permission of the cached URI
		 *
		 * @method permission
		 * @param  {String} uri URI to query
		 * @return {Object} Contains an Array of available commands, the permission bit and a map
		 */
		permission : function (uri) {
			var cached = cache.get(uri, false),
			    bit    = !cached ? 0 : cached.permission,
				result = {allows: [], bit: bit, map: {read: 4, write: 2, "delete": 1}};

			if (bit & 1) result.allows.push("DELETE");
			if (bit & 2) (function(){ result.allows.push("PUT"); result.allows.push("PUT"); })();
			if (bit & 4) result.allows.push("GET");
			return result;
		},

		/**
		 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
		 *
		 * Events: beforeXHR       Fires before the XmlHttpRequest is made
		 *         before[type]    Fires before the XmlHttpRequest is made, type specific
		 *         failed[type]    Fires on error
		 *         received[type]  Fires on XHR readystate 2, clears the timeout only!
		 *         timeout[type]   Fires 30s after XmlHttpRequest is made
		 *
		 * @method request
		 * @param  {String}   uri     URI to query
		 * @param  {String}   type    Type of request (DELETE/GET/POST/PUT/JSONP)
		 * @param  {Function} success A handler function to execute when an appropriate response been received
		 * @param  {Function} failure [Optional] A handler function to execute on error
		 * @param  {Mixed}    args    Data to send with the request, or a custom JSONP handler parameter name
		 * @return {String} URI to query
		 * @private
		 */
		request : function(uri, type, success, failure, args) {
			try {
				if (/post|put/i.test(type) && typeof args === "undefined")
					throw Error(label.error.invalidArguments);

				if (type.toLowerCase() === "jsonp") {
					var curi = new String(uri), uid;

					curi.on("afterJSONP", function(arg){ success(arg); });

					do uid = "a" + utility.id();
					while (typeof abaaso.callback[uid] !== "undefined");

					if (typeof args === "undefined") args = "callback";
					uri = uri.replace(args + "=?", args + "=abaaso.callback." + uid);
					abaaso.callback[uid] = function(arg){
						delete abaaso.callback[uid];
						curi.fire("afterJSONP", arg)
						    .un("afterJSONP");
					};
					el.create("script", {src: uri, type: "text/javascript"}, $("head")[0]);
				}
				else {
					type = type.toLowerCase();
					var xhr     = new XMLHttpRequest(),
					    payload = /post|put/i.test(type) ? args : null,
					    headers = type === "get" && args instanceof Object ? args : null,
					    cached  = type === "options" ? false : cache.get(uri, false),
						typed   = type.capitalize(),
						timer   = function(){
							clearTimeout(abaaso.timer[typed + "-" + uri]);
							delete abaaso.timer[typed + "-" + uri];
							uri.un("received" + typed)
							   .un("timeout"  + typed);
						},
						fail    = function(){
							timer();
							uri.fire("failed" + typed);
						};

					if (type === "delete") {
						uri.on("afterDelete", function(){
							cache.expire(uri);
							uri.un("afterDelete", "expire");
						}, "expire");
					}

					uri.on("received" + typed, timer)
					   .on("timeout"  + typed, fail)
					   .on("after"    + typed, function(arg){ if (typeof success === "function") success(arg); })
					   .on("failed"   + typed, function(){ if (typeof failure === "function") failure(); })
					   .fire("before" + typed)
					   .fire("beforeXHR");

					if (type !== "options" && uri.allow(type) === false) {
						uri.fire("failed" + typed);
						return uri;
					}

					abaaso.timer[typed + "-" + uri] = setTimeout(function(){ uri.fire("timeout" + typed); }, 30000);

					xhr.onreadystatechange = function() { client.response(xhr, uri, type); };
					xhr.open(type.toUpperCase(), uri, true);

					if (payload !== null) {
						switch (true) {
							case typeof payload.xml !== "undefined":
								payload = payload.xml;
							case payload instanceof Document:
								payload = $.xml.decode(payload);
							case typeof payload === "string" && /<[^>]+>[^<]*]+>/.test(payload):
								xhr.setRequestHeader("Content-type", "application/xml");
								break;
							case payload instanceof Object:
								xhr.setRequestHeader("Content-type", "application/json");
								payload = json.encode(payload);
								break;
							default:
								xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
						}
					}

					if (headers !== null) for (i in headers) { xhr.setRequestHeader(i, headers[i]); }
					if (typeof cached === "object" && typeof cached.headers.ETag !== "undefined") xhr.setRequestHeader("ETag", cached.headers.ETag);
					xhr.send(payload);
				}
				return uri;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
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
		response : function(xhr, uri, type) {
			try {
				var typed = type.toLowerCase().capitalize(), bit;

				/**
				 * Gets bit value based on the Array
				 *
				 * 1 --d delete
				 * 2 -w- write
				 * 3 -wd write and delete
				 * 4 r-- read
				 * 5 r-x read and delete
				 * 6 rw- read and write
				 * 7 rwx read, write and delete
				 *
				 * @method bit
				 * @param  {Array} args Array of commands the URI accepts
				 * @return {Integer} To be set as a bit
				 */
				bit = function(args) {
					try {
						if (!args instanceof Array)
							throw Error(label.error.expectedArray);

						var result = 0,
							nth    = args.length,
							i;

						for (i = 0; i < nth; i++) {
							switch (args[i].toLowerCase()) {
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
						}
						return result;
					}
					catch (e) {
						$.error(e, arguments, this);
						return 0;
					}
				};

				switch (true) {
					case xhr.readyState === 2:
						uri.fire("received" + typed);

						var headers = xhr.getAllResponseHeaders().split("\n"),
						    i       = null,
						    nth     = headers.length,
						    items   = {},
						    allow   = null,
						    o, header, value;

						for (i = 0; i < nth; i++) {
							if (!headers[i].isEmpty()) {
								var header    = headers[i].toString(),
								    value     = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");

								header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
								items[header] = value;
								if (header.toLowerCase() === "allow") allow = value;
							}
						}
						cache.set(uri, "headers", items);
						cache.set(uri, "permission", bit(allow !== null ? allow.split(/\s*,\s*/) : [type]));
						break;
					case xhr.readyState === 4:
						switch (xhr.status) {
							case 200:
							case 204:
							case 205:
							case 301:
								var state = null, s = abaaso.state, r, t;

								if (!/delete|options/i.test(type) && /200|301/.test(xhr.status)) {
									t = typeof cache.get(uri, false).headers === "object" ? cache.get(uri, false).headers["Content-Type"] : "";
									switch (true) {
										case /xml/.test(t):
											r = xml.decode(typeof xhr.responseXML.xml !== "undefined" ? xhr.responseXML.xml : xhr.responseText);
											break;
										case /json/.test(t):
											r = json.decode(xhr.responseText);
											break;
										default:
											r = xhr.responseText;
									}

									if (typeof r === "undefined")
										throw Error(label.error.serverError);

									cache.set(uri, "epoch", new Date());
									cache.set(uri, "response", r);
								}

								o = cache.get(uri, false);
								if (type === "options") cache.expire(uri);

								// HATEOAS triggered
								if (type !== "options" && s.header !== null && (state = o.headers[s.header]) && typeof state !== "undefined" && !new s.current !== state)
									typeof s.change === "function" ? s.change(state) : s.current = state;

								uri.fire("afterXHR");
								switch (xhr.status) {
									case 200:
										uri.fire("after" + typed, type === "options" ? o.headers : o.response);
										break;
									case 205:
										uri.fire("reset");
										break;
									case 301:
										uri.fire("moved", o.response);
										break;
								}
								break;
							case 401:
								throw Error(label.error.serverUnauthorized);
								break;
							case 403:
								throw Error(label.error.serverForbidden);
								break;
							case 405:
								cache.set(uri, "!permission", bit(type));
								throw Error(label.error.serverInvalidMethod);
								break;
							default:
								throw Error(label.error.serverError);
						}
						break;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				uri.fire("failed" + typed);
			}
			return uri;
		},


		/**
		 * Returns the visible area of the View
		 *
		 * @method size
		 * @return {Object} Describes the View {x: ?, y: ?}
		 * @private
		 */
		size : function() {
			var x = document.compatMode === "CSS1Compat" && !client.opera ? document.documentElement.clientWidth  : document.body.clientWidth,
			    y = document.compatMode === "CSS1Compat" && !client.opera ? document.documentElement.clientHeight : document.body.clientHeight;

			return {x: x, y: y};
		}
	};

	/**
	 * Cookie methods
	 *
	 * @class cookie
	 * @namespace abaaso
	 */
	var cookie = {
		/**
		 * Expires a cookie if it exists
		 *
		 * @method expire
		 * @param  {String} name Name of the cookie to expire
		 * @return {String} Name of the expired cookie
		 */
		expire : function(name) {
			if (typeof this.get(name) !== "undefined") this.set(name, "", "-1s");
			return name;
		},

		/**
		 * Gets a cookie
		 *
		 * @method get
		 * @param  {String} name Name of the cookie to get
		 * @return {Mixed} Cookie or undefined
		 */
		get : function(name) {
			return this.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @method list
		 * @return {Object} Collection of cookies
		 */
		list : function() {
			var i      = null,
			    nth    = null,
			    item   = null,
			    items  = null,
			    result = {};

			if (typeof document.cookie !== "undefined" && !document.cookie.isEmpty()) {
				items = document.cookie.split(';');
				nth   = items.length;

				for (i = 0; i < nth; i++) {
					item = items[i].split("=");
					result[decodeURIComponent(item[0].toString().trim())] = decodeURIComponent(item[1].toString().trim());
				}
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
		 * @return {Object} The new cookie
		 */
		set : function(name, value, offset) {
			offset = offset.toString() || "";
			var expire = "",
			    span   = null,
			    type   = null,
			    types  = ["d", "h", "m", "s"],
			    i      = types.length;

			if (!offset.isEmpty()) {
				while (i--) {
					if (new RegExp(types[i]).test(offset)) {
						type = types[i];
						span = parseInt(offset);
						break;
					}
				}

				if (isNaN(span))
					throw Error(label.error.invalidArguments);

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
			if (!expire.isEmpty()) expire = "; expires=" + expire.toUTCString();
			document.cookie = name.toString().trim() + "=" + value + expire + "; path=/";
			return this.get(name);
		}
	};

	/**
	 * Template data store, use abaaso.store(obj) or abaaso.data.register(obj)
	 * to register it with an Object
	 *
	 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
	 *
	 * Do not use this directly!
	 *
	 * @class data
	 * @namespace abaaso
	 */
	var data = {
		// Identifies the key in a POST response
		key     : null,

		// Record storage
		keys    : {},
		records : [],

		// Total records in the store
		total   : 0,

		// URI the data store represents (RESTful behavior),
		// has a getter & setter as 'uri'
		_uri     : null,

		/**
		 * Batch sets or deletes data in the store
		 *
		 * Events: beforeDataBatch  Fires before the batch is queued
		 *         afterDataBatch   Fires after the batch is queued
		 *
		 * @method batch
		 * @param  {String}  type Type of action to perform
		 * @param  {Mixed}   data Array of keys or indexes to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync [Optional] True if called by data.sync
		 * @return {Object} Data store
		 */
		batch : function(type, data, sync) {
			type = type.toString().toLowerCase() || undefined;
			sync = (sync === true);

			try {
				if (!/^(set|del)$/.test(type) || typeof data !== "object")
						throw Error(label.error.invalidArguments);

				var obj = this.parentNode,
				    i, nth, key;

				obj.fire("beforeDataBatch");
				if (data instanceof Array) {
					for (i = 0, nth = data.length; i < nth; i++) {
						switch (type) {
							case "del":
								this.del(data[i], false);
								break;
							case "set":
								key = this.key !== null && typeof data[i][this.key] !== "undefined" ? this.key : i;
								this.set(key, data[i], sync);
								break;
						}
					}
				}
				else {
					for (i in data) {
						switch (type) {
							case "del":
								this.del(data[i], false);
								break;
							case "set":
								key = this.key !== null && typeof data[i][this.key] !== "undefined" ? this.key : i;
								key !== i ? delete data[i][key] : key = key.toString();
								this.set(key, data[i], sync);
								break;
						}
					}
				}
				if (type === "del") this.reindex();
				obj.fire("afterDataBatch");
				return this;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Clears the data object, unsets the uri property
		 *
		 * Events: beforeDataClear  Fires before the data is cleared
		 *         afterDataClear   Fires after the data is cleared
		 *
		 * @method clear
		 * @return {Object} Data store
		 */
		clear : function() {
			var obj = this.parentNode;
			obj.fire("beforeDataClear");
			this.uri     = null;
			this.keys    = {};
			this.records = [];
			this.total   = 0;
			obj.fire("afterDataClear");
			return this;
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
		 * @return {Object} Data store
		 */
		del : function(record, reindex) {
			try {
				if (typeof record === "undefined" || (typeof record !== "number" || typeof record !== "string"))
					throw Error(label.error.invalidArguments);

				reindex = reindex === false ? false : true;

				var obj  = this.parentNode,
				    guid = $.genId(),
				    key;

				if (typeof record === "string") {
					key    = record;
					record = this.keys[key];
					if (typeof key === "undefined")
						throw Error(label.error.invalidArguments);

					record = record.index;
				}
				else {
					key = this.records[record];
					if (typeof key === "undefined")
						throw Error(label.error.invalidArguments);

					key = key.key;
				}

				obj.on("syncDataDelete", function(){
					obj.un("syncDataDelete", guid);
					this.records.remove(record);
					delete this.keys[key];
					this.total--;
					if (reindex) this.reindex();
					obj.fire("afterDataDelete");
					return this;
				}, guid, this);

				obj.fire("beforeDataDelete");
				this.uri === null ? obj.fire("syncDataDelete")
				                  : $.del(this.uri+"/"+key, function(){ obj.fire("syncDataDelete"); }, function(){ obj.fire("failedDataDelete"); });
				return this;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds needle in the haystack
		 *
		 * Events: beforeDataFind  Fires before the search begins
		 *         afterDataFind   Fires after the search has finished
		 *
		 * @method find
		 * @param  {Mixed} needle   String, Number or Pattern to test for
		 * @param  {Mixed} haystack [Optional] The field(s) to search
		 * @return {Array} Array of results
		 */
		find : function(needle, haystack) {
			try {
				if (typeof needle === "undefined")
					throw Error(label.error.invalidArguments);

				var h      = [],
				    n      = typeof needle === "string" ? needle.split(/\s*,\s*/) : needle,
				    result = [],
				    nth    = h.length,
					nth2   = n.length,
					obj    = this.parentNode,
					x, y, f, r, s, p, i;

				obj.fire("beforeDataFind");

				if (typeof haystack === "undefined" || !haystack instanceof Array) {
					if (typeof haystack === "string") {
						h = haystack.split(/\s*,\s*/);
						for (i in h) {
							if (typeof this.records.first().data[h[i]] === "undefined")
								throw Error(label.error.invalidArguments);
						}
					}
					else { for (i in this.records.first().data) { h.push(i); } }
				}
				else {
					for (i in haystack) {
						if (typeof this.records.first().data[haystack[i]] === "undefined")
							throw Error(label.error.invalidArguments);
					}
					h = haystack;
				}

				i = this.records.length
				while (i--) {
					for (x = 0; x < nth; x++) {
						for (y = 0; y < nth2; y++) {
							f = h[x];
							p = n[y];
							r = new RegExp(p, "gi");
							s = this.records[i].data[f];
							if (r.test(s)) result.push(this.records[i]);
						}
					}
				}

				obj.fire("afterDataFind");
				return result;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Retrieves a record based on key or index
		 *
		 * If the key is an integer, cast to a string before sending as an argument!
		 *
		 * Events: beforeDataGet  Fires before getting the record
		 *         afterDataGet   Fires after getting the record
		 *
		 * @method get
		 * @param  {Mixed} record Record key, index or Array of pagination start & end
		 * @return {Object} Record
		 */
		get : function(record) {
			try {
				var r   = [],
				    obj = this.parentNode,
				    i, start, end;

				obj.fire("beforeDataGet");
				if (typeof record === "string") r = typeof this.keys[record] !== "undefined" ? this.records[this.keys[record].index] : undefined;
				else if (record instanceof Array) {
					if (!!isNaN(record[0]) || !!isNaN(record[1]))
						throw Error(label.error.invalidArguments);

					start = record[0] - 1;
					end   = record[1] - 1;
					for (i = start; i < end; i++) { if (typeof this.records[i] !== "undefined") r.push(this.records[i]); }
				}
				else { r = this.records[record]; }
				obj.fire("afterDataGet");
				return r;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
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
		 * @return {Object} Object registered with
		 */
		register : function(obj, data) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.register(obj[i], data); }
				}
				else {
					var getter, setter;
					getter = function(){ return this._uri; };
					setter = function(arg){
						try {
							if (arg !== null && arg.isEmpty())
								throw Error(label.error.invalidArguments);

							this._uri = arg;
							if (arg !== null) this.sync();
						}
						catch (e) {
							$.error(e, arguments, this);
							return undefined;
						}
					};

					obj = utility.object(obj);
					$.genId(obj);

					// Hooking in the observer
					switch (true) {
						case typeof obj.fire === "undefined":
							obj.fire = function(){ return $.fire.apply(this, arguments); };
						case typeof obj.listeners === "undefined":
							obj.listeners = function(){ return $.listeners.apply(this, arguments); };
						case typeof obj.on === "undefined":
							obj.on = function(event, listener, id, scope, standby) {
								scope = scope || this;
								return $.on(this, event, listener, id, scope, standby);
							};
						case typeof obj.un === "undefined":
							obj.un = function(event, id) { return $.un(this, event, id); };
					}

					obj.fire("beforeDataStore");
					obj.data = utility.clone(this);
					obj.data.keys    = {};
					obj.data.records = [];
					obj.data.total   = 0;
					obj.data.parentNode = obj; // Recursion, useful
					delete obj.data.register;

					switch (true) {
						case (!client.ie || client.version > 8) && typeof Object.defineProperty === "function":
							Object.defineProperty(obj.data, "uri", {get: getter, set: setter});
							break;
						case typeof obj.data.__defineGetter__ === "function":
							obj.data.__defineGetter__("uri", getter);
							obj.data.__defineSetter__("uri", setter);
							break;
						default: // Only exists when no getters/setters
							obj.data.uri    = null;
							obj.data.setUri = function(arg){ obj.data.uri = arg; setter.call(obj.data, arg); };
					}

					if (typeof data === "object") obj.data.batch("set", data);
					obj.fire("afterDataStore");
				}
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Reindexes the data store
		 *
		 * Events: beforeDataReindex  Fires before reindexing the data store
		 *         afterDataReindex   Fires after reindexing the data store
		 *
		 * @method reindex
		 * @return {Object} Data store
		 */
		reindex : function() {
			var nth = this.total,
			    obj = this.parentNode,
			    i;

			obj.fire("beforeDataReindex");
			for(i = 0; i < nth; i++) {
				if (this.records[i].key.isNumber()) {
					delete this.keys[this.records[i].key];
					this.keys[i.toString()] = {};
					this.records[i].key = i.toString();
				}
				this.keys[this.records[i].key].index = i;
			}
			obj.fire("afterDataReindex");
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
		 * @param key {Mixed} Integer or String to use as a Primary Key
		 * @param data {Object} Key:Value pairs to set as field values
		 * @param sync {Boolean} [Optional] True if called by data.sync
		 * @returns {Object} The data store
		 */
		set : function(key, data, sync) {
			try {
				key  = key === null  ? undefined : key.toString();
				sync = (sync === true);

				switch (true) {
					case (typeof key === "undefined" || key.isEmpty()) && this.uri === null:
					case typeof data === "undefined":
					case data instanceof Array:
					case data instanceof Number:
					case data instanceof String:
					case typeof data !== "object":
						throw Error(label.error.invalidArguments);
				}

				var record = typeof this.keys[key] === "undefined" && typeof this.records[key] === "undefined" ? undefined : this.get(key),
				    obj    = this.parentNode,
				    guid   = $.genId(),
				    arg, index, record;

				obj.on("syncDataSet", function(){
					obj.un("syncDataSet", guid);
					if (typeof record === "undefined") {
						if (typeof key === "undefined") {
							arg = arguments[0];
							if (typeof arg === "undefined") {
								obj.fire("failedDataSet");
								throw Error(label.error.expectedObject);
							}
							key = this.key === null ? array.cast(arg).first() : arg[this.key];
							key = key.toString();
						}
						if (typeof data[key] !== "undefined") key = data[key];
						this.keys[key] = {};
						index = this.records.length;
						this.keys[key].index = index;
						this.records[index] = {};
						this.records[index].data = data;
						this.records[index].key  = key;
						record = this.records[index];
						if (this.key !== null) delete this.records[index].data[this.key];
						this.total++;
					}
					else {
						if (typeof data === "object") {
							for (arg in data) { record[arg] = data[arg]; }
							this.records[record.index] = record;
						}
						else { this.records[record.index] = data; }
					}
					obj.fire("afterDataSet", record);
				}, guid, this);

				obj.fire("beforeDataSet");
				this.uri === null || sync ? obj.fire("syncDataSet")
				                          : $[typeof key === "undefined" ? "post" : "put"](typeof key === "undefined" ? this.uri : this.uri+"/"+key, function(arg){ obj.fire("syncDataSet", arg); }, function(){ obj.fire("failedDataSet"); }, data);

				return this;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Syncs the data store with a URI representation
		 *
		 * Events: beforeDataSync  Fires before syncing the data store
		 *         afterDataSync   Fires after syncing the data store
		 *
		 * @method sync
		 * @return {Object} Data store
		 */
		sync : function() {
			try {
				if (this.uri === null || this.uri.isEmpty())
					throw Error(label.error.invalidArguments);

				var obj  = this.parentNode,
				    guid = $.genId(),
				    success, failure;

				this.uri.on("afterGet", function(arg){
					this.uri.un("afterGet", guid);
					try {
						var data = arg;
						if (typeof data === "undefined")
							throw Error(label.error.expectedObject);

						this.batch("set", data, true);
						obj.fire("afterDataSync");
					}
					catch (e) {
						$.error(e, arguments, this);
						obj.fire("failedDataSync");
					}
				}, guid, this);

				this.uri.on("failedGet", function(){
					this.uri.un("afterGet", guid);
					obj.fire("failedDataSync");
				}, guid, this);

				obj.fire("beforeDataSync");
				$.get(this.uri);
				return this;
			}
			catch (e) {
				$.error(e, arguments, this);
				return this;
			}
		}
	};

	/**
	 * Element methods
	 *
	 * @class el
	 * @namespace abaaso
	 */
	var el = {
		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * Events: beforeClear  Fires before the Object is cleared
		 *         afterClear   Fires after the Object is cleared
		 *
		 * @method clear
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element or Array of Elements
		 */
		clear : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) { this.clear(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (obj !== null) {
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
					}
					else {
						throw Error(label.error.elementNotFound);
					}
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates an Element in document.body or a target Element
		 *
		 * An id is generated if not specified with args
		 *
		 * Events: beforeCreate  Fires after the Element has been created, but not set
		 *         afterCreate   Fires after the Element has been appended to it's parent
		 *
		 * @method create
		 * @param  {String} type   Type of Element to create
		 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
		 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
		 * @return {Object} Element that was created or undefined
		 */
		create : function(type, args, target) {
			try {
				if (typeof type === "undefined")
					throw Error(label.error.invalidArguments);

				var obj, uid;

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

				if (typeof target === "undefined")
					throw Error(label.error.invalidArguments);

				uid = typeof args !== "undefined"
				       && typeof args !== "string"
				       && typeof args.childNodes === "undefined"
				       && typeof args.id !== "undefined"
				       && typeof $("#"+args.id) === "undefined" ? args.id : $.genId();

				if (typeof args !== "undefined" && typeof args.id !== "undefined") delete args.id;

				$.fire("beforeCreate", uid);
				uid.fire("beforeCreate");
				obj = document.createElement(type);
				obj.id = uid;
				if (typeof args === "object" && typeof args.childNodes === "undefined") obj.update(args);
				target.appendChild(obj);
				obj.fire("afterCreate");
				$.fire("afterCreate", obj);
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates a CSS stylesheet in the View
		 *
		 * @method css
		 * @param  {String} content CSS to put in a style tag
		 * @return {Object} Element created or undefined
		 */
		css : function(content) {
			try {
				var ss, css;
				ss = $.create("style", {type: "text/css"}, $("head")[0]);
				if (ss.styleSheet) ss.styleSheet.cssText = content;
				else {
					css = document.createTextNode(content);
					ss.appendChild(css);
				}
				return ss;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Destroys an Element
		 *
		 * Events: beforeDestroy  Fires before the destroy starts
		 *         afterDestroy   Fires after the destroy ends
		 *
		 * @method destroy
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		destroy : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.destroy(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (typeof obj !== "undefined") {
						var id = obj.id
						$.fire("beforeDestroy", obj);
						obj.fire("beforeDestroy");
						observer.remove(id);
						obj.parentNode.removeChild(obj);
						obj.fire("afterDestroy");
						$.fire("afterDestroy", id);
					}
					return undefined;
				}
			}
			catch(e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Disables an Element
		 *
		 * Events: beforeDisable  Fires before the disable starts
		 *         afterDisable   Fires after the disable ends
		 *
		 * @method disable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		disable : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.disable(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (typeof obj !== "undefined" && typeof obj.disabled !== "undefined") {
						obj.fire("beforeDisable");
						obj.disabled = true;
						obj.fire("afterDisable");
					}
					return obj;
				}
			}
			catch(e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Enables an Element
		 *
		 * Events: beforeEnable  Fires before the enable starts
		 *         afterEnable   Fires after the enable ends
		 *
		 * @method enable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		enable : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.enable(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (typeof obj !== "undefined" && typeof obj.disabled !== "undefined") {
						obj.fire("beforeEnable");
						obj.disabled = false;
						obj.fire("afterEnable");
						instances.push(obj);
					}
					return obj;
				}
			}
			catch(e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Hides an Element if it's visible
		 *
		 * Events: beforeHide  Fires before the object is hidden
		 *         afterHide   Fires after the object is hidden
		 *
		 * @method hide
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		hide : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) { this.hide(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
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
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns a Boolean indidcating if the Object is hidden
		 *
		 * @method hidden
		 * @param  {Mixed} obj Element or $ query
		 * @return {Mixed} Boolean indicating if Object is hidden
		 */
		hidden : function(obj) {
			try {
				obj = utility.object(obj);

				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				return obj.style.display === "none" || (typeof obj.hidden !== "undefined" && obj.hidden);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the position of an element
		 *
		 * @method position
		 * @param  {Mixed} obj Element or $ query
		 * @return {Array} Array containing the render position of the element
		 */
		position : function(obj) {
			try {
				obj = utility.object(obj);

				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				var left = null,
				     top = null;

				if (obj.offsetParent) {
					left = obj.offsetLeft;
					top  = obj.offsetTop;

					while (obj = obj.offsetParent) {
						left += obj.offsetLeft;
						top  += obj.offsetTop;
					}
				}

				return [left, top];
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Shows an Element if it's not visible
		 *
		 * Events: beforeEnable  Fires before the object is visible
		 *         afterEnable   Fires after the object is visible
		 *
		 * @method show
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		show : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) { this.show(obj[i]); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					obj.fire("beforeShow");
					switch (true) {
						case typeof obj.hidden === "boolean":
							obj.hidden = false;
							break;
						default:
							obj.style.display = typeof obj["data-display"] !== "undefined" && !obj["data-display"].isEmpty() ? obj["data-display"] : "inherit";
					}
					obj.fire("afterShow");
					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the size of the Object
		 *
		 * @method size
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @return {Object} Size {x:, y:}, Array of sizes or undefined
		 */
		size : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth    = !isNaN(obj.length) ? obj.length : obj.total(),
					    i      = null,
					    result = [];

					for (i = 0; i < nth; i++) { result.push(this.size(obj[i])); }
					return result;
				}
				else {
					obj = utility.object(obj);

					if (typeof obj === "undefined")
						throw Error(label.error.invalidArguments);

					/**
					 * Casts n to a number or returns zero
					 *
					 * @param n {Mixed} The value to cast
					 * @returns {Integer} The casted value or zero
					 */
					var num = function(n) {
						return !isNaN(parseInt(n)) ? parseInt(n) : 0;
					};

					var x = obj.offsetHeight + num(obj.style.paddingTop) + num(obj.style.paddingBottom) + num(obj.style.borderTop) + num(obj.style.borderBottom),
						y = obj.offsetWidth + num(obj.style.paddingLeft) + num(obj.style.paddingRight) + num(obj.style.borderLeft) + num(obj.style.borderRight);

					return {x:x, y:y};
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
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
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		update : function(obj, args) {
			try {
				if (obj instanceof Array) {
					var nth  = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) { this.update(obj[i], args); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					args = args || {};

					if (typeof obj === "undefined")
						throw Error(label.error.invalidArguments);

					obj.fire("beforeUpdate");

					var i;
					for (i in args) {
						switch(i) {
							case "innerHTML":
							case "type":
							case "src":
								obj[i] = args[i];
								break;
							case "opacity": // Requires the fx module
								obj.opacity(args[i]);
								break;
							case "class":
								client.ie && client.version < 9 ? obj.className = args[i] : obj.setAttribute("class", args[i]);
								break;
							case "id":
								var o = observer.listeners;
								if (typeof o[obj.id] !== "undefined") {
									o[args[i]] = $.clone(o[obj.id]);
									delete o[obj.id];
								}
							default:
								obj.setAttribute(i, args[i]);
								break;
						}
					}

					obj.fire("afterUpdate");
					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Number methods
	 *
	 * @class number
	 * @namespace abaaso
	 */
	var number = {
		/**
		 * Tests if an number is even
		 *
		 * @method even
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if even, or undefined
		 */
		even : function(arg) {
			try {
				return ((arg % 2) === 0);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Tests if a number is odd
		 *
		 * @method odd
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if odd, or undefined
		 */
		odd : function(arg) {
			try {
				return !((arg % 2) === 0);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * JSON methods
	 *
	 * @class json
	 * @namespace abaaso
	 */
	var json = {
		/**
		 * Decodes the argument
		 *
		 * @method decode
		 * @param  {String} arg String to parse
		 * @return {Mixed} Entity resulting from parsing JSON, or undefined
		 */
		decode : function(arg) {
			try {
				return JSON.parse(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Encodes the argument as JSON
		 *
		 * @method encode
		 * @param  {Mixed} arg Entity to encode
		 * @return {String} JSON, or undefined
		 */
		encode : function(arg) {
			try {
				return JSON.stringify(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
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
	var label = {
		// Common labels
		common : {
			back    : "Back",
			cancel  : "Cancel",
			clear   : "Clear",
			close   : "Close",
			cont    : "Continue",
			del     : "Delete",
			edit    : "Edit",
			find    : "Find",
			gen     : "Generate",
			go      : "Go",
			loading : "Loading",
			next    : "Next",
			login   : "Login",
			ran     : "Random",
			save    : "Save",
			search  : "Search",
			submit  : "Submit"
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
			expectedObject        : "Expected an Object",
			invalidArguments      : "One or more arguments is invalid",
			invalidDate           : "Invalid Date",
			invalidFields         : "The following required fields are invalid: ",
			propertyNotFound      : "Could not find the requested property",
			serverError           : "Server error has occurred",
			serverForbidden       : "Forbidden to access URI",
			serverInvalidMethod   : "Method not allowed",
			serverUnauthorized    : "Authorization required to access URI"
		},

		// Months of the Year
		months : {
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
	 * Mouse tracking
	 *
	 * @class mouse
	 * @namespace abaaso
	 */
	var mouse = {
		//Indicates whether mouse tracking is enabled
		enabled : false,

		// Indicates whether to try logging co-ordinates to the console
		log : false,

		// Mouse co-ordinations
		pos : {x: null, y: null},

		/**
		 * Enables or disables mouse co-ordinate tracking
		 *
		 * @method track
		 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
		 * @return {Object} abaaso.mouse
		 */
		track : function(n) {
			var m = abaaso.mouse;
			switch (true) {
				case typeof n === "object":
					var x, y, c = false;

					x = (n.pageX) ? n.pageX : ((client.ie && client.version === 8 ? document.documentElement.scrollLeft : document.body.scrollLeft) + n.clientX);
					y = (n.pageY) ? n.pageY : ((client.ie && client.version === 8 ? document.documentElement.scrollTop  : document.body.scrollTop)  + n.clientY);
					switch (true) {
						case m.pos.x !== x:
							$.mouse.pos.x = m.pos.x = x;
							c = true;
						case m.pos.y !== y:
							$.mouse.pos.y = m.pos.y = y;
							c = true;
					}
					if (c && m.log) utility.log(m.pos.x + " : " + m.pos.y);
					break;
				case typeof n === "boolean":
					n ? typeof document.addEventListener !== "undefined" ? document.addEventListener("mousemove", abaaso.mouse.track, false) : document.attachEvent("onmousemove", abaaso.mouse.track)
					  : typeof document.removeEventListener !== "undefined" ? document.removeEventListener("mousemove", abaaso.mouse.track, false) : document.detachEvent("onmousemove", abaaso.mouse.track);
					$.mouse.enabled = m.enabled = n;
					break;
			}
			return m;
		}
	};

	/**
	 * Global Observer wired to a State Machine
	 *
	 * @class observer
	 */
	var observer = {
		// Collection of listeners
		listeners : {},

		// Boolean indicating if events are logged to the console
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @method add
		 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
		 * @param  {String}   event Event being fired
		 * @param  {Function} fn    Event handler
		 * @param  {String}   id    [Optional / Recommended] The id for the listener
		 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param  {String}   state [Optional] The state the listener is for
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		add : function(obj, event, fn, id, scope, state) {
			try {
				if (obj instanceof Array) {
					var nth = !isNaN(obj.length) ? obj.length : obj.total(),
					    i   = null;

					for (i = 0; i < nth; i++) { this.add(obj[i], event, fn, id, scope ? obj[i] : scope, state); }
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (typeof id === "undefined" || !/\w/.test(id)) id = $.genId();

					var instance = null,
					    l        = observer.listeners,
					    o        = typeof obj.id !== "undefined" ? obj.id : obj,
					    efn, item;

					if (typeof o === "undefined" || typeof event === "undefined" || typeof fn !== "function")
						throw Error(label.error.invalidArguments);

					switch (true) {
						case typeof l[o] === "undefined":
							l[o] = {};
						case typeof l[o][event] === "undefined":
							l[o][event] = {};
						case typeof l[o][event].active === "undefined":
							l[o][event].active = {};
						case typeof l[o][event].standby === "undefined":
							l[o][event].standby = {};
					}

					item = {fn: fn, scope: scope};

					if (typeof state === "undefined") {
						l[o][event].active[id] = item;
						instance = o !== "abaaso" ? $("#"+o) : null;
						efn = function(e) {
					    	if (!e) e = window.event;
					    	e.cancelBubble = true;
					    	if (typeof e.stopPropagation === "function") e.stopPropagation();
					    	instance.fire(event);
					    };
						if (instance !== null && event.toLowerCase() !== "afterjsonp" && typeof instance !== "undefined")
							typeof instance.addEventListener === "function" ? instance.addEventListener(event, efn, false) : instance.attachEvent("on" + event, efn);
					}
					else {
						if (typeof l[o][event].standby[state] === "undefined") l[o][event].standby[state] = {};
						l[o][event].standby[state][id] = item;
					}
					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Fires an event
		 *
		 * @method fire
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being fired
		 * @param  {Mixed}  arg   [Optional] Argument supplied to the listener
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		fire : function(obj, event, arg) {
			try {
				if (obj instanceof Array) {
					var nth  = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) { this.fire(obj[i], event, arg); }
					return obj;
				}
				else {
					obj   = utility.object(obj);
					var o = typeof obj.id !== "undefined" ? obj.id : obj.toString(),
					    l, i, c, f, s;

					if (typeof o === "undefined" || o.isEmpty() || typeof obj === "undefined" || typeof event === "undefined")
							throw Error(label.error.invalidArguments);

					if (abaaso.observer.log) utility.log("[" + o + "] " + event);
					$.observer.fired = abaaso.observer.fired++;
					l = observer.list(obj, event).active;

					if (typeof l !== "undefined") {
						for (i in l) {
							c = typeof l[i].scope === "object" ? l[i].scope : $("#"+l[i].scope);
							f = l[i].fn;
							s = typeof c !== "undefined" ? c : abaaso;
							typeof arg === "undefined" ? f.call(s) : f.call(s, arg);
						}
					}
					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the listeners for an event
		 *
		 * @method list
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being queried
		 * @return {Array} Array of listeners for the event
		 */
		list : function(obj, event) {
			try {
				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				obj   = utility.object(obj);
				var l = this.listeners,
				    o = typeof obj.id !== "undefined" ? obj.id : obj.toString();

				return typeof l[o] !== "undefined" ? (typeof event !== "undefined" && typeof l[o][event] !== "undefined" ? $.clone(l[o][event])
				                                                                                                      : $.clone(l[o]))
				                                  : {};
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Removes an event listener, or Array of event listeners
		 *
		 * @method remove
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being fired
		 * @param  {String} id    [Optional] Listener id
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		remove : function(obj, event, id) {
			try {
				if (obj instanceof Array) {
					var nth = !isNaN(obj.length) ? obj.length : obj.total(),
					    i   = null;

					for (i = 0; i < nth; i++) { this.remove(obj[i], event, id); }
					return obj;
				}
				else {
					obj          = utility.object(obj);
					var instance = null,
					    o        = typeof obj.id !== "undefined" ? obj.id : obj.toString(),
					    l        = observer.listeners,
					    efn;

					switch (true) {
						case typeof o === "undefined":
						case typeof event === "undefined":
						case typeof l[o] === "undefined":
						case typeof l[o][event] === "undefined":
							return obj;
					}

					if (typeof id === "undefined") {
						delete l[o][event];
						instance = (o !== "abaaso") ? $("#"+o) : null;
						efn = function(e) {
					    	if (!e) e = window.event;
					    	e.cancelBubble = true;
					    	if (typeof e.stopPropagation === "function") e.stopPropagation();
					    	instance.fire(event);
					    };

						if (instance !== null && event.toLowerCase() !== "afterjsonp" && typeof instance !== "undefined")
							typeof instance.removeEventListener === "function" ? instance.removeEventListener(event, efn, false) : instance.detachEvent("on" + event, efn);
					}
					else if (typeof l[o][event].active[id] !== "undefined") { delete l[o][event].active[id]; }
					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Triggers an Observer state change
		 *
		 * @method state
		 * @param  {String} arg Application state
		 * @return {Object} abaaso
		 */
		state : function(arg) {
			try {
				var l = this.listeners,
				    i, e;

				for (i in l) {
					for (e in l[i]) {
						l[i][e].standby[$.state.previous] = l[i][e].active;
						l[i][e].active = typeof l[i][e].standby[arg] !== "undefined" ? l[i][e].standby[arg] : {};
						if (typeof l[i][e].standby[arg] !== "undefined") delete l[i][e].standby[arg];
					}
				}
				$.fire(arg);
				return abaaso;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Utility methods
	 *
	 * @class utility
	 * @namespace abaaso
	 */
	var utility = {
		/**
		 * Returns an instance or array of instances
		 *
		 * Selectors "contains(string)", "even", "first", "has(tag)", "is(tag)", "last", "not(tag)", "odd" are optional
		 * The "has" and "not" selectors accept comma delimited strings, which can include wildcards, e.g. ":has(d*, l*)"
		 *
		 * Selectors can be delimited with :
		 *
		 * @method $
		 * @param  {String}  arg      Comma delimited string of target #id, .class, tag and :selector
		 * @param  {Boolean} nodelist [Optional] True will return a NodeList (by reference) for tags & classes
		 * @return {Mixed} Element or Array of Elements
		 */
		$ : function(arg, nodelist) {
			var args, obj, i, nth, nth2, c, alt, find, contains, has, not, is, x, s,
			    document  = window.document,
			    instances = [];

			/**
			 * Looks for alternating HTMLElement (arg) in HTMLElement (obj)
			 *
			 * @method alt
			 * @param  {Object} obj   Element to search
			 * @param  {Object} state Boolean representing rows, true is even, false is odd
			 * @return {Array} Array of Elements
			 */
			alt = function(obj, state) {
				var i, nth, instances = [];
				switch (true) {
					case obj instanceof Array:
						nth = obj.length;
						for (i = 0; i < nth; i++) { if (i.isEven() === state) instances.push(obj[i]); }
						break;
					case typeof obj.childNodes !== "undefined" && obj.childNodes.length > 0:
						nth = obj.childNodes.length;
						for (i = 0; i < nth; i++) { if (i.isEven() === state) instances.push(obj.childNodes[i]); }
						break;
				}
				return instances;
			};

			/**
			 * Tests obj against arg
			 *
			 * @method find
			 * @param  {String} obj Property to test
			 * @param  {String} arg String to test for, can be comma delimited or a wildcard
			 * @return {Boolean} True if found
			 */
			find = function(obj, arg) {
				arg = arg.split(/\s*,\s*/);
				var i, nth = arg.length, instances = [];
				for (i = 0; i < nth; i++) { if (new RegExp(arg[i].replace("*", ".*"), "ig").test(obj)) instances.push(arg[i]); }
				return instances.length > 0;
			};

			/**
			 * Looks for arg in obj.innerHTML
			 *
			 * @method contains
			 * @param  {Object} obj Element to search
			 * @param  {Mixed}  arg String or Integer to find in obj
			 * @return {Mixed} Element or Array of Elements
			 */
			contains = function(obj, arg) {
				var i, nth, instances = [];
				if (obj instanceof Array && obj.length === 1) obj = obj.first();
				if (obj instanceof Array) {
					nth = obj.length;
					for (i = 0; i < nth; i++) { if (new RegExp(arg).test(obj[i].innerHTML)) instances.push(obj[i]); }
					return instances.length === 1 ? instances[0] : instances;
				}
				else {
					return obj !== null && arg !== null && new RegExp(arg).test(obj[i].innerHTML) ? obj : undefined;
				}
			};

			/**
			 * Looks for Element in Element
			 *
			 * @method has
			 * @param  {Object} obj Element to search
			 * @param  {String} arg Element type to find, can be comma delimited
			 * @return {Mixed} Element or Array of Elements
			 */
			has = function(obj, arg) {
				var i, nth, instances = [];
				if (obj instanceof Array && obj.length === 1) obj = obj.first();
				if (obj instanceof Array) {
					var x, nth2;
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						nth2 = obj[i].childNodes.length;
						for (x = 0; x < nth2; x++) {
							obj[i].genId();
							if (find(obj[i].childNodes[x].nodeName, arg) && typeof instances[obj[i].id] === "undefined") instances[obj[i].id] = obj[i];
						}
					}
					instances = instances.indexed();
				}
				else {
					nth = obj.childNodes.length;
					for (i = 0; i < nth; i++) { if (find(obj.childNodes[i].nodeName, arg)) instances.push(obj.childNodes[i]); }
				}
				return instances;
			};

			/**
			 * Tests if Element matches Elements
			 *
			 * @method is
			 * @param  {Object} obj Element to search
			 * @param  {String} arg Element type to find, can be comma delimited
			 * @return {Mixed} Element or Array of Elements
			 */
			is = function(obj, arg) {
				var i, nth, instances = [];
				if (obj instanceof Array && obj.length === 1) obj = obj.first();
				if (obj instanceof Array) {
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						obj[i].genId();
						if (find(obj[i].nodeName, arg) && typeof instances[obj[i].id] === "undefined") instances[obj[i].id] = obj[i];
					}
					instances = instances.indexed();
				}
				else { if (find(obj.nodeName, arg)) instances.push(obj); }
				return instances;
			};

			/**
			 * Excludes Elements in Element
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param arg {String} HTMLElement type to exclude, can be comma delimited
			 * @returns {Mixed} Instance or Array of Instances containing arg
			 */
			not = function(obj, arg) {
				var i, nth, instances = [];
				if (obj instanceof Array && obj.length === 1) obj = obj.first();
				if (obj instanceof Array) {
					var x, nth2;
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						nth2 = obj[i].childNodes.length;
						for (x = 0; x < nth2; x++) {
							obj[i].genId();
							!find(obj[i].childNodes[x].nodeName, arg) ? (function(){ if (typeof instances[obj[i].id] === "undefined") instances[obj[i].id] = obj[i]; })()
							                                          : (function(){ if (typeof instances[obj[i].id] !== "undefined") delete instances[obj[i].id]; })();
						}
					}
					instances = instances.indexed();
				}
				else {
					nth = obj.childNodes.length;
					for (i = 0; i < nth; i++) { if (!find(obj.childNodes[i].nodeName, arg)) instances.push(obj.childNodes[i]); }
				}
				return instances;
			};

			if (nodelist !== true) nodelist = false;

			// Recursive processing, ends up below
			if (/,/.test(arg)) arg = arg.split(/\s*,\s*/);
			if (arg instanceof Array) {
				nth = arg.length;
				for (i = 0; i < nth; i++) { instances.push($(arg[i], nodelist)); }
				return instances;
			}

			// Getting selectors
			if (/:/.test(arg)) {
				s   = /:.*/gi.exec(arg) !== null ? /:.*/gi.exec(arg)[0].slice(1) : "";
				arg = /.*:/.exec(arg) !== null ? (!/.*:/.exec(arg)[0].slice(0, -1).isEmpty() ? /.*:/.exec(arg)[0].slice(0, -1)
													                                         : ":")
				                               : ":";
			}
			else { s = ""; }
			args = !/\w/.test(s) ? [] : s.split(/:/);

			// Getting instance(s)
			switch (arg.charAt(0)) {
				case ".":
					obj = document.getElementsByClassName(arg.slice(1));
					if (obj !== null && !nodelist)
						obj = !client.ie || client.version > 8 ? Array.prototype.slice.call(obj) : array.cast(obj);
					break;
				case "#":
					obj = document.getElementById(arg.substring(1));
					break;
				case ":":
					obj = document.getElementsByTagName("*");
					if (obj !== null && !nodelist)
						obj = !client.ie || client.version > 8 ? Array.prototype.slice.call(obj) : array.cast(obj);
					break;
				default:
					obj = document.getElementsByTagName(arg);
					if (obj !== null && !nodelist)
						obj = !client.ie || client.version > 8 ? Array.prototype.slice.call(obj) : array.cast(obj);
			}

			// Processing selector(s)
			if (obj !== null && typeof args.length !== "undefined" && args.length > 0) {
				nth = args.length;
				for (i = 0; i < nth; i++) {
					if (typeof obj === "undefined") {
						obj = [];
						break;
					}

					switch (args[i].replace(/\(.*\)/, "")) {
						case "contains":
							obj = contains(obj, args[i].replace(/.*\(|'|"|\)/g, ""));
							break;
						case "even":
							obj = alt(obj, true);
							break;
						case "first":
							obj = obj.first();
							break;
						case "has":
							obj = has(obj, args[i].replace(/.*\(|'|"|\)/g, ""));
							break;
						case "is":
							obj = is(obj, args[i].replace(/.*\(|'|"|\)/g, ""));
							break;
						case "last":
							obj = obj.last();
							break;
						case "not":
							obj = not(obj, args[i].replace(/.*\(|'|"|\)/g, ""));
							break;
						case "odd":
							obj = alt(obj, false);
							break
						default:
							nth2 = !isNaN(obj.length) ? obj.length : 0;
							instances = [];
							for (x = 0; x < nth2; x++) {
								c = obj[x].className.split(" ");
								if (c.index(args[i]) > -1) instances.push(obj[x]);
							}
							obj = instances;
					}

					if (obj instanceof Array)
						if (obj.length === 0) obj = (i + 1) === nth ? [] : undefined;
				}
			}
			if (obj === null) obj = undefined;
			return obj;
		},

		/**
		 * Aliases origin onto obj
		 *
		 * @method alias
		 * @param  {Object} obj    Object receiving aliasing
		 * @param  {Object} origin Object providing structure to obj
		 * @return {Object} Object receiving aliasing
		 */
		alias : function(obj, origin){
			try {
				var i;
				for (i in origin) {
					(function(){
						var b = i;
						switch (true) {
							case typeof origin[b] === "function":
								obj[b] = function(){ return origin[b].apply(this, arguments); };
								break;
							case origin[b] instanceof Object:
								if (typeof obj[b] === "undefined") obj[b] = {};
								(function(){ abaaso.alias(obj[b], origin[b]); })();
								break;
							case /boolean|number|string/.test(typeof origin[b]):
							case origin[b] === null:
								obj[b] = origin[b];
								break;
						}
					})();
				}
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Clones an Object
		 *
		 * @method clone
		 * @param  {Object} obj Object to clone
		 * @return {Object} Clone of obj
		 */
		clone: function(obj) {
			try {
				if (typeof obj !== "object")
					throw Error(label.error.expectedObject);

				var clone = {}, p;
				if (typeof obj.constructor === "object") clone.constructor = obj.constructor;
				if (typeof obj.prototype === "object") clone.prototype  = obj.prototype;
				for (p in obj) { clone[p] = obj[p]; }
				return clone;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Allows deep setting of properties without knowing
		 * if the structure is valid
		 *
		 * @method define
		 * @param  {String} args  Dot delimited string of the structure
		 * @param  {Mixed}  value Value to set
		 * @param  {Object} obj   Object receiving value
		 * @return {Object} Object receiving value
		 */
		define : function(args, value, obj) {
			args = args.split(".");
			obj  = obj || this;
			if (obj === $) obj = abaaso;

			var i = null,
			    l = args.length,
			    p = obj;

			for (i = 0; i < l; i++) {
				typeof p[args[i]] === "undefined" ? p[args[i]] = (i + 1 < l ? {} : ((typeof value !== "undefined") ? value : null))
							                     : (function(){ if (i + 1 >= l) p[args[i]] = typeof value !== "undefined" ? value : null; })();
				p = p[args[i]];
			}

			return obj;
		},

		/**
		 * Defers the execution of Function by at least the supplied milliseconds
		 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
		 *
		 * @method defer
		 * @param  {Function} fn Function to defer execution of
		 * @param  {Integer}  ms Milliseconds to defer execution
		 * @return {Object} undefined
		 */
		defer : function(fn, ms) {
			var id = $.genId(),
			    op = function() {
					delete abaaso.timer[id];
					fn();
				};
			abaaso.timer[id] = setTimeout(op, ms);
			return undefined;
		},

		/**
		 * Error handling, with history in .log
		 *
		 * @method error
		 * @param  {Mixed} e     Error object or message to display
		 * @param  {Array} args  Array of arguments from the callstack
		 * @param  {Mixed} scope Entity that was "this"
		 * @return {Object} undefined
		 */
		error : function(e, args, scope) {
			if (typeof e === "undefined")
				return;

			var o = {
				arguments : args,
				message   : typeof e.message !== "undefined" ? e.message : e,
				number    : typeof e.number !== "undefined" ? (e.number & 0xFFFF) : undefined,
				scope     : scope,
				timestamp : new Date().toUTCString(),
				type      : typeof e.type !== "undefined" ? e.type : "TypeError"
			};

			if (typeof console !== "undefined") console.error(o.message);
			if (typeof abaaso.error.log === "undefined") abaaso.error.log = [];
			abaaso.error.log.push(o);
			abaaso.fire("error", o);
			return undefined;
		},

		/**
		 * Encodes a string to a DOM friendly ID
		 *
		 * @method domId
		 * @param  {String} arg String to make DOM friendly
		 * @return {String} DOM friendly version of arg
		 */
		domId : function(arg) {
			try {
				return arg.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates an ID value
		 *
		 * @method genId
		 * @param  {Mixed} obj [Optional] Object to receive id
		 * @return {Mixed} Object or id
		 */
		genId : function(obj) {
			try {
				if (obj instanceof Array || obj instanceof String || (typeof obj !== "undefined" && typeof obj.id !== "undefined" && !obj.id.isEmpty()))
					return obj;

				var id;
				do id = "a" + utility.id();
				while (typeof $("#" + id) !== "undefined");

				if (typeof obj === "object") {
					obj.id = id;
					return obj;
				}
				else { return id; }
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates a random number
		 *
		 * @method id
		 * @return {Integer} Between 1 and 1-trillian
		 */
		id : function() {
			return Math.floor(Math.random() * 1000000000);
		},

		/**
		 * Renders a loading icon in a target element,
		 * with a class of "loading"
		 *
		 * @method loading
		 * @param  {Mixed} obj Entity or Array of Entities or $ queries
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		loading : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth = !isNaN(obj.length) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < nth; i++) { this.loading(obj[i]); }
					return obj;
				}

				var l = abaaso.loading;
				if (l.url === null)
					throw Error(label.error.elementNotFound);

				obj = utility.object(obj);

				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				// Setting loading image
				if (typeof l.image === "undefined") {
					l.image     = new Image();
					l.image.src = l.url;
				}

				// Clearing target element
				obj.clear();

				// Creating loading image in target element
				obj.create("div", {"class": "loading"})
				   .create("img", {alt: label.common.loading, src: l.image.src});

				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Writes argument to the console
		 *
		 * @method log
		 * @param  {String} arg String to write to the console
		 * @return undefined;
		 */
		log : function(arg) {
			try {
				console.log(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
			}
			return undefined;
		},

		/**
		 * Returns argument, or instance based on #object.id value
		 *
		 * @method object
		 * @param  {Mixed} obj Entity or $ query
		 * @returns {Mixed} Entity
		 * @private
		 */
		object : function(obj) {
			return typeof obj === "object" ? obj : (obj.toString().charAt(0) === "#" ? $(obj) : obj);
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @method proto
		 * @param  {Object} obj Object receiving prototype extension
		 * @param  {String} type Identifier of obj, determines what Arrays to apply
		 * @return {Object} obj or undefined
		 */
		proto : function(obj, type) {
			try {
 				if (typeof obj !== "function" && typeof obj !== "object")
						throw Error(label.error.invalidArguments);

				// Collection of methods to add to prototypes
				var i,
				    methods = {
					array   : {contains : function(arg) { return $.array.contains(this, arg); },
					           diff     : function(arg) { return $.array.diff(this, arg); },
					           first    : function() { return $.array.first(this); },
					           index    : function(arg) { return $.array.index(this, arg); },
					           indexed  : function() { return $.array.indexed(this); },
					           keys     : function() { return $.array.keys(this); },
					           last     : function(arg) { return $.array.last(this); },
					           on       : function(event, listener, id, scope, standby) {
					           		scope = scope || true;
					           		return $.on(this, event, listener, id, scope, standby);
					           },
					           remove   : function(arg) { return $.array.remove(this, arg); },
					           total    : function() { return $.array.total(this); }},
					element : {create   : function(type, args) {
									this.genId();
									return $.create(type, args, this);
							   },
							   disable   : function() { return $.el.disable(this); },
							   enable    : function() { return $.el.enable(this); },
							   get       : function(uri, headers) {
									this.fire("beforeGet");
									var cached = cache.get(uri),
									    guid   = $.genId();
									if (!cached) {
										uri.on("afterGet", function(arg) {
											uri.un("afterGet", guid);
											this.text(arg).fire("afterGet");
											}, guid, this);
										$.get(uri, undefined, undefined, headers);
									}
									else {
										this.text(cached.response);
										this.fire("afterGet");
									}
									return this;
							   },
							   hide     : function() {
									this.genId();
									return $.el.hide(this);
							   },
							   isAlphaNum: function() { return this.nodeName === "FORM" ? false : $.validate.test({alphanum: typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
						       isBoolean: function() { return this.nodeName === "FORM" ? false : $.validate.test({"boolean": typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
						       isDate   : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : this.innerText.isDate(); },
						       isDomain : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : this.innerText.isDomain(); },
						       isEmail  : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : this.innerText.isEmail(); },
						       isEmpty  : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : this.innerText.isEmpty(); },
						       isIP     : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isIP()     : this.innerText.isIP(); },
						       isInt    : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isInt()    : this.innerText.isInt(); },
						       isNumber : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isNumber() : this.innerText.isNumber(); },
						       isPhone  : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isPhone()  : this.innerText.isPhone(); },
						       isString : function() { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isString() : this.innerText.isString(); },
						       jsonp    : function(uri, property, callback) {
									var target = this,
									    arg    = property,
									    fn = function(response) {
											var self = target,
												node = response,
												prop = arg, i, nth, result;

											try {
													if (typeof prop !== "undefined") {
														prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
														nth = prop.length;
														for (i = 0; i < nth; i++) {
															node = !!isNaN(prop[i]) ? node[prop[i]] : node[parseInt(prop[i])];
															if (typeof node === "undefined")
																throw Error($.label.error.propertyNotFound);
														}
														result = node;
													}
													else { result = response; }
											}
											catch (e) {
													result = $.label.error.serverError;
													$.error(e, arguments, this);
											}

											self.text(result);
										};
									$.jsonp(uri, fn, null, callback);
									return this;
							   },
							   loading  : function() { return $.loading.create(this); },
					           on       : function(event, listener, id, scope, standby) {
									scope = scope || this;
									if (typeof this.id === "undefined" || this.id.isEmpty()) this.genId();
									return $.on(this, event, listener, id, scope, standby);
							   },
					           position : function() {
									this.genId();
									return $.el.position(this);
							   },
							   show     : function() {
									this.genId();
									return $.el.show(this);
							   },
							   size     : function() {
									this.genId();
									return $.el.size(this);
							   },
							   text     : function(arg) {
							   		var args = {};
									this.genId();
									if (typeof this.value !== "undefined") args.value = arg;
									if (typeof this.innerHTML !== "undefined") args.innerHTML = arg;
									return this.update(args);
							   },
							   update   : function(args) {
									this.genId();
									return $.update(this, args);
							   },
							   validate  : function() { return this.nodeName === "FORM" ? $.validate.test(this).pass : typeof this.value !== "undefined" ? !this.value.isEmpty() : !this.innerText.isEmpty(); }},
					number  : {isEven   : function() { return $.number.even(this); },
					           isOdd    : function() { return $.number.odd(this); },
					           on       : function(event, listener, id, scope, standby) {
									scope = scope || this;
					           		return $.on(this, event, listener, id, scope, standby);
					           }},
					shared  : {clear    : function() {
									if (typeof this === "object" && (typeof this.id === "undefined" || this.id.isEmpty())) this.genId();
									this instanceof String ? this.constructor = new String("") : $.clear(this);
									return this;
							   },
							   destroy  : function() { $.destroy(this); },
							   domId    : function() {
							   		if (!this instanceof String) {
							   			this.genId();
							   			return $.domId(this.id);
							   		}
							   		return $.domId(this);
							   },
							   fire     : function(event, args) {
							   		if (!this instanceof String && (typeof this.id === "undefined" || this.id.isEmpty())) this.genId();
							   		return $.fire.call(this, event, args);
							   },
							   genId    : function() { return $.genId(this); },
							   listeners: function(event) {
							   		if (!this instanceof String && (typeof this.id === "undefined" || this.id.isEmpty())) this.genId();
							   		return $.listeners(this, event);
							   },
							   un       : function(event, id) {
							   		if (!this instanceof String && (typeof this.id === "undefined" || this.id.isEmpty())) this.genId();
							   		return $.un(this, event, id);
							   }},
					string  : {allow    : function(arg) { return $.allow(this, arg); },
							   capitalize: function() { return this.charAt(0).toUpperCase() + this.slice(1); },
							   isAlphaNum: function() { return $.validate.test({alphanum: this}).pass; },
							   isBoolean: function() { return $.validate.test({"boolean": this}).pass; },
							   isDate   : function() { return $.validate.test({date: this}).pass; },
							   isDomain : function() { return $.validate.test({domain: this}).pass; },
							   isEmail  : function() { return $.validate.test({email: this}).pass; },
							   isEmpty  : function() { return !$.validate.test({notEmpty: this}).pass; },
							   isIP     : function() { return $.validate.test({ip: this}).pass; },
							   isInt    : function() { return $.validate.test({integer: this}).pass; },
							   isNumber : function() { return $.validate.test({number: this}).pass; },
							   isPhone  : function() { return $.validate.test({phone: this}).pass; },
							   isString : function() { return $.validate.test({string: this}).pass; },
							   on       : function(event, listener, id, scope, standby) {
					           		scope = scope || this;
					           		return $.on(this, event, listener, id, scope, standby);
					           },
					           options  : function(arg) { return $.options(this, arg); },
					           permission: function() { return $.permission(this); },
					           trim     : function(){ return this.replace(/^\s+|\s+$/, ""); }}
				};

				// Applying the methods
				for (i in methods[type])  { obj.prototype[i] = methods[type][i];  }
				for (i in methods.shared) { obj.prototype[i] = methods.shared[i]; }
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Validation methods and patterns
	 *
	 * @class validate
	 * @namespace abaaso
	 */
	var validate = {
		// Regular expression patterns to test against
		pattern : {
			alphanum : /^[a-zA-Z0-9]*$/,
			"boolean": /^(0|1|true|false)?$/,
			domain   : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
			email    : /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/,
			ip       : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
			integer  : /(^-?\d\d*$)/,
			notEmpty : /\w{1,}/,
			number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
			phone    : /^\([1-9]\d{2}\)\s?\d{3}\-\d{4}$/,
			string   : /\w/
		},

		/**
		 * Validates args based on the type or pattern specified
		 *
		 * @method test
		 * @param  {Object} args Object to test {(pattern[name] || /pattern/) : (value || #object.id)}
		 * @return {Object} Results
		 */
		test : function(args) {
			try {
				if (typeof args === "undefined" || args === null || !args instanceof Object)
						throw Error(label.error.expectedObject);

				var exception = false,
				    invalid   = [],
				    value     = null;

				if (typeof args.nodeName !== "undefined" && args.nodeName === "FORM") {
					var i, p, v, c, o, x, t = {}, nth, nth2, result, invalid = [], tracked = {};

					if (args.id.isEmpty()) args.genId();
					c = $("#"+args.id+":has(input,select)");
					nth = c.length;
					for (i = 0; i < nth; i++) {
						v = null;
						p = validate.pattern[c[i].nodeName.toLowerCase()] ? validate.pattern[c[i].nodeName.toLowerCase()]
						                                                  : ((!c[i].id.isEmpty() && validate.pattern[c[i].id.toLowerCase()]) ? validate.pattern[c[i].id.toLowerCase()]
						                                                                                                                     : "notEmpty");
						switch (true) {
							case /radio|checkbox/gi.test(c[i].type):
								if (c[i].name in tracked) { continue; }
								o = document.getElementsByName(c[i].name);
								nth2 = o.length;
								for (x = 0; x < nth2; x++) {
									if (o[x].checked) {
										v = o[x].value;
										tracked[c[i].name] = true;
										continue;
									}
								}
								break;
							case /select/gi.test(c[i].type):
								v = c[i].options[c[i].selectedIndex].value;
								break;
							default:
								v = typeof c[i].value !== "undefined" ? c[i].value : c[i].innerText;
						}
						if (v === null) v = "";
						t[p] = v;
					}
					result = this.test(t);
					return result;
				}
				else {
					for (var i in args) {
						if (typeof i === "undefined" || typeof args[i] === "undefined") {
							invalid.push({test: i, value: args[i]});
							exception = true;
							continue;
						}
						value = args[i].charAt(0) === "#" ? (typeof $(args[i]) !== "undefined" ? (($(args[i]).value) ? $(args[i]).value
						                                                                                             : $(args[i]).innerHTML)
						                                                                       : "")
						                                  : args[i];
						switch (i) {
							case "date":
								if (isNaN(new Date(value).getYear())) {
									invalid.push({test: i, value: value});
									exception = true;
								}
								break;
							case "domain":
								if (!validate.pattern.domain.test(value.replace(/.*\/\//, ""))) {
									invalid.push({test: i, value: value});
									exception = true;
								}
								break;
							case "domainip":
								if (!validate.pattern.domain.test(value.replace(/.*\/\//, "")) || !validate.pattern.ip.test(value)) {
									invalid.push({test: i, value: value});
									exception = true;
								}
								break;
							default:
								var p = typeof validate.pattern[i] !== "undefined" ? validate.pattern[i] : i;
								if (!p.test(value)) {
									invalid.push({test: i, value: value});
									exception = true;
								}
								break;
						}
					}
					return {pass: !exception, invalid: invalid};
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return {pass: false, invalid: {}};
			}
		}
	};

	/**
	 * XML methods
	 *
	 * @class xml
	 * @namespace abaaso
	 */
	var xml = {
		/**
		 * Returns XML (Document) Object from a String
		 *
		 * @method decode
		 * @param  {String} arg XML String
		 * @return {Object} XML Object or undefined
		 */
		decode : function(arg) {
			try {
				if (typeof arg !== "string" || arg.isEmpty())
					throw Error(label.error.invalidArguments);

				var xml;

				if (client.ie) {
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = "false";
					xml.loadXML(arg);
				}
				else { xml = new DOMParser().parseFromString(arg, "text/xml"); }
				return xml;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns XML String from an Object or Array
		 *
		 * @method encode
		 * @param  {Mixed} arg Object or Array to cast to XML String
		 * @return {String} XML String or undefined
		 */
		encode : function(arg, wrap) {
			try {
				if (typeof arg === "undefined")
					throw Error(label.error.invalidArguments);

				switch (true) {
					case arg !== null && typeof arg.xml !== "undefined":
						xml = arg.xml;
						break;
					case arg instanceof Document:
						xml = (new XMLSerializer()).serializeToString(payload);
						break;
					default:
						wrap = wrap === false ? false : true;
						var xml  = wrap ? "<xml>" : "",
						    top  = arguments[2] === false ? false : true,
						    node, i;

						node = function(name, value) {
							var output = "<n>v</n>";
							if (/\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test(value)) output = output.replace(/v/, "<![CDATA[v]]>");
							return output.replace(/n/g, name).replace(/v/, value);
						}

						switch (true) {
							case typeof arg === "boolean":
							case typeof arg === "number":
							case typeof arg === "string":
								xml += node("item", arg);
								break
							case typeof arg === "object":
								for (i in arg) { xml += $.xml.encode(arg[i], (typeof arg[i] === "object"), false).replace(/item|xml/g, !isNaN(i) ? "item" : i); }
								break;
						}

						xml += wrap ? "</xml>" : "";
						if (top) xml = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + xml;
				}
				return xml;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * @constructor
	 */
	return {
		// Classes
		array           : array,
		callback        : {},
		client          : {
			// Properties
			android : client.android,
			blackberry : client.blackberry,
			css3    : false,
			chrome  : client.chrome,
			expire  : client.expire,
			firefox : client.firefox,
			ie      : client.ie,
			ios     : client.ios,
			linux   : client.linux,
			meego   : client.meego,
			mobile  : client.mobile,
			opera   : client.opera,
			osx     : client.osx,
			playbook: client.playbook,
			safari  : client.safari,
			tablet  : client.tablet,
			size    : {x: 0, y: 0},
			version : 0,
			webos   : client.webos,
			windows : client.windows,

			// Methods
			del     : function(uri, success, failure) { return client.request(uri, "DELETE", success, failure); },
			get     : function(uri, success, failure, headers) { return client.request(uri, "GET", success, failure, headers); },
			options : function(uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
			post    : function(uri, success, failure, args) { return client.request(uri, "POST", success, failure, args); },
			put     : function(uri, success, failure, args) { return client.request(uri, "PUT", success, failure, args); },
			jsonp   : function(uri, success, failure, callback) { return client.request(uri, "JSONP", success, failure, callback); },
			permission : client.permission
		},
		cookie          : cookie,
		data            : data,
		el              : el,
		json            : json,
		label           : label,
		loading         : {
			create  : utility.loading,
			url     : null
		},
		mouse           : mouse,
		number          : number,
		observer        : {
				log     : observer.log,
				add     : observer.add,
				fire    : observer.fire,
				fired   : 0,
				list    : observer.list,
				remove  : observer.remove
			},
		state           : {
			_current    : null,
			header      : null,
			previous    : null
		},
		validate        : validate,
		xml             : xml,

		// Methods & Properties
		$               : utility.$,
		alias           : utility.alias,
		allow           : client.allow,
		clean           : cache.clean,
		clear           : el.clear,
		clone           : utility.clone,
		create          : el.create,
		css             : el.css,
		decode          : json.decode,
		defer           : utility.defer,
		define          : utility.define,
		del             : function(uri, success, failure) { return client.request(uri, "DELETE", success, failure); },
		destroy         : el.destroy,
		domId           : utility.domId,
		encode          : json.encode,
		error           : utility.error,
		fire            : function() {
			var event = typeof arguments[0] === "undefined" ? undefined : arguments[0],
				arg   = typeof arguments[1] === "undefined" ? undefined : arguments[1],
				obj   = this === $ ? abaaso : this;

			return abaaso.observer.fire(obj, event, arg);
		},
		genId           : utility.genId,
		get             : function(uri, success, failure, headers) { return client.request(uri, "GET", success, failure, headers); },
		hidden          : el.hidden,
		id              : "abaaso",
		init            : function() {
			// Stopping multiple executions
			delete abaaso.init;

			// Describing the Client
			$.client.version = abaaso.client.version = client.version();
			$.client.css3    = abaaso.client.css3    = client.css3();
			$.client.size    = abaaso.client.size    = client.size();
			$.client.tablet  = abaaso.client.tablet  = client.tablet();
			$.state.current  = abaaso.state._current;

			// Hooking abaaso into native Objects
			utility.proto(Array, "array");
			utility.proto(Element, "element");
			if (client.ie && client.version === 8) utility.proto(HTMLDocument, "element");
			utility.proto(Number, "number");
			utility.proto(String, "string");
			
			// Setting events & garbage collection
			window.onhashchange = function() { abaaso.fire("hash", location.hash); };
			window.onresize     = function() { $.client.size = abaaso.client.size = client.size(); abaaso.fire("resize", abaaso.client.size); };
			abaaso.timer.clean  = setInterval(function(){ abaaso.clean(); }, 120000);

			// abaaso.state.current getter/setter
			var getter, setter;
			getter = function(){ return this._current; };
			setter = function(arg){
				try {
					if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty())
							throw Error(label.error.invalidArguments);

					$.state.previous = this.previous = this._current;
					$.state.current  = this._current = arg;
					return observer.state(arg);
				}
				catch (e) {
					$.error(e, arguments, this);
					return undefined;
				}
			};

			switch (true) {
				case (!client.ie || client.version > 8) && typeof Object.defineProperty === "function":
					Object.defineProperty(abaaso.state, "current", {get: getter, set: setter});
					break;
				case typeof abaaso.state.__defineGetter__ === "function":
					abaaso.state.__defineGetter__("current", getter);
					abaaso.state.__defineSetter__("current", setter);
					break;
				default:
					// Pure hackery, only exists when needed
					abaaso.state.current = null;
					abaaso.state.change  = function(arg){ abaaso.state.current = arg; setter.call(abaaso.state, arg); };
			}

			// Adding an essential method if not present
			if (typeof document.getElementsByClassName === "undefined") {
				document.getElementsByClassName = function(arg) {
					var nodes   = document.getElementsByTagName("*"),
						nth     = nodes.length,
						i       = null,
						obj     = [],
						pattern = new RegExp("(^|\\s)"+arg+"(\\s|$)");

					for (i = 0; i < nth; i++) { if (pattern.test(nodes[i].className)) obj.push(nodes[i]); }
					return obj;
				};
			}

			// Adding an essential method if not present
			if (typeof Array.prototype.filter === "undefined") {
				Array.prototype.filter = function(fn) {
					"use strict";
					if (this === void 0 || this === null || typeof fn !== "function")
						throw Error(label.error.invalidArguments);

					var i      = null,
						t      = Object(this),
						nth    = t.length >>> 0,
						result = [],
						prop   = arguments[1]
						val    = null;

					for (i = 0; i < nth; i++) {
						if (i in t) {
							val = t[i];
							if (fn.call(prop, val, i, t)) result.push(val);
						}
					}

					return result;
				}
			}

			$.ready = abaaso.ready = true;
			$.fire("ready").un("ready");

			// Setting render event
			abaaso.timer.render = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(abaaso.timer.render);
					delete abaaso.timer.render;
					$.fire("render").un("render");
				}
			}, 10);

			return abaaso;
		},
		jsonp           : function(uri, success, failure, callback) { return client.request(uri, "JSONP", success, failure, callback); },
		listeners       : function() {
			var all   = (typeof arguments[1] !== "undefined"),
			    obj   = all ? arguments[0] : this,
				event = all ? arguments[1] : arguments[0];
				if (obj === $) obj = abaaso;

			return observer.list(obj, event);
		},
		on              : function() {
			var all      = (typeof arguments[2] === "function"),
			    obj      = all ? arguments[0] : abaaso,
				event    = all ? arguments[1] : arguments[0],
				listener = all ? arguments[2] : arguments[1],
				id       = all ? arguments[3] : arguments[2],
				scope    = all ? arguments[4] : arguments[3],
				state    = all ? arguments[5] : arguments[4];
				if (typeof scope === "undefined") scope = abaaso;

			return observer.add(obj, event, listener, id, scope, state);
		},
		options         : function(uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
		permission      : client.permission,
		position        : el.position,
		post            : function(uri, success, failure, args) { return client.request(uri, "POST", success, failure, args); },
		put             : function(uri, success, failure, args) { return client.request(uri, "PUT", success, failure, args); },
		ready           : false,
		store           : function(arg, args) { return data.register.call(data, arg, args); },
		timer           : {},
		un              : function() {
			var all   = typeof arguments[0] === "string" ? false : true,
			    obj   = all ? arguments[0] : this,
				event = all ? arguments[1] : arguments[0],
				id    = all ? arguments[2] : arguments[1];
				if (obj === $) obj = abaaso;

			return observer.remove(obj, event, id);
		},
		update          : el.update,
		version         : "1.6.103"
	};
})();

if (typeof abaaso.init === "function") {
	var $ = function(arg, nodelist) { return abaaso.$(arg, nodelist); };

	// Hooking abaaso into global helper, it's superficial
	abaaso.alias($, abaaso);
	delete $.$;
	delete $.callback;
	delete $.init;
	delete $.observer.log;
	delete $.state.header;
	delete $.timer;

	switch (true) {
		case typeof document.addEventListener === "function":
			document.addEventListener("DOMContentLoaded", function() { abaaso.init(); }, false);
			break;
		default:
			abaaso.timer.init = setInterval(function(){
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(abaaso.timer.init);
					delete abaaso.timer.init;
					abaaso.init();
				}
			}, 10);
	}
}
