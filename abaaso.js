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
 * Events:    ready      Fires when the DOM is available
 *            render     Fires when the window resources have loaded
 *            resize     Fires when the window resizes; parameter for listeners is abaaso.client.size
 *            hash       Fires when window.location.hash changes; parameter for listeners is the hash value
 *            error      Fires when an Error is caught; parameter for listeners is the logged Object (abaaso.error.log)
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @namespace
 * @version 1.6.064
 */
var abaaso = abaaso || function(){
	"use strict";

	/**
	 * Array methods
	 *
	 * @class
	 */
	var array = {
		/**
		 * Returns an Object (NodeList, etc.) as an Array
		 *
		 * @param obj {Object} Object to cast
		 * @param key {Boolean} [Optional] Returns key or value, only applies to Objects without a length property
		 * @returns {Array} Object as an Array
		 */
		cast : function(obj, key) {
			try {
				if ((!/object/.test(typeof obj))
				    && (!obj instanceof NodeList)) {
					throw new Error(label.error.expectedObject);
				}

				key   = (key === true) ? true : false;
				var o = [], i, nth;

				switch (true) {
					case (/\d/.test(typeof obj.length)):
						for (i = 0, nth = obj.length; i < nth; i++) { o.push(obj[i]); }
						break;
					default:
						for (i in obj) { o.push((key) ? i : obj[i]); }
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
		 * @param instance {Array} An instance of the array to search
		 * @param arg {String} Comma delimited string of search values
		 * @returns {Mixed} Integer or an array of integers representing the location of the arg(s)
		 */
		contains : function(instance, arg) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				/,/.test(arg) ? arg = arg.split(/\s*,\s*/) : void(0);

				if (arg instanceof Array) {
					var indexes = [],
					    nth     = args.length,
					    i       = null;

					for (i = 0; i < nth; i++) {
						indexes[i] = instance.index(arg[i]);
					}

					return indexes;
				}

				return instance.index(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @param array1 {Array} An array to compare against
		 * @param array2 {Array} An array to compare against
		 * @returns {Array} An array of the differences
		 */
		diff : function(array1, array2) {
			try {
				if ((!array1 instanceof Array)
				    && (!array2 instanceof Array)) {
					throw new Error(label.error.expectedArray);
				}

				return array1.filter(function(key) {return (array2.indexOf(key) < 0);});
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the first Array node
		 *
		 * @param instance {Array} The array
		 * @returns {Mixed} The first node of the array
		 */
		first : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				return instance[0];
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the index of arg in instance. Use contains() for multiple arguments
		 *
		 * @param instance {Mixed} The entity to search
		 * @param arg {Mixed} The argument to find (string or integer)
		 * @returns {Integer} The position of arg in instance
		 */
		index : function(instance, arg) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var i = instance.length;

				while (i--) {
					if (instance[i] == arg) {
						return i;
					}
				}

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
		 * @param instance {Array} The array to index
		 * @param returns {Array} The indexed array
		 */
		indexed : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var o, i = 0, indexed = [];
				for (o in instance) {
					if (!/function/.test(typeof instance[o])) {
						indexed[i] = (instance[o] instanceof Array) ? instance[o].indexed() : instance[o];
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
		 * @param instance {Array} The array to extract keys from
		 * @returns {Array} An array of the keys in instance
		 */
		keys : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var keys = [],
				    i    = null;

				for (i in instance) {
					(!/function/.test(typeof instance[i])) ? keys.push(i) : void(0);
				}

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
		 * @param instance {Array} The array
		 * @returns {Mixed} The last node of the array
		 */
		last : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				return (instance.length > 1) ? instance[(instance.length - 1)] : instance[0];
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Removes indexes from an Array without recreating it
		 *
		 * @param obj {Array} Array to remove from
		 * @param start {Integer} Starting index
		 * @param end {Integer} [Optional] Ending index
		 * @returns {Array} The Array
		 */
		remove : function(obj, start, end) {
			try {
				switch (true) {
					case (!obj instanceof Array):
					case (!start.toString().isNumber()):
						throw new Error(label.error.invalidArguments);
				}

				start = start || 0;

				var length    = obj.length,
				    remaining = obj.slice((end || start)+1 || length);

				obj.length = (start < 0) ? (length + start) : start;
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
		 * @param obj {Array} Array to iterate
		 * @returns {Integer} Number of keys in Array
		 */
		total : function(obj) {
			try {
				if (!obj instanceof Array) {
					throw new Error(label.error.expectedArray);
				}
				var i = 0, arg;
				for (arg in obj) {
					(!/function/.test(typeof obj[arg])) ? i++ : void(0);
				}
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
	 * @class
	 * @private
	 */
	var cache = {
		/**
		 * Array of URIs
		 */
		items : [],

		/**
		 * Garbage collector for the cached items
		 *
		 * Expires cached items every two minutes
		 * @returns undefined
		 */
		clean : function() {
			var uri;
			for (uri in cache.items) {
				(!/function/.test(typeof cache.items[uri])
				 && (cache.expired(uri) === true)) ? cache.expire(uri) : void(0);
			}
			return;
		},

		/**
		 * Expires a URI from the local cache
		 *
		 * @param uri {String} The URI of the local representation
		 * @returns undefined
		 */
		expire : function(uri) {
			!/undefined/.test(typeof cache.items[uri]) ? delete cache.items[uri] : void(0);
			return;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @param uri {Object} The cached URI object
		 * @returns {Boolean} True if the URI has expired
		 */
		expired : function(uri) {
			var o      = abaaso.client,
			    c      = cache.items[uri],
			    epoch  = (c !== undefined) ? new Date(c.epoch) : null,
			    expire = ((c !== undefined) && (c.headers.Expires !== undefined)) ? new Date(c.headers.Expires) : null,
			    now    = new Date(),
			    date   = ((c !== undefined) && (c.headers.Date !== undefined)) ? new Date(c.headers.Date) : null,
			    result = ((c !== undefined)
			              && ((expire !== null && expire < now)
			                  || (date !== null && date.setMilliseconds(date.getMilliseconds() + o.expire) < now)
			                  || (o.expire > 0 && epoch.setMilliseconds(epoch.getMilliseconds() + o.expire) < now))) ? true : false;
			return result;
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @param uri {String} The URI/Identifier for the resource to retrieve from cache
		 * @param expire {Boolean} [Optional] If 'false' the URI will not expire
		 * @returns {Mixed} Returns the URI object {headers, response} or false
		 */
		get : function(uri, expire) {
			try {
				expire = (expire === false) ? false : true;

				if (/undefined/.test(typeof cache.items[uri])) {
					return false;
				}
				else {
					if (!/undefined/.test(typeof cache.items[uri].headers)) {
						if ((!/undefined/.test(typeof cache.items[uri].headers.Pragma) && /no-cache/i.test(cache.items[uri].headers.Pragma) && expire)
						    || (cache.expired(cache.items[uri]))) {
							cache.expire(uri);
							return false;
						}
						else {
							return cache.items[uri];
						}
					}
					else {
						return cache.items[uri];
					}
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @param uri {String} The URI to set or update
		 * @param property {String} The property of the cached URI to set
		 * @param value {Mixed} The value to set
		 */
		set : function(uri, property, value) {
			try {
				if (/undefined/.test(typeof cache.items[uri])) {
					cache.items[uri] = {};
					cache.items[uri].permission = 0;
				}

				(property == "permission") ? cache.items[uri].permission |= value
				                           : (property == "!permission") ? cache.items[uri].permission &= ~value
										                                 : cache.items[uri][property]   = value;
			}
			catch (e) {
				$.error(e, arguments, this);
			}
		}
	};

	/**
	 * Client properties and methods
	 *
	 * @class
	 */
	var client = {
		/**
		 * Public properties
		 */
		android : (function(){ return /android/i.test(navigator.userAgent); })(),
		blackberry : (function(){ return /blackberry/i.test(navigator.userAgent); })(),
		chrome  : (function(){ return /chrome/i.test(navigator.userAgent); })(),
		css3    : (function(){
			switch (true) {
				case (this.mobile):
				case (this.tablet):
				case ((this.chrome) && (this.version > 5)):
				case ((this.firefox) && (this.version > 2)):
				case ((this.ie) && (this.version > 8)):
				case ((this.opera) && (this.version > 8)):
				case ((this.safari) && (this.version > 4)):
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
		tablet  : (function(){ return ((/android|ipad|playbook|meego|webos/i.test(navigator.userAgent))
			                           && ((client.size.x >= 1000)
			                            || (client.size.y >= 1000))) ? true : false; })(),
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
			version      = (isNaN(parseInt(version))) ? 0 : parseInt(version);
			this.version = version;
			return version;
		}),

		/**
		 * Quick way to see if a URI allows a specific command
		 *
		 * @param uri {String} URI
		 * @param command {String} Command to query for
		 * @returns {Boolean} True if the command is available
		 */
		allow : function(uri, command) {
			try {
				if ((uri.isEmpty())
					|| (command.isEmpty())) {
					throw new Error(label.error.invalidArguments);
				}

				var result;

				if (cache.get(uri, false) === false) {
					return undefined;
				}

				switch (true) {
					case (/delete/i.test(command)):
						result = ((uri.permission(command).bit & 1) === 0) ? false : true
						break;
					case (/get/i.test(command)):
						result = ((uri.permission(command).bit & 4) === 0) ? false : true
						break;
					case (/post|put/i.test(command)):
						result = ((uri.permission(command).bit & 2) === 0) ? false : true
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
		 * @param uri {String} URI to retrieve permission from
		 * @returns {Object} Contains an array of available commands, the permission bit and a map
		 */
		permission : function (uri) {
			var cached = cache.get(uri, false),
			    bit    = (!cached) ? 0 : cached.permission,
				result = {allows: [], bit: bit, map: {read: 4, write: 2, "delete": 1}};

			(bit & 1) ? result.allows.push("DELETE") : void(0);
			(bit & 2) ? (function(){ result.allows.push("PUT"); result.allows.push("PUT"); })() : void(0);
			(bit & 4) ? result.allows.push("GET") : void(0);

			return result;
		},

		/**
		 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
		 *
		 * Events:     beforeXHR      Fires before the XmlHttpRequest is made
		 *             before[type]   Fires before the XmlHttpRequest is made, type specific
		 *             failed[type]   Fires on error
		 *             received[type] Fires on XHR readystate 2, clears the timeout only!
		 *             timeout[type]  Fires 30s after XmlHttpRequest is made
		 *
		 * @param uri {String} The resource to interact with
		 * @param type {String} The type of request (DELETE/GET/POST/PUT/JSONP)
		 * @param success {Function} A handler function to execute when an appropriate response been received
		 * @param failure {Function} [Optional] A handler function to execute on error
		 * @param args {Mixed} Data to send with the request, or a custom JSONP handler parameter name
		 * @private
		 */
		request : function(uri, type, success, failure, args) {
			if (/post|put/i.test(type) && args === undefined) {
				throw new Error(label.error.invalidArguments);
			}

			if (/jsonp/i.test(type)) {
				var curi = new String(uri), uid;

				curi.on("afterJSONP", function(arg){ success(arg); });

				do uid = "a" + utility.id();
				while (!/undefined/.test(typeof abaaso.callback[uid]));

				/undefined/.test(typeof args) ? args = "callback" : void(0);

				uri  = uri.replace(args + "=?", args + "=abaaso.callback." + uid);

				abaaso.callback[uid] = function(arg){
					delete abaaso.callback[uid];
					curi.fire("afterJSONP", arg)
					    .un("afterJSONP");
				};

				el.create("script", {src: uri, type: "text/javascript"}, $("head")[0]);
			}
			else {
				var xhr     = new XMLHttpRequest(),
				    payload = /post|put/i.test(type) ? args : null,
				    headers = (/get/i.test(type) && (args instanceof Object)) ? args : null,
				    cached  = /options/i.test(type) ? false : cache.get(uri, false),
					typed   = type.toLowerCase().capitalize(),
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

				switch (type.toLowerCase()) {
					case "delete":
						uri.on("afterDelete", function(){
							cache.expire(uri);
							uri.un("afterDelete", "expire");
						}, "expire");
						break;
				}

				uri.on("received" + typed, timer)
				   .on("timeout"  + typed, fail)
				   .on("after"    + typed, function(arg){ (/function/.test(typeof success)) ? success(arg) : void(0); })
				   .on("failed"   + typed, function(){ (/function/.test(typeof failure)) ? failure() : void(0); })
				   .fire("before" + typed)
				   .fire("beforeXHR");

				if ((!/options/i.test(type)) && (uri.allow(type) === false)) {
					uri.fire("failed" + typed);
					return uri;
				}

				abaaso.timer[typed + "-" + uri] = setTimeout(function(){ uri.fire("timeout" + typed); }, 30000);

				xhr.onreadystatechange = function() { client.response(xhr, uri, type); };
				xhr.open(type.toUpperCase(), uri, true);

				if (payload !== null) {
					switch (true) {
						case (payload instanceof Document):
							xhr.setRequestHeader("Content-type", "application/xml");
							break;
						case (payload instanceof Object):
							xhr.setRequestHeader("Content-type", "application/json");
							payload = json.encode(payload);
							break;
						default:
							xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
					}
				}

				if (headers !== null) {
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}
				}

				(/object/.test(typeof cached)
				 && !/undefined/.test(typeof cached.headers.ETag)) ? xhr.setRequestHeader("ETag", cached.headers.ETag) : void(0);

				xhr.send(payload);
			}

			return uri;
		},

		/**
		 * Receives and caches the URI response
		 *
		 * Headers are cached, if an expiration is set it will be used to control the local cache
		 * If abaaso.state.header is set, a state change is possible
		 *
		 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
		 * resource
		 *
		 * Events:     afterXHR    Fires after the XmlHttpRequest response is received
		 *             after[type] Fires after the XmlHttpRequest response is received, type specific
		 *             success     Fires if a 400 response is received
		 *             failure     Fires if an exception is thrown
		 *
		 * @param xhr {Object} XMLHttpRequest object
		 * @param uri {String} The URI.value to cache
		 * @param fn {Function} A handler function to execute once a response has been received
		 * @param type {String} The type of request
		 * @param ffn {Function} [Optional] A handler function to execute on error
		 * @private
		 */
		response : function(xhr, uri, type) {
			try {
				var typed = type.toLowerCase().capitalize(), bit;

				/**
				 * Returns a bit value based on the array contents
				 *
				 *   1 --d delete
				 *   2 -w- write
				 *   3 -wd write and delete
				 *   4 r-- read
				 *   5 r-x read and delete
				 *   6 rw- read and write
				 *   7 rwx read, write and delete
				 *
				 * @param args {Array} The commands the URI accepts
				 * @returns {Integer} To be set as a bit
				 */
				bit = function(args) {
					try {
						if (!args instanceof Array) {
							throw Error(label.error.expectedArray);
						}

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

				if (xhr.readyState == 2) {
					uri.fire("received" + typed);

					var headers = xhr.getAllResponseHeaders().split("\n"),
					    i       = null,
					    nth     = headers.length,
					    items   = {},
						allow   = null,
						o;

					for (i = 0; i < nth; i++) {
						if (!headers[i].isEmpty()) {
							var header    = headers[i].toString(),
							    value     = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");

							header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
							items[header] = value;

							/allow/i.test(header) ? allow = value : void(0);
						}
					}

					cache.set(uri, "headers", items);
					cache.set(uri, "permission", bit((allow !== null) ? allow.split(/\s*,\s*/) : [type]));
				}
				else if (xhr.readyState == 4) {
					switch (true) {
							case ((xhr.status == 200)
							      && ((/options/i.test(type)
							          || (!xhr.responseText.isEmpty())))):
								var state  = null,
								    s      = abaaso.state;

								if (!/delete|options/i.test(type)) {
									cache.set(uri, "epoch", new Date());
									cache.set(uri, "response", (xhr.responseXML === null) ? xhr.responseText : xhr.responseXML);
								}

								o = cache.get(uri, false);

								/options/i.test(type) ? cache.expire(uri) : void(0);

								// HATEOAS
								if ((/options/i.test(type) === false)
									&& (s.header !== null)
								    && (state = o.headers[s.header])
									&& !/undefined/.test(typeof state)
								    && !new RegExp(state).test(abaaso.state.current)) {
									/function/.test(typeof abaaso.state.change) ? abaaso.state.change(state) : abaaso.state.current = state;
								}

								uri.fire("afterXHR");
								uri.fire("after" + typed, (/options/i.test(type)) ? o.headers : o.response);
								break;
							case (xhr.status == 301):
								throw new Error(label.error.serverError);
								break;
							case (xhr.status == 401):
								throw new Error(label.error.serverUnauthorized);
								break;
							case (xhr.status == 405):
								cache.set(uri, "!permission", bit(type));
								throw new Error(label.error.serverInvalidMethod);
								break;
							default:
								throw new Error(label.error.serverError);
					}
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				uri.fire("failed" + typed);
			}
		},


		/**
		 * Returns the visible area of the View
		 *
		 * @private
		 * @returns {Object} Object describing the size of the View {x:?, y:?}
		 */
		size : function() {
			var x = ((document.compatMode == "CSS1Compat")
					 && (client.opera === false)) ? document.documentElement.clientWidth : document.body.clientWidth,
			    y = ((document.compatMode == "CSS1Compat")
					 && (client.opera === false)) ? document.documentElement.clientHeight : document.body.clientHeight;

			return {x: x, y: y};
		}
	};

	/**
	 * Cookie management methods
	 *
	 * @class
	 */
	var cookie = {
		/**
		 * Expires a cookie if it exists
		 *
		 * @param name {String} The name of the cookie to create
		 */
		expire : function(name) {
			!/undefined/.test(typeof this.get(name)) ? this.set(name, "", "-1s") : void(0);
		},

		/**
		 * Gets a cookie
		 *
		 * @returns {Object} The requested cookie or undefined
		 */
		get : function(name) {
			return this.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @returns {Object} Object containing the cookies
		 */
		list : function() {
			var i      = null,
			    nth    = null,
			    item   = null,
			    items  = null,
			    result = {};

			if ((document.cookie)
			    && (document.cookie != '')) {
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
		 * @param name {String} The name of the cookie to create
		 * @param value {String} The value to set
		 * @param offset {String} A positive or negative integer followed by "d", "h", "m" or "s"
		 * @returns {Object} The new cookie
		 */
		set : function(name, value, offset) {
			offset = offset.toString() || "";
			var expire = "",
			    span   = null,
			    type   = null,
			    types  = ["d", "h", "m", "s"],
			    i      = types.length;

			if (offset != "") {
				while (i--) {
					if (offset.indexOf(types[i]) > 0) {
						type = types[i];
						span = parseInt(offset.substring(0, offset.indexOf(type)));
						break;
					}
				}

				if (isNaN(span)) {
					throw new Error(label.error.invalidArguments);
				}

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
			(expire != "") ? expire = "; expires=" + expire.toUTCString() : void(0);
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
	 * @class
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
		 * Events:     beforeDataBatch    Fires before the batch is queued
		 *             afterDataBatch     Fires after the batch is queued
		 *
		 * @param type {String} The type of action to perform
		 * @param data {Mixed} Array of keys or indexes to delete, or Object containing multiple records to set
		 * @param sync {Boolean} [Optional] True if called by data.sync
		 * @returns {Object} The data store
		 */
		batch : function(type, data, sync) {
			type = type.toString().toLowerCase() || undefined;
			sync = (sync === true) ? true : false;

			try {
				switch (true) {
					case (!/set|del/.test(type)):
					case (!/object/.test(typeof data)):
						throw Error(label.error.invalidArguments);
				}

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
								key = ((this.key !== null) && (!/undefined/.test(typeof data[i][this.key]))) ? this.key : i;
								this.set(key, data[i], sync);
								break;
						}
					}
				}
				else {
					for (i in data) {
						switch (true) {
							case (type == "del"):
								this.del(data[i], false);
								break;
							case (type == "set"):
								key = ((this.key !== null) && (!/undefined/.test(typeof data[i][this.key]))) ? this.key : i;
								(key != i) ? delete data[i][key] : key = key.toString();
								this.set(key, data[i], sync);
								break;
						}
					}
				}

				(type == "del") ? this.reindex() : void(0);
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
		 * Events:     beforeDataClear    Fires before the data is cleared
		 *             afterDataClear     Fires after the data is cleared
		 *
		 * @returns {Object} The data store being cleared
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
		 * Events:     beforeDataDelete    Fires before the record is deleted
		 *             afterDataDelete     Fires after the record is deleted
		 *             syncDataDelete      Fires when the local store is updated
		 *             failedDataDelete    Fires if the store is RESTful and the action is denied
		 *
		 * @param record {Mixed} The record key or index
		 * @param reindex {Boolean} Default is true, will re-index the data object after deletion
		 * @returns {Object} The data store
		 */
		del : function(record, reindex) {
			try {
				reindex = (reindex === false) ? false : true;

				var obj  = this.parentNode,
				    guid = $.genId(),
				    key;

				if ((/undefined/.test(typeof record))
				    || (!/number|string/.test(typeof record))) {
					throw new Error(label.error.invalidArguments);
				}

				if (/string/.test(typeof record)) {
					key    = record;
					record = this.keys[key];
					if (/undefined/.test(typeof key)) {
						throw new Error(label.error.invalidArguments);
					}
					record = record.index;
				}
				else {
					key = this.records[record];
					if (/undefined/.test(typeof key)) {
						throw new Error(label.error.invalidArguments);
					}
					key = key.key;
				}

				obj.on("syncDataDelete", function(){
					obj.un("syncDataDelete", guid);
					this.records.remove(record);
					delete this.keys[key];
					this.total--;
					(reindex === true) ? this.reindex() : void(0);
					obj.fire("afterDataDelete");
					return this;
				}, guid, this);

				obj.fire("beforeDataDelete");

				(this.uri === null) ? obj.fire("syncDataDelete")
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
		 * Events:     beforeDataFind    Fires before the search begins
		 *             afterDataFind     Fires after the search has finished
		 *
		 * @param needle {Mixed} String, Number or Pattern to test for
		 * @param haystack {Mixed} [Optional] The field(s) to search
		 * @returns {Array} Array of results
		 */
		find : function(needle, haystack) {
			try {
				if (/undefined/.test(typeof needle)) {
					throw Error(label.error.invalidArguments);
				}

				var h      = [],
				    n      = /string/.test(typeof needle) ? needle.split(/\s*,\s*/) : needle,
				    result = [],
				    nth    = h.length,
					nth2   = n.length,
					obj    = this.parentNode,
					x, y, f, r, s, p, i;

				obj.fire("beforeDataFind");

				if ((/undefined/.test(typeof haystack))
					|| (!haystack instanceof Array)) {
					if (/string/.test(typeof haystack)) {
						h = haystack.split(/\s*,\s*/);
						for (i in h) {
							if (/undefined/.test(typeof this.records.first().data[h[i]])) {
								throw Error(label.error.invalidArguments);
							}
						}
					}
					else {
						for (i in this.records.first().data) {
							h.push(i);
						}
					}
				}
				else {
					for (i in haystack) {
						if (/undefined/.test(typeof this.records.first().data[haystack[i]])) {
							throw Error(label.error.invalidArguments);
						}
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
							if (r.test(s)) {
								result.push(this.records[i]);
							}
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
		 * Events:     beforeDataGet    Fires before getting the record
		 *             afterDataGet     Fires after getting the record
		 *
		 * @param record {Mixed} The record key (String),  index (Integer) or Array for pagination [start, end]
		 * @returns {Object} Data store record
		 */
		get : function(record) {
			try {
				var r   = [],
				    obj = this.parentNode,
				    i, start, end;

				obj.fire("beforeDataGet");

				if (/string/.test(typeof record)) {
					r = !/undefined/.test(typeof this.keys[record]) ? this.records[this.keys[record].index] : undefined;
				}
				else if (record instanceof Array) {
					if (isNaN(record[0]) || isNaN(record[1])) {
						throw new Error(label.error.invalidArguments);
					}

					start = record[0] - 1;
					end   = record[1] - 1;

					for (i = start; i < end; i++) {
						!/undefined/.test(typeof this.records[i]) ? r.push(this.records[i]) : void(0);
					}
				}
				else {
					r = this.records[record];
				}

				obj.fire("afterDataGet");
				return r;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Factory to create an instance on an Object
		 *
		 * Events:     beforeDataStore    Fires before registering the data store
		 *             afterDataStore     Fires after registering the data store
		 *
		 * @param obj {Object} The Object to register with
		 * @param data {Mixed} [Optional] Data to set with this.batch
		 * @returns {Object} The Object registered with
		 */
		register : function(obj, data) {
			try {
				if (obj instanceof Array) {
					var i = (!isNaN(obj.length)) ? obj.length : obj.total();
					while (i--) {
						this.register(obj[i], data);
					}
				}
				else {
					var getter, setter;
					getter = function(){ return this._uri; };
					setter = function(arg){
						try {
							if ((arg !== null) && (arg.isEmpty())) {
								throw Error(label.error.invalidArguments);
							}
							this._uri = arg;
							(arg !== null) ? this.sync() : void(0);
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
						case (/undefined/.test(typeof obj.fire)):
							obj.fire = function(){ return $.fire.apply(this, arguments); };
						case (/undefined/.test(typeof obj.listeners)):
							obj.listeners = function(){ return $.listeners.apply(this, arguments); };
						case (/undefined/.test(typeof obj.on)):
							obj.on = function(event, listener, id, scope, standby) {
								scope = scope || this;
								return $.on(this, event, listener, id, scope, standby);
							};
						case (/undefined/.test(typeof obj.un)):
							obj.un = function(event, id) { return $.un(this, event, id); };
					}

					obj.fire("beforeDataStore");
					obj.data = utility.clone(this);
					obj.data.keys    = {};
					obj.data.records = [];
					obj.data.total   = 0;
					obj.data.parentNode = obj; // Recursion, but expected
					delete obj.data.register;

					switch (true) {
						case (($.client.ie) && ($.client.version == 8)):
							// Pure hackery, only exists when needed
							obj.data.uri    = null;
							obj.data.setUri = function(arg){ obj.data.uri = arg; setter.call(obj.data, arg); };
						case (/undefined/.test(typeof Object.defineProperty)):
							obj.data.__defineGetter__("uri", getter);
							obj.data.__defineSetter__("uri", setter);
							break;
						default:
							Object.defineProperty(obj.data, "uri", {get: getter, set: setter});
					}

					/object/.test(typeof data) ? obj.data.batch("set", data) : void(0);
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
		 * Events:     beforeDataReindex    Fires before reindexing the data store
		 *             afterDataReindex     Fires after reindexing the data store
		 *
		 * @returns {Object} The data store
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
		 * Events:     beforeDataSet    Fires before the record is set
		 *             afterDataSet     Fires after the record is set
		 *             syncDataSet      Fires when the local store is updated
		 *             failedDataSet    Fires if the store is RESTful and the action is denied
		 *
		 * @param key {Mixed} Integer or String to use as a Primary Key
		 * @param data {Object} Key:Value pairs to set as field values
		 * @param sync {Boolean} [Optional] True if called by data.sync
		 * @returns {Object} The data store
		 */
		set : function(key, data, sync) {
			try {
				key = (key === null) ? undefined : key.toString();
				sync = (sync === true) ? true : false;

				switch (true) {
					case (((/undefined/.test(typeof key)) || (key.isEmpty())) && (this.uri === null)):
					case (/undefined/.test(typeof data)):
					case (data instanceof Array):
					case (data instanceof Number):
					case (data instanceof String):
					case (!/object/.test(typeof(data))):
						throw new Error(label.error.invalidArguments);
				}

				var record = ((/undefined/.test(typeof this.keys[key]))
				              && (/undefined/.test(typeof this.records[key]))) ? undefined : this.get(key),
				    obj    = this.parentNode,
				    guid   = $.genId(),
				    arg, index, record;

				obj.on("syncDataSet", function(){
					obj.un("syncDataSet", guid);
					if (/undefined/.test(typeof record)) {
						if (/undefined/.test(typeof key)) {
							arg = $.decode(arguments[0]);

							if (/undefined/.test(typeof arg)) {
								obj.fire("failedDataSet");
								throw Error(label.error.expectedObject);
							}

							key = (this.key === null) ? array.cast(arg).first() : arg[this.key];
							key = key.toString();
						}
						(!/undefined/.test(typeof data[key])) ? key = data[key] : void(0);
						this.keys[key] = {};
						index = this.records.length;
						this.keys[key].index = index;
						this.records[index] = {};
						this.records[index].data = data;
						this.records[index].key  = key;
						record = this.records[index];
						(this.key !== null) ? delete this.records[index].data[this.key] : void(0);
						this.total++;
					}
					else {
						if (/object/.test(typeof(data))) {
							for (arg in data) {
								record[arg] = data[arg];
							}
							this.records[record.index] = record;
						}
						else {
							this.records[record.index] = data;
						}
					}
					obj.fire("afterDataSet", record);
				}, guid, this);

				obj.fire("beforeDataSet");

				((this.uri === null)
				 || (sync === true)) ? obj.fire("syncDataSet")
				                     : $[(/undefined/.test(typeof key)) ? "post" : "put"](/undefined/.test(typeof key) ? this.uri : this.uri+"/"+key, function(arg){ obj.fire("syncDataSet", arg); }, function(){ obj.fire("failedDataSet"); }, data);

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
		 * Events:     beforeDataSync    Fires before syncing the data store
		 *             afterDataSync     Fires after syncing the data store
		 *
		 * @returns {Object} The data store
		 */
		sync : function() {
			try {
				if ((this.uri === null) || (this.uri.isEmpty())) {
					throw Error(label.error.invalidArguments);
				}

				var obj  = this.parentNode,
				    guid = $.genId(),
				    success, failure;

				this.uri.on("afterGet", function(arg){
					this.uri.un("afterGet", guid);
					try {
						var data = $.decode(arg);
						if (/undefined/.test(typeof data)) {
							throw Error(label.error.expectedObject);
						}
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
	 * @class
	 */
	var el = {
		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * Events:    beforeClear    Fires before the Object is cleared
		 *            afterClear     Fires after the Object is cleared
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {Mixed} Instance or Array of Instances
		 */
		clear : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.clear(obj[i]);
					}

					return obj;
				}
				else {
					obj = utility.object(obj);

					if (obj !== null) {
						obj.fire("beforeClear");

						switch (true) {
							case (/function/.test(typeof obj.reset)):
								obj.reset();
								break;
							case (!/undefined/.test(typeof obj.value)):
								obj.update({innerHTML: "", value: ""});
								break;
							default:
								obj.update({innerHTML: ""});
						}

						obj.fire("afterClear");

						return obj;
					}
					else {
						throw new Error(label.error.elementNotFound);
					}
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates an element in document.body or a target element
		 *
		 * Element.genId() is executed if args doesn't contain an id
		 *
		 * Events:    beforeCreate    Fires after the object has been created, but not set
		 *            afterCreate     Fires after the object has been appended to it's parent
		 *
		 * @param type {String} Type of element to create
		 * @param args {Object} [Optional] Collection of properties to apply to the new element
		 * @param id {Mixed} [Optional] Target object or element.id value to append to
		 * @returns {Object} The elemented that was created
		 */
		create : function(type, args, id) {
			try {
				if (/undefined/.test(typeof type)) {
					throw new Error(label.error.invalidArguments);
				}

				var obj, target;

				if (!/undefined/.test(typeof id)) {
					target = /object/.test(typeof id) ? id : $(id);
				}
				else if (!/undefined/.test(typeof args) && (/string/.test(typeof args) || !/undefined/.test(typeof args.childNodes))) {
					target = args;
					/string/.test(typeof target) ? target = $(target) : void(0);
				}
				else {
					target = document.body;
				}

				if (/undefined/.test(typeof target)) {
					throw new Error(label.error.invalidArguments);
				}

				obj = document.createElement(type);

				(!/undefined/.test(typeof args)
				 && !/string/.test(typeof args)
				 && /undefined/.test(typeof args.childNodes)
				 && !/undefined/.test(typeof args.id)
				 && /undefined/.test(typeof $("#"+args.id))) ? obj.id = args.id : obj.genId();

				(!/undefined/.test(typeof args) && !/undefined/.test(typeof args.id)) ? delete args.id : void(0);

				obj.fire("beforeCreate");
				(/object/.test(typeof args) && /undefined/.test(typeof args.childNodes)) ? obj.update(args) : void(0);
				target.appendChild(obj);
				obj.fire("afterCreate");
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Loads a CSS stylesheet into the View
		 *
		 * @param content {String} The CSS to put in a style tag
		 * @returns {Object} The style Element created
		 */
		css : function(content) {
			try {
				var ss, css;
				ss = $.create("style", {type: "text/css"}, $("head")[0]);
				if (ss.styleSheet) {
					ss.styleSheet.cssText = content;
				}
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
		 * Destroys an element
		 *
		 * Events:    beforeDestroy    Fires before the destroy starts
		 *            afterDestroy     Fires after the destroy ends
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {Mixed} Undefined or Array of Instances
		 */
		destroy : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = (!isNaN(obj.length)) ? obj.length : obj.total();
					while (i--) {
						this.destroy(obj[i]);
					}
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (!/undefined/.test(typeof obj)) {
						obj.fire("beforeDestroy");
						observer.remove(obj.id);
						obj.parentNode.removeChild(obj);
						obj.fire("afterDestroy");
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
		 * Disables an element
		 *
		 * Events:    beforeDisable    Fires before the disable starts
		 *            afterDisable     Fires after the disable ends
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 */
		disable : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = (!isNaN(obj.length)) ? obj.length : obj.total();
					while (i--) {
						this.disable(obj[i]);
					}
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (!/undefined/.test(typeof obj)
					    && !/undefined/.test(typeof obj.disabled)) {
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
		 * Enables an element
		 *
		 * Events:    beforeEnable    Fires before the enable starts
		 *            afterEnable     Fires after the enable ends
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {Mixed} Instance or Array of Instances
		 */
		enable : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = /\d/.test(typeof obj.length) ? obj.length : obj.total();
					while (i--) {
						this.enable(obj[i]);
					}
					return obj;
				}
				else {
					obj = utility.object(obj);
					if (!/undefined/.test(typeof obj)
					    && !/undefined/.test(typeof obj.disabled)) {
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
		 * Events:    beforeHide    Fires before the object is hidden
		 *            afterHide     Fires after the object is hidden
		 *
		 * @param obj {Mixed} Instance, Array of Instances or $() friendly ID
		 * @returns {Mixed} Instance or Array of Instances
		 */
		hide : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.hide(obj[i]);
					}

					return obj;
				}
				else {
					obj = utility.object(obj);
					obj.fire("beforeHide");
					obj["data-display"] = obj.style.display;
					obj.style.display = "none";
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
		 * @param obj {Mixed} Instance or $() friendly ID
		 * @returns {Boolean} Indicates if Object is hidden
		 */
		hidden : function(obj) {
			try {
				obj = utility.object(obj);

				if (/undefined/.test(typeof obj)) {
					throw new Error(label.error.invalidArguments);
				}

				return (obj.style.display == "none") ? true : false;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the position of an element
		 *
		 * @param id {String} Target object.id value
		 * @returns {Array} An array containing the render position of the element
		 */
		position : function(obj) {
			try {
				obj = utility.object(obj);

				if (/undefined/.test(typeof obj)) {
					throw new Error(label.error.invalidArguments);
				}

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
		 * Events:    beforeEnable    Fires before the object is visible
		 *            afterEnable     Fires after the object is visible
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {Mixed} Instance or Array of Instances
		 */
		show : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.show(obj[i]);
					}

					return obj;
				}
				else {
					obj = utility.object(obj);
					obj.fire("beforeShow");
					obj.style.display = (!/undefined/.test(typeof obj["data-display"])
					                     && !obj["data-display"].isEmpty()) ? obj["data-display"] : "inherit";
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
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {Object} Object of the dimensions {x:, y:}
		 */
		size : function(obj) {
				obj = utility.object(obj);

				if (/undefined/.test(typeof obj)) {
					throw new Error(label.error.invalidArguments);
				}

				/**
				 * Casts n to a number or returns zero
				 *
				 * @param n {Mixed} The value to cast
				 * @returns {Integer} The casted value or zero
				 */
				var num = function(n) {
					return (!isNaN(parseInt(n))) ? parseInt(n) : 0;
				};

				var x = obj.offsetHeight + num(obj.style.paddingTop) + num(obj.style.paddingBottom) + num(obj.style.borderTop) + num(obj.style.borderBottom),
					y = obj.offsetWidth + num(obj.style.paddingLeft) + num(obj.style.paddingRight) + num(obj.style.borderLeft) + num(obj.style.borderRight);

				return {x:x, y:y};
		},

		/**
		 * Updates an object or element
		 *
		 * Events:    beforeUpdate    Fires before the update starts
		 *            afterUpdate     Fires after the update ends
		 *
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @param args {Object} A collection of properties
		 * @returns {Mixed} Instance or Array of Instances
		 */
		update : function(obj, args) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.update(obj[i], args);
					}

					return obj;
				}
				else {
					obj = utility.object(obj);
					args = args || {};

					var i;

					if (/undefined/.test(typeof obj)) {
						throw new Error(label.error.invalidArguments);
					}

					obj.fire("beforeUpdate");

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
								obj.setAttribute((client.ie && (client.version < 9)) ? "className" : "class", args[i]);
								break;
							case "id":
								var o = observer.listeners;
								if (!/undefined/.test(typeof o[obj.id])) {
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
	 * @class
	 */
	var number = {
		/**
		 * Returns true if the number is even
		 *
		 * @param arg {Integer}
		 * @returns {Boolean}
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
		 * Returns true if the number is odd
		 *
		 * @param arg {Integer}
		 * @returns {Boolean}
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
	 * @class
	 */
	var json = {
		/**
		 * Decodes the argument into an object
		 *
		 * @param arg {String} The string to parse
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
		 * Encodes a string, array or object to a JSON string
		 *
		 * @param arg {Mixed} The entity to encode
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
	 * @class
	 */
	var label = {
		/**
		 * Common labels
		 */
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

		/**
		 * Error messages
		 */
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
			serverError           : "A server error has occurred",
			serverInvalidMethod   : "Method not allowed",
			serverUnauthorized    : "Unauthorized to access URI"
		}
	};

	/**
	 * Mouse co-ordinates
	 *
	 * @class
	 */
	var mouse = {
		/**
		 * Indicates whether mouse tracking is enabled
		 */
		enabled : false,

		/**
		 * Indicates whether to try logging co-ordinates to the console
		 */
		log : false,

		/**
		 * Mouse co-ordinations
		 */
		pos : {x: null, y: null},

		/**
		 * Enables or disables mouse co-ordinate tracking
		 *
		 * @param n {Mixed} Boolean to enable/disable tracking, or Mouse Event
		 * @returns {Object} abaaso.mouse
		 */
		track : function(n) {
			var m = abaaso.mouse;
			switch (true) {
				case (/object/.test(typeof n)):
					var x, y, c = false;
					x = (n.pageX) ? n.pageX : ((((client.ie) && (client.version == 8)) ? document.documentElement.scrollLeft : document.body.scrollLeft) + n.clientX);
					y = (n.pageY) ? n.pageY : ((((client.ie) && (client.version == 8)) ? document.documentElement.scrollTop  : document.body.scrollTop)  + n.clientY);

					if (m.pos.x != x) {
						$.mouse.pos.x = m.pos.x = x;
						c = true;
					}

					if (m.pos.y != y) {
						$.mouse.pos.y = m.pos.y = y;
						c = true;
					}

					((c === true) && (m.log === true)) ? utility.log(m.pos.x + " : " + m.pos.y) : void(0);
					break;
				case (/boolean/.test(typeof n)):
					(n === true) ? ((document.addEventListener)    ? document.addEventListener("mousemove", abaaso.mouse.track, false)    : document.attachEvent("onmousemove", abaaso.mouse.track))
					             : ((document.removeEventListener) ? document.removeEventListener("mousemove", abaaso.mouse.track, false) : document.detachEvent("onmousemove", abaaso.mouse.track));
					$.mouse.enabled = m.enabled = n;
					break;
			}
			return m;
		}
	};

	/**
	 * Observer for events
	 *
	 * @class
	 */
	var observer = {
		/**
		 * Collection event listeners
		 */
		listeners : {},

		/**
		 * If true, events fired are written to the console
		 */
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @param obj {Mixed} The object.id or instance of object firing the event
		 * @param event {String} The event being fired
		 * @param fn {Function} The event handler
		 * @param id {String} [Optional / Recommended] The id for the listener
		 * @param scope {String} [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param state {String} [Optional] The state the listener is for
		 * @returns {Object} The object
		 */
		add : function(obj, event, fn, id, scope, state) {
			try {
				if (obj instanceof Array) {
					var nth  = ((obj.length) && (!isNaN(obj.length))) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.add(obj[i], event, fn, id, ((/undefined/.test(typeof scope)) ? obj[i] : scope), state);
					}

					return obj;
				}
				else {
					obj     = utility.object(obj);
					(/undefined/.test(typeof id) || !/\w/.test(id)) ? id = $.genId() : void(0);

					var instance = null,
					    l        = observer.listeners,
					    o        = !/undefined/.test(typeof obj.id) ? obj.id : obj,
					    efn, item;

					switch (true) {
						case (/undefined/.test(typeof o)):
						case (/undefined/.test(typeof event)):
						case (!/function/.test(typeof fn)):
							throw new Error(label.error.invalidArguments);
					}

					switch (true) {
						case (/undefined/.test(typeof l[o])):
							l[o] = {};
						case (/undefined/.test(typeof l[o][event])):
							l[o][event] = {};
						case (/undefined/.test(typeof l[o][event].active)):
							l[o][event].active = {};
						case (/undefined/.test(typeof l[o][event].standby)):
							l[o][event].standby = {};
					}

					item = {fn: fn, scope: scope};

					if (/undefined/.test(typeof state)) {
						l[o][event].active[id] = item;
						instance = (o != "abaaso") ? $("#"+o) : null;
						efn = function(e) {
					    	(!e) ? e = window.event : void(0);
					    	e.cancelBubble = true;
					    	/function/.test(typeof e.stopPropagation) ? e.stopPropagation() : void(0);
					    	instance.fire(event);
					    };
						((instance !== null)
						 && !/afterjsonp/i.test(event)
						 && !/undefined/.test(typeof instance)) ? ((/function/.test(typeof instance.addEventListener)) ? instance.addEventListener(event, efn, false)
															                                                           : instance.attachEvent("on" + event, efn))
						                                        : void(0);
					}
					else {
						/undefined/.test(typeof l[o][event].standby[state]) ? l[o][event].standby[state] = {} : void(0);
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
		 * @param obj {Mixed} The object.id or instance of object firing the event
		 * @param event {String} The event being fired
		 * @param arg {Mixed} [Optional] Argument supplied to the listener
		 * @returns {Object} The object
		 */
		fire : function(obj, event, arg) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.fire(obj[i], event, arg);
					}

					return obj;
				}
				else {
					obj   = utility.object(obj);
					var o = !/undefined/.test(typeof obj.id) ? obj.id : obj.toString(),
					    l, i, c, f, s;

					switch (true) {
						case (/undefined/.test(typeof o)):
						case (o.isEmpty()):
						case (/undefined/.test(typeof obj)):
						case (/undefined/.test(typeof event)):
							throw new Error(label.error.invalidArguments);
					}

					(abaaso.observer.log === true) ? utility.log(o + " fired " + event) : void(0);

					l = observer.list(obj, event).active;

					if (!/undefined/.test(typeof l)) {
						for (i in l) {
							c = /object/.test(typeof l[i].scope) ? l[i].scope : $("#"+l[i].scope);
							f = l[i].fn;
							s = !/undefined/.test(typeof c) ? c : abaaso;
							/undefined/.test(typeof arg) ? f.call(s) : f.call(s, arg);
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
		 * Lists the active and standby listeners for an object event
		 *
		 * @param obj {Mixed} The object.id or instance of object firing the event
		 * @param event {String} The event being fired
		 * @returns {Array} The listeners for object
		 */
		list : function(obj, event) {
			try {
				if (/undefined/.test(typeof obj)) {
					throw new Error(label.error.invalidArguments);
				}

				obj   = utility.object(obj);
				var l = this.listeners,
				    o = !/undefined/.test(typeof obj.id) ? obj.id : obj.toString();

				return !/undefined/.test(typeof l[o]) ? ((!/undefined/.test(typeof event)
				                                         && !/undefined/.test(typeof l[o][event])) ? $.clone(l[o][event])
				                                                                                   : $.clone(l[o]))
				                                      : {};
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Removes an event listener, or listeners
		 *
		 * @param obj {Mixed} The object.id or instance of object firing the event
		 * @param event {String} The event being fired
		 * @param id {String} [Optional] The identifier for the listener
		 * @returns {Object} The object
		 */
		remove : function(obj, event, id) {
			try {
				if (obj instanceof Array) {
					var nth  = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;

					for (i = 0; i < nth; i++) {
						this.remove(obj[i], event, id);
					}

					return obj;
				}
				else {
					obj          = utility.object(obj);
					var instance = null,
					    o        = !/undefined/.test(typeof obj.id) ? obj.id : obj.toString(),
					    l        = observer.listeners,
					    efn;

					switch (true) {
						case (/undefined/.test(typeof o)):
						case (/undefined/.test(typeof event)):
						case (/undefined/.test(typeof l[o])):
						case (/undefined/.test(typeof l[o][event])):
							return obj;
					}

					if (/undefined/.test(typeof id)) {
						delete l[o][event];
						instance = (o != "abaaso") ? $("#"+o) : null;
						efn = function(e) {
					    	(!e) ? e = window.event : void(0);
					    	e.cancelBubble = true;
					    	/function/.test(typeof e.stopPropagation) ? e.stopPropagation() : void(0);
					    	instance.fire(event);
					    };
						((instance !== null)
						 && !/afterjsonp/i.test(event)
						 && !/undefined/.test(typeof instance)) ? (/function/.test(typeof instance.removeEventListener) ? instance.removeEventListener(event, efn, false)
						                                                                                                : instance.detachEvent("on" + event, efn))
						                                        : void(0);
					}
					else if (!/undefined/.test(typeof l[o][event].active[id])) {
						delete l[o][event].active[id];
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
		 * Replaces active listeners with the relevant standby listeners
		 *
		 * @param state {String} The new application state
		 * @returns {Object} The object
		 */
		replace : function(state) {
			try {
				var l = this.listeners,
				    i, e;

				for (i in l) {
					for (e in l[i]) {
						l[i][e].standby[$.state.previous] = l[i][e].active;
						l[i][e].active = !/undefined/.test(typeof l[i][e].standby[state]) ? l[i][e].standby[state] : {};
						!/undefined/.test(typeof l[i][e].standby[state]) ? delete l[i][e].standby[state] : void(0);
					}
				}

				$.fire(state);
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
	 * @class
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
		 * @param arg {String} Comma delimited string of target #id, .class, tag and :selector
		 * @param nodelist {Boolean} [Optional] True will return a NodeList (by reference) for tags & classes
		 * @returns {Mixed} Instance or Array of Instances
		 */
		$ : function(arg, nodelist) {
			var args, obj, i, nth, nth2, c, alt, find, contains, has, not, is, x, s,
			    document  = window.document,
			    instances = [];

			/**
			 * Looks for alternating HTMLElement (arg) in HTMLElement (obj)
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param state {Object} Boolean representing rows, true is even, false is odd
			 * @returns {Mixed} Instance or Array of Instances containing arg, alternating odd or even
			 */
			alt = function(obj, state) {
				var i, nth, instances = [];

				if (obj instanceof Array) {
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						(i.isEven() === state) ? instances.push(obj[i]) : void(0);
					}
				}
				else if ((obj.childNodes) && (obj.childNodes.length > 0)) {
					nth = obj.childNodes.length;
					for (i = 0; i < nth; i++) {
						(i.isEven() === state) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			/**
			 * Tests obj against arg
			 *
			 * @param obj {String} Property to test
			 * @param arg {String} String to test for, can be comma delimited or a wildcard
			 * @returns {Boolean} True if found
			 */
			find = function(obj, arg) {
				arg = arg.split(/\s*,\s*/);
				var i, pattern, nth = arg.length, instances = [];
				for (i = 0; i < nth; i++) {
					pattern = new RegExp(arg[i].replace("*", ".*"), "ig");
					(pattern.test(obj)) ? instances.push(arg[i]) : void(0);
				}
				return (instances.length > 0) ? true : false;
			};

			/**
			 * Looks for arg in obj.innerHTML
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param arg {Mixed} String or Integer to find in obj
			 * @returns {Mixed} Instance or Array of Instances containing arg
			 */
			contains = function(obj, arg) {
				var i, nth, instances = [];

				((obj instanceof Array)
				 && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						(new RegExp(arg).test(obj[i].innerHTML)) ? instances.push(obj[i]) : void(0);
					}
					return (instances.length == 1) ? instances[0] : instances;
				}
				else {
					return ((obj !== null)
							&& (arg !== null)
							&& (new RegExp(arg).test(obj[i].innerHTML))) ? obj : undefined;
				}
			};

			/**
			 * Looks for HTMLElement (arg) in HTMLElement (obj)
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param arg {String} HTMLElement type to find, can be comma delimited
			 * @returns {Mixed} Instance or Array of Instances containing arg
			 */
			has = function(obj, arg) {
				var i, nth, instances = [];

				((obj instanceof Array)
				 && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					var x, nth2;
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						nth2 = obj[i].childNodes.length;
						for (x = 0; x < nth2; x++) {
							obj[i].genId();
							((find(obj[i].childNodes[x].nodeName, arg) === true)
							 && (/undefined/.test(typeof instances[obj[i].id]))) ? instances[obj[i].id] = obj[i] : void(0);
						}
					}
					instances = instances.indexed();
				}
				else {
					nth = obj.childNodes.length;
					for (i = 0; i < nth; i++) {
						(find(obj.childNodes[i].nodeName, arg) === true) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			/**
			 * Tests if HTMLElement (obj) matches HTMLElements (arg)
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param arg {String} HTMLElement type to find, can be comma delimited
			 * @returns {Mixed} Instance or Array of Instances containing arg
			 */
			is = function(obj, arg) {
				var i, nth, instances = [];

				((obj instanceof Array)
				 && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						obj[i].genId();
						((find(obj[i].nodeName, arg) === true)
						 && (/undefined/.test(typeof instances[obj[i].id]))) ? instances[obj[i].id] = obj[i] : void(0);
					}
					instances = instances.indexed();
				}
				else {
					(find(obj.nodeName, arg) === true) ? instances.push(obj) : void(0);
				}

				return instances;
			};

			/**
			 * Finds and excludes HTMLElements (arg) in HTMLElement (obj)
			 *
			 * @param obj {Object} HTMLElement to search
			 * @param arg {String} HTMLElement type to exclude, can be comma delimited
			 * @returns {Mixed} Instance or Array of Instances containing arg
			 */
			not = function(obj, arg) {
				var i, nth, instances = [];

				((obj instanceof Array) && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					var x, nth2;
					nth = obj.length;
					for (i = 0; i < nth; i++) {
						nth2 = obj[i].childNodes.length;
						for (x = 0; x < nth2; x++) {
							obj[i].genId();
							(find(obj[i].childNodes[x].nodeName, arg) === false) ? (/undefined/.test(typeof instances[obj[i].id]) ? instances[obj[i].id] = obj[i] : void(0))
							                                                     : (!/undefined/.test(typeof instances[obj[i].id]) ? delete instances[obj[i].id] : void(0));
						}
					}
					instances = instances.indexed();
				}
				else {
					nth = obj.childNodes.length;
					for (i = 0; i < nth; i++) {
						(find(obj.childNodes[i].nodeName, arg) === false) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			nodelist = (nodelist === true) ? true : false;

			// Recursive processing, ends up below
			/,/.test(arg) ? arg = arg.split(/\s*,\s*/) : void(0);
			if (arg instanceof Array) {
				nth = arg.length;

				/^(:)/.test(arg[0]) ? s = "" : void(0);
				for (i = 0; i < nth; i++) {
					instances.push($(arg[i], nodelist));
				}
				return instances;
			}

			if (/:/.test(arg)) {
				s   = (/:.*/gi.exec(arg) !== null) ? /:.*/gi.exec(arg)[0].slice(1) : "";
				arg = (/.*:/.exec(arg) !== null) ? ((!/.*:/.exec(arg)[0].slice(0, -1).isEmpty()) ? /.*:/.exec(arg)[0].slice(0, -1)
													                                             : ":")
				                                 : ":";
			}
			else {
				s = "";
			}

			args = !/\w/.test(s) ? [] : s.split(/:/);

			// Getting instance(s)
			switch (true) {
				case (/^(\.)/.test(arg)):
					obj = document.getElementsByClassName(arg.slice(1));
					((obj !== null)
					 && (nodelist === false)) ? (obj = ((!client.ie)
					                                    || (client.version > 8)) ? Array.prototype.slice.call(obj)
						                                                         : abaaso.array.cast(obj))
						                      : void(0);
					break;
				case (/^(#)/.test(arg)):
					obj = document.getElementById(arg.substring(1));
					break;
				case (/^(:)/.test(arg)):
					obj = document.body.getElementsByTagName("*");
					((obj !== null)
					 && (nodelist === false)) ? (obj = ((!client.ie)
					                                    || (client.version > 8)) ? Array.prototype.slice.call(obj)
						                                                         : abaaso.array.cast(obj))
						                      : void(0);
					break;
				default:
					obj = document.getElementsByTagName(arg);
					((obj !== null)
					 && (nodelist === false)) ? (obj = ((!client.ie)
					                                    || (client.version > 8)) ? Array.prototype.slice.call(obj)
						                                                         : abaaso.array.cast(obj))
						                      : void(0);
					break;
			}

			// Processing selector(s)
			if ((obj !== null)
				&& (args.length)
				&& (args.length > 0)) {
				nth = args.length;
				for (i = 0; i < nth; i++) {
					if (/undefined/.test(typeof obj)) {
						obj = [];
						break;
					}

					switch (args[i].toString().replace(/\(.*\)/, "")) {
						case "contains":
							obj = contains(obj, args[i].toString().replace(/.*\(|'|"|\)/g, ""));
							break;
						case "even":
							obj = alt(obj, true);
							break;
						case "first":
							obj = obj.first();
							break;
						case "has":
							obj = has(obj, args[i].toString().replace(/.*\(|'|"|\)/g, ""));
							break;
						case "is":
							obj = is(obj, args[i].toString().replace(/.*\(|'|"|\)/g, ""));
							break;
						case "last":
							obj = obj.last();
							break;
						case "not":
							obj = not(obj, args[i].toString().replace(/.*\(|'|"|\)/g, ""));
							break;
						case "odd":
							obj = alt(obj, false);
							break
						default:
							nth2 = (obj.length) ? obj.length : 0;
							instances = [];
							for (x = 0; x < nth2; x++) {
								c = obj[x].className.split(" ");
								(c.index(args[i]) > -1) ? instances.push(obj[x]) : void(0);
							}
							obj = instances;
					}

					if (obj instanceof Array) {
						(obj.length === 0) ? obj = (((i + 1) == nth) ? [] : undefined) : void(0);
					}
				}
			}

			if (obj === null) {
				obj = undefined;
			}

			return obj;
		},

		/**
		 * Creates an alias of origin on obj
		 *
		 * @param obj {Object} Object to alias origin
		 * @param origin {Object} Object providing structure to obj
		 * @returns {Object} Object to alias origin
		 */
		alias : function(obj, origin){
			try {
				var i;
				for (i in origin) {
					(function(){
						var b = i;
						switch (true) {
							case (/function/.test(typeof origin[b])):
								obj[b] = function(){ return origin[b].apply(this, arguments); };
								break;
							case (origin[b] instanceof Object):
								/undefined/.test(typeof obj[b]) ? obj[b] = {} : void(0);
								(function(){ abaaso.alias(obj[b], origin[b]); })();
								break;
							case (/boolean|number|string/.test(typeof origin[b])):
							case (origin[b] === null):
								obj[b] = origin[b];
								break;
						}
					})();
				}
				return obj;
			}
			catch (e) {
				$.error(e, arguments, this);
			}
		},

		/**
		 * Clones an Object
		 *
		 * @param obj {Object} Object to clone
		 * @returns {Object} A clone of the Object
		 */
		clone: function(obj) {
			try {
				if (!/object/.test(typeof obj)) {
					throw Error(label.error.expectedObject);
				}

				var clone = {}, p;

				/object/.test(typeof obj.constructor) ? clone.constructor = obj.constructor : void(0);
				/object/.test(typeof obj.prototype)   ? clone.prototype   = obj.prototype   : void(0);

				for (p in obj) {
					clone[p] = obj[p];
				}

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
		 * @param args {String} Dot delimited string of the structure
		 * @param value {Mixed} The value to set
		 * @param obj {Object} The object to set the value on
		 */
		define : function(args, value, obj) {
			args = args.split(".");
			obj  = obj || this;
			(obj === $) ? obj = abaaso : void(0);

			var i = null,
			    l = args.length,
			    p = obj;

			for (i = 0; i < l; i++) {
				(/undefined/.test(typeof p[args[i]])) ? p[args[i]] = ((i + 1 < l) ? {} : (!/undefined/.test(typeof value) ? value : null))
							                          : ((i + 1 >= l) ? (p[args[i]] = !/undefined/.test(typeof value) ? value : null) : void(0));
				p = p[args[i]];
			}

			return obj;
		},

		/**
		 * Defers the execution of Function by at least the supplied milliseconds
		 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
		 *
		 * @param fn {Function} The function to defer execution of
		 * @param ms {Integer} Milliseconds to defer execution
		 * @returns undefined
		 */
		defer : function(fn, ms) {
			var id = $.genId(),
			    op = function() {
					delete abaaso.timer[id];
					fn();
				};
			abaaso.timer[id] = setTimeout(op, ms);
		},

		/**
		 * Error handling, with history in .log
		 *
		 * @param e {Mixed} Error object or message to display
		 * @param args {Array} Array of arguments from the callstack
		 * @param scope {Mixed} Object that triggered the Error
		 */
		error : function(e, args, scope) {
			if (/undefined/.test(typeof e)) {
				return;
			}

			var o = {
				arguments : args,
				message   : !/undefined/.test(typeof e.message) ? e.message : e,
				number    : !/undefined/.test(typeof e.number)  ? (e.number & 0xFFFF) : undefined,
				scope     : scope,
				timestamp : new Date().toUTCString(),
				type      : !/undefined/.test(typeof e.type)    ? e.type    : "TypeError"
			};

			!/undefined/.test(typeof console) ? console.error(o.message) : void(0);
			/undefined/.test(typeof abaaso.error.log) ? abaaso.error.log = [] : void(0);
			abaaso.error.log.push(o);
			abaaso.fire("error", o);
		},

		/**
		 * Encodes a string to a DOM friendly ID
		 *
		 * @param id {String} The object.id value to encode
		 * @returns {String} Returns a lowercase stripped string
		 */
		domId : function(id) {
			try {
				return id.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates an ID value
		 *
		 * @param obj {Mixed} [Optional] Object to set ID on
		 * @returns {Mixed} Object if supplied, or the ID
		 */
		genId : function(obj) {
			try {
				switch (true) {
					case (obj instanceof Array):
					case (obj instanceof String):
					case (!/undefined/.test(typeof obj) && !/undefined/.test(typeof obj.id) && !obj.id.isEmpty()):
						return obj;
				}

				var id;
				do id = "a" + utility.id();
				while (!/undefined/.test(typeof $("#" + id)));

				if (/object/.test(typeof obj)) {
					obj.id = id;
					return obj;
				}
				else {
					return id;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates a random number
		 *
		 * @returns {Integer} Between 1 and 1-trillian
		 */
		id : function() {
			return Math.floor(Math.random() * 1000000000);
		},

		/**
		 * Renders a loading icon in a target element
		 *
		 * @param id {String} Target object.id value
		 */
		loading : function(obj) {
			try {
				if (obj instanceof Array) {
					var nth = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < nth; i++) {
						this.loading(obj[i]);
					}
					return arg;
				}
				else {
					var l = abaaso.loading;
					if (l.url === null) {
						throw new Error(label.error.elementNotFound);
					}

					obj = utility.object(obj);

					if (/undefined/.test(typeof obj)) {
						throw new Error(label.error.invalidArguments);
					}

					// Setting loading image
					if (/undefined/.test(typeof l.image)) {
						l.image     = new Image();
						l.image.src = l.url;
					}

					// Clearing target element
					obj.genId();
					obj.clear();

					// Creating loading image in target element
					obj.create("div", {id: obj.id+"_loading", "class": "loading"})
					   .create("img", {alt: label.common.loading, src: l.image.src});

					return obj;
				}
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Writes argument to the console
		 *
		 * @param arg {String} The string to write to the console
		 * @returns undefined;
		 */
		log : function(arg) {
			try {
				console.log(arg);
			}
			catch (e) {
				$.error(e, arguments, this);
			}
		},

		/**
		 * Returns argument, or instance based on #object.id value
		 *
		 * @param obj {Mixed} Object or #Object.id
		 * @returns {Object} Returns an instance of Object
		 * @private
		 */
		object : function(obj) {
			return /object/.test(typeof obj) ? obj : (/^(#)/.test(obj) ? $(obj) : obj);
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @param obj {Object} Instance of Array, Element, String or Number
		 * @param type {String} Identifier of obj, determines what arrays to apply
		 */
		proto : function(obj, type) {
			try {
				if (!/function|object/.test(typeof obj)) {
						throw new Error(label.error.invalidArguments);
				}

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
					           		scope = (scope === true) ? true : false;
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
										uri.on("afterGet", function() {
											uri.un("afterGet", guid);
											this.text(cache.get(uri, false).response);
											this.fire("afterGet");
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
							   hidden     : function() {
									this.genId();
									return $.el.hidden(this);
							   },
							   isAlphaNum: function() { return (/form/gi.test(this.nodeName)) ? false : $.validate.test({alphanum: !/undefined/.test(typeof this.value) ? this.value : this.innerText}).pass; },
						       isBoolean: function() { return (/form/gi.test(this.nodeName)) ? false : $.validate.test({"boolean": !/undefined/.test(typeof this.value) ? this.value : this.innerText}).pass; },
						       isDate   : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isDate()   : this.innerText.isDate(); },
						       isDomain : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isDomain() : this.innerText.isDomain(); },
						       isEmail  : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isEmail()  : this.innerText.isEmail(); },
						       isEmpty  : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isEmpty()  : this.innerText.isEmpty(); },
						       isIP     : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isIP()     : this.innerText.isIP(); },
						       isInt    : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isInt()    : this.innerText.isInt(); },
						       isNumber : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isNumber() : this.innerText.isNumber(); },
						       isPhone  : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isPhone()  : this.innerText.isPhone(); },
						       isString : function() { return (/form/gi.test(this.nodeName)) ? false : !/undefined/.test(typeof this.value) ? this.value.isString() : this.innerText.isString(); },
						       jsonp    : function(uri, property, callback) {
									var target = this,
									    arg    = property,
									    fn = function(response){
											var self = target,
												node = response,
												prop = arg, i, nth, result;

											try {
													if (!/undefined/.test(typeof prop)) {
														prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
														nth = prop.length;
														for (i = 0; i < nth; i++) {
															node = (isNaN(prop[i])) ? node[prop[i]] : node[parseInt(prop[i])];
															if (/undefined/.test(typeof node)) {
																throw new Error($.label.error.propertyNotFound);
															}
														}
														result = node;
													}
													else {
														result = response;
													}
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
									(/undefined/.test(typeof this.id)
									 || (this.id.isEmpty())) ? this.genId() : void(0);
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
									this.genId();
									!/undefined/.test(typeof this.value)     ? $.update(this, {value: arg})     : void(0);
									!/undefined/.test(typeof this.innerHTML) ? $.update(this, {innerHTML: arg}) : void(0);
									return this;
							   },
							   update   : function(args) {
									this.genId();
									return $.update(this, args);
							   },
							   validate  : function() { return (/form/gi.test(this.nodeName)) ? $.validate.test(this).pass : !/undefined/.test(typeof this.value) ? !this.value.isEmpty() : !this.innerText.isEmpty(); }},
					number  : {isEven   : function() { return $.number.even(this); },
					           isOdd    : function() { return $.number.odd(this); },
					           on       : function(event, listener, id, scope, standby) {
									scope = scope || this;
					           		return $.on(this, event, listener, id, scope, standby);
					           }},
					shared  : {clear    : function() {
									(/object/.test(typeof this)
									 && (/undefined/.test(typeof this.id)
									     || (this.id.isEmpty()))) ? this.genId() : void(0);
									(this instanceof String) ? (this.constructor = new String("")) : $.clear(this);
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
							   		((!this instanceof String)
							   		 && ((/undefined/.test(typeof this.id))
							   		     || (this.id.isEmpty()))) ? this.genId() : void(0);
							   		return $.fire.call(this, event, args);
							   },
							   genId    : function() { return $.genId(this); },
							   listeners: function(event) {
							   		((!this instanceof String)
							   		 && ((/undefined/.test(typeof this.id))
							   		     || (this.id.isEmpty()))) ? this.genId() : void(0);
							   		return $.listeners(this, event);
							   },
							   un       : function(event, id) {
							   		((!this instanceof String)
							   		 && (/undefined/.test(typeof this.id)
							   		     || (this.id.isEmpty()))) ? this.genId() : void(0);
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
			}
			catch (e) {
				$.error(e, arguments, this);
			}
		}
	};

	/**
	 * Validation methods and patterns
	 *
	 * @class
	 */
	var validate = {
		/**
		 * Regular expression patterns to test against
		 */
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
		 * @param args {Object} An object to test {(pattern[name] || /pattern/) : (value || #object.id)}
		 * @returns {Object} An object containing validation status and invalid instances
		 */
		test : function(args) {
			try {
				switch (true){
					case (/undefined/.test(typeof args)):
					case (args === null):
					case (!args instanceof Object):
						throw Error(label.error.expectedObject);
						break;
				}

				var exception = false,
				    invalid   = [],
				    value     = null;

				if (!/undefined/.test(typeof args.nodeName)
				    && /form/gi.test(args.nodeName)) {
					var i, p, v, c, o, x, t = {}, nth, nth2, result, invalid = [], tracked = {};

					(args.id.isEmpty()) ? args.genId() : void(0);

					c    = $("#"+args.id+":has(input,select)");
					nth = c.length;

					for (i = 0; i < nth; i++) {
						v = null;
						p = (validate.pattern[c[i].nodeName.toLowerCase()]) ? validate.pattern[c[i].nodeName.toLowerCase()]
						                                                    : (((c[i].id.isEmpty() === false)
																			   && (validate.pattern[c[i].id.toLowerCase()])) ? validate.pattern[c[i].id.toLowerCase()]
																		                                                     : "notEmpty");

						if (/(radio|checkbox)/gi.test(c[i].type)) {
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
						}
						else if (/select/gi.test(c[i].type)) {
							v = c[i].options[c[i].selectedIndex].value;
						}
						else {
							v = !/undefined/.test(typeof c[i].value) ? c[i].value : c[i].innerText;
						}

						(v === null) ? v = "" : void(0);
						t[p] = v;
					}

					result = this.test(t);

					return result;
				}
				else {
					for (var i in args) {
						if (/undefined/.test(typeof i) || /undefined/.test(typeof args[i])) {
							invalid.push({test: i, value: args[i]});
							exception = true;
							continue;
						}

						value = /^(#)/.test(args[i]) ? (!/undefined/.test(typeof $(args[i])) ? (($(args[i]).value) ? $(args[i]).value
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
							case "domainip":
								if ((!validate.pattern.domain.test(value))
									|| (!validate.pattern.ip.test(value))) {
									invalid.push({test: i, value: value});
									exception = true;
								}
								break;
							default:
								var p = !/undefined/.test(typeof validate.pattern[i]) ? validate.pattern[i] : i;
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
	 * @class
	 */
	var xml = {
		/**
		 * Returns XML (Document) Object from a String
		 *
		 * @param arg {String} XML String
		 * @returns {Object} XML Object
		 */
		decode : function(arg) {
			try {
				switch (true) {
					case (/undefined/.test(typeof arg)):
					case (!arg instanceof String):
					case (arg.isEmpty()):
						throw Error(label.error.invalidArguments);
				}

				var xml;

				if (client.ie) {
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = "false";
					xml.loadXML(arg);
				}
				else {
					xml = new DOMParser().parseFromString(arg, "text/xml");
				}

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
		 * @param arg {Mixed} Object or Array to cast to XML String
		 * @returns {String} XML String
		 * @todo Implement this
		 */
		encode : function(arg) {
			try {
				return undefined;
			}
			catch (e) {
				$.error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Returned to the client
	 *
	 * @constructor
	 */
	return {
		// Classes
		array           : array,
		callback        : [],
		client          : {
			// Properties
			android : client.android,
			blackberry : client.blackberry,
			css3    : null,
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
			size    : {x:0, y:0},
			version : null,
			webos   : client.webos,
			windows : client.windows,

			// Methods
			del     : function(uri, success, failure){ client.request(uri, "DELETE", success, failure); },
			get     : function(uri, success, failure, headers){ client.request(uri, "GET", success, failure, headers); },
			options : function(uri, success, failure){ client.request(uri, "OPTIONS", success, failure); },
			post    : function(uri, success, failure, args){ client.request(uri, "POST", success, failure, args); },
			put     : function(uri, success, failure, args){ client.request(uri, "PUT", success, failure, args); },
			jsonp   : function(uri, success, failure, callback){ client.request(uri, "JSONP", success, failure, callback); },
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
		del             : function(uri, success, failure){ client.request(uri, "DELETE", success, failure); },
		destroy         : el.destroy,
		domId           : utility.domId,
		encode          : json.encode,
		error           : utility.error,
		fire            : function() {
			var event = /undefined/.test(typeof arguments[0]) ? undefined : arguments[0],
				arg   = /undefined/.test(typeof arguments[1]) ? undefined : arguments[1],
				obj   = (this === $) ? abaaso : this;

			return abaaso.observer.fire(obj, event, arg);
		},
		genId           : utility.genId,
		get             : function(uri, success, failure, headers){ client.request(uri, "GET", success, failure, headers); },
		id              : "abaaso",
		init            : function() {
			// Stopping multiple executions
			delete abaaso.init;

			// Describing the Client
			$.client.version = abaaso.client.version = client.version();
			$.client.css3    = abaaso.client.css3    = client.css3();
			$.client.size    = abaaso.client.size    = client.size();
			$.state.current  = abaaso.state._current;

			// Hooking abaaso into native Objects
			utility.proto(Array, "array");
			utility.proto(Element, "element");
			((client.ie) && (client.version == 8)) ? utility.proto(HTMLDocument, "element") : void(0);
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
					switch (true) {
						case (arg === null):
						case (!/string/.test(typeof arg) || !/\w/.test(arg)):
						case (new RegExp("^"+this.previous+"$", "i").test(arg)):
							throw Error(label.error.invalidArguments);
							break;
					}

					$.state.previous = this.previous = this._current;
					$.state.current  = this._current = arg;

					return observer.replace(arg);
				}
				catch (e) {
					$.error(e, arguments, this);
					return undefined;
				}
			};

			switch (true) {
				case (($.client.ie) && ($.client.version == 8)):
					// Pure hackery, only exists when needed
					abaaso.state.current = null;
					abaaso.state.change  = function(arg){ abaaso.state.current = arg; setter.call(abaaso.state, arg); };
				case (/undefined/.test(typeof Object.defineProperty)):
					abaaso.state.__defineGetter__("current", getter);
					abaaso.state.__defineSetter__("current", setter);
					break;
				default:
					Object.defineProperty(abaaso.state, "current", {get: getter, set: setter});
			}

			// Adding an essential method if not present
			if (/undefined/.test(typeof document.getElementsByClassName)) {
				document.getElementsByClassName = function(arg) {
					var nodes   = document.getElementsByTagName("*"),
						nth    = nodes.length,
						i       = null,
						obj     = [],
						pattern = new RegExp("(^|\\s)"+arg+"(\\s|$)");

					for (i = 0; i < nth; i++) {
						(pattern.test(nodes[i].className)) ? obj.push(nodes[i]) : void(0);
					}

					return obj;
				};
			}

			// Adding an essential method if not present
			if (/undefined/.test(typeof Array.prototype.filter)) {
				Array.prototype.filter = function(fn) {
					"use strict";
					if ((this === void 0)
						|| (this === null)
						|| !/function/.test(typeof fn)) {
						throw new Error(label.error.invalidArguments);
					}

					var i      = null,
						t      = Object(this),
						nth   = t.length >>> 0,
						result = [],
						prop   = arguments[1]
						val    = null;

					for (i = 0; i < nth; i++) {
						if (i in t) {
							val = t[i];
							(fn.call(prop, val, i, t)) ? result.push(val) : void(0);
						}
					}

					return result;
				}
			}

			// All setup!
			abaaso.ready = true;
			$.fire("ready").un("ready");

			// Setting render event
			if (!$.ie || ($.version > 8)) {
				abaaso.timer.render = setInterval(function(){
					if (/loaded|complete/.test(document.readyState)) {
						clearInterval(abaaso.timer.render);
						delete abaaso.timer.render;
						$.fire("render").un("render");
					}
				}, 10);
			}

			return abaaso;
		},
		jsonp           : function(uri, success, failure, callback){ client.request(uri, "JSONP", success, failure, callback); },
		listeners       : function() {
			var all   = (arguments[1] !== undefined) ? true : false,
			    obj   = (all) ? arguments[0] : this,
				event = (all) ? arguments[1] : arguments[0];
				(obj === $) ? obj = abaaso : void(0);

			return observer.list(obj, event);
		},
		on              : function() {
			var all      = /function/.test(typeof arguments[2]) ? true : false,
			    obj      = (all) ? arguments[0] : abaaso,
				event    = (all) ? arguments[1] : arguments[0],
				listener = (all) ? arguments[2] : arguments[1],
				id       = (all) ? arguments[3] : arguments[2],
				scope    = (all) ? arguments[4] : arguments[3],
				state    = (all) ? arguments[5] : arguments[4];
				/undefined/.test(typeof scope) ? scope = abaaso : void(0);

			return observer.add(obj, event, listener, id, scope, state);
		},
		options         : function(uri, success, failure){ client.request(uri, "OPTIONS", success, failure); },
		permission      : client.permission,
		position        : el.position,
		post            : function(uri, success, failure, args){ client.request(uri, "POST", success, failure, args); },
		put             : function(uri, success, failure, args){ client.request(uri, "PUT", success, failure, args); },
		ready           : false,
		store           : function(arg, args) {
			return data.register.call(data, arg, args);
		},
		timer           : {},
		un              : function() {
			var all   = /string/.test(typeof arguments[0]) ? false : true,
			    obj   = (all) ? arguments[0] : this,
				event = (all) ? arguments[1] : arguments[0],
				id    = (all) ? arguments[2] : arguments[1];
				(obj === $) ? obj = abaaso : void(0);

			return observer.remove(obj, event, id);
		},
		update          : el.update,
		version         : "1.6.064"
	};
}();

if (/function/.test(typeof abaaso.init)) {
	var $ = function(arg, nodelist) { return abaaso.$(arg, nodelist); };

	// Hooking abaaso into global helper, it's superficial
	abaaso.alias($, abaaso);
	delete $.$;
	delete $.callback;
	delete $.init;
	delete $.observer.log;
	delete $.state.header;
	delete $.timer;

	// Registering events
	switch (true) {
		case $.client.chrome:
		case $.client.firefox:
		case $.client.opera:
		case $.client.safari:
		case ($.client.ie && ($.client.version > 8)):
			document.addEventListener("DOMContentLoaded", function(){ abaaso.init(); }, false);
			break;
		default:
			abaaso.timer.init = setInterval(function(){
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(abaaso.timer.init);
					delete abaaso.timer.init;
					abaaso.init();
					$.fire("render").un("render");
				}
			}, 10);
	}
}
