/**
 * aFrame library
 * http://avoidwork.com/aFrame
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0.beta
 */

/**
 * aFrame singleton
 */
var aFrame=(aFrame)?aFrame:function()
{
	/**
	 * Helper function
	 * @param {mixed} Element ID or array of Element IDs.
	 * @returns {mixed} Instance, or Array of Instances of Elements.
	 */
	$=function(args)
	{
		switch(typeof args)
		{
			case "object":
				alert("sent in an array, expecting one back?");
				instances=[];
				return instances;

			case "string":
			default:
				return document.getElementById(args);
		}
	};

	/**
	 * @param {Boolean} IE detection
	 */
	ie=(document.all)?true:false;

	/**
	 * @param {Array} cache This array holds caches URI resources.
	 */
	cache=[];

	/**
	 * @param {Boolean} CSS3 detection, kinda weak!
	 */
	css3=((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false;
	
	/**
	 * Error class does stuff, eventually.
	 */
	err=
	{
	};
	
	/**
	 * Calendar class will render a calendar, and act as a date picker.
	 */
	calendar=
	{
			clear:false,
			date:new Date(),
			dateMonths:new Array("January","February","March","April","May","June","July","August","September","October","November","December"),
			datePattern:new String("yyyy/mm/dd") // ISO 8601 standard, change to any localized pattern
	};
	
	/**
	 * Client class contains methods to retrieve data.
	 */
	client=
	{

		/**
		 * Receives and caches the URI/xmlHttp response
		 *  set attribute based on typeof maybe?
		 *  @param {Integer} Target element ID.
		 *  @param {String} Attribute to set with response.
		 *  @param {Object} XMLHttp object.
		 * @TODO add a timestamp for expiration.
		 */
		httpGet:function(obj,attribute,xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
					if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
					{
						eval("cache[\""+obj+"\"]="+xmlHttp.responseText+";");
						
						if ($(obj))
						{
							try
							{
								element.update($(obj),[[attribute,xmlHttp.responseText]]);
							}
							catch(err)
							{
								this.error(err);
							};
						}
						else
						{
							throw exception.err1;
						}
					}
					else
					{
						throw exception.err2;
					}
			}
		},

		/**
		 * Creates an xmlHttp request for a URI.
		 */
		httpRequest:function(id,attribute,uri,operation)
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
					catch (e) {}
				}
			}

			(!xmlHttp)?eval("return false"):void(0);

			switch(operation)
			{
			case "get":
				xmlHttp.onreadystatechange=function() { client.httpGet(id,attribute,xmlHttp); };
				xmlHttp.open("GET",uri,true);
				xmlHttp.send(null);
				break;
			case "post":
				// @TODO finish this!
				break;
			};
		},

		/**
		 * Renders a loading (spinning) icon in a target element.
		 * @TODO refactor with element.create()!
		 */
		icon: function(obj)
		{
			if (!$(obj.id+"_loading"))
			{
				var objImage=document.createElement("img");
				objImage.type="image";
				objImage.src=window["icon"].src;
				objImage.setAttribute("id",obj.id+"_loading");
				objImage.setAttribute("alt","");
				(this.ie)?objImage.setAttribute("className","loading"):objImage.setAttribute("class","loading");
				obj.appendChild(objImage);
			}
		}
	};

	/**
	 * Exposes classes, methods & properties.
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
		labels:this.parent.labels,
		
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
		 * Creates an element; optional styling and innerHTML injection.
		 * @param {Array} Literal array of attributes for the new element.
		 * @param {String} Optional target element ID.
		 */
		create:function(args,target)
		{
			if (typeof args=="object")
			{
				var loop=args.length;
				var obj=document.createElement(element);
				
				for (i=0;i<loop;i++)
				{
					switch(args[i][0])
					{
					case "class":
						(this.ie)?obj.setAttribute("className",args[i][1]):href.setAttribute("class",args[i][1]);
						break;
					case "innerHTML":
						obj.innerHTML=args[i][1];
						break;
					default:
						obj.setAttribute(args[i][0],args[i][1]);
						break;
					};
				}
				
				((target==undefined)||(!$(target)))?document.body.appendChild(obj):target.appendChild(obj);
			}
			else
			{
				throw exception.err3;
			}
		},

		/**
		 * Destroys an element if it exists.
		 * @param {Integer} Target element ID.
		 */
		destroy:function(id)
		{
			if ($(id)) { document.body.removeChild($(id)); }
		},

		/**
		 * Overload of reset, to clear an element.
		 * @param {Integer} Target element ID.
		 */
		reset:function(id)
		{
			if ($(id))
			{
				var element=$(id);
				switch(typeof element)
				{
					case "object":
						element.update(id,["innerHTML",""]);
						break;
					case "form":
						$(id).reset();
						break;
				}
			}
			else
			{
				throw exception.err1;
			}
		},

		/**
		 * Updates an element.
		 * @param {Integer} Target element ID.
		 * @param {Array} Literal array of attributes and values.
		 */
		update:function(id,args)
		{
			if ($(id))
			{
				if (typeof args=="object")
				{
					var loop=args.length;
					var obj=$(id);
					
					for (i=0;i<loop;i++)
					{
						switch(args[i][0])
						{
						case "class":
							(this.ie)?obj.setAttribute("className",args[i][1]):href.setAttribute("class",args[i][1]);
							break;
						case "innerHTML":
							obj.innerHTML=args[i][1];
							break;
						default:
							obj.setAttribute(args[i][0],args[i][1]);
							break;
						};
					}
				}
				else
				{
					throw exception.err3;
				}
			}
			else
			{
				throw exception.err1;
			}
		}
	};
	
	/**
	 * Exception class holds exceptions messages
	 */
	exception=
	{
			"err1":"Couldn't find target element",
			"err2":"A server error has occurred",
			"err3":"Expected an array"
	};

	/**
	 * GUI effects
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
			($(id).style.opacity==0)?opacityChange(id,0,100,ms):opacityChange(id,100,0,ms);
		}
	};
	
	/**
	 * Labels is a collection of button labels.
	 */
	var labels=
	{
		"back":"Back",
		"cancel":"Cancel",
		"continue":"Continue",
		"delete":"Delete",
		"edit":"Edit",
		"next":"Next",
		"login":"Login",
		"save":"Save",
		"submit":"Submit"
	};
	
	return constructor;
}();