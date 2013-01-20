/**
 * DataList
 *
 * Provides a reactive View of a DataStore
 * Requires a CSS class named "hidden" to toggle "display:none" of list items
 *
 * @class datalist
 * @namespace abaaso
 */
var datalist = {
	// Inherited by datalists
	methods : {
		/**
		 * Delete sync handler
		 * 
		 * @method del
		 * @param  {Object} rec Record
		 * @return {Undefined}  undefined
		 */
		del : function (rec) {
			if (typeof this.pageIndex === "number" && typeof this.pageSize === "number") this.refresh();
			else {
				this.element.fire("beforeDataListRefresh");
				this.element.find("> li[data-key='" + rec.key + "']").destroy();
				this.element.fire("afterDataListRefresh");
			}
		},

		/**
		 * Displays the data list (unpause)
		 * 
		 * @method display
		 * @return {Undefined} undefined
		 */
		display : function () {
			this.ready = true;
			this.refresh();
		},

		/**
		 * Changes the page index of the DataList
		 * 
		 * @method page
		 * @return {Object}  DataList instance
		 */
		page : function (arg) {
			if (isNaN(arg)) throw Error(label.error.invalidArguments);

			this.pageIndex = arg;
			this.refresh();
			return this;
		},

		/**
		 * Adds pagination Elements to the View
		 * 
		 * @method pages
		 * @return {Object}  DataList instance
		 */
		pages : function () {
			var obj   = this.element,
			    list  = $("#" + obj.id + "-pages-top, #" + obj.id + "-pages-bottom"),
			    page  = this.pageIndex,
			    pos   = this.pagination,
			    range = this.pageRange,
			    mid   = number.round(number.half(range), "down"),
			    start = page - mid,
			    end   = page + mid,
			    self  = this,
			    total = datalist.pages.call(this),
			    i     = 0,
			    diff, li, anchor;

			if (!regex.top_bottom.test(pos)) throw Error(label.error.invalidArguments);

			// Removing the existing controls
			array.each(list, function (i) {
				if (i !== undefined) i.destroy();
			});
			
			// Halting because there's 1 page, or nothing
			if (this.total === 0 || total === 1) return this;

			// Getting the range to display
			if (start < 1) {
				diff  = start.diff(1);
				start = start + diff;
				end   = end   + diff;
			}
			if (end > total) {
				end   = total;
				start = (end - range) + 1;
				if (start < 1) start = 1;
			}

			array.each(pos.explode(), function (i) {
				var current = false,
				    more    = page > 1,
				    next    = (page + 1) <= total,
				    last    = !(page < total);

				// Setting up the list
				list = obj[i === "bottom" ? "after" : "before"]("ul", {"class": "list pages " + i, id: obj.id + "-pages-" + i});

				// First page
				list.create("li").create(more ? "a" : "span", {"class": "first page", "data-page": 1}).html("&lt;&lt;");

				// Previous page
				list.create("li").create(more ? "a" : "span", {"class": "prev page", "data-page": (page - 1)}).html("&lt;");

				// Rendering the page range
				for (i = start; i <= end; i++) {
					current = (i === page);
					list.create("li").create(current ? "span" : "a", {"class": current ? "current page" : "page", "data-page": i}).html(i);
				}

				// Next page
				list.create("li").create(next ? "a" : "span", {"class": "next page", "data-page": next ? (page + 1) : null}).html("&gt;");

				// Last page
				list.create("li").create(last ? "span" : "a", {"class": "last page", "data-page": last ? null : total}).html("&gt;&gt;");

				// Scroll to top the top
				list.find("a.page").on("click", function (e) {
					utility.stop(e);
					self.page(this.data("page"));
					window.scrollTo(0, 0);
				}, "pagination");
			});

			return this;
		},

		/**
		 * Refreshes element
		 * 
		 * Events: beforeDataListRefresh  Fires from the element containing the DataList
		 *         afterDataListRefresh   Fires from the element containing the DataList
		 * 
		 * @method refresh
		 * @param {Boolean} redraw [Optional] Boolean to force clearing the DataList (default), false toggles "hidden" class of items
		 * @return {Object}        DataList instance
		 */
		refresh : function (redraw) {
			redraw       = (redraw !== false);
			var element  = this.element,
			    template = (typeof this.template === "object"),
			    key      = (!template && String(this.template).replace(/\{\{|\}\}/g, "") === this.store.key),
			    consumed = [],
			    items    = [],
			    self     = this,
			    callback = (typeof this.callback === "function"),
			    reg      = new RegExp(),
			    registry = [], // keeps track of records in the list (for filtering)
			    limit    = [],
			    fn, obj, ceiling;

			this.element.fire("beforeDataListRefresh");
			this.refreshing = true;

			// Creating templates for the html rep
			if (!template) fn = function (i) {
				var html = String(self.template);

				html = html.replace("{{" + self.store.key + "}}", i.key)
				utility.iterate(i.data, function (v, k) {
					reg.compile("{{" + k + "}}", "g");
					html = html.replace(reg, v);
				});
				return {li: html.replace(/\{\{.*\}\}/g, self.placeholder)};
			}
			else fn = function (i) {
				var obj = json.encode(self.template);

				obj = obj.replace("{{" + self.store.key + "}}", i.key)
				utility.iterate(i.data, function (v, k) {
					reg.compile("{{" + k + "}}", "g");
					obj = obj.replace(reg, json.encode(v).replace(/(^")|("$)/g, "")); // stripping first and last " to concat to valid JSON
				});
				obj = json.decode(obj.replace(/\{\{.*\}\}/g, self.placeholder));
				return {li: obj};
			};

			// Consuming records based on sort
			consumed = this.order.isEmpty() ? this.store.get() : this.store.sort(this.order, false, this.sensitivity);

			// Processing (filtering) records & generating templates
			array.each(consumed, function (i) {
				if (self.filter === null || !(self.filter instanceof Object)) items.push({key: i.key, template: fn(i)});
				else {
					utility.iterate(self.filter, function (v, k) {
						if (registry.index(i.key) > -1) return;

						var x     = 0,
						    regex = new RegExp(),
						    nth;

						v   = string.explode(v);
						nth = v.length;

						for (x = 0; x < nth; x++) {
							regex.compile(v[x], "i");
							if ((k === self.store.key && regex.test(i.key)) || (i.data[k] !== undefined && regex.test(i.data[k]))) {
								registry.push(i.key);
								items.push({key: i.key, template: fn(i)});
								return;
							}
						}
					});
				}
			});

			// Total count of items in the list
			this.total = items.length;

			// Pagination (supports filtering)
			if (typeof this.pageIndex === "number" && typeof this.pageSize === "number") {
				ceiling = datalist.pages.call(this);
				// Passed the end, so putting you on the end
				if (ceiling > 0 && this.pageIndex > ceiling) return this.page(ceiling);
				// Paginating the items
				else {
					limit = datalist.range.call(this);
					items = items.limit(limit[0], limit[1]);
				}
			}

			// Preparing the target element
			if (redraw) {
				element.clear();
				array.each(items, function (i) {
					var obj = element.tpl(i.template);
					obj.data("key", i.key);
					if (callback) self.callback(obj);
				});
			}
			else {
				element.find("> li").addClass("hidden");
				array.each(items, function (i) {
					element.find("> li[data-key='" + i.key + "']").removeClass("hidden");
				});
			}

			// Rendering pagination elements
			if (regex.top_bottom.test(this.pagination) && typeof this.pageIndex === "number" && typeof this.pageSize === "number") this.pages();
			else {
				$("#" + this.element.id + "-pages-top, #" + this.element.id + "-pages-bottom");
				if (obj !== undefined) obj.destroy();
			}

			this.refreshing = false;
			this.element.fire("afterDataListRefresh", element);
			return this;
		},

		/**
		 * Set sync handler
		 *
		 * @method set
		 * @return {Undefined} undefined
		 */
		set : function () {
			if (!this.refreshing) this.refresh();
		},

		/**
		 * Sorts data list & refreshes element
		 * 
		 * Events: beforeDataListSort     Fires before the DataList sorts
		 *         afterDataListSort      Fires after the DataList is sorted
		 *         beforeDataListRefresh  Fires before the DataList refreshes
		 *         afterDataListRefresh   Fires after the DataList refreshes
		 * 
		 * @method sort
		 * @param  {String} order       SQL "order by" statement
		 * @param  {String} sensitivity [Optional] Defaults to "ci" ("ci" = insensitive, "cs" = sensitive, "ms" = mixed sensitive)
		 * @return {Object}              DataList instance
		 */
		sort : function (order, sensitivity) {
			if (typeof order !== "string") throw Error(label.error.invalidArguments);
			this.element.fire("beforeDataListSort");
			this.order       = order;
			this.sensitivity = sensitivity || "ci";
			this.refresh();
			this.element.fire("afterDataListSort");
			return this;
		},

		/**
		 * Tears down references to the DataList
		 * 
		 * @method teardown
		 * @return {Object}  DataList instance
		 */
		teardown : function () {
			var self = this;

			observer.un(this.element);
			array.each(this.store.datalists, function (i, idx) {
				if (i.id === self.id) {
					this.remove(idx);
					return false;
				}
			});

			return this;
		}
	},

	/**
	 * Creates an instance of datalist
	 *
	 * Events: beforeDataList  Fires before target receives the DataList
	 *         afterDataList   Fires after DataList is setup in target
	 *           
	 * @method factory
	 * @param  {Object} target   Element to receive the DataList
	 * @param  {Object} store    Data store to feed the DataList
	 * @param  {Mixed}  template Record field, template ($.tpl), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
	 * @param  {Object} options  Optional parameters to set on the DataList
	 * @return {Object}          DataList instance
	 */
	factory : function (target, store, template, options) {
		var ref      = [store],
		    instance = {},
		    params   = {},
		    element;

		if (!(target instanceof Element) || typeof store !== "object" || !regex.string_object.test(typeof template)) throw Error(label.error.invalidArguments);

		// Preparing
		element = target.fire("beforeDataList").create("ul", {"class": "list", id: store.parentNode.id + "-datalist"});
		params  = {
			callback    : null,
			filter      : null,
			id          : utility.genId(),
			pageIndex   : 1,
			pageSize    : null,
			pageRange   : 5,
			pagination  : "bottom", // "top" or "bottom|top" are also valid
			placeholder : "",
			order       : "",
			ready       : false,
			refreshing  : false,
			template    : template,
			total       : 0,
			sensitivity : "ci"
		};

		// Creating instance
		instance         = utility.extend(datalist.methods, params);
		instance.element = element;
		instance.store   = ref[0];

		// Applying customization
		if (options instanceof Object) utility.merge(instance, options);

		// Setting reference of instance on store
		instance.store.datalists.push(instance);

		if (instance.store.uri === null || instance.store.loaded) instance.display();

		target.fire("afterDataList", element);

		return instance;
	},

	/**
	 * Calculates the total pages
	 * 
	 * @method pages
	 * @return {Number} Total pages
	 */
	pages : function () {
		if (isNaN(this.pageSize)) throw Error(label.error.invalidArguments);
		return number.round(this.total / this.pageSize, "up");
	},

	/**
	 * Calculates the page size as an Array of start & finish
	 * 
	 * @method range
	 * @return {Array}  Array of start & end numbers
	 */
	range : function () {
		var start = (this.pageIndex * this.pageSize) - this.pageSize,
		    end   = this.pageSize;

		return [start, end];
	}
};
