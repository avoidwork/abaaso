/**
 * aFrame library
 * http://avoidwork.com/aFrame
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0.beta
 */

/**
 * aFrame singleton.
 */
var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Helper function.
	 *
	 * @param {mixed} Element ID or array of element IDs.
	 * @returns {mixed} Instance or Array of Instances of elements.
	 * @TODO Test!
	 */
	$=function(args)
	{
		switch(typeof args)
		{
		case "object":
			var instances=[];
			for (id in args)
			{
				instances.push(document.getElementById(id));
			}
			return instances;
		case "string":
		default:
			return document.getElementById(args);
		}
	};

	/**
	 * IE detection
	 */
	ie=(document.all)?true:false;

	/**
	 * This array holds cached URI resources.
	 */
	cache=[];

	/**
	 * CSS3 detection, kinda weak!
	 */
	css3=((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false;

	/**
	 * Exception handling.
	 *
	 * @TODO Figure out what to do with this!
	 */
	error=function(args)
	{
		var err = new Error(args);
		alert(err.toString()); // temp!!
	};

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
		 *  set attribute based on typeof maybe?
		 *
		 *  @param {Integer} Target element ID.
		 *  @param {String} Attribute to set with response.
		 *  @param {Object} XMLHttp object.
		 * @TODO add a timestamp for expiration.
		 */
		httpGet:function(target,xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
					if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
					{
						if ($(obj))
						{
							eval("cache[\""+target+"\"]="+xmlHttp.responseText+";");
							element.update($(target),[["innerHTML",xmlHttp.responseText]]);
						}
						else
						{
							throw label.exception.err1;
						}
					}
					else
					{
						throw label.exception.err2;
					}
			}
		},

		/**
		 * Creates an xmlHttp request for a URI.
		 */
		httpRequest:function(target,uri,operation)
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
					xmlHttp.onreadystatechange=function() { client.httpGet(target,xmlHttp); };
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
		icon: function(obj)
		{
			if (!$(obj).id+"_"+label.element.loading)
			{
				var args=
				[
				      [["alt",label.element.loading]],
				      [["id",$(obj).id+"_"+label.element.loading]],
				      [["src",window["aFrame.icon"].src]],
				      [["class","loading"]]
				];

				try
				{
					element.create("img",args,obj);
				}
				catch(e)
				{
					error(e);
				}
			}
		}
	};

	/**
	 * Exposed to the client.
	 * @constructor
	 */
	constructor=
	{
		/**
		 * Classes
		 */
		calendar:this.parent.calendar,
		client:this.parent.client, // add client height/width properties
		element:this.parent.element,
		fx:this.parent.fx,
		label:this.parent.label,
		validate:this.parent.validate,

		/**
		 * Methods
		 */
		$:this.parent.$,
		position:null, //find the position; maybe put this in the element class?

		/**
		 * Properties
		 */
		ie:this.parent.ie,
		css3:this.parent.css3
	};

	/**
	 * Element class provides CRUD methods.
	 */
	element=
	{
		/**
		 * Creates an element.
		 *
		 * @param {String} Type of element to create.
		 * @param {Array} Literal array of attributes for the new element.
		 * @param {String} Optional target element ID.
		 */
		create:function(element,args,target)
		{
			if (typeof args=="object")
			{
				var obj=document.createElement(element);
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
				((target==undefined)||(!$(target)))?document.body.appendChild(obj):target.appendChild(obj);
			}
			else
			{
				throw label.exception.err3;
			}
		},

		/**
		 * Destroys an element if it exists.
		 *
		 * @param {Integer} Target element ID.
		 */
		destroy:function(id)
		{
			if ($(id)) { document.body.removeChild($(id)); }
		},

		/**
		 * Resets an element.
		 *
		 * @param {Integer} Target element ID.
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
				throw label.exception.err1;
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
					throw label.exception.err3;
				}
			}
			else
			{
				throw label.exception.err1;
			}
		}
	};

	/**
	 * GUI effects
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value.
		 */
		opacity:function(id,opacity)
		{
			if ($(id))
			{
				var style=$(id).style;
				style.opacity=(opacity/100);
				style.MozOpacity=(opacity/100);
				style.KhtmlOpacity=(opacity/100);
				style.filter="alpha(opacity="+opacity+")";
			}
		},

		/**
		 * Changes an element's opacity to the supplied value, spanning a supplied timeframe.
		 *
		 * @TODO replace aFrame hook with a reference to the parent object/id/name
		 */
		opacityChange:function(id,start,end,ms)
		{
			var speed=Math.round(ms/100);
			var timer=0;

			if (start>end)
			{
				for (i=start;i>=end;i--)
				{
					setTimeout("aFrame.fx.opacity('"+id+"',"+i+")",(timer*speed));
					timer++;
				}
			}
			else if (start<end)
			{
				for (i=start;i<=end;i++)
				{
					setTimeout("aFrame.fx.opacity('"+id+"',"+i+")",(timer*speed));
					timer++;
				}
			}
		},

		/**
		 * Shifts an element's opacity, spanning a supplied timeframe.
		 */
		opacityShift:function(id,ms)
		{
			($(id).style.opacity==0)?opacityChange(id,0,100,ms):opacityChange(id,100,0,ms);
		}
	};

	/**
	 * Label collection / language pack.
	 * Overload this to change languages..
	 */
	var label=
	{
		exception:
		{
			err1:"Couldn't find target element.",
			err2:"A server error has occurred.",
			err3:"Expected an array."
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
	var validate=
	{
	};

	return constructor;
}();