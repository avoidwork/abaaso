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
	 * @param  {Mixed}  obj   Element
	 * @param  {String} name  Attribute name
	 * @param  {Mixed}  value Attribute value
	 * @return {Object}       Element
	 */
	attr : function (obj, key, value) {
		if (typeof value === "string") value = string.trim(value);

		var target, result;

		utility.genId(obj, true);

		if (regex.checked_disabled.test(key) && value === undefined) return obj[key];
		else if (regex.checked_disabled.test(key) && value !== undefined) obj[key] = value;
		else if (obj.nodeName === "SELECT" && key === "selected" && value === undefined) return $("#" + obj.id + " option[selected=\"selected\"]")[0] || $("#" + obj.id + " option")[0];
		else if (obj.nodeName === "SELECT" && key === "selected" && value !== undefined) {
			target = $("#" + obj.id + " option[selected=\"selected\"]")[0];
			if (target !== undefined) {
				target.selected = false;
				target.removeAttribute("selected");
			}
			target = $("#" + obj.id + " option[value=\"" + value + "\"]")[0];
			target.selected = true;
			target.setAttribute("selected", "selected");
		}
		else if (value === undefined) {
			result = obj.getAttribute(key);
			if (result === null) result = undefined;
			return result;
		}
		else if (value === null) obj.removeAttribute(key);
		else obj.setAttribute(key, value);

		return obj;
	},

	/**
	 * Clears an object's innerHTML, or resets it's state
	 *
	 * @method clear
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	clear : function (obj) {
		if (typeof obj.reset === "function") obj.reset();
		else if (obj.value !== undefined) element.update(obj, {innerHTML: "", value: ""});
		else element.update(obj, {innerHTML: ""});
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
		var obj, uid, frag;

		if (type === undefined || String(type).isEmpty()) throw Error(label.error.invalidArguments);

		if (target !== undefined) target = utility.object(target);
		else if (args !== undefined && (typeof args === "string" || args.childNodes !== undefined)) target = utility.object(args);
		else target = document.body;

		if (target === undefined) throw Error(label.error.invalidArguments);
		
		frag = !(target instanceof Element);
		uid  = args                 !== undefined
		        && typeof args      !== "string"
		        && args.childNodes  === undefined
		        && args.id          !== undefined
		        && $("#" + args.id) === undefined ? args.id : utility.genId(undefined, true);

		if (args !== undefined && args.id !== undefined) delete args.id;

		obj = !regex.svg.test(type) ? document.createElement(type) : document.createElementNS("http://www.w3.org/2000/svg", "svg");
		obj.id = uid;

		if (typeof args === "object" && args.childNodes === undefined) element.update(obj, args);

		if (pos === undefined || pos === "last") target.appendChild(obj);
		else if (pos === "first") element.prependChild(target, obj);
		else if (pos === "after") {
			pos = {};
			pos.after = target;
			target    = target.parentNode;
			target.insertBefore(obj, pos.after.nextSibling);
		}
		else if (pos.after !== undefined) target.insertBefore(obj, pos.after.nextSibling);
		else if (pos === "before") {
			pos = {};
			pos.before = target;
			target     = target.parentNode;
			target.insertBefore(obj, pos.before);
		}
		else if (pos.before !== undefined) target.insertBefore(obj, pos.before);
		else target.appendChild(obj);
		
		return obj;
	},

	/**
	 * Gets or sets a CSS style attribute on an Element
	 *
	 * @method css
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   CSS to put in a style tag
	 * @param  {String} value [Optional] Value to set
	 * @return {Object}       Element
	 */
	css : function (obj, key, value) {
		obj = utility.object(obj);
		key = string.toCamelCase(key);
		var i, result;

		if (value !== undefined) {
			obj.style[key] = value;
			result = obj;
		}
		else result = obj.style[key];

		return result;
	},

	/**
	 * Data attribute facade acting as a getter (with coercion) & setter
	 *
	 * @method data
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   Data key
	 * @param  {Mixed}  value Boolean, Number or String to set
	 * @return {Mixed}        undefined, Element or value
	 */
	data : function (obj, key, value) {
		var result;

		if (value !== undefined) {
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
	 * @param  {Mixed} obj Element
	 * @return {Undefined} undefined
	 */
	destroy : function (obj) {
		observer.fire(abaaso, "beforeDestroy", obj);
		observer.remove(obj.id);
		if (obj.parentNode !== null) obj.parentNode.removeChild(obj);
		observer.fire(abaaso, "afterDestroy", obj.id);
		return undefined;
	},

	/**
	 * Disables an Element
	 *
	 * Events: beforeDisable  Fires before the disable starts
	 *         afterDisable   Fires after the disable ends
	 *
	 * @method disable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	disable : function (obj) {
		if (typeof obj.disabled === "boolean" && !obj.disabled) obj.disabled = true;
		return obj;
	},

	/**
	 * Enables an Element
	 *
	 * Events: beforeEnable  Fires before the enable starts
	 *         afterEnable   Fires after the enable ends
	 *
	 * @method enable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	enable : function (obj) {
		if (typeof obj.disabled === "boolean" && obj.disabled) obj.disabled = false;
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

		utility.genId(obj, true);
		array.each(string.explode(arg), function (i) {
			result = result.concat($("#" + obj.id + " " + i));
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
	 * @param  {Mixed} obj Element
	 * @return {Mixed}     Element, Array of Elements or undefined
	 */
	hasClass : function (obj, klass) {
		return obj.classList.contains(klass);
	},

	/**
	 * Hides an Element if it's visible
	 *
	 * @method hide
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	hide : function (obj) {
		if (typeof obj.hidden === "boolean") obj.hidden = true;
		else {
			obj["data-display"] = obj.style.display;
			obj.style.display = "none";
		}

		return obj;
	},

	/**
	 * Returns a Boolean indidcating if the Object is hidden
	 *
	 * @method hidden
	 * @param  {Mixed} obj Element
	 * @return {Boolean}   True if hidden
	 */
	hidden : function (obj) {
		return obj.style.display === "none" || (typeof obj.hidden === "boolean" && obj.hidden);
	},

	/**
	 * Determines if Element is equal to arg, supports nodeNames & CSS2+ selectors
	 *
	 * @method is
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Property to query
	 * @return {Boolean}     True if a match
	 */
	is : function (obj, arg) {
		return /^:/.test(arg) ? (array.contains(element.find(obj.parentNode, obj.nodeName.toLowerCase() + arg), obj)) : new RegExp(arg, "i").test(obj.nodeName);
	},

	/**
	 * Adds or removes a CSS class
	 *
	 * @method clear
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Class to add or remove (can be a wildcard)
	 * @param  {Boolean} add Boolean to add or remove, defaults to true
	 * @return {Object}      Element
	 */
	klass : function (obj, arg, add) {
		var classes;

		add = (add !== false);
		arg = string.explode(arg, " ");

		if (add) {
			array.each(arg, function (i) {
				obj.classList.add(i);
			});
		}
		else array.each(arg, function (i) {
			if (i !== "*") obj.classList.remove(i);
			else {
				array.each(obj.classList, function (x) {
					this.remove(x);
				});
				return false;
			}
		});

		return obj;
	},

	/**
	 * Finds the position of an element
	 *
	 * @method position
	 * @param  {Mixed} obj Element
	 * @return {Object}    Object {top: n, right: n, bottom: n, left: n}
	 */
	position : function (obj) {
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
	 * @param  {Object} obj   Element
	 * @param  {Object} child Child Element
	 * @return {Object}       Element
	 */
	prependChild : function (obj, child) {
		return obj.childNodes.length === 0 ? obj.appendChild(child) : obj.insertBefore(child, obj.childNodes[0]);
	},

	/**
	 * Serializes the elements of a Form, an Element, or Array of Elements or $ queries
	 * 
	 * @param  {Object}  obj    Form, individual Element, or $ query
	 * @param  {Boolean} string [Optional] true if you want a query string, default is false (JSON)
	 * @param  {Boolean} encode [Optional] true if you want to URI encode the value, default is true
	 * @return {Mixed}          String or Object
	 */
	serialize : function (obj, string, encode) {
		obj          = utility.object(obj);
		string       = (string === true);
		encode       = (encode !== false);
		var children = [],
		    registry = {},
		    result;

		if (obj instanceof Array) {
			array.each(obj, function (i) {
				children.push(utility.object(i));
			});
		}
		else children = obj.nodeName === "FORM" ? (obj.elements !== undefined ? array.cast(obj.elements) : obj.find("button, input, select, textarea")) : [obj];

		array.each(children, function (i) {
			if (i.nodeName === "FORM") utility.merge(registry, json.decode(element.serialize(i)))
			else if (registry[i.name] === undefined) registry[i.name] = element.val(i);
		});

		if (!string) result = json.encode(registry);
		else {
			result = "";
			utility.iterate(registry, function (v, k) {
				encode ? result += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(v)
				       : result += "&" + k + "=" + v;
				result = result.replace(/^&/, "?");
			});
		}

		return result;
	},

	/**
	 * Shows an Element if it's not visible
	 *
	 * @method show
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	show : function (obj) {
		if (typeof obj.hidden === "boolean") obj.hidden = false;
		else obj.style.display = obj.getAttribute("data-display") !== null ? obj.getAttribute("data-display") : "inherit";
		return obj;
	},

	/**
	 * Returns the size of the Object
	 *
	 * @method size
	 * @param  {Mixed} obj Element
	 * @return {Object}    Size {height: n, width:n}
	 */
	size : function (obj) {
		var num, height, width;

		/**
		 * Casts n to a number or returns zero
		 *
		 * @param  {Mixed} n The value to cast
		 * @return {Number}  The casted value or zero
		 */
		num = function (n) {
			return !isNaN(n) ? parseInt(n) : 0;
		};

		height = obj.offsetHeight + num(obj.style.paddingTop)  + num(obj.style.paddingBottom) + num(obj.style.borderTop)  + num(obj.style.borderBottom);
		width  = obj.offsetWidth  + num(obj.style.paddingLeft) + num(obj.style.paddingRight)  + num(obj.style.borderLeft) + num(obj.style.borderRight);

		return {height: height, width: width};
	},

	/**
	 * Getter / setter for an Element's text
	 * 
	 * @param  {Object} obj Element
	 * @param  {String} arg [Optional] Value to set
	 * @return {Object}     Element
	 */
	text : function (obj, arg) {
		var key     = obj.textContent !== undefined ? "textContent" : "innerText",
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
		obj.classList.toggle(arg);
		return obj;
	},

	/**
	 * Updates an Element
	 *
	 * @method update
	 * @param  {Mixed}  obj  Element
	 * @param  {Object} args Collection of properties
	 * @return {Object}      Element
	 */
	update : function (obj, args) {
		args = args || {};

		utility.iterate(args, function (v, k) {
			if (regex.element_update.test(k)) obj[k] = v;
			else if (k === "class") !v.isEmpty() ? obj.addClass(v) : obj.removeClass("*");
			else if (k.indexOf("data-") === 0) element.data(obj, k.replace("data-", ""), v);
			else if (k === "id") {
				var o = observer.listeners;

				if (o[obj.id] !== undefined) {
					o[k] = utility.clone(o[obj.id]);
					delete o[obj.id];
				}
			}
			else obj.attr(k, v);
		});
		return obj;
	},

	/**
	 * Gets or sets the value of Element
	 *
	 * Events: beforeValue  Fires before the object receives a new value
	 *         afterValue   Fires after the object receives a new value
	 * 
	 * @param  {Mixed}  obj   Element
	 * @param  {Mixed}  value [Optional] Value to set
	 * @return {Object}       Element
	 */
	val : function (obj, value) {
		var output = null,
		    items;

		if (value === undefined) {
			if (regex.radio_checkbox.test(obj.type)) {
				if (obj.name.isEmpty()) throw Error(label.error.expectedProperty);
				items = $("input[name='" + obj.name + "']");
				array.each(items, function (i) {
					if (output !== null) return;
					if (i.checked) output = i.value;
				});
			}
			else if (regex.select.test(obj.type)) output = obj.options[obj.selectedIndex].value;
			else output = typeof obj.value !== "undefined" ? obj.value : element.text(obj);

			if (typeof output === "string") output = string.trim(output);
		}
		else {
			value = String(value);
			obj.fire("beforeValue");

			if (regex.radio_checkbox.test(obj.type)) {
				items = $("input[name='" + obj.name + "']");
				array.each(items, function (i) {
					if (i.value === value) {
						i.checked = true;
						output    = i;
						return false;
					}
				});
			}
			else if (regex.select.test(obj.type)) {
				array.each(element.find(obj, "> *"), function (i) {
					if (i.value === value) {
						i.selected = true;
						output     = i;
						return false;
					}
				});
			}
			else obj.value !== undefined ? obj.value = value : element.text(obj, value);

			obj.fire("afterValue");
			output = obj;
		}
		return output;
	}
};
