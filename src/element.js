/**
 * Element methods
 *
 * @class element
 * @namespace abaaso
 */
var element = {
	/**
	 * Gets or sets attributes of Element
	 * 
	 * @param  {Mixed}  obj   Element or $ query
	 * @param  {String} name  Attribute name
	 * @param  {Mixed}  value Attribute value
	 * @return {Object}       Element
	 */
	attr : function (obj, key, value) {
		if (typeof value === "string") value = value.trim();

		var regex = /checked|disabled/,
		    target;

		obj = utility.object(obj);

		if (!(obj instanceof Element) || typeof key == "undefined" || String(key).isEmpty()) throw Error(label.error.invalidArguments);

		switch (true) {
			case regex.test(key) && typeof value === "undefined":
				return obj[key];
			case regex.test(key) && typeof value !== "undefined":
				obj[key] = value;
				return obj;
			case obj.nodeName === "SELECT" && key === "selected" && typeof value === "undefined":
				return $("#" + obj.id + " option[selected=\"selected\"]").first() || $("#" + obj.id + " option").first();
			case obj.nodeName === "SELECT" && key === "selected" && typeof value !== "undefined":
				target = $("#" + obj.id + " option[selected=\"selected\"]").first();
				if (typeof target !== "undefined") {
					target.selected = false;
					target.removeAttribute("selected");
				}
				target = $("#" + obj.id + " option[value=\"" + value + "\"]").first();
				target.selected = true;
				target.setAttribute("selected", "selected");
				return obj;
			case typeof value === "undefined":
				return obj.getAttribute(key);
			case value === null:
				obj.removeAttribute(key);
				return obj;
			default:
				obj.setAttribute(key, value);
				return obj;
		}
	},

	/**
	 * Clears an object's innerHTML, or resets it's state
	 *
	 * Events: beforeClear  Fires before the Object is cleared
	 *         afterClear   Fires after the Object is cleared
	 *
	 * @method clear
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Element
	 */
	clear : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		obj.fire("beforeClear");
		switch (true) {
			case typeof obj.reset === "function":
				obj.reset();
				break;
			case typeof obj.value !== "undefined":
				obj.update({innerHTML: "", value: ""});
				break;
			default:
				obj.update({innerHTML: ""});
		}
		obj.fire("afterClear");
		return obj;
	},

	/**
	 * Creates an Element in document.body or a target Element
	 *
	 * An id is generated if not specified with args
	 *
	 * Events: beforeCreate  Fires before the Element has been created, but not set
	 *         afterCreate   Fires after the Element has been appended to it's parent
	 *
	 * @method create
	 * @param  {String} type   Type of Element to create
	 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
	 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
	 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
	 * @return {Object}        Element that was created or undefined
	 */
	create : function (type, args, target, pos) {
		if (typeof type === "undefined" || String(type).isEmpty()) throw Error(label.error.invalidArguments);

		var obj, uid, frag;

		switch (true) {
			case typeof target !== "undefined":
				target = utility.object(target);
				break;
			case typeof args !== "undefined" && (typeof args === "string" || typeof args.childNodes !== "undefined"):
				target = utility.object(args);
				break;
			default:
				target = document.body;
		}

		if (typeof target === "undefined") throw Error(label.error.invalidArguments);
		
		frag = !(target instanceof Element);
		uid  = typeof args !== "undefined"
		        && typeof args !== "string"
		        && typeof args.childNodes === "undefined"
		        && typeof args.id !== "undefined"
		        && typeof $("#" + args.id) === "undefined" ? args.id : utility.genId();

		if (typeof args !== "undefined" && typeof args.id !== "undefined") delete args.id;

		$.fire("beforeCreate", uid);
		if (!frag) target.fire("beforeCreate", uid);
		else if (frag && target.parentNode !== null) target.parentNode.fire("beforeCreate", uid);

		obj = document.createElement(type);
		obj.id = uid;
		if (typeof args === "object" && typeof args.childNodes === "undefined") obj.update(args);
		switch (true) {
			case typeof pos === "undefined":
			case pos === "last":
				target.appendChild(obj);
				break;
			case pos === "first":
				target.prependChild(obj);
				break;
			case pos === "after":
				pos = {};
				pos.after = target;
				target    = target.parentNode;
			case typeof pos.after !== "undefined":
				target.insertBefore(obj, pos.after.nextSibling);
				break;
			case pos === "before":
				pos = {};
				pos.before = target;
				target     = target.parentNode;
			case typeof pos.before !== "undefined":
				target.insertBefore(obj, pos.before);
				break;
			default:
				target.appendChild(obj);
		}

		if (!frag) target.fire("afterCreate", obj);
		else if (frag && target.parentNode !== null) target.parentNode.fire("afterCreate", obj);
		$.fire("afterCreate", obj);
		
		return obj;
	},

	/**
	 * Creates a CSS stylesheet in the View
	 *
	 * @method css
	 * @param  {String} content CSS to put in a style tag
	 * @return {Object}         Element created or undefined
	 */
	css : function (content) {
		var ss, css;
		ss = $("head").first().create("style", {type: "text/css"});
		if (ss.styleSheet) ss.styleSheet.cssText = content;
		else {
			css = document.createTextNode(content);
			ss.appendChild(css);
		}
		return ss;
	},

	/**
	 * Data attribute facade acting as a getter (with coercion) & setter
	 *
	 * @method  data
	 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
	 * @param  {String} key   Data key
	 * @param  {Mixed}  value Boolean, Number or String to set
	 * @return {Mixed}        undefined, Element or value
	 */
	data : function (obj, key, value) {
		var result;

		if (typeof value !== "undefined") {
			typeof obj.dataset === "object" ? obj.dataset[key] = value : element.attr(obj, "data-" + key, value);
			result = obj;
		}
		else result = utility.coerce(typeof obj.dataset === "object" ? obj.dataset[key] : element.attr(obj, "data-" + key));
		return result;
	},

	/**
	 * Destroys an Element
	 *
	 * Events: beforeDestroy  Fires before the destroy starts
	 *         afterDestroy   Fires after the destroy ends
	 *
	 * @method destroy
	 * @param  {Mixed} obj Element or $ query
	 * @return {Undefined} undefined
	 */
	destroy : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		$.fire("beforeDestroy", obj);
		obj.fire("beforeDestroy");
		observer.remove(obj.id);
		if (obj.parentNode !== null) obj.parentNode.removeChild(obj);
		obj.fire("afterDestroy");
		$.fire("afterDestroy", obj.id);
		return undefined;
	},

	/**
	 * Disables an Element
	 *
	 * Events: beforeDisable  Fires before the disable starts
	 *         afterDisable   Fires after the disable ends
	 *
	 * @method disable
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Element
	 */
	disable : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		if (typeof obj.disabled === "boolean" && !obj.disabled) {
			obj.fire("beforeDisable");
			obj.disabled = true;
			obj.fire("afterDisable");
		}
		return obj;
	},

	/**
	 * Enables an Element
	 *
	 * Events: beforeEnable  Fires before the enable starts
	 *         afterEnable   Fires after the enable ends
	 *
	 * @method enable
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Element
	 */
	enable : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		if (typeof obj.disabled === "boolean" && obj.disabled) {
			obj.fire("beforeEnable");
			obj.disabled = false;
			obj.fire("afterEnable");
		}
		return obj;
	},

	/**
	 * Finds descendant childNodes of Element matched by arg
	 *
	 * @method find
	 * @param  {Mixed}  obj Element to search
	 * @param  {String} arg Comma delimited string of descendant selectors
	 * @return {Mixed}      Array of Elements or undefined
	 */
	find : function (obj, arg) {
		var result = [];

		obj = utility.object(obj);
		if (!(obj instanceof Element) || typeof arg !== "string") throw Error(label.error.invalidArguments);
		utility.genId(obj);
		arg.explode().each(function (i) {
			 $("#" + obj.id + " " + i).each(function (o) {
			 	result.add(o);
			 });
		});
		return result;
	},

	/**
	 * Determines if Element has descendants matching arg
	 *
	 * @method has
	 * @param  {Mixed}   obj Element or Array of Elements or $ queries
	 * @param  {String}  arg Type of Element to find
	 * @return {Boolean}     True if 1 or more Elements are found
	 */
	has : function (obj, arg) {
		var result = element.find(obj, arg);
		return (!isNaN(result.length) && result.length > 0);
	},

	/**
	 * Determines if obj has a specific CSS class
	 * 
	 * @method hasClass
	 * @param  {Mixed} obj Element or $ query
	 * @return {Mixed}     Element, Array of Elements or undefined
	 */
	hasClass : function (obj, klass) {
		obj = utility.object(obj);
		return obj.classList.contains(klass);
	},

	/**
	 * Hides an Element if it's visible
	 *
	 * Events: beforeHide  Fires before the object is hidden
	 *         afterHide   Fires after the object is hidden
	 *
	 * @method hide
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Element
	 */
	hide : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		obj.fire("beforeHide");
		switch (true) {
			case typeof obj.hidden === "boolean":
				obj.hidden = true;
				break;
			default:
				obj["data-display"] = obj.style.display;
				obj.style.display = "none";
		}
		obj.fire("afterHide");
		return obj;
	},

	/**
	 * Returns a Boolean indidcating if the Object is hidden
	 *
	 * @method hidden
	 * @param  {Mixed} obj Element or $ query
	 * @return {Boolean}   True if hidden
	 */
	hidden : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		return obj.style.display === "none" || (typeof obj.hidden === "boolean" && obj.hidden);
	},

	/**
	 * Determines if Element is equal to arg, supports nodeNames & CSS2+ selectors
	 *
	 * @method is
	 * @param  {Mixed}   obj Element or $ query
	 * @param  {String}  arg Property to query
	 * @return {Boolean}     True if a match
	 */
	is : function (obj, arg) {
		obj = utility.object(obj);

		if (!(obj instanceof Element) || typeof arg !== "string") throw Error(label.error.invalidArguments);

		utility.genId(obj);
		return /^:/.test(arg) ? (element.find(obj.parentNode, obj.nodeName.toLowerCase() + arg).contains(obj)) : new RegExp(arg, "i").test(obj.nodeName);
	},

	/**
	 * Adds or removes a CSS class
	 *
	 * Events: beforeClassChange  Fires before the Object's class is changed
	 *         afterClassChange   Fires after the Object's class is changed
	 *
	 * @method clear
	 * @param  {Mixed}   obj Element or $ query
	 * @param  {String}  arg Class to add or remove (can be a wildcard)
	 * @param  {Boolean} add Boolean to add or remove, defaults to true
	 * @return {Object}      Element
	 */
	klass : function (obj, arg, add) {
		var classes;

		obj = utility.object(obj);

		if (!(obj instanceof Element) || String(arg).isEmpty()) throw Error(label.error.invalidArguments);

		obj.fire("beforeClassChange");
		add = (add !== false);
		arg = arg.explode(" ");
		if (add) arg.each(function (i) { obj.classList.add(i); });
		else arg.each(function (i) {
			if (i !== "*") obj.classList.remove(i);
			else {
				obj.className.explode(" ").each(function (x) { obj.classList.remove(x); });
				return false;
			}
		});
		obj.fire("afterClassChange");
		return obj;
	},

	/**
	 * Finds the position of an element
	 *
	 * @method position
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Object {top: n, right: n, bottom: n, left: n}
	 */
	position : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		var left, top, height, width;

		left   = top = 0;
		width  = obj.offsetWidth;
		height = obj.offsetHeight;

		if (obj.offsetParent) {
			top    = obj.offsetTop;
			left   = obj.offsetLeft;

			while (obj = obj.offsetParent) {
				left += obj.offsetLeft;
				top  += obj.offsetTop;
			}
		}

		return {
			top    : top,
			right  : document.documentElement.clientWidth  - (left + width),
			bottom : document.documentElement.clientHeight + global.scrollY - (top + height),
			left   : left
		};
	},

	/**
	 * Prepends an Element to an Element
	 * 
	 * @method prependChild
	 * @param  {Object} obj   Element or $ query
	 * @param  {Object} child Child Element
	 * @return {Object}       Element
	 */
	prependChild : function (obj, child) {
		obj = utility.object(obj);

		if (!(obj instanceof Element) || !(child instanceof Element)) throw Error(label.error.invalidArguments);
		
		return obj.childNodes.length === 0 ? obj.appendChild(child) : obj.insertBefore(child, obj.childNodes[0]);
	},

	/**
	 * Shows an Element if it's not visible
	 *
	 * Events: beforeEnable  Fires before the object is visible
	 *         afterEnable   Fires after the object is visible
	 *
	 * @method show
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Element
	 */
	show : function (obj) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		obj.fire("beforeShow");
		switch (true) {
			case typeof obj.hidden === "boolean":
				obj.hidden = false;
				break;
			default:
				obj.style.display = obj.getAttribute("data-display") !== null ? obj.getAttribute("data-display") : "inherit";
		}
		obj.fire("afterShow");
		return obj;
	},

	/**
	 * Returns the size of the Object
	 *
	 * @method size
	 * @param  {Mixed} obj Element or $ query
	 * @return {Object}    Size {height: n, width:n}
	 */
	size : function (obj) {
		obj = utility.object(obj);

		var num, height, width;

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		/**
		 * Casts n to a number or returns zero
		 *
		 * @param  {Mixed} n The value to cast
		 * @return {Number}  The casted value or zero
		 */
		num = function (n) {
			return !isNaN(parseInt(n)) ? parseInt(n) : 0;
		};

		height = obj.offsetHeight + num(obj.style.paddingTop)  + num(obj.style.paddingBottom) + num(obj.style.borderTop)  + num(obj.style.borderBottom);
		width  = obj.offsetWidth  + num(obj.style.paddingLeft) + num(obj.style.paddingRight)  + num(obj.style.borderLeft) + num(obj.style.borderRight);

		return {height: height, width: width};
	},

	/**
	 * Getter / setter for an Element's text
	 * 
	 * @param  {Object} obj Element or $ query
	 * @param  {String} arg [Optional] Value to set
	 * @return {Object}     Element
	 */
	text : function (obj, arg) {
		obj = utility.object(obj);

		var key     = typeof obj.textContent !== "undefined" ? "textContent" : "innerText",
		    payload = {},
		    set     = false;

		if (typeof arg !== "undefined") {
			set          = true;
			payload[key] = arg;
		}

		return set ? element.update(obj, payload) : obj[key];
	},

	/**
	 * Toggles a CSS class
	 * 
	 * @param  {Object} obj Element, or $ query
	 * @param  {String} arg CSS class to toggle
	 * @return {Object}     Element
	 */
	toggleClass : function (obj, arg) {
		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		obj.classList.toggle(arg);
		return obj;
	},

	/**
	 * Updates an Element
	 *
	 * Events: beforeUpdate  Fires before the update starts
	 *         afterUpdate   Fires after the update ends
	 *
	 * @method update
	 * @param  {Mixed}  obj  Element or $ query
	 * @param  {Object} args Collection of properties
	 * @return {Object}      Element
	 */
	update : function (obj, args) {
		obj  = utility.object(obj);
		args = args || {};
		var regex;

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		obj.fire("beforeUpdate");
		regex = /innerHTML|innerText|textContent|type|src/;

		utility.iterate(args, function (v, k) {
			switch (true) {
				case regex.test(k):
					obj[k] = v;
					break;
				case k === "class":
					!v.isEmpty() ? obj.addClass(v) : obj.removeClass("*");
					break;
				case k.indexOf("data-") === 0:
					element.data(obj, k.replace("data-", ""), v);
					break;
				case "id":
					var o = observer.listeners;
					if (typeof o[obj.id] !== "undefined") {
						o[k] = utility.clone(o[obj.id]);
						delete o[obj.id];
					}
				default:
					obj.attr(k, v);
			}
		});

		obj.fire("afterUpdate");
		return obj;
	},

	/**
	 * Gets or sets the value of Element
	 *
	 * Events: beforeValue  Fires before the object receives a new value
	 *         afterValue   Fires after the object receives a new value
	 * 
	 * @param  {Mixed}  obj   Element or $ query
	 * @param  {Mixed}  value [Optional] Value to set
	 * @return {Object}       Element
	 */
	val : function (obj, value) {
		var output = null, items;

		obj = utility.object(obj);

		if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

		switch (true) {
			case typeof value === "undefined":
				switch (true) {
					case (/radio|checkbox/gi.test(obj.type)):
						if (obj.name.isEmpty()) throw Error(label.error.expectedProperty);
						items = $("input[name='" + obj.name + "']");
						items.each(function (i) {
							if (output !== null) return;
							if (i.checked) output = i.value;
						});
						break;
					case (/select/gi.test(obj.type)):
						output = obj.options[obj.selectedIndex].value;
						break;
					default:
						output = typeof obj.value !== "undefined" ? obj.value : element.text(obj);
				}
				break;
			default:
				value = String(value);
				obj.fire("beforeValue");
				switch (true) {
					case (/radio|checkbox/gi.test(obj.type)):
						items = $("input[name='" + obj.name + "']");
						items.each(function (i) {
							if (output !== null) return;
							if (i.value === value) {
								i.checked = true;
								output    = i;
							}
						});
						break;
					case (/select/gi.test(obj.type)):
						array.cast(obj.options).each(function (i) {
							if (output !== null) return;
							if (i.value === value) {
								i.selected = true;
								output     = i;
							}
						});
						break;
					default:
						typeof obj.value !== "undefined" ? obj.value = value : element.text(obj, value);
				}
				obj.fire("afterValue");
				output = obj;
		}
		return output;
	}
};
