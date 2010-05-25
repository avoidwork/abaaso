/**
 * aFrame
 * http://avoidwork.com/aFrame
 *
 * "An A-frame is a basic structure designed to bear a load in a lightweight economical manner."
 * aFrame provides a set of classes and object prototyping to ease the creation and maintenance of pure JavaScript web applications.
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version Prototype
 */

var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * This array holds cached URI resources.
	 * This should be checked prior to httpGet();
	 * @TODO Set a global timeout value, 0 or Xms before a cache item expires.
	 */
	cache=[];

	/**
	 * Calendar class will render a calendar, and act as a date picker.
	 */
	calendar=
	{
		dateCur:new Date(),
		pattern:new String("yyyy/mm/dd"), // ISO 8601 standard, change to any localized pattern

		/**
		 * Creates a calendar in the window.
		 * @param initEl {string} Element that called this function
		 * @param formEl {string} Form element that will receive the calendar value
		 * @param clear {boolean} Optional boolean for displaying optional Clear anchor in calendar header
		 */
		create: function(initEl, formEl, clear)
		{
			var args=null;
			clear=(clear==undefined)?false:validate.bool(clear);
			var dateStamp=($(formEl).value!="")?new Date($(formEl).value):new Date();
			var pos=element.position(initEl);

			$(initEl).blur();
			($(formEl).value=="Invalid Date")?$(formEl).value="":void(0);

			($("aFrame.calendar"))?element.destroy("aFrame.calendar"):void(0);
			element.create("div", [["id", "aFrame.calendar"],["style","top:"+pos[1]+"px;left:"+pos[0]+"px;"]]);
			renderCalendar("aFrame.calendar", dateStamp, formEl, clear);
		},

		/**
		 * Gets the days in a month
		 * @param month {integer}
		 * @param year {integer}
		 * @returns {integer}
		 */
		dateDays: function(month, year)
		{
			return(32-new Date(year, month, 32).getDate());
		},

		/**
		 * Returns a date based on calendar.pattern
		 * @param dateStamp {date}
		 * @returns {string}
		 */
		dateOutput: function(dateStamp)
		{
			var output=new String(pattern);
			var outputDate=new Date(dateStamp);

			output=output.replace(/dd/,outputDate.getDate());
			output=output.replace(/mm/,outputDate.getMonth()+1);
			output=output.replace(/yyyy/,outputDate.getFullYear());

			return(output);
		},

		/**
		 * Renders a "day" div in the calendar
		 * @param targetEl {string}
		 * @param dateStamp {date}
		 * @param formEl {string}
		 */
		renderDay: function(targetEl, dateStamp, formEl)
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
				else if ((dateStamp.getDay()==0)||(dateStamp.getDay()==6))
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
		},

		/**
		 * Renders the calendar
		 * @param targetEl {string} Target element.
		 * @param dateStamp {string} Date to work with.
		 * @param formEl {string} Form element to update.
		 * @param clear {boolean} Value reflects displaying the Clear option in the Calendar Header.
		 */
		renderCalendar: function(targetEl, dateStamp, formEl, clear)
		{
			dateStamp=new Date(dateStamp);

			if ($(targetEl))
			{
				$(targetEl).reset();

				var datePrev= new Date;
				var dateNext=new Date;
				var loop=dateDays(dateStamp.getMonth(), dateStamp.getFullYear());

				switch (dateCur.getMonth())
				{
				case 0:
					datePrev.setDate(1);
					datePrev.setMonth(11);
					datePrev.setFullYear(dateStamp.getFullYear()-1)
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
					dateNext.setFullYear(dateStamp.getFullYear()+1)
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

				element.create("div", ["id","calendarTop"], targetEl);
				(clear)?element.create("a", [["id","calendarClear"], ["innerHTML", label.element.clear], ["onclick","aFrame.reset('"+element+"');aFrame.destroy('"+targetEl+"')"]], "calendarTop"):void(0);
				element.create("a", [["id","calendarClose"], ["innerHTML", label.element.close], ["onclick","aFrame.destroy('"+targetEl+"')"]], "calendarTop");
				element.create("div", [["id","calendarHeader"]], targetEl);
				element.create("a", [["id","calendarPrev"], ["innerHTML","&lt;"], ["onclick","aFrame.calendar.renderCalendar('"+targetEl+"','"+datePrev.toDateString()+"','"+formEl+"');"]], "calendarHeader");
				element.create("span", [["id","calendarMonth"], ["innerHTML", (label.month.(dateStamp.getMonth())+" "+dateStamp.getFullYear())]], "calendarHeader");
				element.create("a", [["id","calendarNext"], ["innerHTML","&gt;"], ["onclick","aFrame.calendar.renderCalendar('"+targetEl+"','"+dateNext.toDateString()+"','"+formEl+"');"]], "calendarHeader");
				element.create("div"[["id","calendarDays"]], targetEl);

				for (i=1;i<=loop;i++)
				{
					dateStamp.setDate(i)
					renderDay("calendarDays", dateStamp, formEl);
				}
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
		* Helper function
		* @param arg {mixed} String or Array of element IDs.
		* @returns {mixed} instances Instance or Array of Instances of elements.
		*/
		$:function(arg)
		{
			if (typeof arg=="object")
			{
				var instances=[];
				var loop=arg.length;
				for (var i=0;i<loop;i++)
				{
					instances.push(document.getElementById(arg[i]));
				}
				return instances;
			}
			return document.getElementById(arg);
		},

		/**
		* Error handling
		* @param arg {String} Error message to display.
		* @TODO Figure out what to do with this!
		*/
		error:function(arg)
		{
			var err = new Error(arg);
			alert(err.toString());
		},

		/**
		 * Receives and caches the URI/xmlHttp response
		 * @param xmlHttp {Object} XMLHttp object.
		 * @returns {Mixed} Instance of URI
		 */
		httpGet:function(xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
				if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
				{
					if ($(obj))
					{
						eval("cache[\""+id+"\"]="+xmlHttp.responseText+";");
						return xmlHttp.responseText;
					}
					else
					{
						throw label.error.msg1;
					}
				}
				else
				{
					throw label.error.msg2;
				}
			}
		},

		/**
		 * Creates an xmlHttp request for a URI
		 * @param uri {String} The resource to interact with.
		 * @param type {String} The type of interaction.
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
				catch (e)
				{
					try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
					catch (e)
					{
						error(e);
					}
				}
			}

			(!xmlHttp)?eval("return false"):void(0);

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
				};
			}
			catch(e)
			{
				error(e);
			}
		},

		/**
		 * Renders a loading icon in a target element
		 * @param el {String} Target element ID.
		*/
		icon:function(el)
		{
			if (!window["aFrame.icon"])
			{
				window["aFrame.icon"]=new Image();
				window["aFrame.icon"].src=constructor.iconUrl;
			}

			if (!$(el+"_"+label.element.loading.toLocaleLowerCase()))
			{
				var args=
				[
					["alt",label.element.loading],
					["id",el+"_"+label.element.loading.toLocaleLowerCase()],
					["src",window["aFrame.icon"].src],
					["class","loading"]
				];

				try
				{
					element.create("img",args,el);
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
	element=
	{
		/**
		 * Creates an element
		 * @param type {String} Type of element to create.
		 * @param args {Array} Literal array of attributes for the new element.
		 * @param targetEl {String} Optional target element ID.
		 */
		create:function(type, args, targetEl)
		{
			if (typeof args=="object")
			{
				var el=document.createElement(type);
				var loop=args.length;
				for (var i=0;i<loop;i++)
				{
					switch(args[i][0])
					{
					case "class":
						(ie)?el.setAttribute("className",args[i][1]):el.setAttribute("class",args[i][1]);
						break;
					case "innerHTML":
					case "type":
					case "src":
						eval("el."+args[i][0]+"='"+args[i][1]+"';");
						break;
					default:
						el.setAttribute(args[i][0],args[i][1]);
						break;
					};
				}
				($(targetEl))?$(targetEl).appendChild(el):document.body.appendChild(el);
			}
			else
			{
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element
		 * @param el {String} Target element to remove.
		 */
		destroy:function(el)
		{
			if ($(el))
			{
				document.body.removeChild($(el));
			}
		},

		/**
		 * Encodes a string to a DOM friendly ID
		 * @param arg {String} The string to encode.
		 * @returns {String} Returns a lowercase stripped string.
		 */
		domID:function(arg)
		{
			return arg.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
		},

		/**
		 * Finds the position of an element
		 * @param el {string} The element id to get
		 * @TODO Fix this!
		 */
		position: function(el)
		{
			var curleft=curtop=0;

			if ($(el).offsetParent)
			{
				curleft=$(el).offsetLeft;
				curtop=$(el).offsetTop;
				while (el=$(el).offsetParent)
				{
					curleft+=el.offsetLeft;
					curtop+=el.offsetTop;
				}
			}

			return [curleft,curtop];
		},

		/**
		 * Resets an element
		 * @param el {String} Target element ID.
		 * @TODO switch this to if ("attribute" in $var) maybe...
		 */
		reset:function(el)
		{
			if ($(el))
			{
				switch(typeof $(el))
				{
				case "form":
					$(el).reset();
					break;
				case "object":
				default:
					$(el).update([["innerHTML",""]]);
				}
			}
			else
			{
				throw label.error.msg1;
			}
		},

		/**
		 * Updates an element
		 * @param el {String} Target element ID.
		 * @param args {Array} Literal array of attributes and values.
		 */
		update:function(el, args)
		{
			if ($(el))
			{
				if (typeof args=="object")
				{
					var loop=args.length;
					for (var i=0;i<loop;i++)
					{
						switch(args[i][0])
						{
						case "class":
							(ie)?$(el).setAttribute("className", args[i][1]):$(el).setAttribute("class", args[i][1]);
							break;
						case "innerHTML":
						case "type":
						case "src":
							eval("el."+args[i][0]+"='"+args[i][1]+"';");
							break;
						default:
							$(el).setAttribute(args[i][0] ,args[i][1]);
							break;
						};
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
		 * @param opacity {Integer} The opacity value to set.
		 * @param el {String} The element ID to update.
		 */
		opacity:function(opacity, el)
		{
			if ($(el))
			{
				$(el).style.opacity=(opacity/100);
				$(el).style.MozOpacity=(opacity/100);
				$(el).style.KhtmlOpacity=(opacity/100);
				$(el).style.filter="alpha(opacity="+opacity+")";
			}
		},

		/**
		 * Changes an element's opacity to the supplied value, spanning a supplied time frame.
		 * @param id {String}
		 * @param start {Integer}
		 * @param end {Integer}
		 * @param ms {Integer}
		 */
		opacityChange:function(id, start, end, ms)
		{
			var speed=Math.round(ms/100);
			var timer=0;

			if (start>end)
			{
				for (var i=start;i>=end;i--)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+id+"')",(timer*speed));
					timer++;
				}
			}
			else if (start<end)
			{
				for (var i=start;i<=end;i++)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+id+"')",(timer*speed));
					timer++;
				}
			}
		},

		/**
		 * Shifts an element's opacity, spanning a supplied time frame
		 * @param el {String} Target element ID.
		 * @param ms {Integer}
		 */
		opacityShift:function(el, ms)
		{
			($(el).style.opacity==0)?aFrame.fx.opacityChange(el, 0, 100, ms):aFrame.fx.opacityChange(el, 100, 0, ms);
		}
	};

	/**
	 * Class for integer properties and manipulation.
	 */
	number=
	{
		/**
		 * Returns true if the number is even.
		 * @param arg {Integer}
		 * @returns {Boolean}
		 */
		isEven:function(arg)
		{
			arg=(((parseInt(arg)/2).toString().indexOf("."))>-1)?false:true;
			return arg;
		},

		/**
		 * Returns true if the number is odd.
		 * @param arg {Integer}
		 * @returns {Boolean}
		 */
		isOdd:function(arg)
		{
			arg=(((parseInt(arg)/2).toString().indexOf("."))>-1)?true:false;
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
			msg4:"The following required fields are missing or invalid:"
		},

		/**
		 * Common element labels.
		 */
		element:
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
		month:
		{
			1:"January",
			2:"February",
			3:"March",
			4:"April",
			5:"May",
			6:"June",
			7:"July",
			8:"August",
			9:"September",
			10:"October",
			11:"November",
			12:"December"
		}
	};

	/**
	 * Class for URI interaction
	 */
	uri=
	{
		/**
		 * Load a URI from local cache, or makes a server request.
		 * @param uri {String}
		 * @returns {Mixed} Instance of URI.
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
			return client.httpRequest(uri,"GET");
		},

		post: function(uri,args)
		{
			void(0);
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
		 * Validates a boolean is passed in
		 * @param args {boolean}
		 * @returns {boolean}
		 */
 		bool: function(args)
		{
			switch(args)
			{
				case true:
				case false:
					return args;
				default:
					return false;
			}
		},

		/**
		 * Sets an exception and appends to the message displayed to the Client.
		 * @param args {String}
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
					(!isDomain(value))?invalid(required[i][2]):void(0);
					break;
				case "isDomainOrIp":
					((!isIpAddr(value))&&(!isDomain(value)))?invalid(required[i][2]):void(0);
					break;
				case "isIp":
					(!isIpAddr(value))?invalid(required[i][2]):void(0);
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
							exception=(parseInt(val)==parseInt(required[i][3][x]))?false:true;
							if (!exception) { break; }
						}
						(exception)?invalid(required[i][2]):void(0);
					}
					break;
				case "isNotEmpty":
					(($(required[i][0]).style.display!="none") && (val=="")) ? invalid(required[i][2]) : void(0);
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
	constructor=
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
		create:element.create,
		destroy:element.destroy,
		domID:element.domID,
		error:client.error,
		icon:client.icon,
		position:null, //find the position; maybe put this in the element class?
		reset:element.reset,
		update:element.update,

		/**
		 * Classes
		 */
		calendar:calendar,
		el:element,
		element:element,
		fx:fx,
		label:label,
		number:number,
		uri:uri,
		validate:validate
	};

	/**
	 * Globals
	 */
	$=client.$;
	error=client.error;
	ie=client.ie;

	/**
	 * Exposing the constructor to the client
	 */
	return constructor;
}();

/**
 * Registering a global helper
 */
var $=function(args) { return aFrame.$(args); };

/**
 * Adding aFrame to objects
 */
Number.prototype.isEven=function() { return aFrame.number.isEven(this); };
Number.prototype.isOdd=function() { return aFrame.number.isOdd(this); };
Object.prototype.destroy=function() { return aFrame.destroy(this.id); };
Object.prototype.domID=function() { return aFrame.domID(this.id); };
Object.prototype.reset=function() { return aFrame.domID(this.id); };
Object.prototype.update=function(args) { return aFrame.domID(this.id, args); };
String.prototype.domID=function() { return aFrame.domID(this); };
