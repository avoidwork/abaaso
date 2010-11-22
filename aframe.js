/**
 * aFrame
 *
 * "An A-frame is a basic structure designed to bear a load in a lightweight economical manner."
 *
 * aFrame provides a set of classes and object prototyping to ease the creation and maintenance of RESTful JavaScript web applications.
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright Copyright (c) 2010, avoidwork inc.
 * @license http://en.wikipedia.org/wiki/BSD_licenses#3-clause_license_.28.22New_BSD_License.22.29
 * @link http://avoidwork.com/products/aframe aFrame
 * @version Alpha
 */

/**
 * aFrame JavaScript framework
 *
 * @class
 * @namespace
 */
var aFrame = function(){
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
		 * @TODO make this accept comma delimited args
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
				var remaining = instance.slice((end || start)+1 || instance.length);
				instance.length = (start < 0) ? (instance.length + start) : start;
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
	 * Override aFrame.calendar.date.pattern to change the localized pattern from ISO 8601
	 *
	 * @class
	 * @todo finish refactoring the date picker, it's broken right now
	 */
	var calendar = {
		/**
		 * Tracking object used to render the calendar
		 */
		date : {
			c           : new Date(),
			clear       : null,
			d           : null,
			destination : null,
			label       : null,
			n           : new Date(),
			p           : new Date(),
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

				var args = {id: "aFrame_calendar", opacity: 0},
				    o    = calendar.date;

				o.clear       = ((destination !== undefined) && (clear === undefined)) ? false : validate.bool(clear);
				o.destination = ((destination !== undefined) && ($(destination))) ? destination : null;
				o.c           = ((destination !== undefined) && ($(destination).value != "")) ? new Date($(destination).value) : o.c;

				$(target).blur();
				((destination !== undefined) && ($(destination).value == "Invalid Date"))? $(destination).clear() : void(0);
				($("aFrame_calendar")) ? el.destroy("aFrame_calendar") : void(0);

				if (destination !== undefined) {
					var pos = el.position(destination);
					args.style = "top:"+pos[1]+"px;left:"+pos[0]+"px;";
					el.create("div", args);
				}
				else {
					el.create("div", args, target);
				}

				if (calendar.render("aFrame_calendar", o.c)) {
					fx.opacityShift("aFrame_calendar", 300);
				}
				else {
					$("aFrame_calendar").destroy();
					throw label.error.elementNotCreated;
				}
			}
			catch(e) {
				error(e);
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
					    args = {id: "href_day_" + dateStamp.getDate(), innerHTML: dateStamp.getDate()};

					args.class = ((dateStamp.getDate() == o.getDate())
						      && (dateStamp.getMonth() == o.getMonth())
						      && (dateStamp.getFullYear() == o.getFullYear())) ? "current" : "weekend";

					el.create("div", {id: "div_day_" + dateStamp.getDate(), class: "day"}, target);
					el.create("a", args, "div_day_" + dateStamp.getDate());

					if (calendar.date.destination !== null) {
						aFrame.un("href_day_" + dateStamp.getDate(), "click");
						aFrame.on("href_day_" + dateStamp.getDate(), "click", function() {
							var date = new Date(aFrame.calendar.date.current),
							    day  = this.innerHTML.match(/^\d{1,2}$/);

							date.setDate(day[0]);
							aFrame.calendar.date.c = date;
							($(aFrame.calendar.date.destination)) ? $(aFrame.calendar.date.destination).update(aFrame.calendar.output(date)) : void(0);
							aFrame.destroy("aFrame_calendar");
							}, "href_day_" + dateStamp.getDate());
					}
				}
				else {
					el.create("div", {class: "day"}, target);
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
		 * Returns a  Date object as a string formatted as date.pattern
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
		 * @param target {string} Target object.id value
		 * @param dateStamp {mixed} Date to work with
		 */
		render : function(target, dateStamp) {
			try {
				if ($(target)) {
					$(target).clear();

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
						aFrame.un("calendarClear", "click");
						aFrame.on("calendarClear", "click", function() {
							((aFrame.calendar.date.destination != null)
							  && $(aFrame.calendar.date.destination)) ? $(aFrame.calendar.date.destination).clear() : void(0);
							aFrame.destroy("aFrame_calendar");
							});
					}

					el.create("a", {id: "calendarClose", innerHTML: label.common.close}, "calendarTop");
					aFrame.un("calendarClose", "click");
					aFrame.on("calendarClose", "click", function() {
						aFrame.destroy("aFrame_calendar");
						});

					el.create("div", {id: "calendarHeader"}, target);

					el.create("a", {id: "calendarPrev", innerHTML: "&lt;"}, "calendarHeader");
					aFrame.un("calendarPrev", "click");
					aFrame.on("calendarPrev", "click", function() {
						aFrame.calendar.render("aFrame_calendar", aFrame.calendar.date.p);
						});

					el.create("span", {id: "calendarMonth", innerHTML: o.label+" "+dateStamp.getFullYear().toString()}, "calendarHeader");

					el.create("a", {id: "calendarNext", innerHTML: "&gt;"}, "calendarHeader");
					aFrame.un("calendarNext", "click");
					aFrame.on("calendarNext", "click", function() {
						aFrame.calendar.render("aFrame_calendar", aFrame.calendar.date.n);
						});

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
				if ((this.chrome) || (this.safari)) { return true; }
				if ((this.firefox) && (this.version > 4)) { return true; }
				if ((this.ie) && (this.version > 8)) { return true; }
				if ((this.opera) && (this.version > 8)) { return true; }
				return false;}),
		chrome	: (navigator.userAgent.toLowerCase().indexOf("chrom") > -1) ? true : false,
		firefox : (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) ? true : false,
		ie	: (navigator.userAgent.toLowerCase().indexOf("msie") > -1) ? true : false,
		ms	: 0,
		opera	: (navigator.userAgent.toLowerCase().indexOf("opera") > -1) ? true : false,
		safari	: (navigator.userAgent.toLowerCase().indexOf("safari") > -1) ? true : false,
		version	: (navigator.userAgent.toLowerCase().indexOf("msie") > -1) ? parseInt(navigator.userAgent.replace(/(.*MSIE|;.*)/gi, "")) : parseInt(navigator.appVersion),

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
		 * Creates an xmlHttp request to a URI
		 *
		 * @param uri {string} The resource to interact with.
		 * @param handler {function} A handler function to execute when an appropriate  response been received.
		 * @param type {string} The type of request.
		 * @param args {mixed} Data to append to the HTTP request.
		 * @todo detect if the URI doesn't match the domain/origin, and add to the head tag if that's the case instead of XMLHttpRequest!
		 */
		request : function(uri, handler, type, args) {
			var xmlHttp = false;

			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
			}
			else if (window.ActiveXObject) {
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch (e1) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch (e2) {
						error(e2);
					}
				}
			}

			try {
				switch(type.toLowerCase()) {
					case "delete":
					case "get":
						xmlHttp.onreadystatechange = function() { client.response(xmlHttp, uri, handler); };
						(type.toLowerCase() == "delete") ? xmlHttp.open("DELETE", uri, true) : xmlHttp.open("GET", uri, true);
						xmlHttp.send(null);
						break;
					case "post":
					case "put":
						xmlHttp.onreadystatechange = function() { client.response(xmlHttp, uri, handler); };
						(type.toLowerCase() == "post") ? xmlHttp.open("POST", uri, true) : xmlHttp.open("PUT", uri, true);
						(xmlHttp.overrideMimeType) ? xmlHttp.overrideMimeType("text/html") : void(0);
						xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						xmlHttp.setRequestHeader("Content-length", args.length);
						xmlHttp.setRequestHeader("Connection", "close");
						xmlHttp.send(args);
						break;
				}
			}
			catch(e3) {
				error(e3);
			}
		},

		/**
		 * Receives and caches the URI response
		 *
		 * Headers are cached, if an expiration is set it will be used to control the local cache
		 *
		 * @param xmlHttp {object} XMLHttp object
		 * @param uri {string} The URI.value to cache
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		response : function(xmlHttp, uri, handler) {
			try {
				if (xmlHttp.readyState == 2) {
					var headers = xmlHttp.getAllResponseHeaders().split("\n"),
					    i       = null,
					    loop    = headers.length,
					    items   = {};

					for (i = 0; i < loop; i++) {
						if (headers[i] != "") {
							var header    = new String(headers[i]),
							    value     = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");
							header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
							items[header] = value;
						}
					}

					cache.set(uri, "headers", items);
				}
				else if (xmlHttp.readyState == 4) {
					if (((xmlHttp.status == 200)
					     || (xmlHttp.status == 201)
					     || (xmlHttp.status == 204))
					    && (typeof xmlHttp.responseText != "")) {
						if (xmlHttp.status == 200) {
							cache.set(uri, "epoch", new Date());
							cache.set(uri, "response", xmlHttp.responseText);
						}

						uri = cache.get(uri, false);
						handler(uri);
					}
					else {
						throw label.error.serverError;
					}
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Renders a loading icon in a target element
		 *
		 * @param id {string} Target object.id value
		 */
		spinner : function(id) {
			try {
				if (!window["aFrame_spinner"]) {
					window["aFrame_spinner"] = new Image();
					window["aFrame_spinner"].src = aFrame.spinner_url;
				}

				if (!$(id + "_" + label.common.loading.toLocaleLowerCase())) {
					el.create("img", {
						alt: label.common.loading,
						id: id + "_" + label.common.loading.toLocaleLowerCase(),
						src: window["aFrame_spinner"].src,
						class: "spinner"
						}, id);
				}
			}
			catch (e) {
				error(e);
			}
		}
	};

	/**
	 * Database methods
	 *
	 * @class
	 */
	var database = {
		/**
		 * Creates a local database if the client supports this feature
		 *
		 * @param id {string} The id of the database to create.
		 * @param version {string} The version of the database to create.
		 * @param name {string} The name of the database to create.
		 * @param size {integer} The size of the database to create in bytes.
		 * @returns {object} A local database,
		 */
		create : function(id, version, name, size) {
			try {
				if (window.openDatabase) {
					var db = (size === undefined) ? window.openDatabase(id, version, name) : window.openDatabase(id, version, name, size);

					if (db) {
						return db;
					}

					throw label.error.databaseNotOpen;
				}
				else {
					throw label.error.databaseNotSupported;
				}
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Destroys the local database
		 *
		 * @param arg {string} The database.id to destroy
		 */
		destroy : function(arg) {
			el.destroy(arg);
		},

		/**
		 * Opens a local database
		 *
		 * @param arg {string} The database.id to open
		 * @returns {object} The database
		 * @todo implement this
		 */
		open : function(arg) {
			void(0);
		},

		/**
		 * Executes a query in a transaction with exception handling
		 *
		 * @param db {string} The local database to run the query against
		 * @param arg {string} The query to run
		 * @param handler {mixed} The transaction handler referenced in arg
		 */
		query : function(db, arg, handler) {
			try {
				if (arg.indexOf("?") == -1) {
					throw label.error.databaseWarnInjection;
				}

				if (db) {
					db.transaction(function(handler) {
						handler.executeSql(arg);
					});
				}
				else {
					throw label.error.databaseNotOpen;
				}
			}
			catch (e) {
				error(e);
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
		 * @param id {string} Target object.id value
		 */
		clear : function(id) {
			try {
				if ($(id)) {
					switch (typeof $(id)) {
						case "form":
							$(id).reset();
							break;
						default:
							$(id).update({innerHTML: ""});
							break;
					}
				}
				else {
					throw label.error.elementNotFound;
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Creates an element in document.body or a target element
		 *
		 * @param type {string} Type of element to create
		 * @param args {object} Collection of properties to apply to the new element
		 * @param id {string} [Optional] Target id value to add element to
		 */
		create : function(type, args, id) {
			try {
				if (args instanceof Object) {
					var obj = document.createElement(type);
					el.update(obj, args);
					($(id)) ? $(id).appendChild(obj) : document.body.appendChild(obj);
				}
				else {
					throw label.error.expectedObject;
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Destroys an element
		 *
		 * @param arg {string} Comma delimited string of target element.id values
		 */
		destroy : function(arg) {
			try {
				var args = arg.split(","),
				       i = args.length;

				while (i--) {
					var instance = $(args[i]);
					((instance !== undefined) && (instance != null)) ? instance.parentNode.removeChild(instance) : void(0);
				}
			}
			catch(e) {
				error(e);
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
		position : function(id) {
			var left = null,
			     top = null,
			     obj = $(id);

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
		 * @param obj {mixed} An instance of an object, or a target object.id value
		 * @param args {object} A collection of properties
		 */
		update : function(obj, args) {
			try {
				if (!args instanceof Object) {
					throw label.error.expectedObject;
				}

				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj) {
					for (var i in args) {
						switch(i) {
							case "class":
								((client.ie) && (client.version < 8)) ? obj.setAttribute("className", args[i]) : obj.setAttribute("class", args[i]);
								break;
							case "innerHTML":
							case "type":
							case "src":
								obj[i] = args[i];
								break;
							case "opacity":
								obj.opacity(args[i]);
								break;
							default:
								obj.setAttribute(i, args[i]);
								break;
						}
					}
				}
				else {
					throw label.error.elementNotFound;
				}
			}
			catch (e) {
				error(e);
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
		 * Changes an element's opacity to the supplied value
		 *
		 * @param obj {mixed} Instance of an object, or the target object.id value
		 * @param opacity {integer} The opacity value to set
		 * @returns {integer} The opacity value of the element
		 */
		opacity : function(obj, opacity) {
			try {
				obj = (typeof obj == "object") ? obj : $(obj);

				if (obj !== undefined) {
					if (opacity !== undefined) {
						(client.ie) ? obj.style.filter = "alpha(opacity=" + opacity + ")" : obj.style.opacity = (opacity/100);
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
		opacityChange : function(id, start, end, ms) {
			try {
				var fn    = null,
				    speed = Math.round(ms/100),
				    timer = 0,
				    i     = null;

				if (start > end) {
					for (i = start; i >= end; i--) {
						setTimeout("$(\"" + id + "\").opacity(" + i + ")", (timer*speed));
						timer++;
					}
				}
				else {
					for (i = start; i <= end; i++) {
						setTimeout("$(\"" + id + "\").opacity(" + i + ")", (timer*speed));
						timer++;
					}
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Shifts an object's opacity, transition speed is based on the ms argument
		 *
		 * @param id {string} Target object.id value
		 * @param ms {integer} Milliseconds for transition to take
		 */
		opacityShift : function(id, ms) {
			($(id).opacity() === 0) ? this.opacityChange(id, 0, 100, ms) : this.opacityChange(id, 100, 0, ms);
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
	 * Overload this with another language pack
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
			gen     : "Generate",
			loading : "Loading",
			next    : "Next",
			login   : "Login",
			ran     : "Random",
			save    : "Save",
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
		 * Adds a listener to an object
		 *
		 * @param obj {string} The object firing the event
		 * @param event {string} The event being fired
		 * @param listener {function} The event listener
		 * @param scope {string} [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param id {string} [Optional / Recommended] The id for the listener
		 * @todo Implement eventListenerList when it's supported to clean up the registration with the DOM
		 */
		add : function(obj, event, listener, scope, id) {
			try {
				if ((obj === undefined)
				    || (event === undefined)
				    || (listener === undefined)
				    || (!listener instanceof Function)) {
					throw label.error.invalidArguments;
				}

				var item = {};
				item.fn  = listener;
				(scope !== undefined) ? item.scope = scope : void(0);

				(observer.listeners[obj] === undefined) ? observer.listeners[obj] = [] : void(0);
				(observer.listeners[obj][event] === undefined) ? observer.listeners[obj][event] = [] : void(0);
				(observer.listeners[obj][event]["active"] === undefined) ? observer.listeners[obj][event]["active"] = [] : void(0);

				(id !== undefined) ?
				 observer.listeners[obj][event]["active"][id] = item :
				 observer.listeners[obj][event]["active"].push(item);

				($(obj)) ? (($(obj).addEventListener) ?
					    $(obj).addEventListener(event, function(){ aFrame.fire(obj, event); }, false) :
					    $(obj).attachEvent("on" + event, function(){ aFrame.fire(obj, event); }))
				 : void(0);
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Fires an event
		 *
		 * @param obj {string} The object firing the event
		 * @param event {string} The event being fired
		 */
		fire : function(obj, event) {
			try {
				if ((obj === undefined)
				    || (event === undefined)) {
					throw label.error.invalidArguments;
				}

				var listeners = (observer.listeners[obj] !== undefined) ?
					((observer.listeners[obj][event] !== undefined) ?
					 ((observer.listeners[obj][event]["active"] !== undefined) ?
					  observer.listeners[obj][event]["active"] : []) : []) : [];

				for (var i in listeners) {
					if (listeners[i].fn) {
						if (listeners[i].scope !== undefined) {
							var scope = ($(listeners[i].scope)) ? $(listeners[i].scope) : listeners[i].scope,
							    fn    = listeners[i]["fn"];
							fn.call(scope);
						}
						else {
							listeners[i]["fn"]();
						}
					}
				}
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Lists the active and standby listeners for an object event
		 *
		 * @param obj {string} The object firing the event
		 * @param event {string} The event being fired
		 */
		list : function(obj, event) {
			try {
				if ((obj === undefined)
				    || (event === undefined)) {
					throw label.error.invalidArguments;
				}

				return (observer.listeners[obj] !== undefined) ? ((observer.listeners[obj][event] !== undefined) ? observer.listeners[obj][event] : []) : [];
			}
			catch (e) {
				error(e);
				return undefined;
			}
		},

		/**
		 * Removes an event listener, or listeners
		 *
		 * @param obj {string} The object firing the event
		 * @param event {string} The event being fired
		 * @param id {string} [Optional] The identifier for the listener
		 */
		remove : function(obj, event, id) {
			try {
				if ((obj === undefined)
				    || (event === undefined)
				    || (observer.listeners[obj] === undefined)
				    || (observer.listeners[obj][event] === undefined)) {
					return;
				}
				else {
					if (id === undefined) {
						delete observer.listeners[obj][event];
					}
					else if ((id !== undefined)
						 && (typeof id == String)
						 && (observer.listeners[obj][event][id] !== undefined)) {
						delete observer.listeners[obj][event][id];
					}
				}
			}
			catch (e) {
				error (e);
			}
		},

		/**
		 * Replaces an active listener, moving it to the standby collection
		 *
		 * @param obj {string} The object firing the event
		 * @param event {string} The event
		 * @param id {string} The identifier for the active listener
		 * @param sId {string} The identifier for the new standby listener
		 * @param listener {mixed} The standby id (string), or the new event listener (function)
		 */
		replace : function(obj, event, id, sId, listener) {
			try {
				if ((obj === undefined)
				    || (event === undefined)
				    || (id === undefined)
				    || (sId === undefined)
				    || (observer.listeners[obj] === undefined)
				    || (observer.listeners[obj][event] === undefined)
				    || (observer.listeners[obj][event]["active"] === undefined)
				    || (observer.listeners[obj][event]["active"][id] === undefined)) {
					throw label.error.invalidArguments;
				}

				(observer.listeners[obj][event]["standby"] === undefined) ? observer.listeners[obj][event]["standby"] = [] : void(0);

				if (typeof(listener) == "string")
				{
					if ((observer.listeners[obj][event]["standby"][listener] === undefined)
					    || (observer.listeners[obj][event]["standby"][listener]["fn"] === undefined)) {
						throw label.error.invalidArguments;
					}
					else {
						listener = observer.listeners[obj][event]["standby"][listener]["fn"];
					}
				}
				else if (!listener instanceof Function) {
					throw label.error.invalidArguments;
				}

				observer.listeners[obj][event]["standby"][sId] = {"fn" : observer.listeners[obj][event]["active"][id]["fn"]};
				observer.listeners[obj][event]["active"][id]   = {"fn" : listener};
			}
			catch (e) {
				error(e);
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
				arg = new String(arg);
				arg = (arg.indexOf(",") > -1) ? arg.split(",") : arg;

				if (arg instanceof Array) {
					var instances = [],
					    i         = arg.length;

					while (i--) {
						instances.push($(arg[i]));
					}

					return instances;
				}

				return document.getElementById(arg);
			}
			catch (e) {
				error(e);
				return undefined;
			}
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
		 * Error handling
		 *
		 * @param e {mixed} Error object or message to display.
		 */
		error : function(e) {
			var err = new Error(e);
			((client.ie) || (console === undefined)) ? alert(err.description) : console.error(err);
			(error.events === undefined) ? error.events = [] : void(0);
			error.events.push(err);
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
			domain : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/,
			ip     : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
			email  : /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/,
			number : /^(\d+)$/,
			phone  : /^(([0-9]{1})*[- .(]*([0-9a-zA-Z]{3})*[- .)]*[0-9a-zA-Z]{3}[- .]*[0-9a-zA-Z]{4})+$/,
			string : /^(\w+)$/
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
						case "domainip":
							if ((!value.test(validate.pattern.domain))
							    || (!value.test(validate.pattern.ip))) {
								invalid.push(i);
								exception = true;
							}
							break;
						default:
							var pattern = (validate.pattern[args[i]]) ? validate.pattern[args[i]] : args[i];
							if (!value.test(pattern)) {
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

	/**
	 * Declaring private global instances
	 */
	var $     = utility.$,
	    error = utility.error;

	/**
	 * Returned to the client
	 *
	 * @constructor
	 */
	return {
		/**
		 * Properties
		 */
		ready		: false,

		/**
		 * Methods
		 */
		$		: utility.$,
		clear		: el.clear,
		create		: el.create,
		del		: client.del,
		destroy		: el.destroy,
		domID		: utility.domID,
		error		: utility.error,
		fire		: observer.fire,
		get		: client.get,
		position	: el.position,
		post		: client.post,
		put		: client.put,
		on		: observer.add,
		un		: observer.remove,
		update		: el.update,

		/**
		 * Classes
		 */
		array		: array,
		calendar	: calendar,
		client		: {
			// Properties
			css3	: client.css3,
			chrome	: client.chrome,
			firefox : client.firefox,
			ie	: client.ie,
			ms	: client.ms,
			opera	: client.opera,
			safari	: client.safari,
			version	: client.version,
			// Methods
			del	: client.del,
			get	: client.get,
			post	: client.post,
			put	: client.put
		},
		database	: database,
		el		: el,
		listener	: {
			add	: observer.add,
			list	: observer.list,
			remove	: observer.remove,
			replace	: observer.replace
		},
		fx		: fx,
		json		: json,
		label		: label,
		number		: number,
		spinner		: {
			create	: client.spinner,
			url	: null
		},
		validate	: validate
	};
}();

/**
 * Declaring a global helper
 */
var $ = function(arg) {
	return aFrame.$(arg);
};

/**
 * Prototyping standard objects with aFrame
 */
Array.prototype.contains = function(arg) {
	aFrame.array.contains(this, arg);
};

Array.prototype.index = function(arg) {
	aFrame.array.index(this, arg);
};

Array.prototype.remove = function(arg) {
	aFrame.array.remove(this, arg);
};

Element.prototype.destroy = function() {
	aFrame.destroy(this.id);
};

Element.prototype.domID = function() {
	return aFrame.domID(this.id);
};

Element.prototype.get = function(arg) {
	aFrame.get(arg, function() {
		aFrame.update(this.id, {innerHTML: arguments[0]});
	});
};

Element.prototype.opacity = function(arg) {
	return aFrame.fx.opacity(this, arg);
};

Element.prototype.opacityShift = function(arg) {
	aFrame.fx.opacityShift(this.id, arg);
};

Element.prototype.clear = function() {
	aFrame.clear(this.id);
};

Element.prototype.update = function(args) {
	aFrame.update(this.id, args);
};

Number.prototype.even = function() {
	return aFrame.number.even(this);
};

Number.prototype.odd = function() {
	return aFrame.number.odd(this);
};

String.prototype.domID = function() {
	return aFrame.domID(this);
};

/**
 * Firing the ready event
 */
if ((aFrame.client.chrome) || (aFrame.client.firefox)) {
	window.addEventListener("DOMContentLoaded", function(){
		aFrame.ready = true;
		aFrame.fire("aFrame", "ready");
		aFrame.un("aFrame", "ready");
	}, false);
}
else if (aFrame.client.safari) {
	aFrame.ready = setInterval(function(){
		if (/loaded|complete/.test(document.readyState)) {
			clearInterval(aFrame.ready);
			aFrame.ready = true;
			aFrame.fire("aFrame", "ready");
			aFrame.un("aFrame", "ready");
		}}, 10);
}
else {
	window.onload = function() {
		aFrame.ready = setInterval(function(){
			if (!aFrame.ready) {
				if (document.getElementById) {
					clearInterval(aFrame.ready);
					aFrame.ready = true;
					aFrame.fire("aFrame", "ready");
					aFrame.un("aFrame", "ready");
				}
			}}, 10);
	}
}
