/**
 * Validation methods and patterns
 *
 * pattern.url is authored by Diego Perini
 *
 * @class validate
 * @namespace abaaso
 */
var validate = {
	// Regular expression patterns to test against
	pattern : {
		alphanum : /^[a-zA-Z0-9]+$/,
		"boolean": /^(0|1|true|false)?$/,
		domain   : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
		email    : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		ip       : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
		integer  : /(^-?\d\d*$)/,
		notEmpty : /\w{1,}/,
		number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
		phone    : /^([0-9\(\)\/\+ \-\.]+)$/,
		url      : /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
		xml      : /<[^>]+>[^<]*]+>/
	},

	/**
	 * Validates args based on the type or pattern specified
	 *
	 * @method test
	 * @param  {Object} args Object to test {(pattern[name] || /pattern/) : (value || #object.id)}
	 * @return {Object}      Results
	 */
	test : function (args) {
		var exception = false,
		    invalid   = [],
		    tracked   = {},
		    value     = null,
		    result    = [],
		    c         = [],
		    inputs    = [],
		    selects   = [],
		    i, p, o, x, nth;

		if (typeof args.nodeName !== "undefined" && args.nodeName === "FORM") {
			if (args.id.isEmpty()) args.genId();
			inputs  = $("#" + args.id + " input");
			selects = $("#" + args.id + " select");
			if (inputs.length > 0)  c = c.concat(inputs);
			if (selects.length > 0) c = c.concat(selects);
			c.each(function (i) {
				var z = {},
				    p, v, r;

				p = validate.pattern[i.nodeName.toLowerCase()] ? validate.pattern[i.nodeName.toLowerCase()] : ((!i.id.isEmpty() && validate.pattern[i.id.toLowerCase()]) ? validate.pattern[i.id.toLowerCase()] : "notEmpty");
				v = i.val();
				if (v === null) v = "";
				z[p] = v;
				r    = validate.test(z)
				if (!r.pass) {
					invalid.push({element: i, test: p, value: v});
					exception = true;
				}
			});
		}
		else {
			utility.iterate(args, function (i, k) {
				if (typeof k === "undefined" || typeof i === "undefined") {
					invalid.push({test: k, value: i});
					exception = true;
					return
				}
				value = String(i).charAt(0) === "#" ? (typeof $(i) !== "undefined" ? $(i).val() : "") : i;
				switch (k) {
					case "date":
						if (isNaN(new Date(value).getYear())) {
							invalid.push({test: k, value: value});
							exception = true;
						}
						break;
					case "domain":
						if (!validate.pattern.domain.test(value.replace(/.*\/\//, ""))) {
							invalid.push({test: k, value: value});
							exception = true;
						}
						break;
					case "domainip":
						if (!validate.pattern.domain.test(value.replace(/.*\/\//, "")) || !validate.pattern.ip.test(value)) {
							invalid.push({test: k, value: value});
							exception = true;
						}
						break;
					default:
						p = typeof validate.pattern[k] !== "undefined" ? validate.pattern[k] : k;
						if (!p.test(value)) {
							invalid.push({test: k, value: value});
							exception = true;
						}
				}
			});
		}
		return {pass: !exception, invalid: invalid};
	}
};
