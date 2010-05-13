/**
 * aFrame library
 * http://avoidwork.com/aFrame
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0.beta
 */

/**
 * aFrame singleton, with RESTful caching.
 */
var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Helper function
	 *
	 * @param {mixed} arg String or Array of element IDs.
	 * @returns {mixed} instances Instance or Array of Instances of elements.
	 */
	$=function(arg)
	{
		if (typeof arg=="object")
		{
			var instances=[];
			var loop=arg.length;
			for (i=0;i<loop;i++)
			{
				instances.push(document.getElementById(arg[i]));
			}
			return instances;
		}

		return document.getElementById(arg);
	};

	/**
	 * IE detection.
	 */
	ie=(document.all)?true:false;

	/**
	 * This array holds cached URI resources.
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
	 * Client class contains methods to retrieve data.
	 * These methods should be executed from a try{} statement.
	 */
	client=
	{

		/**
		 * Receives and caches the URI/xmlHttp response
		 * set attribute based on typeof maybe?
		 *
		 * @param {Integer} Target element ID.
		 * @param {Object} XMLHttp object.
		 * @TODO add a timestamp for expiration.
		 */
		httpGet:function(id,xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
				if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
				{
					if ($(obj))
					{
						// eval in a 2d array with timestamp/response!
						eval("cache[\""+id+"\"]="+xmlHttp.responseText+";");
						element.update(id,[["innerHTML",xmlHttp.responseText]]);
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
		 * Creates an xmlHttp request for a URI.
		 * @member client
		 */
		httpRequest:function(id,uri,type)
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
				switch(operation)
				{
				case "get":
					xmlHttp.onreadystatechange=function() { client.httpGet(id,xmlHttp); };
					xmlHttp.open("GET",uri,true);
					xmlHttp.send(null);
					break;
				case "post":
					// @TODO finish this!
					break;
				};
			}
			catch(e)
			{
				error(e);
			}
		},

		/**
		 * Renders a loading (spinning) icon in a target element.
		 */
		icon: function(id)
		{
			if (!$(id+"_"+label.element.loading))
			{
				var args=
				[
					["alt",label.element.loading],
					["id",id+"_"+label.element.loading],
					["src",window["aFrame.icon"].src],
					["class","loading"]
				];

				try
				{
					element.create("img",args,id);
				}
				catch(e)
				{
					error(e);
				}
			}
		}
	};

	/**
	 * CSS3 detection, kinda weak!
	 */
	css3=((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false;
	
	/**
	 * Element CRUD methods.
	 */
	element=
	{
		/**
		 * Creates an element.
		 *
		 * @param {String} element Type of element to create.
		 * @param {Array} args Literal array of attributes for the new element.
		 * @param {String} target Optional target element ID.
		 */
		create:function(element,args,target)
		{
			if (typeof args=="object")
			{
				var obj=document.createElement(element);
				var loop=args.length;
				for (i=0;i<loop;i++)
				{
					switch(args[i][0])
					{
					case "class":
						(this.ie)?obj.setAttribute("className",args[i][1]):href.setAttribute("class",args[i][1]);
						break;
					case "innerHTML":
					case "type":
					case "src":
						eval("obj."+args[i][0]+"='"+args[i][1]+"';");
						break;
					default:
						obj.setAttribute(args[i][0],args[i][1]);
						break;
					};
				}
				(!$(target))?document.body.appendChild(obj):$(target).appendChild(obj);
			}
			else
			{
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element if it exists.
		 * @param {String} Target element ID.
		 */
		destroy:function(id)
		{
			if ($(id)) { document.body.removeChild($(id)); }
		},

		/**
		 * Resets an element.
		 * @param {String} Target element ID.
		 */
		reset:function(id)
		{
			if ($(id))
			{
				var element=$(id);
				switch(typeof element)
				{
				case "form":
					$(id).reset();
					break;
				case "object":
				default:
					element.update(id,[["innerHTML",""]]);
					break;
				}
			}
			else
			{
				throw label.error.msg1;
			}
		},

		/**
		 * Updates an element.
		 *
		 * @param {Integer} Target element ID.
		 * @param {Array} Literal array of attributes and values.
		 */
		update:function(id,args)
		{
			if ($(id))
			{
				if (typeof args=="object")
				{
					var obj=$(id);
					for (attribute in args)
					{
						switch(attribute[0])
						{
						case "class":
							(this.ie)?obj.setAttribute("className",attribute[1]):href.setAttribute("class",attribute[1]);
							break;
						case "innerHTML":
						case "type":
						case "src":
							obj.attribute[0]=attribute[1];
							break;
						default:
							obj.setAttribute(attribute[0],attribute[1]);
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
	 * Error handling.
	 *
	 * @TODO Figure out what to do with this!
	 */
	error=function(args)
	{
		var err = new Error(args);
		alert(err.toString()); // temp!!
	};
	
	/**
	 * Various GUI effects
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value.
		 */
		opacity:function(opacity,id)
		{
			if ($(id))
			{
				obj=$(id);
				obj.style.opacity=(opacity/100);
				obj.style.MozOpacity=(opacity/100);
				obj.style.KhtmlOpacity=(opacity/100);
				obj.style.filter="alpha(opacity="+opacity+")";
			}
		},

		/**
		 * Changes an element's opacity to the supplied value, spanning a supplied timeframe.
		 */
		opacityChange:function(id,start,end,ms)
		{
			var speed=Math.round(ms/100);
			var timer=0;

			if (start>end)
			{
				for (i=start;i>=end;i--)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+id+"')",(timer*speed));
					timer++;
				}
			}
			else if (start<end)
			{
				for (i=start;i<=end;i++)
				{
					setTimeout("aFrame.fx.opacity("+i+",'"+id+"')",(timer*speed));
					timer++;
				}
			}
		},

		/**
		 * Shifts an element's opacity, spanning a supplied timeframe.
		 */
		opacityShift:function(id,ms)
		{
			($(id).style.opacity==0)?aFrame.fx.opacityChange(id,0,100,ms):aFrame.fx.opacityChange(id,100,0,ms);
		}
	};
	
	/**
	 * Label collection / language pack.
	 * Overload this to change languages..
	 */
	label=
	{
		error:
		{
			msg1:"Couldn't find target element.",
			msg2:"A server error has occurred.",
			msg3:"Expected an array.",
			msg4:"The following required fields are missing or invalid:"
		},

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
	 * Form validation.
	 */
	validate=
	{
		exception:false,
		loop:null,
		msg:label.error.msg4,
		required:[],
		value:null,
		
		invalid:function(arg)
		{
			this.exception=true;
			this.msg+=" "+arg.toString()+", ";
		},
	
		fields:function(args)
		{
			this.required=args;
			this.loop=required.length;
			
			for (i=0;i<this.loop;i++)
			{
				this.value=$(this.required[i][0]).value;
				switch (this.required[i][1])
				{
				case "isDomain":
					(!this.isDomain(this.value))?invalid(this.required[i][2]):void(0);
					break;
				case "isDomainOrIp":
					((!this.isIpAddr(this.value))&&(!this.isDomain(this.value)))?this.invalid(required[i][2]):void(0);
					break;
				case "isIp":
					(!this.isIpAddr(this.value))?this.invalid(required[i][2]):void(0);
					break;
				case "isInteger":
					if (isNaN(this.value))
					{
						this.invalid(required[i][2]);
					}
					else if (required[i][3])
					{
						var y=required[i][3].length;
						var exception=false;
						for (x=0;x<y;x++)
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

			// Throwing exception if an error occurred.
			if (err) { throw msg; }
				
			return !err;
		}
	};

	/**
	 * Exposed to the client.
	 */
	constructor=
	{
		// Cache the AJAX loader img object here!
			
		// Public properties
		ie:this.parent.ie,
		css3:this.parent.css3,

		// Public methods
		$:this.parent.$,
		position:null, //find the position; maybe put this in the element class?

		//Public classes
		calendar:this.parent.calendar,
		client:this.parent.client,
		element:this.parent.element,
		fx:this.parent.fx,
		label:this.parent.label,
		validate:this.parent.validate
	};

	return constructor;
}();