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
	 */
	$=function(args)
	{
		switch(typeof args)
		{
		case "object":
			alert("sent in an array, expecting one back?");
			var instances=[];
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
	ex=function(args)
	{
		alert(args); // temp!!
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
		httpGet:function(obj,attribute,xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
					if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
					{
						eval("cache[\""+obj+"\"]="+xmlHttp.responseText+";");
						
						if ($(obj))
						{
							element.update($(obj),[[attribute,xmlHttp.responseText]]);
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
					catch (e)
					{
						ex(e);
					}
				}
			}

			(!xmlHttp)?eval("return false"):void(0);

			try
			{
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
			}
			catch(e)
			{
				ex(e);
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
				
				element.create("img",args,obj);
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
					case "type":
					case "src":
						obj.args[i][0]=args[i][1];
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
					case "object":
						element.update(id,[["innerHTML",""]]);
						break;
					case "form":
						$(id).reset();
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
						case "type":
						case "src":
							obj.args[i][0]=args[i][1];
							break;
						default:
							obj.setAttribute(args[i][0],args[i][1]);
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