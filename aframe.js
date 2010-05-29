/**
 * aFrame
 * http://avoidwork.com/aFrame
 *
 * "An A-frame is a basic structure designed to bear a load in a lightweight economical manner."
 * aFrame provides a set of classes and object prototyping to ease the creation and maintenance of pure JavaScript web applications.
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2010
 * @version Prototype
 */

var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Class of cached items[], and time in ms to hold items (0=infinity).
	 * This should be checked prior to httpGet();
	 */
	cache=
	{
		time:0,
		items:[],

		/**
		 * Returns an the cached response from the URI.
		 * @param args {string}
		 * @returns {string}
		 */
		getItem:function(arg)
		{
			for (var resource in cache.items)
			{
				if (resource==arg)
				{
					return cache.items[arg];
				}
			}
			return "";
		},

		/**
		 * Sets the time in milliseconds to hold a URI/URL response, if ms is supplied; and returns the value of cache.time.
		 * @param ms {integer} Optional milliseconds.
		 * @returns {integer} cache.time
		 */
		getSetTime:function(ms)
		{
			if (ms!==undefined)
			{
				cache.time=(!isNaN(ms))?ms:0;
			}
			return cache.time;
		}
	};

	/**
	 * Class provites a calendar via the create() function.
	 * @TODO Make the formEl parameter optional.
	 */
	calendar=
	{
		dateCur:new Date(),

		// ISO 8601 standard, change to any localized pattern
		pattern:"yyyy/mm/dd",

		/**
		 * Creates a calendar in the window.
		 * @param initEl {string} Element that called this function.
		 * @param formEl {string} Form element that will receive the calendar value.
		 * @param clear {boolean} Optional boolean for displaying optional Clear anchor in calendar header.
		 */
		create: function(initEl, formEl, clear)
		{
			var args=null;
			clear=(clear===undefined)?false:validate.bool(clear);
			var dateStamp=($(formEl).value!="")?new Date($(formEl).value):new Date();
			var pos=element.position(initEl);

			$(initEl).blur();

			if ($(formEl).value=="Invalid Date")
			{
				$(formEl).reset();
			}

			if ($("aFrame.calendar"))
			{
				el.destroy("aFrame.calendar");
			}

			el.create("div", [["id", "aFrame.calendar"],["style","top:"+pos[1]+"px;left:"+pos[0]+"px;"]]);
			fx.opacity(0, "aFrame.calendar");

			if (renderCalendar("aFrame.calendar", dateStamp, formEl, clear))
			{
				fx.opacityShift("aFrame.calendar", 100);
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
			var output=calendar.pattern;
			var outputDate=new Date(dateStamp);

			output=output.replace(/dd/,outputDate.getDate());
			output=output.replace(/mm/,outputDate.getMonth()+1);
			output=output.replace(/yyyy/,outputDate.getFullYear());

			return output;
		},

		/**
		 * Renders a "day" div in the calendar.
		 * @param targetEl {string}
		 * @param dateStamp {date}
		 * @param formEl {string}
		 * @returns {boolean}
		 */
		renderDay: function(targetEl, dateStamp, formEl)
		{
			try
			{
				dateStamp=new Date(dateStamp);

				if (!isNaN(dateStamp.getYear()))
				{
					var args=[
						["id","href_day_"+dateStamp.getDate()],
						["onclick", ("aFrame.update('"+formEl+"','"+dateOutput(dateStamp.toDateString())+"');aFrame.destroy('aFrame.calendar');")],
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

					element.create("div", [["id","div_day_"+dateStamp.getDate()],["class","day"]], targetEl);
					element.create("a", args, "div_day_"+dateStamp.getDate());
				}
				else
				{
					element.create("div", [["class","day"]], targetEl);
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
		 * @param targetEl {string} Target element.
		 * @param dateStamp {string} Date to work with.
		 * @param formEl {string} Form element to update.
		 * @param clear {boolean} Value reflects displaying the Clear option in the Calendar Header.
		 * @returns {boolean}
		 */
		renderCalendar: function(targetEl, dateStamp, formEl, clear)
		{
			try
			{
				dateStamp=new Date(dateStamp);

				if ($(targetEl))
				{
					$(targetEl).reset();

					var datePrev=new Date();
					var dateNext=new Date();
					var dateLabel=null;
					var loop=dateDays(dateStamp.getMonth(), dateStamp.getFullYear());

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
					element.create("div", ["id","calendarTop"], targetEl);

					if (clear)
					{
						element.create("a", [["id","calendarClear"], ["innerHTML", label.element.clear], ["onclick","aFrame.reset('"+element+"');aFrame.destroy('"+targetEl+"')"]], "calendarTop");
					}

					element.create("a", [["id","calendarClose"], ["innerHTML", label.element.close], ["onclick","aFrame.destroy('"+targetEl+"')"]], "calendarTop");
					element.create("div", [["id","calendarHeader"]], targetEl);
					element.create("a", [["id","calendarPrev"], ["innerHTML","&lt;"], ["onclick","aFrame.calendar.renderCalendar('"+targetEl+"','"+datePrev.toDateString()+"','"+formEl+"');"]], "calendarHeader");
					element.create("span", [["id","calendarMonth"], ["innerHTML", dateLabel+" "+dateStamp.getFullYear().toString()]], "calendarHeader");
					element.create("a", [["id","calendarNext"], ["innerHTML","&gt;"], ["onclick","aFrame.calendar.renderCalendar('"+targetEl+"','"+dateNext.toDateString()+"','"+formEl+"');"]], "calendarHeader");
					element.create("div"[["id","calendarDays"]], targetEl);

					for (var i=1;i<=loop;i++)
					{
						dateStamp.setDate(i);
						renderDay("calendarDays", dateStamp, formEl);
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
		css3:((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false,
		ie:(document.all)?true:false,
		firefox:null,
		opera:null,
		safari:null,
		version:null,

		/**
		 * Returns an instance or array of instances.
		 * @param arg {mixed} String or Array of element IDs.
		 * @returns {mixed} instances Instance or Array of Instances of elements.
		 */
		$:function(arg)
		{
			if (arg!==undefined)
			{
				if (typeof arg=="object")
				{
					var instances=[];
					var loop=arg.length;
					for (var i=0;i<loop;i++)
					{
						instances.push(document.getElementById(arg[i].toString()));
					}
					return instances;
				}
				return document.getElementById(arg.toString());
			}
			return null;
		},

		/**
		 * Error handling.
		 * @param arg {string} Error message to display.
		 * @TODO Figure out what to do with this!
		 */
		error:function(arg)
		{
			var err = new Error(arg);
			alert(err.toString());
		},

		/**
		 * Receives and caches the URI/xmlHttp response.
		 * @param xmlHttp {object} XMLHttp object.
		 * @returns {string} Instance of URI
		 */
		httpGet:function(xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
				if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
				{
					eval("cache.items[\""+id+"\"]="+xmlHttp.responseText+";");
					return xmlHttp.responseText;
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
		 * @param type {string} The type of interaction.
		 * @TODO Complete the POST portion
		 */
		httpRequest:function(uri, type)
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

			if (!xmlHttp)
			{
				return false;
			}

			try
			{
				switch(type.toLowerCase()) // excessive?
				{
				case "get":
					xmlHttp.onreadystatechange=function() { return client.httpGet(xmlHttp); };
					xmlHttp.open("GET",uri,true);
					xmlHttp.send(null);
					break;
				case "post":
					xmlHttp.onreadystatechange=function() { return client.httpPost(xmlHttp); };
					xmlHttp.open("POST",uri,true);
					xmlHttp.send(null);
					break;
				}
			}
			catch(e3)
			{
				error(e3);
			}
		},

		/**
		 * Renders a loading icon in a target element.
		 * Loads the constructor.iconUrl uri into the aFrame.icon object.
		 * @param el {string} Target element ID.
		 */
		icon:function(targetEl)
		{
			if (!window["aFrame.icon"])
			{
				window["aFrame.icon"]=new Image();
				window["aFrame.icon"].src=pub.iconUrl;
			}

			if (!$(targetEl+"_"+label.common.loading.toLocaleLowerCase()))
			{
				try
				{
					el.create("img", [
							["alt", label.common.loading],
							["id", targetEl+"_"+label.common.loading.toLocaleLowerCase()],
							["src", window["aFrame.icon"].src],
							["class", "loading"]
						], targetEl);
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
		 * @param targetEl {string} Optional target element ID.
		 */
		create:function(type, args, targetEl)
		{
			if (typeof args=="object")
			{
				var obj=document.createElement(type);
				var loop=args.length;

				if ($(targetEl))
				{
					$(targetEl).appendChild(obj);
				}
				else
				{
					document.body.appendChild(obj);
				}

				for (var i=0;i<loop;i++)
				{
					switch(args[i][0])
					{
					case "class":
						if (client.ie)
						{
							obj.setAttribute("className",args[i][1]);
						}
						else
						{
							obj.setAttribute("class",args[i][1]);
						}
						break;
					case "innerHTML":
					case "type":
					case "src":
						eval("obj."+args[i][0]+"='"+args[i][1]+"';");
						break;
					case "event":
						if (obj.id) { el.event(obj.id, args[i][1], args[i][2]); }
						break;
					default:
						obj.setAttribute(args[i][0],args[i][1]);
						break;
					}
				}
			}
			else
			{
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element.
		 * @param arg {string} Target element to remove.
		 */
		destroy:function(arg)
		{
			if ($(arg))
			{
				document.body.removeChild($(arg));
			}
		},

		/**
		 * Encodes a string to a DOM friendly ID.
		 * @param arg {string} The string to encode.
		 * @returns {string} Returns a lowercase stripped string.
		 */
		domID:function(arg)
		{
			return arg.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
		},

		/**
		 * Adds an Event Listener to an Element.
		 * @param targetEl {string} Target element ID.
		 * @param type {string} Event type.
		 * @param handler {mixed} Expecting a function.
		 */
		event:function(targetEl, type, handler)
		{
			if ($(targetEl).addEventListener)
			{
				eval("$(targetEl)."+type+"="+handler);
				//$(targetEl).addEventListener(type, handler, false);
			}
			else if ($(targetEl).attachEvent)
			{
				$(targetEl).attachEvent('on' + type, handler);
			}
		},

		/**
		 * Finds the position of an element
		 * @param el {string} The element id to get
		 * @TODO Fix this!
		 */
		position: function(targetEl)
		{
			var curleft=0;
			var curtop=0;

			if ($(targetEl).offsetParent)
			{
				curleft=$(targetEl).offsetLeft;
				curtop=$(targetEl).offsetTop;
				/*while (targetEl=$(targetEl).offsetParent)
				{
					curleft+=targetEl.offsetLeft;
					curtop+=targetEl.offsetTop;
				}*/
			}

			return [curleft,curtop];
		},

		/**
		 * Resets an element
		 * @param arg {string} Target element ID.
		 * @TODO switch this to if ("attribute" in $var) maybe...
		 */
		reset:function(arg)
		{
			if ($(arg))
			{
				if (typeof $(arg)=="form")
				{
					$(arg).reset();
				}
				else
				{
					$(arg).update([["innerHTML",""]]);
				}
			}
			else
			{
				throw label.error.msg1;
			}
		},

		/**
		 * Updates an element
		 * @param targetEl {string} Target element ID.
		 * @param args {Array} Literal array of attributes and values.
		 */
		update:function(targetEl, args)
		{
			if ($(targetEl))
			{
				if (typeof args=="object")
				{
					var loop=args.length;
					for (var i=0;i<loop;i++)
					{
						switch(args[i][0])
						{
						case "class":
							if (client.ie)
							{
								$(targetEl).setAttribute("className", args[i][1]);
							}
							else
							{
								$(targetEl).setAttribute("class", args[i][1]);
							}
							break;
						case "innerHTML":
						case "type":
						case "src":
							eval("$(targetEl)."+args[i][0]+"='"+args[i][1]+"';");
							break;
						default:
							$(targetEl).setAttribute(args[i][0] , args[i][1]);
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
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value
		 * @param opacity {integer} The opacity value to set.
		 * @param obj {targetEl} The element ID to update.
		 */
		opacity:function(opacity, targetEl)
		{
			if ($(targetEl))
			{
				var style = $(targetEl).style;
				style.opacity=(opacity/100);
				style.MozOpacity=(opacity/100);
				style.KhtmlOpacity=(opacity/100);
				style.filter="alpha(opacity="+opacity+")";
			}
		},

		/**
		 * Changes an element's opacity to the supplied value, spanning a supplied time frame.
		 * @param obj {string}
		 * @param start {integer}
		 * @param end {integer}
		 * @param ms {integer}
		 */
		opacityChange:function(obj, start, end, ms)
		{
			var speed=Math.round(ms/100);
			var timer=0;
			var i=null;

			if (start>end)
			{
				for (i=start;i>=end;i--)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+obj+"')",(timer*speed));
					timer++;
				}
			}
			else if (start<end)
			{
				for (i=start;i<=end;i++)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+obj+"')",(timer*speed));
					timer++;
				}
			}
		},

		/**
		 * Shifts an element's opacity, spanning a supplied time frame
		 * @param el {string} Target element ID.
		 * @param ms {integer}
		 */
		opacityShift:function(obj, ms)
		{
			if ($(obj).style.opacity===0)
			{
				aFrame.fx.opacityChange(obj, 0, 100, ms);
			}
			else
			{
				aFrame.fx.opacityChange(obj, 100, 0, ms);
			}
		}
	};

	/**
	 * Class for integer properties and manipulation.
	 */
	number=
	{
		/**
		 * Returns true if the number is even.
		 * @param arg {integer}
		 * @returns {Boolean}
		 */
		isEven:function(arg)
		{
			arg=(((arg/2).toString().indexOf("."))>-1)?false:true;
			return arg;
		},

		/**
		 * Returns true if the number is odd.
		 * @param arg {integer}
		 * @returns {Boolean}
		 */
		isOdd:function(arg)
		{
			arg=(((arg/2).toString().indexOf("."))>-1)?true:false;
			return arg;
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
			msg1:"Target element does not exist.",
			msg2:"A server error has occurred.",
			msg3:"Expected an array.",
			msg4:"The following required fields are missing or invalid:",
			msg5:"Could not create object."
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
			loading:"Loading",
			next:"Next",
			login:"Login",
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
	 * Class for URI interaction
	 */
	uri=
	{
		/**
		 * Load a URI from local cache, or makes a server request.
		 * @param uri {string}
		 * @returns {mixed} Instance of URI.
		 * @TODO Fix the for loop!
		 */
		get:function(uri)
		{
			for (var resource in cache)
			{
				if (resource==uri)
				{
					return cache[uri];
				}
			}
			return client.httpRequest(uri, "GET");
		},

		post: function(uri,args)
		{
			for (var resource in cache)
			{
				if (resource==uri)
				{
					return cache[uri];
				}
			}
			return client.httpRequest(uri, "POST");
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
		}
	};

	/**
	 * Public class
	 * @constructor
	 */
	pub=
	{
		/**
		 * Properties
		 */
		ie:client.ie,
		css3:client.css3,
		iconUrl:"http://farm5.static.flickr.com/4065/4474242391_d5ca519f5e_o.gif", // Set this to your own icon/url

		/**
		 * Methods
		 */
		$:client.$,
		cacheTime:cache.getSetTime,
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
		calendar:calendar,
		client:client,
		el:el,
		fx:fx,
		label:label,
		number:number,
		uri:uri,
		validate:validate
	};

	// Declaring private global instances
	var $=function(arg) { return client.$(arg); };
	var error=client.error;

	// Exposing the public class to the client
	return pub;
}();

// Declaring a document scope helper function
var $=function(arg) { return aFrame.$(arg); };

// Prototyping standard objects with aFrame
Number.prototype.isEven=function() { return aFrame.number.isEven(this); };
Number.prototype.isOdd=function() { return aFrame.number.isOdd(this); };
Object.prototype.destroy=function() { return aFrame.destroy(this.id); };
Object.prototype.domID=function() { return aFrame.domID(this.id); };
Object.prototype.reset=function() { return aFrame.reset(this.id); };
Object.prototype.update=function(args) { return aFrame.update(this.id, args); };
String.prototype.domID=function() { return aFrame.domID(this); };
