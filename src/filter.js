/**
 * DataList filter factory
 * 
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist List Module linked to the data store required
 * @param  {String} filters  Comma delimited string of fields to filter by
 * @return {Object}          Filter instance
 */
(function ($) {
"use strict";

var filter;

/**
 * List filter factory
 * 
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist List Module linked to the data store required
 * @param  {String} filters  Comma delimited string of fields to filter by
 * @return {Object}          Instance of filter
 */
filter = function (obj, datalist, filters) {
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
 * @returns {Undefined} undefined
 */
filter.prototype.init = function () {
	this.element.on("keyup", this.update, "filter", this);
	return this;
};

/**
 * Cancel all event listeners
 *
 * @returns {Undefined} undefined
 */
filter.prototype.teardown = function () {
	this.element.un("keyup", "filter");
	return this;
};

/**
 * Update the results list
 *
 * @returns {Undefined} undefined
 */
filter.prototype.update = function (e) {
	var val = this.element.val();
	
	if (!val.isEmpty()) {
		$.iterate(this.filters, function (v, k) { this[k] = "^" + val.escape().replace("\\*", ".*"); });
		this.datalist.filter = this.filters;
	}
	else this.datalist.filter = null;

	this.datalist.pageIndex = 1;
	this.datalist.refresh();
	return this;
};

/**
 * Set the filters
 * 
 * Create an object based on comma separated key string
 * 
 * @param {String} fields Comma separated filters
 * @returns {Undefined} undefined
 */
filter.prototype.set = function (fields) {
	var obj = {};

	if (typeof fields !== "string" || String(fields).isEmpty()) throw Error($.label.error.invalidArguments);

	fields.explode().each(function (v) { obj[v] = ""; });
	this.filters = obj;
	return this;
};


abaaso.module("filter", filter);

})($);
