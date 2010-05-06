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
	 * @param {mixed} Element ID or array of Element IDs.
	 * @returns {mixed} Instance, or Array of Instances of Elements.
	 */
	$=function(args)
	{
		switch(typeof args)
		{
			case "object":
				alert("sent in an array, expecting one back?");
				//instances=[];
				//return instances;
				return null;

			case "string":
			default:
				return document.getElementById(args);
		}
	};

	/**
	 * @param {Boolean} IE detection
	 * @member pub
	 */
	ie=(document.all)?true:false;

	/**
	 * @param {Array} cache This array holds caches URI resources.
	 */
	cache=[];

	/**
	 * Client class contains methods to retrieve data.
	 * @member pub
	 */
	client=
	{

		/**
		 * Receives and caches the URI/xmlHttp response
		 * @member client
		 */
		httpGet:function(obj,xmlHttp)
		{
			if (xmlHttp.readyState==4)
			{
						if ((xmlHttp.status==200)&&(xmlHttp.responseText!=""))
						{
							eval("cache[\""+obj+"\"]="+xmlHttp.responseText+";");

							// chain events here? not sure what to do atm.
							/*switch(obj)
							{
								case "config":
									eval("config=cache.json[\"config\"];");
									(config.keyboard)?document.onkeydown=awFlickr.keyCode:void(0);
									(!config.rightClick)?document.onmousedown=awFlickr.mouseCode:void(0);
									awFlickr.sets(1);
									awFlickr.set("photostream","photostream");
									break;

								case "sets":
									eval("cache.sets=cache.json[\"sets\"];");
									awFlickr.sets(1);
									break;

								default:
									eval("cache.loaded=cache.json[\""+obj+"\"];");
									client.cache();
									break;
							}
						}
						break;

					default:
						document.getElementById(obj).innerHTML=(xmlHttp.status==200)?xmlHttp.responseText:"A server error has occurred";
						break;*/
				}
			}
		},

		/**
		 * Creates an xmlHttp request for a URI.
		 * @member client
		 */
		httpRequest:function(id,resource,type)
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

			xmlHttp.onreadystatechange=function() { client.httpGet(id,xmlHttp,type); };
			xmlHttp.open("GET",resource,true);
			xmlHttp.send(null);
		},

		/**
		 * Renders a loading (spinning) icon in a target element.
		 * @member client
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
	 * @param {Boolean} CSS3 detection, kinda weak!
	 */
	css3=((!document.all)||(navigator.appVersion.indexOf("MSIE 9")>-1))?true:false;

	/**
	 * Element CRUD methods.
	 */
	element=
	{
		/**
		 * Creates an element; optional styling and innerHTML injection.
		 * @member element
		 */
		create:function(element,id,style,content,target)
		{

			var obj=document.createElement(element);
			(id!="")?obj.setAttribute("id",id):void(0);
			(style!="")?obj.setAttribute("style",style):void(0);
			(content!="")?obj.innerHTML=content:void(0);
			(target==undefined)?document.body.appendChild(obj):target.appendChild(obj);
		},

		/**
		 * Destroys an element if it exists.
		 * @member element
		 */
		destroy:function(id)
		{
			($(id))?document.body.removeChild(document.getElementById(id)):void(0);
		},

		/**
		 * Overload of reset, to clear an element.
		 * @member element
		 */
		reset:function(id)
		{
			if ($(id))
			{
				element=$(id);
				switch(typeof element)
				{
					case "object":
						element.innerHTML="";
						break;
				}
			}
		},

		/**
		 * Updates an element
		 * @TODO Make this work; not tested.
		 * @member element
		 */
		update:function(id,attr,value)
		{
			(element=$(id))?element.attr=value:void(0);
		}
	};

	/**
	 * Various GUI effects
	 * @member pub
	 */
	fx=
	{
		/**
		 * Changes an element's opacity to the supplied value.
		 * @member fx
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
		 * @member fx
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
		 * @member fx
		 */
		opacityShift:function(id,ms)
		{
			($(id).style.opacity==0)?opacityChange(id,0,100,ms):opacityChange(id,100,0,ms);
		}
	};

	/**
	 * Public class exposed to the client.
	 */
	pub=
	{
		// Public properties
		ie:this.parent.ie,
		css3:this.parent.css3,

		// Public methods
		$:this.parent.$,
		position:null, //find the position; maybe put this in the element class?

		//Public classes
		client:this.parent.client,
		element:this.parent.element,
		fx:this.parent.fx
	};

	return pub;
}();