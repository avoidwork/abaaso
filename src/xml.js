/**
 * XML methods
 *
 * @class xml
 * @namespace abaaso
 */
var xml = {
	/**
	 * Returns XML (Document) Object from a String
	 *
	 * @method decode
	 * @param  {String} arg XML String
	 * @return {Object}     XML Object or undefined
	 */
	decode : function (arg) {
		try {
			if (typeof arg !== "string" || arg.isEmpty()) throw Error(label.error.invalidArguments);

			var x;

			if (client.ie) {
				x = new ActiveXObject("Microsoft.XMLDOM");
				x.async = "false";
				x.loadXML(arg);
			}
			else x = new DOMParser().parseFromString(arg, "text/xml");
			return x;
		}
		catch (e) {
			error(e, arguments, this);
			return undefined;
		}
	},

	/**
	 * Returns XML String from an Object or Array
	 *
	 * @method encode
	 * @param  {Mixed} arg Object or Array to cast to XML String
	 * @return {String}    XML String or undefined
	 */
	encode : function (arg, wrap) {
		try {
			if (typeof arg === "undefined") throw Error(label.error.invalidArguments);

			wrap = !(wrap === false);
			var x    = wrap ? "<xml>" : "",
			    top  = !(arguments[2] === false),
			    node, i;

			if (arg !== null && typeof arg.xml !== "undefined") arg = arg.xml;
			if (arg instanceof Document) arg = (new XMLSerializer()).serializeToString(arg);

			node = function (name, value) {
				var output = "<n>v</n>";
				if (/\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test(value)) output = output.replace(/v/, "<![CDATA[v]]>");
				return output.replace(/n/g, name).replace(/v/, value);
			}

			switch (true) {
				case typeof arg === "boolean":
				case typeof arg === "number":
				case typeof arg === "string":
					x += node("item", arg);
					break;
				case typeof arg === "object":
					utility.iterate(arg, function (v, k) { x += xml.encode(v, (typeof v === "object"), false).replace(/item|xml/g, isNaN(k) ? k : "item"); });
					break;
			}

			x += wrap ? "</xml>" : "";
			if (top) x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;

			return x;
		}
		catch (e) {
			error(e, arguments, this);
			return undefined;
		}
	}
};
