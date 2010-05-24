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
		clear:false,
		date:new Date(),
		pattern:new String("yyyy/mm/dd") // ISO 8601 standard, change to any localized pattern
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
		 * @param {mixed} arg String or Array of element IDs.
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
		 * Receives and caches the URI/xmlHttp response
		 * @param {Integer} Target element ID.
		 * @param {Object} XMLHttp object.
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
		 * @param {String} uri
		 * @param {String} type
		 * @TODO Complete the POST portion
		 */
		httpRequest:function(uri,type)
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
		 * @param {String} id Target element ID.
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
		 * @param {String} type Type of element to create.
		 * @param {Array} args Literal array of attributes for the new element.
		 * @param {String} target Optional target element ID.
		 */
		create:function(type,args,target)
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
				($(target))?$(target).appendChild(el):document.body.appendChild(el);
			}
			else
			{
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element
		 * @param {String} obj Target
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
		 * @param {String} arg The string to encode.
		 * @returns {String} Returns a lowercase stripped string.
		 */
		domID:function(args)
		{
			return args.toString().replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
		},

		/**
		 * Resets an element
		 * @param {String} id Target element ID.
		 * @TODO switch this to if ("attribute" in $var) maybe...
		 */
		reset:function(id)
		{
			if ($(id))
			{
				switch(typeof $(id))
				{
				case "form":
					$(id).reset();
					break;
				case "object":
				default:
					$(id).update(id,[["innerHTML",""]]);
				}
			}
			else
			{
				throw label.error.msg1;
			}
		},

		/**
		 * Updates an element
		 * @param {Integer} obj Target
		 * @param {Array} args Literal array of attributes and values.
		 */
		update:function(el,args)
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
	 * Error handling
	 * @param {String} args Error message to display.
	 * @TODO Figure out what to do with this!
	 */
	error=function(args)
	{
		var err = new Error(args);
		//(console)?console.log(err.toString()):alert(err.toString());
		alert(err.toString());
	};

	/**
	 * Class of GUI effects
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value
		 * @param {Integer} opacity The opacity value to set.
		 * @param {String} id The element ID to update.
		 */
		opacity:function(opacity,id)
		{
			if ($(id))
			{
				$(id).style.opacity=(opacity/100);
				$(id).style.MozOpacity=(opacity/100);
				$(id).style.KhtmlOpacity=(opacity/100);
				$(id).style.filter="alpha(opacity="+opacity+")";
			}
		},

		/**
		 * Changes an element's opacity to the supplied value, spanning a supplied time frame
		 * @param {Integer} id
		 * @param {Integer} start
		 * @param {Integer} end
		 * @param {Integer} ms
		 */
		opacityChange:function(id,start,end,ms)
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
		 * @param {Integer} id
		 * @param {Integer} ms
		 */
		opacityShift:function(id,ms)
		{
			($(id).style.opacity==0)?aFrame.fx.opacityChange(id,0,100,ms):aFrame.fx.opacityChange(id,100,0,ms);
		}
	};

	/**
	 * Class for integer properties and manipulation
	 */
	number=
	{
		isEven:function(arg)
		{
			arg=(((parseInt(arg)/2).toString().indexOf("."))>-1)?false:true;
			return arg;
		},

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
		 * @param {String} uri
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
		 * Sets an exception and appends to the message displayed to the Client.
		 */
		invalid:function(arg)
		{
			exception=true;
			msg+=" "+arg.toString()+", ";
		},

		/**
		 * Validates the value of elements based on the args passed in.
		 * @param {Array} args
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
		iconUrl:"http://farm5.static.flickr.com/4065/4474242391_d5ca519f5e_o.gif", // Default, change this

		/**
		 * Methods
		 */
		$:client.$,
		create:element.create,
		destroy:element.destroy,
		domID:element.domID,
		error:error,
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
	 * Global Methods
	 */
	$=client.$;
	ie=client.ie;

	return constructor;
}();

/**
 * Registering a Global Helper
 */
var $=function(args) { return aFrame.$(args); };

/**
 * Extending standard objects
 */
Number.prototype.isEven=function() { return aFrame.number.isEven(this); };
Number.prototype.isOdd=function() { return aFrame.number.isOdd(this); };
Object.prototype.destroy=function() { return aFrame.destroy(this.id); };
Object.prototype.domID=function() { return aFrame.domID(this.id); };
Object.prototype.reset=function() { return aFrame.domID(this.id); };
Object.prototype.update=function(args) { return aFrame.domID(this.id, args); };
String.prototype.domID=function() { return aFrame.domID(this); };
