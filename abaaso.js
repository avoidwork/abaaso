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
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
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
 * HATEOAS can be implemented by setting abaaso.state.header which will trigger a
 * transition (state change) if the header is part of an XHR response.
 *
 * This requires standby listeners to be created on "ready" so the observer can
 * replace the active listeners; otherwise an exception is thrown.
 *
 * See @link for the development roadmap
 *
 * Events:    ready      Fires when the DOM is available (safe for GUI creation)
 *            render     Fires when the window resources have loaded (safe for visual fx)
 *            resize     Fires when the window resizes
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com/products/abaaso abaaso
 * @namespace
 * @version Beta
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
				arg = (arg.toString().indexOf(",") > -1) ? arg.split(",") : arg;

				if (arg instanceof Array) {
					var indexes = [],
					          i = args.length;

					while (i--) {
						indexes[i] = instance.index(arg[i]);
					}

					return indexes;
				}
				else {
					return instance.index(arg);
				}
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
		 * @returns {integer} The position of item in ar
		 */
		index : function(instance, arg) {
			try {
				if (instance instanceof Array) {
					var i = instance.length;

					while (i--) {
						if (instance[i] == arg) {
							return i;
						}
					}

					return -1;
				}
				else {
					throw label.error.expectedArray;
				}
			}
			catch (e) {
				error(e);
				return -1;
			}
		},

		/**
		 * Removes arg from instance without destroying and re-creating instance
		 *
		 * @param instance {array} An instance of the array to use
		 * @param start {integer} The starting position
		 * @param end {integer} The ending position (optional)
		 * @returns {array} A scrubbed array
		 */
		remove : function(instance, start, end) {
			try {
				start = start || 0;
				instance.fire("beforeRemove");
				var remaining = instance.slice((end || start)+1 || instance.length);
				instance.length = (start < 0) ? (instance.length + start) : start;
				instance.fire("beforeAfter");
				return instance.push.apply(instance, remaining);
			}
			catch (e) {
				error(e);
				return undefined;
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
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @param uri {string} The URI/Identifier for the resource to retrieve from cache
		 * @param expire {boolean} [Optional] If 'false' the URI will not expire
		 * @returns {mixed} Returns the URI object {headers, response} or false
		 */
		get : function(uri, expire) {
			try {
				expire = (expire === false) ? false : true;

				if (this.items[uri] === undefined) {
					return false;
				}
				else {
					if (this.items[uri].headers !== undefined) {
						if (((this.items[uri].headers.Pragma !== undefined)
						    && (this.items[uri].headers.Pragma == "no-cache")
						    && (expire))
						    || ((this.items[uri].headers.Expires !== undefined)
							 && (new Date(this.items[uri].headers.Expires) < new Date())
							 && (expire))
						    || ((client.ms > 0)
							 && (expire)
							 && (this.items[uri].headers.Date !== undefined)
							 && (new Date(this.items[uri].headers.Date).setMilliseconds(new Date(this.items[uri].headers.Date).getMilliseconds() + client.ms) > new Date()))
						    || ((client.ms > 0)
							 && (expire)
							 && (new Date(this.items[uri].epoch).setMilliseconds(new Date(this.items[uri].epoch).getMilliseconds() + client.ms) > new Date()))) {
							delete this.items[uri];
							return false;
						}
						else {
							return this.items[uri];
						}
					}
					else {
						return this.items[uri];
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
				(this.items[uri] === undefined) ? this.items[uri] = {} : void(0);
				this.items[uri][property] = value;
			}
			catch (e) {
				error(e);
			}
		}
	};

	/**
	 * Calendar methods
	 *
	 * Override abaaso.calendar.date.pattern to change the localized pattern from ISO 8601
	 *
	 * @class
	 */
	var calendar = {
		/**
		 * Tracking object used to render the calendar
		 */
		date : {
			c           : new Date(), // Current
			clear       : null,
			d           : null,
			destination : null,
			label       : null,
			n           : new Date(), // Next
			p           : new Date(), // Previous
			pattern     : "yyyy/mm/dd"
		},

		/**
		 * Creates a calendar, which can act like a date picker
		 *
		 * @param target {string} Object.id value that called this function
		 * @param destination {string} Optional element.id that will receive the calendar value
		 * @param clear {boolean} Optional boolean for displaying optional Clear anchor in calendar header
		 */
		create : function(target, destination, clear) {
			try {
				if ((!$(target))
				    || ((destination !== undefined)
					&& (!$(destination)))) {
					throw label.error.elementNotFound;
				}

				var args           = {id: "abaaso_calendar"},
				    o              = calendar.date,
				    obj            = null,
				    objDestination = $(destination),
				    objTarget      = $(target);

				o.clear       = ((destination !== undefined) && (clear === undefined)) ? false : validate.bool(clear);
				o.destination = ((destination !== undefined) && (objDestination)) ? destination : null;
				o.c           = ((destination !== undefined) && (objDestination.value != "")) ? new Date(objDestination.value) : o.c;

				objTarget.blur();

				((o.destination !== null)
				 && (objDestination.value == label.error.invalidDate))? objDestination.clear() : void(0);

				if (o.destination !== null) {
					var pos = objTarget.position();
					args.style = "top:" + pos[1] + "px;left:" + pos[0] + "px;position:absolute;z-index:9999;";
					obj = el.create("div", args);
				}
				else {
					obj = el.create("div", args, target);
				}

				if (!calendar.render(obj.id, o.c)) {
					obj.destroy();
					throw label.error.elementNotCreated;
				}
				else {
					return obj;
				}
			}
			catch(e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Creates a day div in the calendar
		 *
		 * @param target {string} Object.id value
		 * @param dateStamp {date} Date object
		 */
		day : function(target, dateStamp) {
			try {
				dateStamp = (dateStamp !== undefined) ? new Date(dateStamp) : null;

				if ((dateStamp != null)
				     && (!isNaN(dateStamp.getYear()))) {
					var o    = calendar.date.c,
					    d    = dateStamp.getDate(),
					    args = {id: "href_day_" + d, innerHTML: d};

					args["class"] = ((dateStamp.getDate() == o.getDate())
						      && (dateStamp.getMonth() == o.getMonth())
						      && (dateStamp.getFullYear() == o.getFullYear())) ? "current" : "weekend";

					el.create("div", {id: "div_day_" + d, "class": "day"}, target);
					el.create("a", args, "div_day_" + d);

					if (calendar.date.destination !== null) {
						$(args.id).un("click").on("click", function() {
							var date = new Date(abaaso.calendar.date.c),
							    day  = this.innerHTML.match(/^\d{1,2}$/);

							date.setDate(day[0]);
							abaaso.calendar.date.c = date;
							date = abaaso.calendar.format(date);

							($(abaaso.calendar.date.destination)) ? $(abaaso.calendar.date.destination).update({innerHTML: date, value: date}) : void(0);

							abaaso.destroy("abaaso_calendar");
							}, args.id);
					}
				}
				else {
					el.create("div", {"class": "day"}, target);
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Gets the days in a month
		 *
		 * @param month {integer}
		 * @param year {integer}
		 * @returns {integer}
		 */
		days : function(month, year) {
			try {
				return (32 - new Date(year, month, 32).getDate());
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Returns a Date object as a string formatted as date.pattern
		 *
		 * @param dateStamp {object} Date object to return as a string
		 * @returns {string} Date object value in the date.pattern format
		 */
		format : function(dateStamp) {
			try {
				var output     = calendar.date.pattern,
				    outputDate = new Date(dateStamp);

				output = output.replace(/dd/,outputDate.getDate());
				output = output.replace(/mm/,outputDate.getMonth()+1);
				output = output.replace(/yyyy/,outputDate.getFullYear());

				return output;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Renders the calendar in the target element
		 *
		 * (Pre-registered) Events are destroyed and recreated to insure proper behavior
		 *
		 * @param target {string} Target object.id value
		 * @param dateStamp {mixed} Date to work with
		 */
		render : function(target, dateStamp) {
			try {
				var obj = $(target);
				if (obj !== null) {
					obj.fire("beforeRender");
					obj.clear();

					var o = calendar.date;
					o.c = new Date(dateStamp);
					o.p = new Date(dateStamp);
					o.n = new Date(dateStamp);
					o.d = calendar.days(o.c.getMonth(), o.c.getFullYear());

					switch (o.c.getMonth()) {
						case 0:
							o.p.setMonth(11);
							o.p.setFullYear(o.c.getFullYear()-1);
							o.n.setMonth(o.c.getMonth()+1);
							o.n.setFullYear(o.c.getFullYear());
							break;
						case 10:
							o.p.setMonth(o.c.getMonth()-1);
							o.p.setFullYear(o.c.getFullYear());
							o.n.setMonth(o.c.getMonth()+1);
							o.n.setFullYear(o.c.getFullYear());
							break;
						case 11:
							o.p.setMonth(o.c.getMonth()-1);
							o.p.setFullYear(o.c.getFullYear());
							o.n.setMonth(0);
							o.n.setFullYear(o.c.getFullYear()+1);
							break;
						default:
							o.p.setMonth(o.c.getMonth()-1);
							o.p.setFullYear(o.c.getFullYear());
							o.n.setMonth(o.c.getMonth()+1);
							o.n.setFullYear(o.c.getFullYear());
							break;
					}

					o.label = label.months[(o.c.getMonth()+1).toString()];
					el.create("div", {id: "calendarTop"}, target);

					if (o.clear) {
						el.create("a", {id: "calendarClear", innerHTML: label.common.clear}, "calendarTop");
						$("calendarClear").un("click").on("click", function() {
							var o = abaaso.calendar.date;
							((o.destination !== null) && $(o.destination)) ? $(o.destination).clear() : void(0);
							o.c = new Date();
							o.p = o.c;
							o.n = o.c;
							abaaso.destroy("abaaso_calendar");
							});
					}

					el.create("a", {id: "calendarClose", innerHTML: label.common.close}, "calendarTop");
					$("calendarClose").un("click").on("click", function() { abaaso.destroy("abaaso_calendar"); });

					el.create("div", {id: "calendarHeader"}, target);

					el.create("a", {id: "calendarPrev", innerHTML: "&lt;"}, "calendarHeader");
					$("calendarPrev").un("click").on("click", function() { abaaso.calendar.render("abaaso_calendar", abaaso.calendar.date.p); });

					el.create("span", {id: "calendarMonth", innerHTML: o.label+" "+dateStamp.getFullYear().toString()}, "calendarHeader");

					el.create("a", {id: "calendarNext", innerHTML: "&gt;"}, "calendarHeader");
					$("calendarNext").un("click").on("click", function() { abaaso.calendar.render("abaaso_calendar", abaaso.calendar.date.n); });

					el.create("div", {id: "calendarDays"}, target);

					dateStamp.setDate(1);

					var i    = null,
					    loop = dateStamp.getDay();

					for (i = 1; i <= loop; i++) {
						calendar.day("calendarDays");
					}

					loop = o.d;

					for (i = 1; i <= loop; i++) {
						calendar.day("calendarDays", dateStamp.setDate(i));
					}

					$(target).fire("afterRender");

					return true;
				}
				else {
					throw label.error.elementNotFound;
				}
			}
			catch (e) {
				error(e);
				return false;
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
		css3	: (function(){
				if ((this.chrome) && (parseInt(client.version) >= 6)) { return true; }
				if ((this.firefox) && (parseInt(client.version) >= 3)) { return true; }
				if ((this.ie) && (parseInt(client.version) >= 9)) { return true; }
				if ((this.opera) && (parseInt(client.version >= 9))) { return true; }
				if ((this.safari) && (parseInt(client.version >= 5))) { return true; }
				else { return false; }}),
		chrome	: (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) ? true : false,
		firefox : (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) ? true : false,
		ie	: (navigator.userAgent.toLowerCase().indexOf("msie") > -1) ? true : false,
		ms	: 0,
		opera	: (navigator.userAgent.toLowerCase().indexOf("opera") > -1) ? true : false,
		safari	: (navigator.userAgent.toLowerCase().indexOf("safari") > -1) ? true : false,
		version	: (function(){
				if (this.chrome) { return navigator.userAgent.replace(/(.*Chrome\/|Safari.*)/gi, ""); }
				if (this.firefox) { return navigator.userAgent.replace(/(.*Firefox\/)/gi, ""); }
				if (this.ie) { return navigator.userAgent.replace(/(.*MSIE|;.*)/gi, ""); }
				if (this.opera) { return navigator.userAgent.replace(/(.*Opera\/|\(.*)/gi, ""); }
				if (this.safari) { return navigator.userAgent.replace(/(.*Version\/|Safari.*)/gi, ""); }
				else { return parseInt(navigator.appVersion); }
				}),

		/**
		 * Sends a DELETE to the URI
		 *
		 * @param uri {string} URI to submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		del : function(uri, handler) {
			try {
				if ((uri == "")
				    || (!handler instanceof Function)) {
					throw label.error.invalidArguments;
				}

				client.request(uri, handler, "DELETE");
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Sends a GET to the URI
		 *
		 * @param uri {string} URI to submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		get : function(uri, handler) {
			try {
				if ((uri == "")
				    || (!handler instanceof Function)) {
					throw label.error.invalidArguments;
				}

				var response = cache.get(uri);
				(!response) ? client.request(uri, handler, "GET") : handler(response);
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Sends a PUT to the URI
		 *
		 * @param uri {string} URI submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 * @param {args} PUT variables to include
		 */
		put : function(uri, handler, args) {
			try {
				if ((uri == "")
				    || (!handler instanceof Function)
				    || (args == "")) {
					throw label.error.invalidArguments;
				}

				client.request(uri, handler, "PUT", args);
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Sends a POST to the URI
		 *
		 * @param uri {string} URI submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 * @param {args} POST variables to include
		 */
		post : function(uri, handler, args) {
			try {
				if ((uri == "")
				    || (!handler instanceof Function)
				    || (args == "")) {
					throw label.error.invalidArguments;
				}

				client.request(uri, handler, "POST", args);
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Creates an XmlHttpRequest to a URI
		 *
		 * @param uri {string} The resource to interact with
		 * @param fn {function} A handler function to execute when an appropriate response been received
		 * @param type {string} The type of request
		 * @param args {mixed} Data to append to the request
		 */
		request : function(uri, fn, type, args) {
			try {
				var xhr = new XMLHttpRequest();
				uri.toString().fire("beforeXHR");

				switch(type.toLowerCase()) {
					case "delete":
					case "get":
						xhr.onreadystatechange = function() { client.response(xhr, uri, fn); };
						(type.toLowerCase() == "delete") ? xhr.open("DELETE", uri, true) : xhr.open("GET", uri, true);
						xhr.send(null);
						break;
					case "post":
					case "put":
						xhr.onreadystatechange = function() { client.response(xhr, uri, fn); };
						(type.toLowerCase() == "post") ? xhr.open("POST", uri, true) : xhr.open("PUT", uri, true);
						(xhr.overrideMimeType) ? xhr.overrideMimeType("text/html") : void(0);
						xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						xhr.setRequestHeader("Content-length", args.length);
						xhr.setRequestHeader("Connection", "close");
						xhr.send(args);
						break;
				}
			}
			catch(e) {
				error(e);
			}
		},

		/**
		 * Receives and caches the URI response
		 *
		 * Headers are cached, if an expiration is set it will be used to control the local cache
		 *
		 * @param xhr {object} XMLHttpRequest object
		 * @param uri {string} The URI.value to cache
		 * @param fn {function} A handler function to execute once a response has been received
		 */
		response : function(xhr, uri, fn) {
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
						var state = null,
						        s = abaaso.state;

						cache.set(uri, "epoch", new Date());
						cache.set(uri, "response", xhr.responseText);

						uri.toString().fire("afterXHR");

						uri = cache.get(uri, false);

						if ((s.header !== null)
						    && (state = uri.headers[s.header]) && (state !== undefined)) {
							s.previous = s.current;
							s.current  = state;
							((s.previous !== null)
							 && (s.current !== null)) ? observer.replace(abaaso, state, s.previous, s.current, s.current) : void(0);
							abaaso.fire(state);
						}

						(fn !== undefined) ? fn(uri) : void(0);
					}
					else {
						throw label.error.serverError;
					}
				}
			}
			catch (e) {
				error(e);
			}
		}
	};

	/**
	 * Template data store object, to be put on a widget
	 *
	 * @class
	 * @todo complete for v1.1.0
	 */
	var data = {
		// Records
		records : [],

		// Methods
		del : function() {},
		insert : function() {},
		search : function() {},
		select : function() {},
		update : function() {}
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
		 * @param id {string} Target object.id value
		 */
		clear : function(obj) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj !== null) {
					obj.fire("beforeClear");

					switch (typeof obj) {
						case "form":
							obj.reset();
							break;
						case "object":
							obj.update({innerHTML: "", value: ""});
							break;
						default:
							obj.update({innerHTML: ""});
							break;
					}

					obj.fire("afterClear");
					return obj;
				}
				else {
					throw label.error.elementNotFound;
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
		 * @param args {object} Collection of properties to apply to the new element
		 * @param id {string} [Optional] Target id value to add element to
		 * @returns {object} The elemented that was created
		 */
		create : function(type, args, id) {
			try {
				if (args instanceof Object) {
					var obj = document.createElement(type);
					(args.id === undefined) ? obj.genID() : obj.id = args.id;
					obj.fire("beforeCreate");
					el.update(obj, args);
					((id !== undefined)
					 && ($(id) !== undefined)) ? $(id).appendChild(obj) : document.body.appendChild(obj);
					obj.fire("afterCreate");
					return obj;
				}
				else {
					throw label.error.expectedObject;
				}
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
		 * @param arg {string} Comma delimited string of target element.id values
		 */
		destroy : function(arg) {
			try {
				var args   = arg.split(","),
				       i   = args.length,
				       obj = null;

				while (i--) {
					obj = $(args[i]);
					if (obj !== null) {
						obj.fire("beforeDestroy");
						observer.remove(obj.id);
						obj.parentNode.removeChild(obj);
						obj.fire("afterDestroy");
					}
				}
			}
			catch(e) {
				error(e);
			}
		},

		/**
		 * Disables an element
		 *
		 * Events:    beforeDisable    Fires before the disable starts
		 *            afterDisable     Fires after the disable ends
		 *
		 * @param arg {string} Comma delimited string of target element.id values
		 */
		disable : function(arg) {
			try {
				var args      = arg.split(","),
				    i         = args.length,
				    instances = [],
				    obj       = null;

				while (i--) {
					obj = $(args[i]);
					if (obj !== null) {
						obj.fire("beforeDisable");
						obj.disabled = true;
						obj.fire("afterDisable");
						instances.push(obj);
					}
				}

				return (instances.length == 1) ? instances[0] : instances;
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
		 * @param arg {string} Comma delimited string of target element.id values
		 */
		enable : function(arg) {
			try {
				var args      = arg.split(","),
				    i         = args.length,
				    instances = [],
				    obj       = null;


				while (i--) {
					obj = $(args[i]);
					if (obj !== null) {
						obj.fire("beforeEnable");
						obj.disabled = false;
						obj.fire("afterEnable");
						instances.push(obj);
					}
				}

				return (instances.length == 1) ? instances[0] : instances;
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
		 * Finds the position of an element
		 *
		 * @param id {string} Target object.id value
		 * @returns {array} An array containing the render position of the element
		 */
		position : function(obj) {
			obj = (typeof obj == "object") ? obj : $(obj);

			if (obj === undefined) {
				throw label.error.invalidArguments;
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
		 * Updates an object or element
		 *
		 * Events:    beforeUpdate    Fires before the update starts
		 *            afterUpdate     Fires after the update ends
		 *
		 * @param obj {mixed} An instance of an object, or a target object.id value
		 * @param args {object} A collection of properties
		 */
		update : function(obj, args) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);
				args = args || {};

				if (obj === undefined) {
					throw label.error.invalidArguments;
				}

				obj.fire("beforeUpdate");

				if (obj) {
					for (var i in args) {
						switch(i) {
							case "class":
								((client.ie)
								 && (client.version < 8)) ? obj.setAttribute("className", args[i]) : obj.setAttribute("class", args[i]);
								break;
							case "innerHTML":
							case "type":
							case "src":
								obj[i] = args[i];
								break;
							case "opacity":
								obj.opacity(args[i]);
								break;
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
					throw label.error.elementNotFound;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		}
	};

	/**
	 * Effects methods
	 *
	 * @class
	 */
	var fx = {
		/**
		 * Bounces Target at it's current position
		 *
		 * @param id {string} Target object.id value
		 * @param ms {int} Milliseconds for bounce to take
		 * @param height {int} The maximum height of the bounce
		 * @todo complete for v1.1.0
		 */
		bounce : function(obj, ms, height) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if ((obj === undefined)
				    || (isNaN(ms))
				    || (isNaN(height))) {
					throw label.error.invalidArguments;
				}

				obj.fire("beforeBounce");
				obj.fire("afterBounce");
				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Shifts an object's opacity, transition speed is based on the ms argument
		 *
		 * Events:    beforeFade    Fires before the fade starts
		 *            afterFade     Fires after the fade ends
		 *
		 * @param id {string} Target object.id value
		 * @param ms {integer} Milliseconds for transition to take
		 * @param end {integer} [Optional] The final opacity value of the fade
		 * @returns {object} Target object
		 */
		fade : function(obj, ms, end) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if ((obj === undefined)
				    || (isNaN(ms))
				    || ((end !== undefined)
					&& (isNaN(end)))) {
					throw label.error.invalidArguments;
				}

				var start = obj.opacity();
				    end   = end || ((obj.opacity() === 0) ? 100 : 0);

				obj.fire("beforeFade");
				fx.opacityChange(obj, start, end, ms);
				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Simulates the Target falling to a position
		 *
		 * @param id {string} Target object.id value
		 * @param pos {int} The X co-ordinate to end the fall
		 * @param ms {int} Milliseconds for bounce to take
		 * @todo complete for v1.1.0
		 */
		fall : function (obj, pos, ms) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj === undefined) {
					throw label.error.invalidArguments;
				}

				obj.fire("beforeFall");

				var i     = null,
				    speed = Math.round(ms/100),
				    timer = 0;

				for (i = start; i >= end; i--) {
					if (i == end) {
						setTimeout("$(\"" + obj.id + "\").move(" + i + ");$(\"" + obj.id + "\").fire(\"afterFall\")", (timer*speed));
					}
					else {
						setTimeout("$(\"" + obj.id + "\").move(" + i + ")", (timer*speed));
					}
					timer++;
				}

				return o;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Moves an Object to a new position
		 *
		 * @param id {string} Target object.id value
		 * @param pos {array} An array of co-ordinates [X,Y]
		 */
		move : function (obj, pos) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if ((obj === undefined)
				    || (!pos instanceof Array)
				    || (isNaN(pos[0]))
				    || (isNaN(pos[1]))) {
					throw label.error.invalidArguments;
				}

				var p     = obj.position();
				    p[0] += pos[0];
				    p[1] += pos[1];

				(obj.style.position != "absolute") ? obj.style.position = "absolute" : void(0);

				obj.style.left     = p[0] + "px";
				obj.style.top      = p[1] + "px";

				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Changes an element's opacity to the supplied value
		 *
		 * @param obj {mixed} Instance of an object, or the target object.id value
		 * @param opacity {integer} The opacity value to set
		 * @returns {integer} The opacity value of the element
		 */
		opacity : function(obj, opacity) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj !== null) {
					if ((opacity !== undefined)
					    || (!isNaN(opacity))) {
						(client.ie) ? obj.style.filter = "alpha(opacity=" + opacity + ")" : obj.style.opacity = (parseInt(opacity)/100);
						return parseInt(opacity);
					}
					else {
						return (client.ie) ? parseInt(obj.style.filter.toString().replace(/(.*\=|\))/gi, "")) : parseInt(obj.style.opacity);
					}
				}
				else {
					return undefined;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Changes an object's opacity from the start value to the end value, transition speed is based on the ms argument
		 *
		 * @param id {string} Target object.id value
		 * @param start {integer} Opacity start value
		 * @param end {integer} Opacity end value
		 * @param ms {integer} Milliseconds for transition to take
		 */
		opacityChange : function(obj, start, end, ms) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj === undefined) {
					throw label.error.invalidArguments;
				}

				var fn    = null,
				    speed = Math.round(ms/100),
				    timer = 0,
				    i     = null;

				if (start > end) {
					for (i = start; i >= end; i--) {
						if (i == end) {
							setTimeout("$(\"" + obj.id + "\").opacity(" + i + ");$(\"" + obj.id + "\").fire(\"afterFade\")", (timer*speed));
						}
						else {
							setTimeout("$(\"" + obj.id + "\").opacity(" + i + ")", (timer*speed));
						}
						timer++;
					}
				}
				else {
					for (i = start; i <= end; i++) {
						if (i == end) {
							setTimeout("$(\"" + obj.id + "\").opacity(" + i + ");$(\"" + obj.id + "\").fire(\"afterFade\")", (timer*speed));
						}
						else {
							setTimeout("$(\"" + obj.id + "\").opacity(" + i + ")", (timer*speed));
						}
						timer++;
					}
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Slides an object to a position
		 *
		 * @param id {string} Target object.id value
		 * @param ms {integer} Milliseconds for transition to take
		 * @param pos {array} An array of co-ordinates [X,Y]
		 * @param elastic {integer} [Optional] The elastic force to apply when Target reaches destination [0-100]
		 * @todo complete for v1.1.0
		 */
		slide : function(obj, ms, pos, elastic) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if ((obj === undefined)
				    || (isNaN(ms))
				    || (!pos instanceof Array)
				    || (isNaN(pos[0]))
				    || (isNaN(pos[1]))) {
					throw label.error.invalidArguments;
				}

				elastic = elastic || 0;

				obj.fire("beforeSlide");
				obj.fire("afterSlide");

				return obj;
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
				return (((parseInt(arg) / 2).toString().indexOf(".")) > -1) ? false : true;
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
				return (((parseInt(arg) / 2).toString().indexOf(".")) > -1) ? true : false;
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
			expectedObject        : "Expected an Object.",
			invalidArguments      : "One or more arguments is invalid.",
			invalidDate           : "Invalid Date.",
			invalidFields         : "The following required fields are invalid: ",
			serverError           : "A server error has occurred."
		},

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
		 * Months
		 */
		months : {
			"1"  : "January",
			"2"  : "February",
			"3"  : "March",
			"4"  : "April",
			"5"  : "May",
			"6"  : "June",
			"7"  : "July",
			"8"  : "August",
			"9"  : "September",
			"10" : "October",
			"11" : "November",
			"12" : "December"
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
				var instance = null,
				           l = observer.listeners,
				           o = (obj.id !== undefined) ? obj.id : obj.toString();

				obj     = (typeof obj == "object") ? obj : $(obj);
				standby = ((standby !== undefined) && (standby === true)) ? true : false;

				if ((o === undefined)
				    || (event === undefined)
				    || (!fn instanceof Function)
				    || ((standby)
					&& (id === undefined))) {
					throw label.error.invalidArguments;
				}

				(l[o] === undefined) ? l[o] = [] : void(0);
				(l[o][event] === undefined) ? l[o][event] = [] : void(0);
				(l[o][event].active === undefined) ? l[o][event].active = [] : void(0);

				var item = {fn: fn};
				((scope !== undefined) && (scope !== null)) ? item.scope = scope : void(0);

				if (!standby) {
					(id !== undefined) ? l[o][event].active[id] = item : l[o][event].active.push(item);
					instance = (o !== "abaaso") ? $(o) : null;
					((instance !== null)
					 && (instance !== undefined)) ? ((instance.addEventListener !== undefined)
									 ? instance.addEventListener(event, function(){ instance.fire(event); }, false)
									 : instance.attachEvent("on" + event, function(){ instance.fire(event); })) : void(0);
				}
				else {
					(l[o][event].standby === undefined) ? l[o][event].standby = [] : void(0);
					l[o][event].standby[id] = item;
				}

				return obj;
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
				var l   = observer.listeners,
				    o   = (obj.id !== undefined) ? obj.id : obj.toString();
				    obj = (typeof obj == "object") ? obj : $(obj);

				if ((o === undefined)
				    || (o == "")
				    || (obj === undefined)
				    || (event === undefined)) {
					throw label.error.invalidArguments;
				}

				var listeners = (l[o] !== undefined) ? ((l[o][event] !== undefined)
									? ((l[o][event].active !== undefined)
									   ? l[o][event].active : []) : []) : [];

				for (var i in listeners) {
					if ((listeners[i] !== undefined)
					    && (listeners[i].fn)) {
						if (listeners[i].scope !== undefined) {
							var instance = $(listeners[i].scope),
							    fn       = listeners[i].fn,
							    scope    = (instance !== undefined) ? instance : listeners[i].scope;

							fn.call(scope);
						}
						else {
							listeners[i].fn();
						}
					}
				}

				return obj;
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
				if ((obj === undefined)
				    || (event === undefined)) {
					throw label.error.invalidArguments;
				}

				var l = observer.listeners,
				    o = (obj.id !== undefined) ? obj.id : obj.toString();

				return (l[o] !== undefined) ? ((l[o][event] !== undefined) ? l[o][event] : l[o]) : [];
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
				var instance = null,
				    o        = (obj.id !== undefined) ? obj.id : obj.toString(),
				    l        = observer.listeners;

				obj = (typeof obj == "object") ? obj : $(obj);

				if ((o === undefined)
				    || (event === undefined)
				    || (l[o] === undefined)
				    || (l[o][event] === undefined)) {
					return obj;
				}
				else {
					if (id === undefined) {
						delete l[o][event];
						instance = (o !== "abaaso") ? $(o) : null;
						((instance !== null)
						 && (instance !== undefined)) ? ((instance.removeEventListener)
										 ? instance.removeEventListener(event, function(){ instance.fire(event); }, false)
										 : instance.removeEvent("on" + event, function(){ instance.fire(event); })) : void(0);
					}
					else if (l[o][event].active[id] !== undefined) {
						delete l[o][event].active[id];
						((l[o][event].standby !== undefined)
						 && (l[o][event].standby[id] !== undefined)) ? delete l[o][event].standby[id] : void(0);
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
				var l = observer.listeners,
				    o = (obj.id !== undefined) ? obj.id : obj.toString();

				obj = (typeof obj == "object") ? obj : $(obj);

				if ((o === undefined)
				    || (event === undefined)
				    || (id === undefined)
				    || (sId === undefined)
				    || (l[o] === undefined)
				    || (l[o][event] === undefined)
				    || (l[o][event].active === undefined)
				    || (l[o][event].active[id] === undefined)) {
					throw label.error.invalidArguments;
				}

				(l[o][event].standby === undefined) ? l[o][event].standby = [] : void(0);

				if (typeof(listener) == "string")
				{
					if ((l[o][event].standby[listener] === undefined)
					    || (l[o][event].standby[listener].fn === undefined)) {
						throw label.error.invalidArguments;
					}
					else {
						listener = l[o][event].standby[listener].fn;
					}
				}
				else if (!listener instanceof Function) {
					throw label.error.invalidArguments;
				}

				l[o][event].standby[sId] = {"fn" : l[o][event].active[id].fn};
				l[o][event].active[id]   = {"fn" : listener};

				return obj;
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
		 * @param arg {string} Comma delimited string of target element.id values
		 * @returns {mixed} instances Instance or Array of Instances of elements
		 */
		$ : function(arg) {
			try {
				arg = (arg.toString().indexOf(",") > -1) ? arg.split(",") : arg;

				if (arg instanceof Array) {
					var instances = [],
					    i         = arg.length;

					while (i--) {
						instances.push($(arg[i]));
					}

					return instances;
				}

				var obj = document.getElementById(arg);
				obj = (obj === null) ? undefined : obj;

				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Error handling, with history in .events[]
		 *
		 * @param e {mixed} Error object or message to display.
		 */
		error : function(e) {
			var err = {name: ((typeof e == "object") ? e.name : "TypeError"), message: (typeof e == "object") ? e.message : e};
			(e.number !== undefined) ? (err.number = (e.number & 0xFFFF)) : void(0);
			((!client.ie)
			 && (console !== undefined)) ? console.error(err.message) : void(0);
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
				return id.replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
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
				if (obj === undefined) {
					throw label.error.invalidArguments;
				}

				if (obj.id != "") {
					return obj;
				}

				var id = "abaaso_" + Math.floor(Math.random() * 1000000000);
				obj.id = ($(id) === undefined) ?  id : id + Math.floor(Math.random() * 1000);

				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Renders a loading icon in a target element
		 *
		 * @param id {string} Target object.id value
		 */
		loading : function(id) {
			try {
				var obj = $(id);

				if (obj === undefined) {
					throw label.error.invalidArguments;
				}

				if (abaaso.loading.image === undefined) {
					abaaso.loading.image     = new Image();
					abaaso.loading.image.src = abaaso.loading.url;
				}

				obj.clear();
				abaaso.create("div", {id: id + "_loading", style: "text-align:center"}, id);
				abaaso.create("img", {alt: label.common.loading, src: abaaso.loading.image.src}, id + "_loading");
				return obj;
			}
			catch (e) {
				error(e);
				return undefined;
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
					throw label.error.invalidArguments;
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
						(obj[collection[i].name] = collection[i].fn);
					}
				}

				// Collection of methods to add to prototypes
				var methods = {
					array   : [
						{name: "contains", fn: function(arg) {
							return abaaso.array.contains(this, arg);
							}},
						{name: "index", fn: function(arg) {
							return abaaso.array.index(this, arg);
							}},
						{name: "remove", fn: function(arg) {
							return abaaso.array.remove(this, arg);
							}}
					],
					element : [
						{name: "bounce", fn: function(ms, height) {
							this.genID();
							abaaso.fx.bounce(this.id, ms, height);
							}},
						{name: "destroy", fn: function() {
							this.genID();
							abaaso.destroy(this.id);
							}},
						{name: "disable", fn: function() {
							this.genID();
							return abaaso.el.disable(this.id);
							}},
						{name: "domID", fn: function() {
							this.genID();
							return abaaso.domID(this.id);
							}},
						{name: "enable", fn: function() {
							this.genID();
							return abaaso.el.enable(this.id);
							}},
						{name: "get", fn: function(uri) {
							this.fire("beforeGet");
							var cached = cache.get(uri);
							if (!cached) {
								uri.toString().on("afterXHR", function() {
									var response = cache.get(uri, false).response;
									this.update({innerHTML: response, value: response});
									uri.toString().un("afterXHR", "get");
									this.fire("afterGet");
									}, "get", this);
								abaaso.get(uri);
							}
							else {
								(this.value !== undefined) ? this.update({value: response}) : this.update({innerHTML: response});
								this.fire("afterGet");
							}
							return this;
							}},
						{name: "fade", fn: function(arg) {
							abaaso.fx.fade(this.id, arg);
							}},
						{name: "fall", fn: function() {
							void(0);
							}},
						{name: "loading", fn: function() {
							this.genID();
							return abaaso.loading.create(this.id);
							}},
						{name: "move", fn: function(pos, ms) {
							this.genID();
							abaaso.fx.move(this, pos, ms);
							}},
						{name: "opacity", fn: function(arg) {
							return abaaso.fx.opacity(this, arg);
							}},
						{name: "position", fn: function() {
							this.genID();
							return abaaso.el.position(this.id);
							}},
						{name: "slide", fn: function(ms, pos, elastic) {
							this.genID();
							abaaso.fx.slide(this.id, ms, pos, elastic);
							}},
						{name: "update", fn: function(args) {
							this.genID();
							abaaso.update(this, args);
							}}
					],
					number  : [
						{name: "even", fn: function() {
							return abaaso.number.even(this);
							}},
						{name: "odd", fn: function() {
							return abaaso.number.odd(this);
							}}
					],
					shared  : [
						{name: "clear", fn: function() {
							((typeof this == "object")
							 && ((this.id === undefined)
							     || (this.id == ""))) ? this.genID() : void(0);
							(typeof this == "object") ? abaaso.clear(this) : (this.constructor = new String(""));
							return this;
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
						{name: "on", fn: function(event, listener, id, scope, standby) {
							scope = scope || this;
							((!this instanceof String)
								 && ((this.id === undefined)
								     || (this.id == ""))) ? this.genID() : void(0);
							return abaaso.on(this, event, listener, id, scope, standby);
							}},
						{name: "un", fn: function(event, id) {
							((!this instanceof String)
								 && ((this.id === undefined)
								     || (this.id == ""))) ? this.genID() : void(0);
							return abaaso.un(this, event, id);
							}}
					],
					string  : []
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
			try {
				switch (arg) {
					case true:
					case false:
						return arg;
					default:
						return false;
				}
			}
			catch (e) {
				error(e);
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
		// Properties
		id              : "abaaso",
		ready           : false,
		version         : "beta",

		// Methods
		$               : utility.$,
		clear           : el.clear,
		create          : el.create,
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
		init            : function() {
			abaaso.ready = true;

			utility.proto(Array.prototype, "array");
			utility.proto(Element.prototype, "element");
			(client.ie) ? utility.proto(HTMLDocument.prototype, "element") : void(0);
			utility.proto(Number.prototype, "number");
			utility.proto(String.prototype, "string");

			window.$        = function(arg) { return abaaso.$(arg); };
			window.onresize = function() { abaaso.fire("resize"); };

			if (!client.ie) {
				window.onload = function() { abaaso.fire("render").un("render"); };
			}

			abaaso.fire("ready").un("ready");

			delete abaaso.init;
			},
		listeners       : function() {
			var all   = (arguments[1] !== undefined) ? true : false;
			var obj   = (all) ? arguments[0] : abaaso,
			    event = (all) ? arguments[1] : arguments[0];

			return abaaso.observer.list(obj, event);
			},
		position        : el.position,
		post            : client.post,
		put             : client.put,
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
		un              : function() {
			var all   = (typeof arguments[0] == "string") ? false : true;
			var obj   = (all) ? arguments[0] : abaaso,
			    event = (all) ? arguments[1] : arguments[0],
			    id    = (all) ? arguments[2] : arguments[1];

			return abaaso.observer.remove(obj, event, id);
			},
		update          : el.update,

		// Classes
		array           : array,
		calendar        : calendar,
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
			put     : client.put
			},
		el              : el,
		fx              : {
			bounce  : fx.bounce,
			fade    : fx.fade,
			fall    : fx.fall,
			move    : fx.move,
			opacity : fx.opacity,
			slide   : fx.slide
			},
		json            : json,
		label           : label,
		loading         : {
			create  : utility.loading,
			url     : null
			},
		number          : number,
		observer        : {
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
		validate        : validate
	};
}();

// Registering events
try {
	if ((abaaso.client.chrome) || (abaaso.client.firefox) || (abaaso.client.safari)) {
		window.addEventListener("DOMContentLoaded", function(){
			abaaso.init();
		}, false);
	}
	else {
		// @todo Refactor for v1.0.0
		abaaso.ready = setInterval(function(){
			if (document.getElementById) {
				clearInterval(abaaso.ready);
				abaaso.init();
				abaaso.fire("render").un("render");
			}}, 250);
	}
}
catch (e) {
	abaaso.error(e);
}
