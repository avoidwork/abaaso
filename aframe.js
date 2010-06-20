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
 * @constructor
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version Prototype
 */
var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Class for RESTful AJAX interaction
	 */
	ajax=
	{
		/**
		 * Makes a DELETE to the URI with the supplied args.
		 * @param uri {string} URI to GET from local cache or the resource.
		 * @param handler {function} A handler function to execute once a response has been received.
		 */
		del:function(uri, handler)
		{
			client.httpRequest(uri, handler, "DELETE");
		},

		/**
		 * Makes a GET to the URI.
		 * @param uri {string} URI to GET from local cache or the resource.
		 * @param handler {function} A handler function to execute once a response has been received.
		 */
		get:function(uri, handler)
		{
			if (cache.get(uri))
			{
				handler(cache.get(uri));
			}
			client.httpRequest(uri, handler, "GET");
		},

		/**
		 * Makes a POST to the URI with the supplied args.
		 * @param uri {string} URI to POST to.
		 * @param handler {function} A handler function to execute once a response has been received.
		 * @param {args} POST variables to include.
		 */
		post: function(uri, handler, args)
		{
			client.httpRequest(uri, handler, "POST", args);
		},

		/**
		 * Makes an UPDATE to the URI with the supplied args.
		 * @param uri {string} URI to UPDATE.
		 * @param handler {function} A handler function to execute once a response has been received.
		 * @param {args} POST variables to include.
		 */
		update: function(uri, handler, args)
		{
			client.httpRequest(uri, handler, "UPDATE", args);
		}
	};

	/**
	 * Class of cached items, with methods to get and set.
	 */
	cache=
	{
		// Array of cached uri responses.
		items:[],

		// Default timeout value (0 = infinity).
		ms:0,

		/**
		 * Returns the cached response from the URI, or False
		 * @param arg {string} The URI/Identifier for the resource to retrieve from cache.
		 * @returns {mixed} Returns the URI response as a string, or False.
		 */
		get:function(arg)
		{
			var loop=this.items.length;
			for (var i=0;i<loop;i++)
			{
				if ((this.items[i].uri==arg)&&((pub.ms===0)||((new Date()-this.items[i].timestamp)<pub.ms)))
				{
					return this.items[i].response;
				}
			}
			return false;
		},

		/**
		 * Commits, or updates an item in cache.items
		 * @param uri {string} The URI to set or update.
		 * @param response {string} The URI response.
		 */
		set:function(uri, response)
		{
			var loop=this.items.length;
			for (var i=0;i<loop;i++)
			{
				if (this.items[i].uri==uri)
				{
					this.items[i].response=response;
					this.items[i].timestamp=new Date();
					return;
				}
			}
			this.items.push({uri:uri, response:response, timestamp:new Date()});
		}
	};

	/**
	 * Class provites a calendar via the create() function.
	 */
	calendar=
	{
		// Current date
		dateCur:new Date(),

		// ISO 8601 standard, change to any localized pattern
		pattern:"yyyy/mm/dd",

		/**
		 * Creates a calendar in the window.
		 * @param id {string} Object.id value that called this function.
		 * @param form {string} Form element that will receive the calendar value.
		 * @param clear {boolean} Optional boolean for displaying optional Clear anchor in calendar header.
		 */
		create: function(id, form, clear)
		{
			var args=null;
			clear=(clear===undefined)?false:validate.bool(clear);
			var dateStamp=($(form).value!="")?new Date($(form).value):new Date();
			var pos=element.position(id);

			$(id).blur();

			if ($(form).value=="Invalid Date")
			{
				$(form).reset();
			}

			if ($("aFrame.calendar"))
			{
				el.destroy("aFrame.calendar");
			}

			el.create("div", [
					["id", "aFrame.calendar"],
					["opacity", 0],
					["style","top:"+pos[1]+"px;left:"+pos[0]+"px;"]
				]);

			if (this.renderCalendar("aFrame.calendar", dateStamp, form, clear))
			{
				fx.opacityShift("aFrame.calendar", 300);
			}
			else
			{
				$("aFrame.calendar").destroy();
				throw label.error.msg5;
			}
		},

		/**
		 * Gets the days in a month.
		 * @param month {integer}
		 * @param year {integer}
		 * @returns {integer}
		 */
		dateDays: function(month, year)
		{
			return (32-new Date(year, month, 32).getDate());
		},

		/**
		 * Returns a date based on calendar.pattern.
		 * @param dateStamp {date}
		 * @returns {string}
		 */
		dateOutput: function(dateStamp)
		{
			var output=this.pattern;
			var outputDate=new Date(dateStamp);

			output=output.replace(/dd/,outputDate.getDate());
			output=output.replace(/mm/,outputDate.getMonth()+1);
			output=output.replace(/yyyy/,outputDate.getFullYear());

			return output;
		},

		/**
		 * Renders a "day" div in the calendar.
		 * @param id {string} Object.id value
		 * @param dateStamp {date} Date string.
		 * @param obj {string} Optional object to be updated on click.
		 * @returns {boolean}
		 * @TODO refactor the update to use el.listener().
		 */
		renderDay: function(id, dateStamp, obj)
		{
			try
			{
				dateStamp=new Date(dateStamp);

				if (!isNaN(dateStamp.getYear()))
				{
					var args=[
							["id","href_day_"+this.dateStamp.getDate()],
							["onclick", "aFrame.update('"+obj+"','"+this.dateOutput(dateStamp.toDateString())+"');aFrame.destroy('aFrame.calendar');"],
							[innerHTML, dateStamp.getDate()]
						];

					if ((dateStamp.getDate()==dateCur.getDate())&&(dateStamp.getMonth()==dateCur.getMonth())&&(dateStamp.getFullYear()==dateCur.getFullYear()))
					{
						args.push(["class", "current"]);
					}
					else if ((dateStamp.getDay()===0)||(dateStamp.getDay()==6))
					{
						args.push(["class", "weekend"]);
					}

					el.create("div", [
							["id","div_day_"+dateStamp.getDate()],
							["class","day"]
						], id);

					el.create("a", args, "div_day_"+dateStamp.getDate());
				}
				else
				{
					el.create("div", [["class","day"]], id);
				}

				return true;
			}
			catch (e)
			{
				error(e);
				return false;
			}
		},

		/**
		 * Renders the calendar in the target element.
		 * @param id {string} Target object.id value.
		 * @param dateStamp {string} Date to work with.
		 * @param obj {string} Object to update.
		 * @param clear {boolean} Value reflects displaying the Clear option in the Calendar Header.
		 * @returns {boolean}
		 */
		renderCalendar: function(id, dateStamp, obj, clear)
		{
			try
			{
				dateStamp=new Date(dateStamp);

				if ($(id))
				{
					$(id).reset();

					var datePrev=new Date();
					var dateNext=new Date();
					var dateLabel=null;
					var loop=this.dateDays(dateStamp.getMonth(), dateStamp.getFullYear());

					switch (dateCur.getMonth())
					{
					case 0:
						datePrev.setDate(1);
						datePrev.setMonth(11);
						datePrev.setFullYear(dateStamp.getFullYear()-1);
						dateNext.setDate(1);
						dateNext.setMonth(dateStamp.getMonth()+1);
						dateNext.setFullYear(dateStamp.getFullYear());
						break;
					case 10:
						datePrev.setDate(1);
						datePrev.setMonth(dateStamp.getMonth()-1);
						datePrev.setFullYear(dateStamp.getFullYear());
						dateNext.setDate(1);
						dateNext.setMonth(dateStamp.getMonth()+1);
						dateNext.setFullYear(dateStamp.getFullYear());
						break;
					case 11:
						datePrev.setDate(1);
						datePrev.setMonth(dateStamp.getMonth()-1);
						datePrev.setFullYear(dateStamp.getFullYear());
						dateNext.setDate(1);
						dateNext.setMonth(0);
						dateNext.setFullYear(dateStamp.getFullYear()+1);
						break;
					default:
						datePrev.setDate(1);
						datePrev.setMonth(dateStamp.getMonth()-1);
						datePrev.setFullYear(dateStamp.getFullYear());
						dateNext.setDate(1);
						dateNext.setMonth(dateStamp.getMonth()+1);
						dateNext.setFullYear(dateStamp.getFullYear());
						break;
					}

					eval("dateLabel=label.month."+dateStamp.getMonth()+";");
					el.create("div", [["id", "calendarTop"]], id);

					if (clear)
					{
						el.create("a", [
								["id", "calendarClear"],
								["innerHTML", label.common.clear],
								["listener", "click", "aFrame.reset('"+obj+"');aFrame.destroy('"+id+"')"]
							], "calendarTop");
					}

					el.create("a", [
							["id", "calendarClose"],
							["innerHTML", label.common.close],
							["listener", "click", "aFrame.destroy('"+id+"')"]
						], "calendarTop");

					el.create("div", [
							["id", "calendarHeader"]
						], id);

					el.create("a", [
							["id", "calendarPrev"],
							["innerHTML", "&lt;"],
							["listener", "click", "aFrame.calendar.renderCalendar('"+id+"','"+datePrev.toDateString()+"','"+obj+"');"]
						], "calendarHeader");

					el.create("span", [
							["id", "calendarMonth"],
							["innerHTML", dateLabel+" "+dateStamp.getFullYear().toString()]
						], "calendarHeader");

					el.create("a", [
							["id", "calendarNext"],
							["innerHTML", "&gt;"],
							["listener", "click", "aFrame.calendar.renderCalendar('"+id+"','"+dateNext.toDateString()+"','"+obj+"');"]
						], "calendarHeader");

					el.create("div", [
							["id", "calendarDays"]
						], id);

					for (var i=1;i<=loop;i++)
					{
						dateStamp.setDate(i);
						this.renderDay("calendarDays", dateStamp, obj);
					}

					return true;
				}
				else
				{
					return false;
				}
			}
			catch(e)
			{
				error(e);
				return false;
			}
		}
	};

	/**
	 * Class contains methods and properties for client interaction
	 */
	client=
	{
		/**
		 * Public properties
		 */
		css3:null,
		chrome:(navigator.userAgent.toLowerCase().indexOf("chrom")>-1)?true:false,
		firefox:(navigator.userAgent.toLowerCase().indexOf("firefox")>-1)?true:false,
		ie:(navigator.userAgent.toLowerCase().indexOf("msie")>-1)?true:false,
		opera:(navigator.userAgent.toLowerCase().indexOf("opera")>-1)?true:false,
		safari:(navigator.userAgent.toLowerCase().indexOf("safari")>-1)?true:false,
		version:(navigator.userAgent.toLowerCase().indexOf("msie")>-1)?parseInt(navigator.userAgent.toString().replace(/(.*MSIE|;.*)/gi, "")):parseInt(navigator.appVersion),

		/**
		 * Returns an instance or array of instances.
		 * @param arg {string} Comma delimited string of IDs to return instances of.
		 * @returns {mixed} instances Instance or Array of Instances of elements.
		 */
		$:function(arg)
		{
			if (arg!==undefined)
			{
				arg=(arg.toString().indexOf(",")>-1)?arg.split(","):arg;
				if (arg instanceof Array)
				{
					var instances=[];
					var loop=arg.length;
					for (var i=0;i<loop;i++)
					{
						instances.push($(arg[i].toString()));
					}
					return instances;
				}
				return document.getElementById(arg.toString());
			}
			return null;
		},

		/**
		 * Returns a boolean representing CSS3 support in the client.
		 * @returns {boolean} A boolean representing CSS3 support.
		 */
		css3Support:function()
		{
			if ((this.chrome)||(this.safari)) { return true; }
			if ((this.firefox)&&(this.version>4)) { return true; }
			if ((this.ie)&&(this.version>8)) { return true; }
			if ((this.opera)&&(this.version>8)) { return true; }
			return false;
		},

		/**
		 * Error handling.
		 * @param e {mixed} Error object or message to display.
		 */
		error:function(e)
		{
			var err=new Error(e);
			($("console"))?console.log(err.description):alert(err.description);
		},

		/**
		 * Receives and caches the URI response.
		 * @param xmlHttp {object} XMLHttp object.
		 * @param uri {string} The URI.value to cache.
		 * @param handler {function} A handler function to execute once a response has been received.
		 */
		httpGet:function(xmlHttp, uri, handler)
		{
			if (xmlHttp.readyState==4)
			{
				if ((xmlHttp.status==200)&&(typeof xmlHttp.responseText!=""))
				{
					cache.set(uri, xmlHttp.responseText);
					handler(xmlHttp.responseText);
				}
				else
				{
					throw label.error.msg2;
				}
			}
		},

		/**
		 * Creates an xmlHttp request for a URI.
		 * @param uri {string} The resource to interact with.
		 * @param handler {function} A handler function to execute once a response has been received.
		 * @param type {string} The type of interaction.
		 * @param args {mixed} POST data to append to the HTTP query.
		 * @TODO Complete the POST portion
		 */
		httpRequest:function(uri, handler, type, args)
		{
			var xmlHttp=false;

			if (window.XMLHttpRequest)
			{
				xmlHttp=new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
				catch (e1)
				{
					try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
					catch (e2)
					{
						error(e2);
					}
				}
			}

			if (xmlHttp)
			{
				try
				{
					switch(type.toLowerCase())
					{
					case "get":
						xmlHttp.onreadystatechange=function() { client.httpGet(xmlHttp, uri, handler); };
						xmlHttp.open("GET",uri, true);
						xmlHttp.send(null);
						break;
					case "post":
						xmlHttp.onreadystatechange=function() { client.httpPost(xmlHttp, uri, handler); };
						xmlHttp.open("POST",uri, true);
						xmlHttp.send(null);
						break;
					}
				}
				catch(e3)
				{
					error(e3);
				}
			}
		},

		/**
		 * Renders a loading icon in a target element.
		 * Loads the constructor.iconUrl uri into the aFrame.icon object.
		 * @param id {string} Target object.id value.
		 */
		icon:function(id)
		{
			if (!window["aFrame.icon"])
			{
				window["aFrame.icon"]=new Image();
				window["aFrame.icon"].src=aFrame.iconUrl;
			}

			if (!$(id+"_"+label.common.loading.toLocaleLowerCase()))
			{
				try
				{
					el.create("img", [
							["alt", label.common.loading],
							["id", id+"_"+label.common.loading.toLocaleLowerCase()],
							["src", window["aFrame.icon"].src],
							["class", "loading"]
						], id);
				}
				catch(e)
				{
					error(e);
				}
			}
		}
	};

	/**
	 * Class for HTML element CRUD, etc.
	 */
	el=
	{
		/**
		 * Creates an element in document.body or a target element.
		 * @param type {string} Type of element to create.
		 * @param args {Array} Literal array of attributes for the new element.
		 * @param id {string} Optional target object.id value.
		 */
		create:function(type, args, id)
		{
			if (args instanceof Array)
			{
				var obj=document.createElement(type);
				this.update(obj, args);
				($(id))?$(id).appendChild(obj):document.body.appendChild(obj);
			}
			else
			{
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element.
		 * @param args {string} Comma delimited string of target object.id values.
		 * @TODO make this array friendly!
		 */
		destroy:function(id)
		{
			if ($(id))
			{
				document.body.removeChild($(arg));
			}
		},

		/**
		 * Encodes a string to a DOM friendly ID.
		 * @param id {string} The object.id value to encode.
		 * @returns {string} Returns a lowercase stripped string.
		 */
		domID:function(id)
		{
			return id.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
		},

		/**
		 * Adds an event to the target element.
		 * @param id {string} The target object.id value.
		 * @param arg {string} The name of the event to add to the object.
		 */
		event:function(id, arg)
		{
			this.update(id, [["event", arg]]);
		},

		/**
		 * Returns the ID of the element that triggered the event.
		 * @param e {event} The event arguement sent to the listener.
		 * @param obj {object} The element whose listener called this function.
		 * @returns {string} The id of the element that triggered the event.
		 */
		eventID:function(e, obj)
		{
			return (window.event)?window.event.srcElement.id:obj.id;
		},

		/**
		 * Adds an event listener  to the target element.
		 * @param id {string} Target object.id value.
		 * @param type {string} Event type.
		 * @param handler {mixed} A handler function to execute.
		 */
		listener:function(id, type, handler)
		{
			this.update(id, [["listener", type, handler]]);
		},

		/**
		 * Finds the position of an element
		 * @param id {string} Target object.id value.
		 * @TODO Fix this!
		 */
		position: function(id)
		{
			var curleft=0;
			var curtop=0;

			if ($(id).offsetParent)
			{
				curleft=$(id).offsetLeft;
				curtop=$(id).offsetTop;
				/*while (targetEl=$(targetEl).offsetParent)
				{
					curleft+=targetEl.offsetLeft;
					curtop+=targetEl.offsetTop;
				}*/
			}

			return [curleft,curtop];
		},

		/**
		 * Resets an object.
		 * @param id {string} Target object.id value.
		 * @TODO switch this to if ("attribute" in $var) maybe...
		 */
		reset:function(id)
		{
			if ($(id))
			{
				if (typeof $(id)=="form") { $(id).reset(); }
				else { this.update(id, [["innerHTML", ""]]); }
			}
			else
			{
				throw label.error.msg1;
			}
		},

		/**
		 * Updates an object
		 * @param obj {mixed} An instance of an object, or a target object.id value.
		 * @param args {Array} Literal array of attributes and values.
		 */
		update:function(obj, args)
		{
			obj=(typeof obj=="object")?obj:$(obj);
			if ((obj!==undefined)&&(obj!=null))
			{
				if (args instanceof Array)
				{
					var loop=args.length;
					for (var i=0;i<loop;i++)
					{
						switch(args[i][0])
						{
						case "class":
							((client.ie)&&(client.version<8))?obj.setAttribute("className", args[i][1]):obj.setAttribute("class", args[i][1]);
							break;
						case "event":
							alert("add an event here!");
							break;
						case "innerHTML":
						case "type":
						case "src":
							obj[args[i][0]]=args[i][1];
							break;
						case "listener":
							(obj.addEventListener)?obj.addEventListener(args[i][1], args[i][2], false):obj.attachEvent("on"+args[i][1], args[i][2]);
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
				else
				{
					throw label.error.msg3;
				}
			}
			else
			{
				throw label.error.msg1;
			}
		}
	};

	/**
	 * Class of GUI effects
	 * @TODO emulate a fall and maybe a collision?
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value.
		 * @param obj {mixed} Instance of an object, or the target object.id value.
		 * @param opacity {integer} The opacity value to set.
		 * @returns {integer} The opacity value of the element.
		 */
		opacity:function(obj, opacity)
		{
			obj=(typeof obj=="object")?obj:$(obj);
			if (obj!==undefined)
			{
				if (opacity!==undefined)
				{
					(client.ie)?obj.style.filter="alpha(opacity="+opacity+")":obj.style.opacity=(opacity/100);
					return parseInt(opacity);
				}
				else
				{
					return (client.ie)?parseInt(obj.style.filter.toString().replace(/(.*\=|\))/gi, "")):parseInt(obj.style.opacity);
				}
			}
			else
			{
				return null;
			}
		},

		/**
		 * Changes an object's opacity from the start value to the end value, transition speed is based on the ms argument.
		 * @param id {string} Target object.id value.
		 * @param start {integer} Opacity start value.
		 * @param end {integer} Opacity end value.
		 * @param ms {integer} Milliseconds for transition to take.
		 */
		opacityChange:function(id, start, end, ms)
		{
			var fn=null;
			var speed=Math.round(ms/100);
			var timer=0;
			var i=null;

			if (start>end)
			{
				for (i=start;i>=end;i--)
				{
					setTimeout("$(\""+id+"\").opacity("+i+")", (timer*speed));
					timer++;
				}
			}
			else
			{
				for (i=start;i<=end;i++)
				{
					setTimeout("$(\""+id+"\").opacity("+i+")", (timer*speed));
					timer++;
				}
			}
		},

		/**
		 * Shifts an object's opacity, transition speed is based on the ms argument.
		 * @param id {string} Target object.id value.
		 * @param ms {integer} Milliseconds for transition to take.
		 */
		opacityShift:function(id, ms)
		{
			($(id).opacity()===0)?this.opacityChange(id, 0, 100, ms):this.opacityChange(id, 100, 0, ms);
		}
	};

	/**
	 * Class for number properties and manipulation.
	 */
	number=
	{
		/**
		 * Returns true if the number is even.
		 * @param arg {integer}
		 * @returns {boolean}
		 */
		isEven:function(arg)
		{
			return (((parseInt(arg)/2).toString().indexOf("."))>-1)?false:true;
		},

		/**
		 * Returns true if the number is odd.
		 * @param arg {integer}
		 * @returns {boolean}
		 */
		isOdd:function(arg)
		{
			return (((parseInt(arg)/2).toString().indexOf("."))>-1)?true:false;
		}
	};

	/**
	 * JSON decoding and encoding.
	 */
	json=
	{
		/**
		 * Decodes the argument into an object.
		 * @param arg {string} The string to parse.
		 */
		decode:function(arg)
		{
			if (window.JSON)
			{
				return JSON.parse(arg);
			}
			return eval("("+arg+")");
		},

		/**
		 * Encodes a string, array or object to a JSON string.
		 * @param arg {mixed} The entity to encode.
		 */
		encode:function(arg)
		{
			if (window.JSON)
			{
				return JSON.stringify(arg);
			}
			throw "Not implemented";
		}
	};

	/**
	 * Class of labels
	 */
	label=
	{
		/**
		 * Error messages that are thrown.
		 */
		error:
		{
			msg1:"Could not find element.",
			msg2:"A server error has occurred.",
			msg3:"Expected an array.",
			msg4:"The following required fields are invalid: ",
			msg5:"Could not create element."
		},

		/**
		 * Common element labels.
		 */
		common:
		{
			back:"Back",
			cancel:"Cancel",
			clear:"Clear",
			close:"Close",
			cont:"Continue",
			del:"Delete",
			edit:"Edit",
			gen:"Generate",
			loading:"Loading",
			next:"Next",
			login:"Login",
			ran:"Random",
			save:"Save",
			submit:"Submit"
		},

		/**
		 * Months of the Year.
		 */
		months:
		{
			"1":"January",
			"2":"February",
			"3":"March",
			"4":"April",
			"5":"May",
			"6":"June",
			"7":"July",
			"8":"August",
			"9":"September",
			"10":"October",
			"11":"November",
			"12":"December"
		}
	};

	/**
	 * Class for form validation
	 */
	validate=
	{
		exception:false,
		loop:null,
		msg:label.error.msg4,
		required:[],
		value:null,

		/**
		 * Returns the supplied argument, or false.
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
		 * Sets an exception and appends to the message displayed to the Client.
		 * @param args {string}
		 */
		invalid:function(arg)
		{
			exception=true;
			msg+=" "+arg.toString()+", ";
		},

		/**
		 * Validates the value of elements based on the args passed in.
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
		 * Validates all fields in the target form based on a typeof detection and length requirement of 1.
		 * @param arg {String} The target object.id value.
		 * @returns {Boolean}
		 */
		form:function(arg) {
			void(0);
		}
	};

	/**
	 * Public class returned to the client
	 */
	pub=
	{
		/**
		 * Properties
		 * iconUrl should be changed the url of your default loader icon.
		 */
		iconUrl:"http://farm5.static.flickr.com/4042/4714861874_2d574de7b1_o.gif",
		ms:cache.ms,

		/**
		 * Methods
		 */
		$:client.$,
		create:el.create,
		destroy:el.destroy,
		domID:el.domID,
		error:client.error,
		icon:client.icon,
		position:el.position,
		reset:el.reset,
		update:el.update,

		/**
		 * Classes
		 */
		ajax:ajax,
		cache:cache,
		calendar:calendar,
		client:client,
		el:el,
		fx:fx,
		label:label,
		number:number,
		validate:validate
	};

	// Declaring private global instances
	var $=function(arg) { return client.$(arg); };
	var error=client.error;

	// Setting client.css3 property
	pub.client.css3=client.css3Support();

	// Returning pub{} to the client.
	return pub;
}();

// Declaring a document scope global helper
var $=function(arg) { return aFrame.$(arg); };

// Prototyping standard objects with aFrame
Element.prototype.event=function(args) { aFrame.el.event(this.id, args); };
Element.prototype.destroy=function() { aFrame.destroy(this.id); };
Element.prototype.domID=function() { return aFrame.domID(this.id); };
Element.prototype.get=function(arg) { aFrame.ajax.get(arg, function(){ aFrame.el.update(this.id, [["innerHTML", arguments[0]]]); }); };
Element.prototype.listener=function(target, handler) { aFrame.el.listener(this.id, target, handler); };
Element.prototype.opacity=function(arg) { return aFrame.fx.opacity(this, arg); };
Element.prototype.opacityShift=function(arg) { aFrame.fx.opacityShift(this.id, arg); };
Element.prototype.reset=function() { aFrame.reset(this.id); };
Element.prototype.update=function(args) { aFrame.update(this.id, args); };
Number.prototype.isEven=function() { return aFrame.number.isEven(this); };
Number.prototype.isOdd=function() { return aFrame.number.isOdd(this); };
String.prototype.domID=function() { return aFrame.domID(this); };
