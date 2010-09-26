/**
 * Copyright (c) 2010, avoidwork inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 	* Redistributions of source code must retain the above copyright
 * 	  notice, this list of conditions and the following disclaimer.
 * 	* Redistributions in binary form must reproduce the above copyright
 * 	  notice, this list of conditions and the following disclaimer in the
 * 	  documentation and/or other materials provided with the distribution.
 * 	* Neither the name of avoidwork inc. nor the
 * 	  names of its contributors may be used to endorse or promote products
 * 	  derived from this software without specific prior written permission.
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
 * aFrame <http://avoidwork.com/aFrame>
 *
 * "An A-frame is a basic structure designed to bear a load in a lightweight economical manner."
 * aFrame provides a set of classes and object prototyping to ease the creation and maintenance of pure JavaScript web applications.
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version Alpha
 */
var aFrame = function() {
	/**
	 * RESTful AJAX methods
	 *
	 * @class
	 */
	var ajax = {
		/**
		 * Sends a DELETE to the URI
		 *
		 * @param uri {string} URI to submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		del : function(uri, handler) {
			client.request(uri, handler, "DELETE");
		},

		/**
		 * Sends a GET to the URI
		 *
		 * @param uri {string} URI to submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		get : function(uri, handler) {
			var response = cache.get(uri);
			(!response) ? client.request(uri, handler, "GET") : handler(response);
		},

		/**
		 * Sends a PUT to the URI
		 *
		 * @param uri {string} URI submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 * @param {args} PUT variables to include
		 */
		put : function(uri, handler, args) {
			client.request(uri, handler, "PUT", args);
		},

		/**
		 * Sends a POST to the URI
		 *
		 * @param uri {string} URI submit to
		 * @param handler {function} A handler function to execute once a response has been received
		 * @param {args} POST variables to include
		 */
		post : function(uri, handler, args) {
			client.request(uri, handler, "POST", args);
		}
	};

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
					var indexes = [];
					var i = args.length;

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
			}
		},

		/**
		 * Iterates an Array and executes a handler on each key
		 *
		 * @param instance {array} The array to iterate
		 * @param handler {function} The function to perform on each key
		 */
		execute : function(instance, handler) {
			try {
				if (!instance instanceof Array) {
					throw label.error.expectedArray;
				}

				var i = this.instance.length;

				while (i--) {
					handler(instance[i]);
				}
			}
			catch (e) {
				error(e);
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
				var remaining = instance.slice((end || start)+1 || instance.length);
				instance.length = (start < 0) ? (instance.length + start) : start;
				return instance.push.apply(instance, remaining);
			}
			catch (e) {
				error(e);
			}
		}
	};

	/**
	 * RESTful properties and methods
	 *
	 * @class
	 * @todo determine if this can be done with an associative Array better
	 */
	var cache = {
		/**
		 * Array of responses
		 * @private
		 */
		items : [],

		/**
		 * Default timeout (0 = infinity)
		 */
		ms : 0,

		/**
		 * Returns the cached response from the URI or false
		 *
		 * @param arg {string} The URI/Identifier for the resource to retrieve from cache
		 * @returns {mixed} Returns the URI response as a string or false
		 */
		get : function(arg) {
			var i = this.items.length;

			while (i--) {
				if ((this.items[i].uri == arg) && ((pub.ms === 0) || ((new Date() - this.items[i].timestamp) < pub.ms))) {
					return this.items[i].response;
				}
			}

			return false;
		},

		/**
		 * Commits, or updates an item in cache.items
		 *
		 * @param uri {string} The URI to set or update
		 * @param response {string} The URI response
		 */
		set : function(uri, response) {
			var i = this.items.length;

			while (i--) {
				if (this.items[i].uri == uri) {
					this.items[i].response = response;
					this.items[i].timestamp = new Date();
					return;
				}
			}

			this.items.push({uri:uri, response:response, timestamp:new Date()});
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
		 * Used to render the calendar
		 */
		date : {
			current : new Date(),
			previous : new Date(),
			next : new Date(),
			clear : null,
			days : null,
			destination : null,
			label : null,
			pattern : "yyyy/mm/dd"
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
				if ((!$(target)) || ((destination !== undefined) && (!$(destination)))) {
					throw label.error.elementNotFound;
				}

				var args = [
					["id", "aFrame_calendar"],
					["opacity", 0]
				];

				this.date.clear = ((destination !== undefined) && (clear === undefined)) ? false : validate.bool(clear);
				this.date.destination = ((destination !== undefined) && ($(destination))) ? destination : null;
				this.date.current = ((destination !== undefined) && ($(destination).value != "")) ? new Date($(destination).value) : this.date.current;

				$(target).blur();
				((destination !== undefined) && ($(destination).value == "Invalid Date"))? $(destination).clear() : void(0);
				($("aFrame_calendar")) ? el.destroy("aFrame_calendar") : void(0);

				if (destination !== undefined) {
					var pos = el.position(destination);
					args.push(["style","top:"+pos[1]+"px;left:"+pos[0]+"px;"]);
					el.create("div", args);
				}
				else {
					el.create("div", args, target);
				}

				if (this.render("aFrame_calendar", this.date.current)) {
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
			dateStamp = (dateStamp != null) ? new Date(dateStamp) : null;

			if ((dateStamp != null) && (!isNaN(dateStamp.getYear()))) {
				var args=[
					["id","href_day_" + dateStamp.getDate()],
					["innerHTML", dateStamp.getDate()]
				];

				if (this.date.destination !== undefined) {
					args.push(["listener", "click", function(e) {
						var scope = window.aFrame;
						scope.update.call(scope.calendar, scope.calendar.date.destination, 'the value here');
						scope.destroy("aFrame_calendar");
					}]);
				}

				if ((dateStamp.getDate() == this.date.current.getDate()) && (dateStamp.getMonth() == this.date.current.getMonth()) && (dateStamp.getFullYear() == this.date.current.getFullYear())) {
					args.push(["class", "current"]);
				}
				else if ((dateStamp.getDay() === 0) || (dateStamp.getDay() == 6)) {
					args.push(["class", "weekend"]);
				}

				el.create("div", [
					["id","div_day_" + dateStamp.getDate()],
					["class","day"]
				], target);

				el.create("a", args, "div_day_" + dateStamp.getDate());
			}
			else {
				el.create("div", [["class","day"]], target);
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
			return (32 - new Date(year, month, 32).getDate());
		},

		/**
		 * Returns a  Date object as a string formatted as date.pattern
		 *
		 * @param dateStamp {object} Date object to return as a string
		 * @returns {string} Date object value in the date.pattern format
		 */
		format : function(dateStamp) {
			var output = calendar.date.pattern;
			var outputDate = new Date(dateStamp);

			output = output.replace(/dd/,outputDate.getDate());
			output = output.replace(/mm/,outputDate.getMonth()+1);
			output = output.replace(/yyyy/,outputDate.getFullYear());

			return output;
		},

		/**
		 * Renders the calendar in the target element
		 *
		 * @param target {string} Target object.id value
		 * @param dateStamp {mixed} Date to work with
		 */
		render : function(target, dateStamp) {
			if ($(target)) {
				$(target).clear();

				this.date.current = new Date(dateStamp);
				this.date.previous = new Date(dateStamp);
				this.date.next = new Date(dateStamp);
				this.date.days = this.days(this.date.current.getMonth(), this.date.current.getFullYear());

				switch (this.date.current.getMonth())
				{
					case 0:
						this.date.previous.setMonth(11);
						this.date.previous.setFullYear(this.date.current.getFullYear()-1);
						this.date.next.setMonth(this.date.current.getMonth()+1);
						this.date.next.setFullYear(this.date.current.getFullYear());
						break;
					case 10:
						this.date.previous.setMonth(this.date.current.getMonth()-1);
						this.date.previous.setFullYear(this.date.current.getFullYear());
						this.date.next.setMonth(this.date.current.getMonth()+1);
						this.date.next.setFullYear(this.date.current.getFullYear());
						break;
					case 11:
						this.date.previous.setMonth(this.date.current.getMonth()-1);
						this.date.previous.setFullYear(this.date.current.getFullYear());
						this.date.next.setMonth(0);
						this.date.next.setFullYear(this.date.current.getFullYear()+1);
						break;
					default:
						this.date.previous.setMonth(this.date.current.getMonth()-1);
						this.date.previous.setFullYear(this.date.current.getFullYear());
						this.date.next.setMonth(this.date.current.getMonth()+1);
						this.date.next.setFullYear(this.date.current.getFullYear());
						break;
				}

				this.date.label = label.months[(this.date.current.getMonth()+1).toString()];

				el.create("div", [["id", "calendarTop"]], target);

				if (this.date.clear) {
					el.create("a", [
						["id", "calendarClear"],
						["innerHTML", label.common.clear],
						["listener", "click", function(e) {
							var scope=window.aFrame;
							(scope.calendar.date.destination!="")?scope.el.clear(scope.calendar.date.destination):void(0);
							scope.el.destroy("aFrame_calendar");
							}]
					], "calendarTop");
				}

				el.create("a", [
					["id", "calendarClose"],
					["innerHTML", label.common.close],
					["listener", "click", function(e) {
						window.aFrame.destroy("aFrame_calendar");
						}]
				], "calendarTop");

				el.create("div", [
					["id", "calendarHeader"]
				], target);

				el.create("a", [
					["id", "calendarPrev"],
					["innerHTML", "&lt;"],
					["listener", "click", function(e) {
						var scope=window.aFrame.calendar;
						scope.render.call(scope, "aFrame_calendar", scope.date.previous);
						}]
				], "calendarHeader");

				el.create("span", [
					["id", "calendarMonth"],
					["innerHTML", this.date.label+" "+dateStamp.getFullYear().toString()]
				], "calendarHeader");

				el.create("a", [
					["id", "calendarNext"],
					["innerHTML", "&gt;"],
					["listener", "click", function(e) {
						var scope=window.aFrame.calendar;
						scope.render.call(scope, "aFrame_calendar", scope.date.next);
						}]
				], "calendarHeader");

				el.create("div", [
					["id", "calendarDays"]
				], target);


				dateStamp.setDate(1);

				var loop = dateStamp.getDay();

				for (var i=1; i<=loop; i++) {
					this.day("calendarDays", null);
				}

				loop = this.date.days;

				for (var i=1; i<=loop; i++) {
					this.day("calendarDays", dateStamp.setDate(i));
				}

				return true;
			}
			else {
				throw label.error.elementNotFound;
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
		css3 : null,
		chrome : (navigator.userAgent.toLowerCase().indexOf("chrom") > -1) ? true : false,
		firefox : (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) ? true : false,
		ie : (navigator.userAgent.toLowerCase().indexOf("msie") > -1) ? true : false,
		opera : (navigator.userAgent.toLowerCase().indexOf("opera") > -1) ? true : false,
		safari : (navigator.userAgent.toLowerCase().indexOf("safari") > -1) ? true : false,
		version : (navigator.userAgent.toLowerCase().indexOf("msie") > -1) ? parseInt(navigator.userAgent.replace(/(.*MSIE|;.*)/gi, "")) : parseInt(navigator.appVersion),

		/**
		 * Returns a boolean representing CSS3 support in the client
		 *
		 * @returns {boolean} A boolean representing CSS3 support
		 */
		css3Support : function() {
			if ((this.chrome) || (this.safari)) { return true; }
			if ((this.firefox) && (this.version > 4)) { return true; }
			if ((this.ie) && (this.version > 8)) { return true; }
			if ((this.opera) && (this.version > 8)) { return true; }
			return false;
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
		 * @param xmlHttp {object} XMLHttp object
		 * @param uri {string} The URI.value to cache
		 * @param handler {function} A handler function to execute once a response has been received
		 */
		response : function(xmlHttp, uri, handler) {
			try {
				if (xmlHttp.readyState == 4) {
					if (((xmlHttp.status == 200) || (xmlHttp.status == 201) || (xmlHttp.status == 204)) && (typeof xmlHttp.responseText != "")) {
						if (xmlHttp.status == 200) {
							cache.set(uri, xmlHttp.responseText);
						}
						handler(xmlHttp.responseText);
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
		icon : function(id) {
			if (!window["aFrame.icon"]) {
				window["aFrame.icon"] = new Image();
				window["aFrame.icon"].src = aFrame.iconUrl;
			}

			if (!$(id + "_" + label.common.loading.toLocaleLowerCase())) {
				el.create("img", [
					["alt", label.common.loading],
					["id", id + "_" + label.common.loading.toLocaleLowerCase()],
					["src", window["aFrame.icon"].src],
					["class", "loading"]
				], id);
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
		 * Creates an element in document.body or a target element
		 *
		 * @param type {string} Type of element to create
		 * @param args {Array} Literal array of attributes for the new element
		 * @param id {string} Optional target object.id value
		 */
		create : function(type, args, id) {
			try {
				if (args instanceof Array) {
					var obj = document.createElement(type);
					this.update(obj, args);
					($(id)) ? $(id).appendChild(obj) : document.body.appendChild(obj);
				}
				else {
					throw label.error.expectedArray;
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
			try
			{
				var args = arg.split(",");
				var i = args.length;

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
		 * Adds an event to the target element
		 *
		 * @param id {string} The target object.id value
		 * @param arg {string} The name of the event to add to the object
		 */
		event : function(id, type, fn) {
			this.update(id, [["event", arg]]);
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
		 * Adds an event listener  to the target element
		 *
		 * @param id {string} Target object.id value
		 * @param type {string} Event type
		 * @param handler {mixed} A handler function to execute
		 */
		listener : function(id, type, handler) {
			this.update(id, [["listener", type, handler]]);
		},

		/**
		 * Finds the position of an element
		 *
		 * @param id {string} Target object.id value
		 * @returns {array} An array containing the render position of the element
		 */
		position : function(id) {
			var left = null;
			var top = null;
			var obj = $(id);

			if (obj.offsetParent) {
				left = obj.offsetLeft;
				top = obj.offsetTop;

				while (obj = obj.offsetParent) {
					left += obj.offsetLeft;
					top += obj.offsetTop;
				}
			}

			return [left, top];
		},

		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * @param id {string} Target object.id value
		 * @todo switch this to if ("attribute" in $var) maybe...
		 */
		clear : function(id) {
			try {
				if ($(id)) {
					switch (typeof $(id)) {
						case "form":
							$(id).reset();
							break;
						default:
							this.update(id, [["innerHTML", ""]]);
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
		 * Updates an object
		 *
		 * @param obj {mixed} An instance of an object, or a target object.id value
		 * @param args {Array} Literal array of attributes and values
		 */
		update : function(obj, args) {
			try {
				obj = (obj instanceof Object) ? obj : $(obj);

				if ((obj !== undefined) && (obj != null)) {
					if (args instanceof Array) {
						var i = args.length;

						while (i--) {
							switch(args[i][0]) {
							case "class":
								((client.ie) && (client.version < 8)) ? obj.setAttribute("className", args[i][1]) : obj.setAttribute("class", args[i][1]);
								break;
							case "event":
								alert("add an event here!");
								break;
							case "innerHTML":
							case "type":
							case "src":
								obj[args[i][0]] = args[i][1];
								break;
							case "listener":
								(obj.addEventListener) ? obj.addEventListener(args[i][1], args[i][2], false) : obj.attachEvent("on"+args[i][1], args[i][2]);
								break;
							case "opacity":
								fx.opacity(obj, args[i][1]);
								break;
							default:
								obj.setAttribute(args[i][0] , args[i][1]);
								break;
							}
						}
					}
					else {
						throw label.error.expectedArray;
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
				return null;
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
			var fn = null;
			var speed = Math.round(ms/100);
			var timer = 0;
			var i = null;

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
		isEven : function(arg) {
			return (((parseInt(arg) / 2).toString().indexOf(".")) > -1) ? false : true;
		},

		/**
		 * Returns true if the number is odd
		 *
		 * @param arg {integer}
		 * @returns {boolean}
		 */
		isOdd : function(arg) {
			return (((parseInt(arg) / 2).toString().indexOf(".")) > -1) ? true : false;
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
				if (window.JSON) {
					return JSON.parse(arg);
				}

				return eval("("+arg+")");
			}
			catch (e) {
				error(e);
			}
		},

		/**
		 * Encodes a string, array or object to a JSON string
		 *
		 * @param arg {mixed} The entity to encode
		 */
		encode : function(arg) {
			try {
				if (window.JSON) {
					return JSON.stringify(arg);
				}

				throw label.error.databaseNotSupported;
			}
			catch (e) {
				error(e);
			}
		}
	};

	/**
	 * Labels
	 *
	 * @class
	 */
	var label = {
		/**
		 * Error messages
		 */
		error : {
			databaseNotOpen : "Failed to open the Database, possibly exceeded Domain quota.",
			databaseNotSupported : "Client does not support local database storage.",
			databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder.",
			elementNotCreated : "Could not create the Element.",
			elementNotFound : "Could not find the Element.",
			expectedArray : "Expected an Array.",
			expectedArrayObject : "Expected an Array or Object.",
			expectedObject : "Expected an Object.",
			invalidDate : "Invalid Date",
			invalidFields : "The following required fields are invalid: ",
			serverError : "A server error has occurred."
		},

		/**
		 * Common labels
		 */
		common : {
			back : "Back",
			cancel : "Cancel",
			clear : "Clear",
			close : "Close",
			cont : "Continue",
			del : "Delete",
			edit : "Edit",
			gen : "Generate",
			loading : "Loading",
			next : "Next",
			login : "Login",
			ran : "Random",
			save : "Save",
			submit : "Submit"
		},

		/**
		 * Months
		 */
		months : {
			"1" : "January",
			"2" : "February",
			"3" : "March",
			"4" : "April",
			"5" : "May",
			"6" : "June",
			"7" : "July",
			"8" : "August",
			"9" : "September",
			"10" : "October",
			"11" : "November",
			"12" : "December"
		}
	};

	/**
	 * Utility methods
	 */
	var utility = {
		/**
		 * Returns an instance or array of instances
		 *
		 * @param arg {string} Comma delimited string of target element.id values
		 * @returns {mixed} instances Instance or Array of Instances of elements
		 */
		$ : function(arg) {
			if (arg !== undefined) {
				arg = (arg.indexOf(",") > -1) ? arg.split(",") : arg;

				if (arg instanceof Array) {
					var instances = [];
					var i = arg.length;

					while (i--) {
						instances.push($(arg[i]));
					}

					return instances;
				}

				return document.getElementById(arg.toString());
			}

			return null;
		},

		/**
		 * Encodes a string to a DOM friendly ID
		 *
		 * @param id {string} The object.id value to encode
		 * @returns {string} Returns a lowercase stripped string
		 */
		domID : function(id) {
			return id.replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
		},

		/**
		 * Error handling
		 *
		 * @param e {mixed} Error object or message to display.
		 */
		error : function(e) {
			var err = new Error(e);

			if (client.ie) {
				alert(err.description);
			}
			else if (console) {
				console.error(err);
			}
			else {
				alert(err.description);
			}
		}
	};

	/**
	 * Form validation
	 */
	var validate=
	{
		exception:false,
		loop:null,
		msg:label.error.invalidFields,
		required:[],
		value:null,

		/**
		 * Returns the supplied argument, or false
		 *
		 * @param arg {boolean}
		 * @returns {boolean}
		 */
		bool:function(arg)
		{
			switch(arg)
			{
				case true:
				case false:
					return arg;
				default:
					return false;
			}
		},

		/**
		 * Sets an exception and appends to the message displayed to the Client
		 *
		 * @param args {string}
		 */
		invalid:function(arg)
		{
			exception=true;
			msg+=" "+arg.toString()+", ";
		},

		/**
		 * Validates the value of elements based on the args passed in
		 *
		 * @param args {Array}
		 * @returns {Boolean}
		 */
		fields:function(args)
		{
			required=args;
			loop=required.length;

			for (var i=0;i<this.loop;i++)
			{
				value=$(required[i][0]).value;
				switch (required[i][1])
				{
				case "isDomain":
					if (!isDomain(value)) { invalid(required[i][2]); }
					break;
				case "isDomainOrIp":
					if ((!isIpAddr(value))&&(!isDomain(value))) { invalid(required[i][2]); }
					break;
				case "isIp":
					if (!isIpAddr(value)) { invalid(required[i][2]); }
					break;
				case "isInteger":
					if (isNaN(value))
					{
						invalid(required[i][2]);
					}
					else if (required[i][3])
					{
						var y=required[i][3].length;
						var exception=false;

						for (var x=0;x<y;x++)
						{
							exception=(value==required[i][3][x])?false:true;
							if (!exception) { break; }
						}

						if (exception) { invalid(required[i][2]); }
					}
					break;
				case "isNotEmpty":
					if (($(required[i][0]).style.display!="none")&&(value=="")) { invalid(required[i][2]); }
					break;
				}
			}

			if (err) { throw msg; }

			return !err;
		},

		/**
		 * Validates all fields in the target form based on a typeof detection and length requirement of 1
		 *
		 * @param arg {String} The target object.id value.
		 * @returns {Boolean}
		 */
		form:function(arg) {
			void(0);
		}
	};

	/**
	 * @constructor
	 * @class
	 */
	var constructor = {
		/**
		 * Properties
		 */
		iconUrl : null,
		ms : cache.ms,
		ready : true,

		/**
		 * Methods
		 */
		$ : utility.$,
		create : el.create,
		destroy : el.destroy,
		domID : utility.domID,
		error : utility.error,
		icon : client.icon,
		position : el.position,
		clear : el.clear,
		update : el.update,

		/**
		 * Classes
		 */
		ajax : ajax,
		array : array,
		cache : cache,
		calendar : calendar,
		client : client,
		database : database,
		el : el,
		error : error,
		fx : fx,
		json : json,
		label : label,
		number : number,
		validate : validate
	};

	/**
	 * Declaring private global instances
	 */
	var $ = utility.$;
	var error = utility.error;

	/**
	 * Setting client.css3 property
	 */
	constructor.client.css3 = client.css3Support();

	/**
	 * Exposing constructor to the client
	 */
	return constructor;
}();

/**
 * Declaring a document scope global helper
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

Element.prototype.event = function(args) {
	aFrame.el.event(this.id, args);
};

Element.prototype.destroy = function() {
	aFrame.destroy(this.id);
};

Element.prototype.domID = function() {
	return aFrame.domID(this.id);
};

Element.prototype.get = function(arg) {
	aFrame.ajax.get(arg, function() {
		aFrame.el.update(this.id, [["innerHTML", arguments[0]]]);
	});
};

Element.prototype.listener = function(target, handler) {
	aFrame.el.listener(this.id, target, handler);
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

Number.prototype.isEven = function() {
	return aFrame.number.isEven(this);
};

Number.prototype.isOdd = function() {
	return aFrame.number.isOdd(this);
};

String.prototype.domID = function() {
	return aFrame.domID(this);
};
