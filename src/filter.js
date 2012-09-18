/**
 * DataList filter factory
 * 
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist List Module linked to the data store required
 * @param  {String} filters  Comma delimited string of fields to filter by
 * @return {Object}          Filter instance
 */
var filter = (function () {
	var factory;

	factory = function (obj, datalist, filters) {
		var ref = [datalist];

		if (!(obj instanceof Element) || (typeof datalist !== "undefined" && typeof datalist.store === "undefined") || (typeof filters !== "string" || String(filters).isEmpty())) throw Error($.label.error.invalidArguments);

		this.datalist = ref[0];
		this.element  = obj;
		this.filters  = {};
		this.set(filters);
		this.element.on("afterValue", this.update, "value", this);
		return this.init();
	};

	/**
	 * Initiate all event listeners
	 *
	 * @return {Object} Filter instance
	 */
	factory.prototype.init = function () {
		this.element.on("keyup", this.update, "filter", this);
		return this;
	};

	/**
	 * Set the filters
	 * 
	 * Create an object based on comma separated key string
	 * 
	 * @param {String} fields Comma separated filters
	 * @return {Object} Filter instance
	 */
	factory.prototype.set = function (fields) {
		var obj = {};

		if (typeof fields !== "string" || String(fields).isEmpty()) throw Error(label.error.invalidArguments);

		fields.explode().each(function (v) { obj[v] = ""; });
		this.filters = obj;
		return this;
	};

	/**
	 * Cancel all event listeners
	 *
	 * @return {Object} Filter instance
	 */
	factory.prototype.teardown = function () {
		this.element.un("keyup", "filter");
		return this;
	};

	/**
	 * Update the results list
	 *
	 * @param  {Object} e Keyboard event
	 * @return {Object}   Filter instance
	 */
	factory.prototype.update = function (e) {
		var val = this.element.val();
		
		if (!val.isEmpty()) {
			utility.iterate(this.filters, function (v, k) { this[k] = "^" + val.escape().replace("\\*", ".*"); });
			this.datalist.filter = this.filters;
		}
		else this.datalist.filter = null;

		this.datalist.pageIndex = 1;
		this.datalist.refresh();
		return this;
	};

	return factory;
})();
