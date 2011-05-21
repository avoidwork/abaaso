/**
 * Copyright (c) 2011, avoidwork inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of avoidwork inc. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AVOIDWORK INC. BE LIABLE FOR ANY
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
 * abaaso provides a set of classes and object prototyping to ease the creation
 * and maintenance of RESTful JavaScript applications.
 *
 * Events:    ready      Fires when the DOM is available (safe for GUI creation)
 *            render     Fires when the window resources have loaded (safe for visual fx)
 *            resize     Fires when the window resizes
 *            hashChange Fires when window.location.hash changes
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @namespace
 * @version 1.4.010
 */
var abaaso = function(){
	/**
	 * Array methods
	 *
	 * @class
	 */
	var array = {
		/**
		 * Finds the index of arg(s) in instance
		 *
		 * @param instance {array} An instance of the array to search
		 * @param arg {string} Comma delimited string of search values
		 * @returns {mixed} Integer or an array of integers representing the location of the arg(s)
		 */
		contains : function(instance, arg) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				arg = (arg.toString().indexOf(",") > -1) ? arg.split(",") : arg;

				if (arg instanceof Array) {
					var indexes = [],
					    loop    = args.length,
					    i       = null;

					for (i = 0; i < loop; i++) {
						indexes[i] = instance.index(arg[i]);
					}

					return indexes;
				}

				return instance.index(arg);
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @param array1 {array} An array to compare against
		 * @param array2 {array} An array to compare against
		 * @returns {array} An array of the differences
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
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns the first Array node
		 *
		 * @param instance {array} The array
		 * @returns {mixed} The first node of the array
		 */
		first : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				return instance[0];
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Finds the index of arg in instance. Use contains() for multiple arguments
		 *
		 * @param instance {mixed} The entity to search
		 * @param arg {mixed} The argument to find (string or integer)
		 * @returns {integer} The position of arg in instance
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
				error(e);
				return -1;
			}
		},

		/**
		 * Returns an Associative Array as an Indexed Array
		 *
		 * @param instance {array} The array to index
		 * @param returns {array} The indexed array
		 */
		indexed : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var o, i = 0, indexed = [];
				for (o in instance) {
					if (typeof instance[o] != "function") {
						indexed[i] = (instance[o] instanceof Array) ? instance[o].indexed() : instance[o];
						i++
					}
				}
				indexed.length = i;
				return indexed;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns the keys in the array
		 *
		 * @param instance {array} The array to extract keys from
		 * @returns {array} An array of the keys in instance
		 */
		keys : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var keys = [],
				    i    = null;

				for (i in instance) {
					(typeof instance[i] != "function") ? keys.push(i) : void(0);
				}

				return keys;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns the last node of the array
		 *
		 * @param instance {array} The array
		 * @returns {mixed} The last node of the array
		 */
		last : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				return (instance.length > 1) ? instance[(instance.length - 1)] : instance[0];
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Removes arg from instance without destroying and re-creating instance
		 *
		 * Events:    beforeRemove      Fires before modifying the array
		 *            afterRemove       Fires after modifying the array
		 *
		 * @param instance {array} An instance of the array to use
		 * @param start {integer} The starting position
		 * @param end {integer} The ending position (optional)
		 * @returns {array} A scrubbed array
		 */
		remove : function(instance, start, end) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}

				var remaining;
				start = start || 0;
				instance.fire("beforeRemove");
				remaining = instance.slice((end || start)+1 || instance.length);
				instance.length = (start < 0) ? (instance.length + start) : start;
				instance.push.apply(obj, remaining);
				instance.fire("afterRemove");

				return instance;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Gets the total keys in an Array
		 *
		 * @param instance {array} The array to iterate
		 * @returns {integer} The number of keys in the Array
		 */
		total : function(instance) {
			try {
				if (!instance instanceof Array) {
					throw new Error(label.error.expectedArray);
				}
				var i = 0, arg;
				for (arg in instance) {
					(typeof instance[arg] != "function") ? i++ : void(0);
				}
				return i;
			}
			catch (e) {
				error(e);
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
			for (var uri in cache.items) {
				((typeof cache.items[uri] != "function")
				 && (cache.expired(uri) === true)) ? cache.expire(uri) : void(0);
			}
			return;
		},

		/**
		 * Expires a URI from the local cache
		 *
		 * @param uri {string} The URI of the local representation
		 * @returns undefined
		 */
		expire : function(uri) {
			(cache.items[uri] !== undefined) ? delete cache.items[uri] : void(0);
			return;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @param uri {object} The cached URI object
		 * @returns {boolean} A boolean representing if the URI has expired
		 */
		expired : function(uri) {
			var result = ((cache.items[uri] !== undefined)
				      && (((cache.items[uri].headers.Expires !== undefined)
					   && (new Date(cache.items[uri].headers.Expires) < new Date()))
					  || ((client.ms > 0)
					      && (cache.items[uri].headers.Date !== undefined)
					      && (new Date(cache.items[uri].headers.Date).setMilliseconds(new Date(cache.items[uri].headers.Date).getMilliseconds() + client.ms) > new Date()))
					  || ((client.ms > 0)
					      && (new Date(cache.items[uri].epoch).setMilliseconds(new Date(cache.items[uri].epoch).getMilliseconds() + client.ms) > new Date())))) ? true : false;
			return result;
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @param uri {string} The URI/Identifier for the resource to retrieve from cache
		 * @param expire {boolean} [Optional] If 'false' the URI will not expire
		 * @returns {mixed} Returns the URI object {headers, response} or false
		 */
		get : function(uri, expire) {
			try {
				expire = (expire === false) ? false : true;

				if (cache.items[uri] === undefined) {
					return false;
				}
				else {
					if (cache.items[uri].headers !== undefined) {
						if (((cache.items[uri].headers.Pragma !== undefined)
						    && (cache.items[uri].headers.Pragma == "no-cache")
						    && (expire))
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
				error(e);
				return undefined;
			}
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @param uri {string} The URI to set or update
		 * @param property {string} The property of the cached URI to set
		 * @param value {mixed} The value to set
		 */
		set : function(uri, property, value) {
			try {
				(cache.items[uri] === undefined) ? cache.items[uri] = {} : void(0);
				cache.items[uri][property] = value;
			}
			catch (e) {
				error(e);
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
		chrome  : (function(){ return (navigator.userAgent.toLowerCase().indexOf("chrome") > -1)  ? true : false; })(),
		css3    : false,
		firefox : (function(){ return (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) ? true : false; })(),
		ie      : (function(){ return (navigator.userAgent.toLowerCase().indexOf("msie") > -1)    ? true : false; })(),
		ms      : 0,
		opera   : (function(){ return (navigator.userAgent.toLowerCase().indexOf("opera") > -1)   ? true : false; })(),
		safari  : (function(){ return (navigator.userAgent.toLowerCase().indexOf("safari") > -1)  ? true : false; })(),
		version : null,

		/**
		 * Sends a DELETE to the URI
		 *
		 * Events:     beforeDelete    Fires before the DELETE request is made
		 *             afterDelete     Fires after the DELETE response is received
		 *
		 * @param uri {string} URI to submit to
		 * @param success {function} A handler function to execute once a response has been received
		 * @param failure {function} [Optional] A handler function to execute on error
		 */
		del : function(uri, success, failure) {
			try {
				if ((uri == "")
				    || (!success instanceof Function)) {
					throw new Error(label.error.invalidArguments);
				}

				uri.on("afterDelete", function(){
						cache.expire(uri);
						uri.un("afterDelete", "expire");
					}, "expire").fire("beforeDelete");
				client.request(uri, success, "DELETE", null, failure);
			}
			catch (e) {
				error(e);
				(failure instanceof Function) ? failure(e) : void(0);
			}
		},

		/**
		 * Sends a GET to the URI
		 *
		 * Events:     beforeGet    Fires before the GET request is made
		 *             afterGet     Fires after the GET response is received
		 *
		 * @param uri {string} URI to submit to
		 * @param success {function} A handler function to execute once a response has been received
		 * @param failure {function} [Optional] A handler function to execute on error
		 */
		get : function(uri, success, failure) {
			try {
				if ((uri == "")
				    || (!success instanceof Function)) {
					throw new Error(label.error.invalidArguments);
				}

				uri.fire("beforeGet");
				var cached = cache.get(uri);
				(!cached) ? client.request(uri, success, "GET", null, failure) : success(cached.response);
			}
			catch (e) {
				error(e);
				(failure instanceof Function) ? failure(e) : void(0);
			}
		},

		/**
		 * Sends a PUT to the URI
		 *
		 * Events:     beforePut    Fires before the PUT request is made
		 *             afterPut     Fires after the PUT response is received
		 *
		 * @param uri {string} URI submit to
		 * @param success {function} A handler function to execute once a response has been received
		 * @param {args} PUT variables to include
		 * @param failure {function} [Optional] A handler function to execute on error
		 */
		put : function(uri, success, args, failure) {
			try {
				if ((uri == "")
				    || (!success instanceof Function)
				    || (args === undefined)
				    || (typeof args != "object")) {
					throw new Error(label.error.invalidArguments);
				}

				uri.fire("beforePut");
				client.request(uri, success, "PUT", args, failure);
			}
			catch (e) {
				error(e);
				(failure instanceof Function) ? failure(e) : void(0);
			}
		},

		/**
		 * Sends a POST to the URI
		 *
		 * Events:     beforePost    Fires before the POST request is made
		 *             afterPost     Fires after the POST response is received
		 *
		 * @param uri {string} URI submit to
		 * @param success {function} A handler function to execute once a response has been received
		 * @param {args} POST variables to include
		 * @param failure {function} [Optional] A handler function to execute on error
		 */
		post : function(uri, success, args, failure) {
			try {
				if ((uri == "")
				    || (!success instanceof Function)
				    || (args == "")) {
					throw new Error(label.error.invalidArguments);
				}

				uri.fire("beforePost");
				client.request(uri, success, "POST", args, failure);
			}
			catch (e) {
				error(e);
				(failure instanceof Function) ? failure(e) : void(0);
			}
		},

		/**
		 * Cross-site JSONP request
		 *
		 * Events:     beforeJSONP    Fires before the JSONP request is made
		 *             afterJSONP     Fires after the JSONP response is received
		 *
		 * @param uri {string} URI to load as a SCRIPT element
		 * @param success {function} A handler function to execute once a response has been received
		 * @param failure {function} [Optional] A handler function to execute on error
		 * @param callback {string} [Optional] The callback variable to add to the JSONP request
		 */
		jsonp : function(uri, success, failure, callback) {
			try {
				if ((uri == "")
				    || (!success instanceof Function)) {
					throw new Error(label.error.invalidArguments);
				}

				callback = (callback !== undefined) ? callback : null;

				uri.fire("beforeJSONP");
				client.request(uri, success, "JSONP", callback, failure);
			}
			catch (e) {
				error(e);
				(failure instanceof Function) ? failure(e) : void(0);
			}
		},

		/**
		 * Creates an XmlHttpRequest to a URI
		 *
		 * Events:     beforeXHR    Fires before the XmlHttpRequest is made
		 *
		 * @param uri {string} The resource to interact with
		 * @param fn {function} A handler function to execute when an appropriate response been received
		 * @param type {string} The type of request (DELETE/GET/POST/PUT/JSONP)
		 * @param args {mixed} Data to send with the request, or a custom JSONP handler parameter name
		 * @param ffn {function} [Optional] A handler function to execute on error
		 * @private
		 */
		request : function(uri, fn, type, args, ffn) {
			if (((type.toLowerCase() == "post")
			     || (type.toLowerCase() == "put"))
			    && (typeof args != "object")) {
				throw new Error(label.error.invalidArguments);
			}

			if (type.toLowerCase() == "jsonp") {
				var uid  = "a" + utility.id(),
				    curi = uri,
				    head = $("head")[0];

				do uid = "a" + utility.id();
				while (abaaso.callback[uid] !== undefined);

				(args === null) ? args = "callback" : void(0);
				uri  = uri.replace(args + "=?", args + "=abaaso.callback." + uid);
				uri += "&"+new Date().getTime().toString();

				abaaso.callback[uid] = function(response) {
					fn(response);
					delete abaaso.callback[uid];
					curi.fire("afterJSONP");
					};

				el.create("script", {src: uri, type: "text/javascript"}, head);
			}
			else {
				var xhr     = new XMLHttpRequest(),
				    payload = ((type.toLowerCase() == "post")
					       || (type.toLowerCase() == "put")) ? args : null,
				    cached  = cache.get(uri, false);

				uri.fire("beforeXHR");

				xhr.onreadystatechange = function() { client.response(xhr, uri, fn, type, ffn); };
				xhr.open(type.toUpperCase(), uri, true);
				(payload !== null) ? xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8") : void(0);
				((cached !== false)
				 && (cached.headers.ETag !== undefined)) ? xhr.setRequestHeader("ETag", cached.headers.ETag) : void(0);
				xhr.send(payload);
			}
		},

		/**
		 * Receives and caches the URI response
		 *
		 * Headers are cached, if an expiration is set it will be used to control the local cache
		 * If abaaso.state.header is set, a state change is possible
		 *
		 * Events:     afterXHR    Fires after the XmlHttpRequest response is received
		 *
		 * @param xhr {object} XMLHttpRequest object
		 * @param uri {string} The URI.value to cache
		 * @param fn {function} A handler function to execute once a response has been received
		 * @param type {string} The type of request
		 * @param ffn {function} [Optional] A handler function to execute on error
		 * @private
		 */
		response : function(xhr, uri, fn, type, ffn) {
			try {
				if (xhr.readyState == 2) {
					var headers = xhr.getAllResponseHeaders().split("\n"),
					    i       = null,
					    loop    = headers.length,
					    items   = {};

					for (i = 0; i < loop; i++) {
						if (headers[i] != "") {
							var header    = headers[i].toString(),
							    value     = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");

							header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
							items[header] = value;
						}
					}

					cache.set(uri, "headers", items);
				}
				else if (xhr.readyState == 4) {
					if ((xhr.status == 200)
					    && (xhr.responseText != "")) {
						var state  = null,
						    s      = abaaso.state;

						if (type != "DELETE") {
							cache.set(uri, "epoch", new Date());
							cache.set(uri, "response", xhr.responseText);
						}

						uri.fire("afterXHR");
						uri.fire("after"+type.toLowerCase().capitalize());
						uri = cache.get(uri, false);

						if ((s.header !== null)
						    && (state = uri.headers[s.header]) && (state !== undefined)) {
							s.previous = s.current;
							s.current  = state;
							((s.previous !== null)
							 && (s.current !== null)) ? observer.replace(abaaso, state, s.previous, s.current, s.current) : void(0);
							abaaso.fire(state);
						}

						(fn !== undefined) ? fn(uri.response) : void(0);
					}
					else if (xhr.status == 401) {
						throw new Error(label.error.serverUnauthorized);
					}
					else {
						throw new Error(label.error.serverError);
					}
				}
			}
			catch (e) {
				error(e);
				(ffn instanceof Function) ? ffn(e) : void(0);
			}
		},
		
		
		/**
		 * Returns the visible area of the View
		 *
		 * @returns {array} Array as [x,y]
		 */
		size : function() {
				var x = ((document.compatMode == "CSS1Compat")
						 && (client.opera === false)) ? document.documentElement.clientWidth : document.body.clientWidth,
				    y = ((document.compatMode == "CSS1Compat")
						 && (client.opera === false)) ? document.documentElement.clientHeight : document.body.clientHeight;

				return [x, y];
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
		 * @param name {string} The name of the cookie to create
		 */
		expire : function(name) {
			(this.get(name) !== undefined) ? this.set(name, "", "-1s") : void(0);
		},

		/**
		 * Gets a cookie
		 *
		 * @returns {object} The requested cookie or undefined
		 */
		get : function(name) {
			return this.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @returns {object} Object containing the cookies
		 */
		list : function() {
			var i      = null,
			    loop   = null,
			    item   = null,
			    items  = null,
			    result = {};

			if ((document.cookie)
			    && (document.cookie != '')) {
				items = document.cookie.split(';');
				loop  = items.length;

				for (i = 0; i < loop; i++) {
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
		 * @param name {string} The name of the cookie to create
		 * @param value {string} The value to set
		 * @param offset {string} A positive or negative integer followed by "d", "h", "m" or "s"
		 * @returns {object} The new cookie
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
	 * Template data store object, to be put on a widget with define()
	 *
	 * Do not use this directly!
	 *
	 * @class
	 */
	var data = {
		// Associative arrays of records
		keys    : [],
		records : [],

		/**
		 * Clears the data object
		 *
		 * Events:     beforeClear    Fires before the data is cleared
		 *             afterClear     Fires after the data is cleared
		 *
		 * @returns {Object} The data object being cleared
		 */
		clear : function() {
			this.parent.fire("beforeClear");
			this.keys    = [];
			this.records = [];
			this.parent.fire("afterClear");
			return this;
		},

		/**
		 * Deletes a record based on key or index
		 *
		 * Events:     beforeDelete    Fires before the record is deleted
		 *             afterDelete     Fires after the record is deleted
		 *
		 * @param record {Mixed} The record key or index
		 * @param reindex {Boolean} Default is true, will re-index the data object after deletion
		 * @returns {Object} The data object containing the record
		 */
		del : function(record, reindex) {
			try {
				reindex = (reindex === false) ? false : true;

				var key, index;

				if ((record === undefined)
				    || ((typeof record != "string")
					&& (typeof record != "number"))) {
					throw new Error(label.error.invalidArguments);
				}

				this.parent.fire("beforeDelete");

				if (typeof record == "string") {
					key = this.keys[record];
					if (key === undefined) {
						throw new Error(label.error.invalidArguments);
					}
					delete this.records[key.index];
					delete this.keys[record];
				}
				else {
					key = this.records[record].key;
					delete this.records[record];
					delete this.keys[key];
				}

				(reindex === true) ? this.reindex() : void(0);

				this.parent.fire("afterDelete");

				return this;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Retrieves a record based on key or index
		 *
		 * If the key is an integer, cast to a string before sending as an argument!
		 *
		 * @param record {mixed} The record key (string),  index (integer) or array for pagination [start, end]
		 * @returns object
		 */
		get : function(record) {
			try {
				var r = [],
				    i, start, end;

				this.parent.fire("beforeGet");

				if (typeof record == "string") {
					return (this.keys[record] !== undefined) ? this.records[this.keys[record].index] : undefined;
				}
				else if (record instanceof Array) {
					if (isNaN(record[0]) || isNaN(record[1])) {
						throw new Error(label.error.invalidArguments);
					}

					start = record[0] - 1;
					end   = record[1] - 1;

					for (i = start; i < end; i++) {
						(this.records[i] !== undefined) ? r.push(this.records[i]) : void(0);
					}

					return r;
				}
				else {
					return this.records[record];
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Registers an instance on an Object
		 *
		 * @param {Object} obj The Object to register with
		 * @returns {Object} The Object registered with
		 */
		register : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = (!isNaN(obj.length)) ? obj.length : obj.total();
					while (i--) {
						this.register(obj[i]);
					}
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);
					abaaso.genID(obj);
					abaaso.define("data", this, obj);
					abaaso.define("data.parent", obj.id, obj);
					delete obj.data.register;
				}
				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Reindexes the data object
		 *
		 * @returns {Object} The data object
		 */
		reindex : function() {
			var i, n = 0, loop = this.records.length, key, index;
			for (i = 0; i < loop; i++) {
				if (this.records[i] !== undefined) {
					key   = this.records[i].key;
					index = parseInt(this.keys[key].index);
					if (index != n) {
						this.records[n] = this.records[i];
						this.keys[key].index = n;
						delete this.records[i];
					}
					n++
				}
			}
			(n > 0) ? this.records.length = n : void(0);
			return this;
		},

		/**
		 * Sets a new or existing record
		 *
		 * Events:     beforeSet    Fires before the record is set
		 *             afterSet     Fires after the record is set
		 *
		 * @param key {Mixed} Integer or String to use as a Primary Key
		 * @param data {Object} Key:Value pairs to set as field values
		 */
		set : function(key, data) {
			try {
				if ((key === undefined)
				    || (key === undefined)) {
					throw new Error(label.error.invalidArguments);
				}

				this.parent.fire("beforeSet");

				var record = ((this.keys[key] === undefined) && (this.records[key] === undefined)) ? undefined : this.get(key),
				    arg, index;

				if (record === undefined) {
					this.keys[key] = {};
					index = (this.records.length - 1) + 1;
					this.keys[key].index = index;
					this.records[index] = {};
					this.records[index].data = data;
					this.records[index].key  = key;
					record = this.records[index];
				}
				else {
					if (typeof(data) == "object") {
						for (arg in data) {
							record[arg] = data[arg];
						}
						this.records[record.index] = record;
					}
					else {
						this.records[record.index] = data;
					}
				}

				this.parent.fire("afterSet");

				return this;
			}
			catch (e) {
				error(e);
				return undefined;
			}
			void(0);
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
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {mixed} Instance or Array of Instances
		 */
		clear : function(obj) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.clear(obj[i]);
					}
					return obj;
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);

					if (obj !== null) {
						obj.fire("beforeClear");

						if (typeof obj.reset == "function") {
							obj.reset();
						}
						else if (obj.value !== undefined) {
							obj.update({innerHTML: "", value: ""});
						}
						else {
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
				error(e);
				return undefined;
			}
		},

		/**
		 * Creates an element in document.body or a target element
		 *
		 * Element.genID() is executed if args doesn't contain an id
		 *
		 * Events:    beforeCreate    Fires after the object has been created, but not set
		 *            afterCreate     Fires after the object has been appended to it's parent
		 *
		 * @param type {string} Type of element to create
		 * @param args {object} [Optional] Collection of properties to apply to the new element
		 * @param id {mixed} [Optional] Target object or element.id value to append to
		 * @returns {object} The elemented that was created
		 */
		create : function(type, args, id) {
			try {
				if (type === undefined) {
					throw new Error(label.error.invalidArguments);
				}

				var obj, target;

				if (id !== undefined) {
					target = (typeof id == "object") ? id : $(id);
				}
				else if ((args !== undefined) && ((typeof args == "string") || (args.childNodes !== undefined))) {
					target = args;
					(typeof target == "string") ? target = $(target) : void(0);
				}
				else {
					target = document.body;
				}

				if (target === undefined) {
					throw new Error(label.error.invalidArguments);
				}

				obj = document.createElement(type);

				((args !== undefined)
				 && (typeof args != "string")
				 && (args.childNodes === undefined)
				 && (args.id !== undefined)
				 && ($("#"+args.id) === undefined)) ? obj.id = args.id : obj.genID();

				((args !== undefined) && (args.id !== undefined)) ? delete args.id : void(0);

				obj.fire("beforeCreate");
				((typeof(args) == "object")
				 && (args.childNodes === undefined)) ? obj.update(args) : void(0);
				target.appendChild(obj);
				obj.fire("afterCreate");
				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Loads a CSS stylesheet into the View
		 *
		 * @param content {string} The CSS to put in a style tag
		 * @returns {object} The style Element created
		 */
		css : function(content) {
			try {
				var ss, css;
				ss = create("style", {type: "text/css"}, $("head")[0]);
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
				error(e);
				return undefined;
			}
		},

		/**
		 * Destroys an element
		 *
		 * Events:    beforeDestroy    Fires before the destroy starts
		 *            afterDestroy     Fires after the destroy ends
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {mixed} Undefined or Array of Instances
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
					obj = (typeof obj == "object") ? obj : $(obj);
					if (obj !== undefined) {
						obj.fire("beforeDestroy");
						observer.remove(obj.id);
						obj.parentNode.removeChild(obj);
						obj.fire("afterDestroy");
					}
					return undefined;
				}
			}
			catch(e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Disables an element
		 *
		 * Events:    beforeDisable    Fires before the disable starts
		 *            afterDisable     Fires after the disable ends
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
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
					obj = (typeof obj == "object") ? obj : $(obj);
					if ((obj !== undefined)
					    && (obj.disabled !== undefined)) {
						obj.fire("beforeDisable");
						obj.disabled = true;
						obj.fire("afterDisable");
					}
					return obj;
				}
			}
			catch(e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Enables an element
		 *
		 * Events:    beforeEnable    Fires before the enable starts
		 *            afterEnable     Fires after the enable ends
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {mixed} Instance or Array of Instances
		 */
		enable : function(obj) {
			try {
				if (obj instanceof Array) {
					var i = (!isNaN(obj.length)) ? obj.length : obj.total();
					while (i--) {
						this.enable(obj[i]);
					}
					return obj;
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);
					if ((obj !== undefined)
					    && (obj.disabled !== undefined)) {
						obj.fire("beforeEnable");
						obj.disabled = false;
						obj.fire("afterEnable");
						instances.push(obj);
					}
					return obj;
				}
			}
			catch(e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns the ID of the element that triggered the event
		 *
		 * @param e {event} The event arguement sent to the listener
		 * @param obj {object} The element whose listener called this function
		 * @returns {string} The id of the element that triggered the event
		 */
		eventID : function(e, obj) {
			return (window.event) ? window.event.srcElement.id : obj.id;
		},

		/**
		 * Hides an Element if it's visible
		 *
		 * Events:    beforeHide    Fires before the object is hidden
		 *            afterHide     Fires after the object is hidden
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {mixed} Instance or Array of Instances
		 */
		hide : function(obj) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.hide(obj[i]);
					}
					return obj;
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);
					obj.fire("beforeHide");
					(obj.old === undefined) ? obj.old = {} : void(0);
					obj.old.display   = obj.style.display;
					obj.style.display = "none";
					obj.fire("afterHide");
					return obj;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Finds the position of an element
		 *
		 * @param id {string} Target object.id value
		 * @returns {array} An array containing the render position of the element
		 */
		position : function(obj) {
			obj = (typeof obj == "object") ? obj : $(obj);

			if (obj === undefined) {
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
		},

		/**
		 * Shows an Element if it's not visible
		 *
		 * Events:    beforeEnable    Fires before the object is visible
		 *            afterEnable     Fires after the object is visible
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @returns {mixed} Instance or Array of Instances
		 */
		show : function(obj) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.show(obj[i]);
					}
					return obj;
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);
					obj.fire("beforeShow");
					obj.style.display = ((obj.old !== undefined)
							     && (obj.old.display !== undefined)
							     && (obj.old.display != "")) ? obj.old.display : "inherit";
					obj.fire("afterShow");
					return obj;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Updates an object or element
		 *
		 * Events:    beforeUpdate    Fires before the update starts
		 *            afterUpdate     Fires after the update ends
		 *
		 * @param obj {mixed} Instance, Array of Instances of $() friendly ID
		 * @param args {object} A collection of properties
		 * @returns {mixed} Instance or Array of Instances
		 */
		update : function(obj, args) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.update(obj[i], args);
					}
					return obj;
				}
				else {
					obj = (typeof obj == "object") ? obj : $(obj);
					args = args || {};

					if (obj === undefined) {
						throw new Error(label.error.invalidArguments);
					}

					obj.fire("beforeUpdate");

					if (obj) {
						for (var i in args) {
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
									((client.ie) && (client.version < 8)) ? i = "className" : void(0);
								case "id":
									var o = observer.listeners;
									if (o[obj.id] !== undefined) {
										o[args[i]] = [].concat(o[obj.id]);
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
					else {
						throw new Error(label.error.elementNotFound);
					}
				}
			}
			catch (e) {
				error(e);
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
		 * @param arg {integer}
		 * @returns {boolean}
		 */
		even : function(arg) {
			try {
				return ((arg % 2) === 0);
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns true if the number is odd
		 *
		 * @param arg {integer}
		 * @returns {boolean}
		 */
		odd : function(arg) {
			try {
				return !((arg % 2) === 0);
			}
			catch (e) {
				error(e);
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
		 * @param arg {string} The string to parse
		 */
		decode : function(arg) {
			try {
				return JSON.parse(arg);
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Encodes a string, array or object to a JSON string
		 *
		 * @param arg {mixed} The entity to encode
		 */
		encode : function(arg) {
			try {
				return JSON.stringify(arg);
			}
			catch (e) {
				error(e);
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
			databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota.",
			databaseNotSupported  : "Client does not support local database storage.",
			databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder.",
			elementNotCreated     : "Could not create the Element.",
			elementNotFound       : "Could not find the Element.",
			expectedArray         : "Expected an Array.",
			expectedArrayObject   : "Expected an Array or Object.",
			expectedBoolean       : "Expected a Boolean value.",
			expectedNumber        : "Expected a Number.",
			expectedObject        : "Expected an Object.",
			invalidArguments      : "One or more arguments is invalid.",
			invalidDate           : "Invalid Date.",
			invalidFields         : "The following required fields are invalid: ",
			serverError           : "A server error has occurred.",
			serverUnauthorized    : "Unauthorized to access URI."
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
		 * @param n {mixed} Boolean to enable/disable tracking, or Mouse Event
		 * @returns {object} abaaso.mouse
		 */
		track : function(n) {
			var m = abaaso.mouse;
			if (typeof n == "object") {
				var x, y, c = false;
				x = (n.pageX) ? n.pageX : (document.body.scrollTop + n.clientX);
				y = (n.pageY) ? n.pageY : (document.body.scrollLeft + n.clientY);

				if (m.pos.x != x) {
					m.pos.x = x;
					c = true;
				}

				if (m.pos.y != y) {
					m.pos.y = y;
					c = true;
				}

				if ((c === true) && (m.log === true)) {
					try {
						console.log(m.pos.x + " : " + m.pos.y);
					}
					catch (e) {
						abaaso.error(e);
					}
				}
			}
			else if (typeof n == "boolean") {
				if (n === true) {
					(document.addEventListener) ? document.addEventListener("mousemove", abaaso.mouse.track, false) : document.attachEvent("onmousemove", abaaso.mouse.track);
				}
				else {
					(document.removeEventListener) ? document.removeEventListener("mousemove", abaaso.mouse.track, false) : document.detachEvent("onmousemove", abaaso.mouse.track);
				}
				m.enabled = n;
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
		 * Array of event listeners
		 */
		listeners : [],

		/**
		 * If true, events fired are written to the console
		 */
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @param obj {mixed} The object.id or instance of object firing the event
		 * @param event {string} The event being fired
		 * @param fn {function} The event handler
		 * @param id {string} [Optional / Recommended] The id for the listener
		 * @param scope {string} [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param standby {boolean} [Optional] Add to the standby collection; the id parameter is [Required] if true
		 * @returns {object} The object
		 */
		add : function(obj, event, fn, id, scope, standby) {
			try {
				if (obj instanceof Array) {
					var loop = ((obj.length) && (!isNaN(obj.length))) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.add(obj[i], event, fn, id, ((scope === false) ? obj[i] : scope), standby);
					}
					return obj;
				}
				else {
					var instance = null,
						   l = observer.listeners,
						   o = (obj.id !== undefined) ? obj.id : obj;

					obj     = (typeof obj == "object") ? obj : ((obj.charAt(0) == "#") ? $(obj) : obj);
					standby = (standby === true) ? true : false;

					if ((o === undefined)
					    || (event === undefined)
					    || (!fn instanceof Function)
					    || ((standby)
						&& (id === undefined))) {
						throw new Error(label.error.invalidArguments);
					}

					(l[o] === undefined) ? l[o] = [] : void(0);
					(l[o][event] === undefined) ? l[o][event] = [] : void(0);
					(l[o][event].active === undefined) ? l[o][event].active = [] : void(0);

					var item = {fn: fn};
					((scope !== undefined) && (scope !== null)) ? item.scope = scope : void(0);

					if (!standby) {
						(id !== undefined) ? l[o][event].active[id] = item : l[o][event].active.push(item);
						instance = (o != "abaaso") ? $("#"+o) : null;
						((instance !== null)
						 && (instance !== undefined)) ? ((typeof instance.addEventListener == "function")
										 ? instance.addEventListener(event, function(e){
											(!e) ? e = window.event : void(0);
											e.cancelBubble = true;
											(typeof e.stopPropagation == "function") ? e.stopPropagation() : void(0);
											instance.fire(event);
										   }, false)
										 : instance.attachEvent("on" + event, function(e){
											(!e) ? e = window.event : void(0);
											e.cancelBubble = true;
											(typeof e.stopPropagation == "function") ? e.stopPropagation() : void(0);
											instance.fire(event);
										   }))
						                              : void(0);
					}
					else {
						(l[o][event].standby === undefined) ? l[o][event].standby = [] : void(0);
						l[o][event].standby[id] = item;
					}

					return obj;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Fires an event
		 *
		 * @param obj {mixed} The object.id or instance of object firing the event
		 * @param event {string} The event being fired
		 * @returns {object} The object
		 */
		fire : function(obj, event) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.fire(obj[i], event);
					}
					return obj;
				}
				else {
					obj     = (typeof obj == "object") ? obj : ((obj.charAt(0) == "#") ? $(obj) : obj);
					var l   = observer.listeners,
					    o   = (obj.id !== undefined) ? obj.id : obj.toString(),
					    i;

					if ((o === undefined)
					    || (o == "")
					    || (obj === undefined)
					    || (event === undefined)) {
						throw new Error(label.error.invalidArguments);
					}

					(abaaso.observer.log === true) ? utility.log(o + " fired " + event) : void(0);
					
					var listeners = observer.list(obj, event).active;

					if (listeners !== undefined) {
						for (i in listeners) {
							if ((listeners[i] !== undefined)
							    && (typeof listeners[i] != "function")
							    && (listeners[i].fn)) {
								if (listeners[i].scope !== undefined) {
									var instance = (typeof listeners[i].scope == "object") ? listeners[i].scope : $("#"+listeners[i].scope),
									    fn       = listeners[i].fn,
									    scope    = (instance !== undefined) ? instance : listeners[i].scope;

									fn.call(scope);
								}
								else {
									listeners[i].fn();
								}
							}
						}
					}

					return obj;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Lists the active and standby listeners for an object event
		 *
		 * @param obj {mixed} The object.id or instance of object firing the event
		 * @param event {string} The event being fired
		 * @returns {array} The listeners for object
		 */
		list : function(obj, event) {
			try {
				if (obj === undefined) {
					throw new Error(label.error.invalidArguments);
				}

				obj   = (typeof obj == "object") ? obj : ((obj.charAt(0) == "#") ? $(obj) : obj);
				var l = observer.listeners,
				    o = (obj.id !== undefined) ? obj.id : obj.toString();

				return (l[o] !== undefined) ? (((event !== undefined) && (l[o][event] !== undefined)) ? l[o][event] : l[o]) : [];
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Removes an event listener, or listeners
		 *
		 * @param obj {mixed} The object.id or instance of object firing the event
		 * @param event {string} The event being fired
		 * @param id {string} [Optional] The identifier for the listener
		 * @returns {object} The object
		 */
		remove : function(obj, event, id) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.remove(obj[i], event, id);
					}
					return obj;
				}
				else {
					obj          = (typeof obj == "object") ? obj : ((obj.charAt(0) == "#") ? $(obj) : obj);
					var instance = null,
					    o        = (obj.id !== undefined) ? obj.id : obj.toString(),
					    l        = observer.listeners;

					if ((o === undefined)
					    || (event === undefined)
					    || (l[o] === undefined)
					    || (l[o][event] === undefined)) {
						return obj;
					}
					else {
						if (id === undefined) {
							delete l[o][event];
							instance = (o != "abaaso") ? $("#"+o) : null;
							((instance !== null)
							 && (instance !== undefined)) ? ((typeof instance.removeEventListener == "function")
											 ? instance.removeEventListener(event, function(e){
												(!e) ? e = window.event : void(0);
												e.cancelBubble = true;
												(typeof e.stopPropagation == "function") ? e.stopPropagation() : void(0);
												instance.fire(event);
											   }, false)
											 : instance.detachEvent("on" + event, function(e){
												(!e) ? e = window.event : void(0);
												e.cancelBubble = true;
												(typeof e.stopPropagation == "function") ? e.stopPropagation() : void(0);
												instance.fire(event);
											   })) : void(0);
						}
						else if (l[o][event].active[id] !== undefined) {
							delete l[o][event].active[id];

							if ((l[o][event].standby !== undefined)
							    && (l[o][event].standby[id] !== undefined)) {
								delete l[o][event].standby[id];
							}
						}

						return obj;
					}
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Replaces an active listener, moving it to the standby collection
		 *
		 * @param obj {mixed} The object.id or instance of object firing the event
		 * @param event {string} The event
		 * @param id {string} The identifier for the active listener
		 * @param sId {string} The identifier for the new standby listener
		 * @param listener {mixed} The standby id (string), or the new event listener (function)
		 * @returns {object} The object
		 */
		replace : function(obj, event, id, sId, listener) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.replace(obj[i], event, id, sId, listener);
					}
					return obj;
				}
				else {
					obj   = (typeof obj == "object") ? obj : ((obj.charAt(0) == "#") ? $(obj) : obj);
					var l = observer.listeners,
					    o = (obj.id !== undefined) ? obj.id : obj.toString();

					if ((o === undefined)
					    || (event === undefined)
					    || (id === undefined)
					    || (sId === undefined)
					    || (l[o] === undefined)
					    || (l[o][event] === undefined)
					    || (l[o][event].active === undefined)
					    || (l[o][event].active[id] === undefined)) {
						throw new Error(label.error.invalidArguments);
					}

					(l[o][event].standby === undefined) ? l[o][event].standby = [] : void(0);

					if (typeof listener == "string") {
						if ((l[o][event].standby[listener] === undefined)
						    || (l[o][event].standby[listener].fn === undefined)) {
							throw new Error(label.error.invalidArguments);
						}
						else {
							listener = l[o][event].standby[listener].fn;
						}
					}
					else if (!listener instanceof Function) {
						throw new Error(label.error.invalidArguments);
					}

					l[o][event].standby[sId] = {"fn" : l[o][event].active[id].fn};
					l[o][event].active[id]   = {"fn" : listener};

					return obj;
				}
			}
			catch (e) {
				error(e);
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
		 * Selectors "contains(string)", "even", "first", "has(tag)", "last", "not(tag)", "odd" are optional
		 * The "has" and "not" selectors accept comma delimited strings, which can include wildcards, e.g. ":has(d*, l*)"
		 *
		 * IDs cannot use dot notation, selectors can be delimited with . or :
		 *
		 * @param arg {string} Comma delimited string of target #id, .class, tag and :selector
		 * @param nodelist {boolean} [Optional] True will return a NodeList (by reference) for tags & classes
		 * @returns {mixed} Instance or Array of Instances
		 */
		$ : function(arg, nodelist) {
			var args, obj, i, loop, c, alt, find, contains, has, not, x,
			    document  = window.document,
			    instances = [];

			/**
			 * Looks for alternating HTMLElement (arg) in HTMLElement (obj)
			 *
			 * @param obj {object} HTMLElement to search
			 * @param state {object} Boolean representing rows, true is even, false is odd
			 * @returns {mixed} Instance or Array of Instances containing arg, alternating odd or even
			 */
			alt = function(obj, state) {
				var i, loop, instances = [];

				if (obj instanceof Array) {
					loop = obj.length;
					for (i = 0; i < loop; i++) {
						(i.even() === state) ? instances.push(obj[i]) : void(0);
					}
				}
				else if ((obj.childNodes) && (obj.childNodes.length > 0)) {
					loop = obj.childNodes.length;
					for (i = 0; i < loop; i++) {
						(i.even() === state) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			/**
			 * Tests obj against arg
			 *
			 * @param obj {string} Property to test
			 * @param arg {string} String to test for, can be comma delimited or a wildcard
			 * @returns {boolean} True if found
			 */
			find = function(obj, arg) {
				arg = arg.split(/\s*,\s*/);
				var i, pattern, loop = arg.length, instances = [];
				for (i = 0; i < loop; i++) {
					pattern = new RegExp(arg[i].replace("*", ".*"), "ig");
					(pattern.test(obj)) ? instances.push(arg[i]) : void(0);
				}
				return (instances.length > 0) ? true : false;
			};

			/**
			 * Looks for arg in obj.innerHTML
			 *
			 * @param obj {object} HTMLElement to search
			 * @param arg {mixed} String or Integer to find in obj
			 * @returns {mixed} Instance or Array of Instances containing arg
			 */
			contains = function(obj, arg) {
				var i, loop, instances = [];

				((obj instanceof Array) && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					loop = obj.length;
					for (i = 0; i < loop; i++) {
						(obj[i].innerHTML.indexOf(arg) >= 0) ? instances.push(obj[i]) : void(0);
					}
					return (instances.length == 1) ? instances[0] : instances;
				}
				else {
					return ((obj != null) && (arg != null) && (obj.innerHTML.indexOf(arg) >= 0)) ? obj : undefined;
				}
			};

			/**
			 * Looks for HTMLElement (arg) in HTMLElement (obj)
			 *
			 * @param obj {object} HTMLElement to search
			 * @param arg {string} HTMLElement type to find, can be comma delimited
			 * @returns {mixed} Instance or Array of Instances containing arg
			 */
			has = function(obj, arg) {
				var i, loop, instances = [];

				((obj instanceof Array) && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					var x, loop2;
					loop = obj.length;
					for (i = 0; i < loop; i++) {
						loop2 = obj[i].childNodes.length;
						for (x = 0; x < loop2; x++) {
							obj[i].genID();
							((find(obj[i].childNodes[x].nodeName, arg) === true)
							 && (instances[obj[i].id] === undefined)) ? instances[obj[i].id] = obj[i] : void(0);
						}
					}
					instances = instances.indexed();
				}
				else {
					loop = obj.childNodes.length;
					for (i = 0; i < loop; i++) {
						(find(obj.childNodes[i].nodeName, arg) === true) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			/**
			 * Tests if HTMLElement (obj) matches HTMLElements (arg)
			 *
			 * @param obj {object} HTMLElement to search
			 * @param arg {string} HTMLElement type to find, can be comma delimited
			 * @returns {mixed} Instance or Array of Instances containing arg
			 */
			is = function(obj, arg) {
				var i, loop, instances = [];

				((obj instanceof Array) && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					loop = obj.length;
					for (i = 0; i < loop; i++) {
						obj[i].genID();
						((find(obj[i].nodeName, arg) === true)
						 && (instances[obj[i].id] === undefined)) ? instances[obj[i].id] = obj[i] : void(0);
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
			 * @param obj {object} HTMLElement to search
			 * @param arg {string} HTMLElement type to exclude, can be comma delimited
			 * @returns {mixed} Instance or Array of Instances containing arg
			 */
			not = function(obj, arg) {
				var i, loop, instances = [];

				((obj instanceof Array) && (obj.length == 1)) ? obj = obj.first() : void(0);

				if (obj instanceof Array) {
					var x, loop2;
					loop = obj.length;
					for (i = 0; i < loop; i++) {
						loop2 = obj[i].childNodes.length;
						for (x = 0; x < loop2; x++) {
							obj[i].genID();
							(find(obj[i].childNodes[x].nodeName, arg) === false) ? ((instances[obj[i].id] === undefined) ? instances[obj[i].id] = obj[i] : void(0))
													     : ((instances[obj[i].id] !== undefined) ? delete instances[obj[i].id]   : void(0));
						}
					}
					instances = instances.indexed();
				}
				else {
					loop = obj.childNodes.length;
					for (i = 0; i < loop; i++) {
						(find(obj.childNodes[i].nodeName, arg) === false) ? instances.push(obj.childNodes[i]) : void(0);
					}
				}

				return instances;
			};

			arg      = (arg.toString().indexOf(",") > -1) ? arg.split(/\s*,\s*/) : arg;
			nodelist = (nodelist === true) ? true : false;

			// Recursive processing, ends up below
			if (arg instanceof Array) {
				loop = arg.length;
				for (i = 0; i < loop; i++) {
					instances.push($(arg[i], nodelist));
				}
				return instances;
			}

			// Setting arg & args
			args = arg.split(/\.|:/).slice(1);
			if (arg.charAt(0) == ":") {
				arg = ":";
			}
			else if (arg.charAt(0) == ".") {
				arg = ((args.length) && (args.length > 0)) ? new String("."+args[0]) : new String(arg);
				args = args.splice(1);
			}
			else {
				arg = ((args.length) && (args.length > 0)) ? new String(arg.split(/\.|:/)[0]) : new String(arg);
			}

			// Getting instance(s)
			switch (arg.charAt(0)) {
				case ".":
					obj = document.getElementsByClassName(arg.substring(1));
					((obj !== null) && (nodelist === false) && ((!client.ie) || (client.version > 8))) ? obj = Array.prototype.slice.call(obj) : void(0);
					break;
				case "#":
					obj = document.getElementById(arg.substring(1));
					break;
				case ":":
					obj = document.body.getElementsByTagName("*");
					if ((obj !== null) && (nodelist === false)) {
						if ((!client.ie) || (client.version > 8)) {
							obj = Array.prototype.slice.call(obj);
						}
						else {
							var a = [], i, loop = obj.length;
							for (var i = 0; i < loop; i++) {
								a.push(obj[i]);
							}
							obj = a;
						}
					}
					break;
				default:
					obj = document.getElementsByTagName(arg);
					if ((obj !== null) && (nodelist === false)) {
						if ((!client.ie) || (client.version > 8)) {
							obj = Array.prototype.slice.call(obj);
						}
						else {
							var a = [], i, loop = obj.length;
							for (var i = 0; i < loop; i++) {
								a.push(obj[i]);
							}
							obj = a;
						}
					}
					break;
			}

			// Processing selector(s)
			if ((obj !== null) && (args.length) && (args.length > 0)) {
				loop = args.length;
				for (i = 0; i < loop; i++) {
					if (obj === undefined) {
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
							loop = (obj.length) ? obj.length : 0;
							instances = [];
							for (x = 0; x < loop; x++) {
								c = obj[x].className.split(" ");
								(c.index(args[i]) > -1) ? instances.push(obj[x]) : void(0);
							}
							obj = instances;
					}

					if (obj instanceof Array) {
						(obj.length === 0) ? obj = (((i + 1) == loop) ? [] : undefined) : void(0);
					}
				}
			}

			if (obj === null) {
				obj = undefined;
			}

			return obj;
		},

		/**
		 * Allows deep setting of properties without knowing
		 * if the structure is valid
		 *
		 * @param args {string} Dot delimited string of the structure
		 * @param value {mixed} The value to set
		 * @param obj {object} The object to set the value on
		 */
		define: function(args, value, obj) {
			args = args.split(".");
			obj  = obj || this;

			var i = null,
			    l = args.length,
			    p = obj;

			for (i = 0; i < l; i++) {
				(p[args[i]] === undefined) ? p[args[i]] = ((i+1 < l) ? {} : ((value !== undefined) ? value : null))
							   : ((i+1 >= l) ? (p[args[i]] = (value !== undefined) ? value : null) : void(0));
				p = p[args[i]];
			}

			return obj;
		},

		/**
		 * Error handling, with history in .events[]
		 *
		 * @param e {mixed} Error object or message to display.
		 */
		error : function(e) {
			var err = {name: ((typeof e == "object") ? e.name : "TypeError"), message: (typeof e == "object") ? e.message : e};
			(e.number !== undefined) ? (err.number = (e.number & 0xFFFF)) : void(0);
			(typeof console != "undefined") ? console.error(err.message) : void(0);
			(error.events === undefined) ? error.events = [] : void(0);
			error.events.push(err);
		},

		/**
		 * Encodes a string to a DOM friendly ID
		 *
		 * @param id {string} The object.id value to encode
		 * @returns {string} Returns a lowercase stripped string
		 */
		domID : function(id) {
			try {
				return id.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Generates an id property if obj does not have one
		 *
		 * @param obj {mixed} The object to verify
		 * @returns {object} The object
		 */
		genID : function(obj) {
			try {
				if (typeof obj != "object") {
					throw new Error(label.error.invalidArguments);
				}

				if ((obj instanceof Array) || (obj.id != "")) {
					return obj;
				}

				var id = "abaaso-" + utility.id();
				do id  = "abaaso-" + utility.id();
				while ($("#"+id) !== undefined);
				obj.id = id;

				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Generates a random number
		 *
		 * @returns {integer} Between 1 and 1-trillian
		 */
		id : function() {
			return Math.floor(Math.random() * 1000000000);
		},

		/**
		 * Renders a loading icon in a target element
		 *
		 * @param id {string} Target object.id value
		 */
		loading : function(obj) {
			try {
				if (obj instanceof Array) {
					var loop = (!isNaN(obj.length)) ? obj.length : obj.total(),
					    i    = null;
					for (i = 0; i < loop; i++) {
						this.loading(obj[i]);
					}
					return arg;
				}
				else {
					if (abaaso.loading.url === null) {
						throw new Error(label.error.elementNotFound);
					}

					obj = (typeof(obj) == "object") ? obj : $(obj);

					if (obj === undefined) {
						throw new Error(label.error.invalidArguments);
					}

					// Setting loading image
					if (abaaso.loading.image === undefined) {
						abaaso.loading.image     = new Image();
						abaaso.loading.image.src = abaaso.loading.url;
					}

					// Clearing target element
					obj.genID();
					obj.clear();

					// Creating loading image in target element
					$("#"+obj.id).create("div", {id: obj.id+"_loading", style: "text-align:center"});
					$("#"+obj.id+"_loading").create("img", {alt: label.common.loading, src: abaaso.loading.image.src});

					return obj;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},
		
		/**
		 * Writes argument to the console
		 *
		 * @param arg {string} The string to write to the console
		 * @returns undefined;
		 */
		log : function(arg) {
			try {
				console.log(arg);
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @param obj {object} Instance of Array, Element, String or Number
		 * @param type {string} Identifier of obj, determines what arrays to apply
		 */
		proto : function(obj, type) {
			try {
				if (typeof obj != "object") {
					throw new Error(label.error.invalidArguments);
				}

				/**
				 * Applies a collection of methods onto an Object
				 *
				 * @param obj {object} The object to receive the methods
				 * @param collection {array} The collection of methods to apply
				 */
				var apply   = function(obj, collection) {
					var i = collection.length;
					while (i--) {
						obj[collection[i].name] = collection[i].fn;
					}
				}

				// Collection of methods to add to prototypes
				var methods = {
					array   : [
						{name: "contains", fn: function(arg) {
							return abaaso.array.contains(this, arg);
							}},
						{name: "diff", fn: function(arg) {
							return abaaso.array.diff(this, arg);
							}},
						{name: "first", fn: function() {
							return abaaso.array.first(this);
							}},
						{name: "index", fn: function(arg) {
							return abaaso.array.index(this, arg);
							}},
						{name: "indexed", fn: function() {
							return abaaso.array.indexed(this);
							}},
						{name: "keys", fn: function() {
							return abaaso.array.keys(this);
							}},
						{name: "last", fn: function(arg) {
							return abaaso.array.last(this);
							}},
						{name: "on", fn: function(event, listener, id, scope, standby) {
							scope = scope || false;
							return abaaso.on(this, event, listener, id, scope, standby);
							}},
						{name: "remove", fn: function(arg) {
							return abaaso.array.remove(this, arg);
							}},
						{name: "total", fn: function() {
							return abaaso.array.total(this);
							}}
					],
					element : [
						{name: "create", fn: function(type, args) {
							this.genID();
							return abaaso.create(type, args, this);
							}},
						{name: "disable", fn: function() {
							return abaaso.el.disable(this);
							}},
						{name: "enable", fn: function() {
							return abaaso.el.enable(this);
							}},
						{name: "get", fn: function(uri) {
							this.fire("beforeGet");
							var cached = cache.get(uri);
							if (!cached) {
								uri.on("afterGet", function() {
									uri.un("afterGet", "get");
									var response = cache.get(uri, false).response;
									(this.value !== undefined) ? this.update({value: response}) : this.update({innerHTML: response});
									this.fire("afterGet");
									}, "get", this);
								abaaso.get(uri);
							}
							else {
								(this.value !== undefined) ? this.update({value: cached.response}) : this.update({innerHTML: cached.response});
								this.fire("afterGet");
							}
							return this;
							}},
						{name: "hide", fn: function() {
							this.genID();
							return abaaso.el.hide(this);
							}},
						{name: "jsonp", fn: function(uri, property, callback) {
							var target = this,
							    arg = property,
							    response,
							    fn = function(response){
								var self = target,
								    node = response,
								    prop = arg, i, loop;

								if (prop !== undefined) {
									prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
									loop = prop.length;
									for (i = 0; i < loop; i++) {
										node = (isNaN(prop[i])) ? node[prop[i]] : node[parseInt(prop[i])];
									}
									text = node;
								}
								else {
									text = response;
								}

								self.text(text);
								};
							abaaso.client.jsonp(uri, fn, null, callback);
							return this;
							}},
						{name: "loading", fn: function() {
							return abaaso.loading.create(this);
							}},
						{name: "on", fn: function(event, listener, id, scope, standby) {
							scope = scope || this;
							((this.id === undefined)
							 || (this.id == "")) ? this.genID() : void(0);
							return abaaso.on(this, event, listener, id, scope, standby);
							}},
						{name: "position", fn: function() {
							this.genID();
							return abaaso.el.position(this);
							}},
						{name: "show", fn: function() {
							this.genID();
							return abaaso.el.show(this);
							}},
						{name: "text", fn: function(arg) {
							this.genID();
							return abaaso.update(this, {innerHTML: arg});
							}},
						{name: "update", fn: function(args) {
							this.genID();
							return abaaso.update(this, args);
							}}
					],
					number  : [
						{name: "even", fn: function() {
							return abaaso.number.even(this);
							}},
						{name: "odd", fn: function() {
							return abaaso.number.odd(this);
							}},
						{name: "on", fn: function(event, listener, id, scope, standby) {
							scope = scope || this;
							return abaaso.on(this, event, listener, id, scope, standby);
							}}
					],
					shared  : [
						{name: "clear", fn: function() {
							((typeof this == "object")
							 && ((this.id === undefined)
							     || (this.id == ""))) ? this.genID() : void(0);
							(this instanceof String) ? (this.constructor = new String("")) : abaaso.clear(this);
							return this;
							}},
						{name: "destroy", fn: function() {
							abaaso.destroy(this);
							}},
						{name: "domID", fn: function() {
							if (!this instanceof String) {
								this.genID();
								return abaaso.domID(this.id);
							}
							return abaaso.domID(this);
							}},
						{name: "fire", fn: function(event) {
							((!this instanceof String)
								 && ((this.id === undefined)
								     || (this.id == ""))) ? this.genID() : void(0);
							return abaaso.fire(this, event);
							}},
						{name: "genID", fn: function() {
							return abaaso.genID(this);
							}},
						{name: "listeners", fn: function(event) {
							((!this instanceof String)
								 && ((this.id === undefined)
								     || (this.id == ""))) ? this.genID() : void(0);
							return abaaso.listeners(this, event);
							}},
						{name: "un", fn: function(event, id) {
							((!this instanceof String)
								 && ((this.id === undefined)
								     || (this.id == ""))) ? this.genID() : void(0);
							return abaaso.un(this, event, id);
							}}
					],
					string  : [
						{name: "capitalize", fn: function() {
							return this.charAt(0).toUpperCase() + this.slice(1);
							}},
						{name: "on", fn: function(event, listener, id, scope, standby) {
							scope = scope || this;
							return abaaso.on(this, event, listener, id, scope, standby);
							}},
						{name: "trim", fn: function(){
							return this.replace(/^\s+|\s+$/, "");
							}}
					]
				};

				// Applying the methods
				apply(obj, methods[type]);
				apply(obj, methods.shared);
			}
			catch (e) {
				error(e);
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
			domain   : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/,
			ip       : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
			integer  : /(^-?\d\d*$)/,
			email    : /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/,
			number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
			notEmpty : /\S/,
			phone    : /^\([1-9]\d{2}\)\s?\d{3}\-\d{4}$/,
			string   : /\w/
		},

		/**
		 * Returns the supplied argument, or false
		 *
		 * @param arg {boolean}
		 * @returns {boolean}
		 */
		bool : function(arg) {
			switch (arg) {
				case true:
				case false:
					return arg;
				default:
					return false;
			}
		},

		/**
		 * Validates args based on the type or pattern specified
		 *
		 * @param args {object} An object to test {id: [test || pattern]}
		 * @returns {object} An object containing validation status and invalid instances
		 */
		test : function(args) {
			try {
				var exception = false,
				    invalid   = [],
				    pattern   = validate.pattern,
				    value     = null;

				for (var i in args) {
					value = ($(i).value) ? $(i).value : $(i).innerHTML;
					switch (args[i]) {
						case "boolean":
							if (!validate.bool(value)) {
								invalid.push(i);
								exception = true;
							}
							break;
						case "date":
							value = new String(value);
							if ((!pattern.notEmpty.test(value))
							    || (!new Date(value))) {
								invalid.push(i);
								exception = true;
							}
							break;
						case "domainip":
							value = new String(value);
							if ((!pattern.domain.test(value))
							    || (!pattern.ip.test(value))) {
								invalid.push(i);
								exception = true;
							}
							break;
						default:
							value = new String(value);
							var p = (pattern[args[i]]) ? pattern[args[i]] : args[i];
							if (!p.test(value)) {
								invalid.push(i);
								exception = true;
							}
							break;
					}
				}

				return {pass: !exception, invalid: invalid};
			}
			catch (e) {
				error(e);
				return {pass: false, invalid: {}};
			}
		}
	};

	// Declaring private global instances
	var $     = utility.$,
	    error = utility.error;

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
			css3    : client.css3,
			chrome  : client.chrome,
			firefox : client.firefox,
			ie      : client.ie,
			ms      : client.ms,
			opera   : client.opera,
			safari  : client.safari,
			version : client.version,

			// Methods
			del     : client.del,
			get     : client.get,
			post    : client.post,
			put     : client.put,
			jsonp   : client.jsonp,
			size    : client.size
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
			current : null,
			header  : null,
			previous: null
			},
		validate        : validate,

		// Methods & Properties
		$               : utility.$,
		clear           : el.clear,
		clean           : cache.clean,
		create          : el.create,
		css             : el.css,
		define          : utility.define,
		del             : client.del,
		destroy         : el.destroy,
		domID           : utility.domID,
		error           : utility.error,
		fire            : function() {
			var obj   = (arguments[1] === undefined) ? abaaso : arguments[0],
			    event = (arguments[1] === undefined) ? arguments[0] : arguments[1];

			return abaaso.observer.fire(obj, event);
			},
		genID           : utility.genID,
		get             : client.get,
		id              : "abaaso",
		init            : function() {
			abaaso.ready = true;

			client.version = (function(){
					if (client.chrome)  { return parseInt(navigator.userAgent.replace(/(.*Chrome\/|Safari.*)/gi, "").trim()); }
					if (client.firefox) { return parseInt(navigator.userAgent.replace(/(.*Firefox\/)/gi, "").trim()); }
					if (client.ie)      { return parseInt(navigator.userAgent.replace(/(.*MSIE|;.*)/gi, "").trim()); }
					if (client.opera)   { return parseInt(navigator.userAgent.replace(/(.*Opera\/|\(.*)/gi, "").trim()); }
					if (client.safari)  { return parseInt(navigator.userAgent.replace(/(.*Version\/|Safari.*)/gi, "").trim()); }
					else { return parseInt(navigator.appVersion); }
				})();
			client.css3    = (function(){
					if ((client.chrome) && (client.version > 5))  { return true; }
					if ((client.firefox) && (client.version > 2)) { return true; }
					if ((client.ie) && (client.version > 8))      { return true; }
					if ((client.opera) && (client.version > 8))   { return true; }
					if ((client.safari) && (client.version > 4))  { return true; }
					else { return false; }
				})();
			abaaso.client.version = client.version;
			abaaso.client.css3    = client.css3;

			utility.proto(Array.prototype, "array");
			utility.proto(Element.prototype, "element");
			((client.ie) && (client.version == 8)) ? utility.proto(HTMLDocument.prototype, "element") : void(0);
			utility.proto(Number.prototype, "number");
			utility.proto(String.prototype, "string");
			window.onhashchange = function() { abaaso.fire("hashChange"); };
			window.onresize = function() { abaaso.fire("resize"); };
			abaaso.timer.clean = setInterval(function(){ abaaso.clean(); }, 120000);

			if (typeof document.getElementsByClassName == "undefined") {
				document.getElementsByClassName = function(arg) {
					var nodes   = document.getElementsByTagName("*"),
					    loop    = nodes.length,
					    i       = null,
					    obj     = [],
					    pattern = new RegExp("(^|\\s)"+arg+"(\\s|$)");

					for (i = 0; i < loop; i++) {
						(pattern.test(nodes[i].className)) ? obj.push(nodes[i]) : void(0);
					}

					return obj;
				};
			}

			if (typeof Array.prototype.filter == "undefined") {
				Array.prototype.filter = function(fn) {
					"use strict";
					if ((this === void 0)
					    || (this === null)
					    || (typeof fn !== "function")) {
						throw new Error(label.error.invalidArguments);
					}

					var i      = null,
					    t      = Object(this),
					    loop   = t.length >>> 0,
					    result = [],
					    prop   = arguments[1]
					    val    = null;

					for (i = 0; i < loop; i++) {
						if (i in t) {
							val = t[i];
							(fn.call(prop, val, i, t)) ? result.push(val) : void(0);
						}
					}

					return result;
				}
			}

			abaaso.fire("ready").un("ready");

			if ((!client.ie) || (client.version > 8)) {
				abaaso.timer.render = setInterval(function(){
					if (/loaded|complete/.test(document.readyState)) {
						clearInterval(abaaso.timer.render);
						abaaso.fire("render").un("render");
					}
				}, 10);
			}

			delete abaaso.init;
			},
		jsonp           : client.jsonp,
		listeners       : function() {
			var all   = (arguments[1] !== undefined) ? true : false;
			var obj   = (all) ? arguments[0] : abaaso,
			    event = (all) ? arguments[1] : arguments[0];

			return abaaso.observer.list(obj, event);
			},
		on              : function() {
			var all      = (arguments[2] instanceof Function) ? true : false;
			var obj      = (all) ? arguments[0] : abaaso,
			    event    = (all) ? arguments[1] : arguments[0],
			    listener = (all) ? arguments[2] : arguments[1],
			    id       = (all) ? arguments[3] : arguments[2],
			    scope    = (all) ? arguments[4] : arguments[3],
			    standby  = (all) ? arguments[5] : arguments[4];

			return abaaso.observer.add(obj, event, listener, id, scope, standby);
			},
		position        : el.position,
		post            : client.post,
		put             : client.put,
		ready           : false,
		timer           : {},
		un              : function() {
			var all   = (typeof arguments[0] == "string") ? false : true;
			var obj   = (all) ? arguments[0] : abaaso,
			    event = (all) ? arguments[1] : arguments[0],
			    id    = (all) ? arguments[2] : arguments[1];

			return abaaso.observer.remove(obj, event, id);
			},
		update          : el.update,
		version         : "1.4.010"
	};
}();

var $ = function(arg, nodelist) {
	return abaaso.$(arg, nodelist);
};

// Registering events
switch (true) {
	case abaaso.client.chrome:
	case abaaso.client.firefox:
	case abaaso.client.opera:
	case abaaso.client.safari:
	case ((abaaso.client.ie) && (abaaso.client.version > 8)):
		document.addEventListener("DOMContentLoaded", function(){ abaaso.init(); }, false);
		break;
	default:
		abaaso.timer.init = setInterval(function(){
			if (/loaded|complete/.test(document.readyState)) {
				clearInterval(abaaso.timer.init);
				abaaso.init();
				abaaso.fire("render").un("render");
			}
		}, 10);
}
