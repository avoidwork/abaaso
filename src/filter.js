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
			observer.add(this.element, "keyup",      this.update, "filter", this);
			observer.add(this.element, "afterValue", this.update, "value",  this);
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

			if (typeof fields !== "string" || String(fields).isEmpty()) throw Error(label.error.invalidArguments);

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
			observer.remove(this.element, "keyup",      "filter");
			observer.remove(this.element, "afterValue", "value");
			return this;
		},

		/**
		 * Update the results list
		 *
		 * @returns {Undefined} undefined
		 */
		update : function (e) {
			var self = this;

			// Clearing existing timer
			utility.clearTimers(this.element.id + "Debounce");
			
			// Deferring the refresh
			utility.defer(function () {
				var val = self.element.val();
				
				if (!val.isEmpty()) {
					utility.iterate(self.filters, function (v, k) {
						this[k] = "^" + val.escape().replace("\\*", ".*");
					});
					self.datalist.filter = self.filters;
				}
				else self.datalist.filter = null;

				self.datalist.pageIndex = 1;
				self.datalist.refresh();
			}, this.debounce, this.element.id + "Debounce");
			return this;
		}
	},

	/**
	 * DataList filter factory
	 * 
	 * @param  {Object} obj      Element to receive the filter
	 * @param  {Object} datalist List Module linked to the data store required
	 * @param  {String} filters  Comma delimited string of fields to filter by
	 * @param  {Number} debounce [Optional] Milliseconds to debounce
	 * @return {Object}          Filter instance
	 */
	factory : function (obj, datalist, filters, debounce) {
		debounce     = debounce || 250;
		var instance = {},
		    ref      = [datalist];

		if (!(obj instanceof Element) || (datalist !== undefined && datalist.store === undefined) || (typeof filters !== "string" || String(filters).isEmpty())) throw Error(label.error.invalidArguments);

		instance = utility.extend(filter.methods, {filters: {}});
		instance.datalist = ref[0];
		instance.debounce = debounce;
		instance.element  = obj;
		instance.set(filters);
		return instance.init();
	}
};
