/**
 * DataList Filter
 * 
 * @class filter
 * @namespace abaaso
 */
var filter = {
	methods : {
		/**
		 * Initiate all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		init : function () {
			this.element.on("keyup", this.update, "filter", this);
			return this;
		},

		/**
		 * Set the filters
		 * 
		 * Create an object based on comma separated key string
		 * 
		 * @param {String} fields Comma separated filters
		 * @returns {Undefined} undefined
		 */
		set : function (fields) {
			var obj = {};

			if (typeof fields !== "string" || String(fields).isEmpty()) throw Error($.label.error.invalidArguments);

			array.each(fields.explode(), function (v) {
				obj[v] = "";
			});
			this.filters = obj;
			return this;
		},

		/**
		 * Cancel all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		teardown : function () {
			this.element.un("keyup", "filter");
			return this;
		},

		/**
		 * Update the results list
		 *
		 * @returns {Undefined} undefined
		 */
		update : function (e) {
			var val = this.element.val();
			
			if (!val.isEmpty()) {
				utility.iterate(this.filters, function (v, k) { this[k] = "^" + val.escape().replace("\\*", ".*"); });
				this.datalist.filter = this.filters;
			}
			else this.datalist.filter = null;

			this.datalist.pageIndex = 1;
			this.datalist.refresh();
			return this;
		}
	},

	/**
	 * DataList filter factory
	 * 
	 * @param  {Object} obj      Element to receive the filter
	 * @param  {Object} datalist List Module linked to the data store required
	 * @param  {String} filters  Comma delimited string of fields to filter by
	 * @return {Object}          Filter instance
	 */
	factory : function (obj, datalist, filters) {
		var instance = {},
		    ref = [datalist];

		if (!(obj instanceof Element) || (typeof datalist !== "undefined" && typeof datalist.store === "undefined") || (typeof filters !== "string" || String(filters).isEmpty())) throw Error($.label.error.invalidArguments);

		instance = utility.extend(filter.methods, {filters: {}});
		instance.datalist = ref[0];
		instance.element  = obj;
		instance.set(filters);
		instance.element.on("afterValue", instance.update, "value", instance);
		return instance.init();
	}
};
