/**
 * aFrame
 * http://avoidwork.com/aFrame
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version Prototype
 */

var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Helper function
	 * Returns an instance, or an array of instances depending on the what is passed in.
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
	 * Renders a loading icon in a target element
	 * @param {String} id Target element ID.
	 */
	icon=function(id)
	{
		if (!window["aFrame.icon"])
		{
			window["aFrame.icon"]=new Image();
			window["aFrame.icon"].src="http://farm5.static.flickr.com/4065/4474242391_d5ca519f5e_o.gif";				
		}
		
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
	};
	
	/**
	 * IE detection
	 * Basic, this should be extended with a version number.
	 */
	ie=(document.all)?true:false;

	/**
	 * This array holds cached URI resources.
	 * This should be checked prior to httpGet();
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
	 * Class contains methods to get and post data
	 */
	client=
	{	
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
		}
	};

	/**
	 * CSS3 detection
	 * @TODO Make this better!
	 */
	css3=((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false;

	/**
	 * Encodes a category name to a dom friendly id
	 * @param {String} sName The category name.
	 * @returns {String} A DOM friendly format.
	 */
	domID=function(arg)
	{
		arg = arg.toString(); 
		if (arg!="")
		{
			arg = arg.replace(/(\&|,|(\s)|\/)/gi,"");
		}
		return arg.toLowerCase();
	};
	
	/**
	 * Element CRUD methods
	 */
	element=
	{
		/**
		 * Creates an element
		 * @param {String} element Type of element to create.
		 * @param {Array} args Literal array of attributes for the new element.
		 * @param {String} target Optional target element ID.
		 */
		create:function(el,attributes,obj)
		{
			var element = el;
			var args = attributes;
			var target = obj;
			
			if (typeof args=="object")
			{
				var obj=document.createElement(element);
				var loop=args.length;
				for (i=0;i<loop;i++)
				{
					switch(args[i][0])
					{
					case "class":
						(ie)?obj.setAttribute("className",args[i][1]):obj.setAttribute("class",args[i][1]);
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
				alert("here");
				throw label.error.msg3;
			}
		},

		/**
		 * Destroys an element
		 * @param {String} id Target element ID.
		 */
		destroy:function(id)
		{
			if ($(id)) { document.body.removeChild($(id)); }
		},

		/**
		 * Resets an element
		 * @param {String} id Target element ID.
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
		 * Updates an element
		 * @param {Integer} id Target element ID.
		 * @param {Array} args Literal array of attributes and values.
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
	 * Error handling
	 * @param {String} args Error message to display.
	 * @TODO Figure out what to do with this!
	 */
	error=function(args)
	{
		var err = new Error(args);
		alert(err.toString()); // temp!!
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
				obj=$(id);
				obj.style.opacity=(opacity/100);
				obj.style.MozOpacity=(opacity/100);
				obj.style.KhtmlOpacity=(opacity/100);
				obj.style.filter="alpha(opacity="+opacity+")";
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
	 * Class of labels
	 */
	label=
	{
		/**
		 * Error messages that are thrown.
		 */
		error:
		{
			msg1:"Couldn't find target element.",
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
	 * Class for number properties and manipulation
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
	 * Class for URI interaction
	 */
	uri=
	{
		/**
		 * Load a URI from local cache, or makes a server request.
		 * @param {String} uri 
		 * @returns {Mixed} Instance of URI.
		 */
		get:function(uri)
		{
			type=(type=="undefined")?"GET":type;
				
			for (var resource in cache)
			{
				if (resource==uri) { return cache[uri]; }
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
			this.exception=true;
			this.msg+=" "+arg.toString()+", ";
		},
	
		/**
		 * Validates the value of elements based on the args passed in.
		 * @param {Array} args
		 * @returns {Boolean}
		 */
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

			if (err) { throw msg; }
				
			return !err;
		}
	};

	/**
	 * Public class
	 */
	constructor=
	{		
		/**
		 * Properties
		 */
		ie:this.parent.ie,
		css3:this.parent.css3,

		/**
		 * Methods
		 */
		$:this.parent.$,
		create:this.parent.element.create,
		destroy:this.parent.element.desotry,
		domID:this.parent.domID,
		error:this.parent.error,
		icon:this.parent.icon,
		isEven:this.parent.number.isEven,
		isOdd:this.parent.number.isOdd,
		position:null, //find the position; maybe put this in the element class?
		reset:this.parent.element.reset,
		update:this.parent.element.update,

		/**
		 * Classes
		 */
		calendar:this.parent.calendar,
		fx:this.parent.fx,
		label:this.parent.label,
		uri:this.parent.uri,
		validate:this.parent.validate
	};

	/**
	 * Exposing the public class
	 */
	return constructor;
}();