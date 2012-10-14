/**
 * DataList
 *
 * Provides a reactive View of a DataStore
 *
 * Requires a CSS class named "hidden" to toggle "display:none" of list items
 */
var datalist = {
	position : /top|botton/,

	// Inherited by data stores
	methods : {
		/**
		 * Changes the page index of the DataList
		 * 
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
		 * @return {Object}  DataList instance
		 */
		pages : function () {
			var obj   = this.element,
			    list  = $("#" + obj.id + "-pages-top, #" + obj.id + "-pages-bottom"),
			    page  = this.pageIndex,
			    pos   = this.pagination,
			    range = this.pageRange,
			    mid   = range.half().roundDown(),
			    start = page - mid,
			    end   = page + mid,
			    self  = this,
			    total = datalist.pages.call(this),
			    i     = 0,
			    diff, li, anchor;

			if (!datalist.position.test(pos)) throw Error(label.error.invalidArguments);

			// Removing the existing controls
			list.each(function (i) { if (typeof i !== "undefined") i.destroy(); });
			
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

			pos.explode().each(function (i) {
				// Setting up the list
				list = obj[i === "bottom" ? "after" : "before"]("ul", {"class": "list pages " + i, id: obj.id + "-pages-" + i});

				// First page
				page > 1 ? list.create("li").create("a", {"class": "first page", "data-page": 1}).html("&lt;&lt;").on("click", function () { self.page(this.data("page")); }, "click")
				         : list.create("li").create("span", {"class": "first page"}).html("&lt;&lt;");

				// Previous page
				page > 1 ? list.create("li").create("a", {"class": "prev page", "data-page": (page - 1)}).html("&lt;").on("click", function () { self.page(this.data("page")); }, "click")
				         : list.create("li").create("span", {"class": "prev page"}).html("&lt;");

				// Rendering the page range
				for (i = start; i <= end; i++) {
					i !== page ? list.create("li").create("a", {"class": i === page ? "current page" : "page", "data-page": i}).html(i).on("click", function (e) { self.page(this.data("page")); }, "click")
					           : list.create("li").create("span", {"class": "page"}).html(i);
				}

				// Next page
				((page + 1) <= total) ? list.create("li").create("a", {"class": "next page", "data-page": (page + 1)}).html("&gt;").on("click", function () { self.page(this.data("page")); }, "click")
				                      : list.create("li").create("span", {"class": "next page"}).html("&gt;");

				// Last page
				page < total ? list.create("li").create("a", {"class": "last page", "data-page": total}).html("&gt;&gt;").on("click", function () { self.page(this.data("page")); }, "click")
				             : list.create("li").create("span", {"class": "last page"}).html("&gt;&gt;");

				// Scroll to top the top
				list.find("a").on("click", function (e) { window.scrollTo(0, 0); });
			});

			return this;
		},

		/**
		 * Refreshes element
		 * 
		 * Events: beforeDataListRefresh  Fires from the element containing the DataList
		 *         afterDataListRefresh   Fires from the element containing the DataList
		 * 
		 * @param {Boolean} redraw [Optional] Boolean to force clearing the DataList (default), false toggles "hidden" class of items
		 * @return {Object}        DataList instance
		 */
		refresh : function (redraw) {
			redraw       = (redraw !== false);
			var element  = this.element,
			    template = (typeof this.template === "object"),
			    key      = (!template && String(this.template).replace(/{{|}}/g, "") === this.store.key),
			    consumed = [],
			    items    = [],
			    self     = this,
			    callback = (typeof this.callback === "function"),
			    cleanup  = /{{.*}}/g,
			    regex    = new RegExp(),
			    registry = [], // keeps track of records in the list (for filtering)
			    limit    = [],
			    fn, obj;

			if (!this.ready) {
				this.ready = true;
				this.store.parentNode.on("afterDataSet", function (r)  {
					if (datalist.garbage(this.store.parentNode, element.id, "afterDataSet", "set-" + element.id)) return;
					if (!this.refreshing) this.refresh();
				}, "set-" + element.id, this);
			}

			this.element.fire("beforeDataListRefresh");
			this.refreshing = true;

			// Creating templates for the html rep
			if (!template) fn = function (i) {
				var html = String(self.template);

				html = html.replace("{{" + self.store.key + "}}", i.key)
				utility.iterate(i.data, function (v, k) {
					regex.compile("{{" + k + "}}", "g");
					html = html.replace(regex, v);
				});
				return {li: html.replace(cleanup, self.placeholder)};
			}
			else fn = function (i) {
				var obj = json.encode(self.template);

				obj = obj.replace("{{" + self.store.key + "}}", i.key)
				json.iterate(i.data, function (v, k) {
					regex.compile("{{" + k + "}}", "g");
					obj = obj.replace(regex, json.encode(v).replace(/(^")|("$)/g, "")); // stripping first and last " to concat to valid JSON
				});
				obj = json.decode(obj.replace(cleanup, self.placeholder));
				return {li: obj};
			};

			// Consuming records based on sort
			consumed = this.order.isEmpty() ? this.store.get() : this.store.sort(this.order, false, this.sensitivity);

			// Processing (filtering) records & generating templates
			consumed.each(function (i) {
				if (self.filter === null || !(self.filter instanceof Object)) items.push({key: i.key, template: fn(i)});
				else {
					utility.iterate(self.filter, function (v, k) {
						if (registry.index(i.key) > -1) return;

						var x     = 0,
						    regex = new RegExp(),
						    nth;

						v   = String(v).explode();
						nth = v.length;

						for (x = 0; x < nth; x++) {
							regex.compile(v[x], "i");
							if ((k === self.store.key && regex.test(i.key)) || (typeof i.data[k] !== "undefined" && regex.test(i.data[k]))) {
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

			// Pagination supporting filtering
			if (typeof this.pageIndex === "number" && typeof this.pageSize === "number") {
				limit = datalist.range.call(this);
				items = items.range(limit[0], limit[1]);
			}

			// Preparing the target element
			if (redraw) {
				element.clear();
				items.each(function (i) {
					var obj = element.tpl(i.template);
					obj.data("key", i.key);
					if (callback) self.callback(obj);
				});
			}
			else {
				element.find("> li").addClass("hidden");
				items.each(function (i) { element.find("> li[data-key='" + i.key + "']").removeClass("hidden"); });
			}

			// Rendering pagination elements
			if (position.test(this.pagination) && typeof this.pageIndex === "number" && typeof this.pageSize === "number") this.pages();
			else {
				$("#" + this.element.id + "-pages-top, #" + this.element.id + "-pages-bottom");
				if (typeof obj !== "undefined") obj.destroy();
			}

			this.refreshing = false;
			this.element.fire("afterDataListRefresh", element);
			return this;
		},

		/**
		 * Sorts data list & refreshes element
		 * 
		 * Events: beforeDataListRefresh, afterDataListRefresh
		 * 
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
		 * Tears down references to the DataList in the Observer
		 * 
		 * @return {Object}  DataList instance
		 */
		teardown : function () {
			var id = this.element.id;

			this.store.parentNode.un("afterDataDelete", "delete-" + id).un("afterDataRetrieve, afterDataSync", "refresh-" + id);
			return this;
		}
	},

	/**
	 * Creates an instance of datalist
	 * 
	 * Options: callback    Function to execute after creating a templated record display, parameter is the new Element
	 *          filter      Object describing key:value pairs to filter the list on ({property: "someValue"}), accepts comma delimited values
	 *          placeholder String to use in lieu of an undefined record (data) property
	 *          start       Start position for pagination
	 *          end         End position for pagination
	 *
	 * Events: beforeDataList  Fires before target receives the DataList
	 *         afterDataList   Fires after DataList is setup in target
	 *           
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
		    element, fn;

		if (!(target instanceof Element) || typeof store !== "object" || !/string|object/.test(typeof template)) throw Error(label.error.invalidArguments);

		// Preparing
		element  = target.fire("beforeDataList").create("ul", {"class": "list", id: store.parentNode.id + "-datalist"});
		params   = {
			callback    : null,
			filter      : null,
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
		if (options instanceof Object) utility.iterate(options, function (v, k) { instance[k] = v; });

		// Cleaning up orphaned element(s)
		instance.store.parentNode.on("afterDataDelete", function (r) {
			this.element.fire("beforeDataListRefresh");
			if (datalist.garbage(this.store.parentNode, element.id, "afterDataDelete", "delete-" + element.id)) return;
			if (typeof this.pageIndex === "number" && typeof this.pageSize === "number") this.refresh();
			else this.element.find("> li[data-key='" + r.key + "']").destroy();
			this.element.fire("afterDataListRefresh");
		}, "delete-" + element.id, instance);

		fn = function () {
			var ev = this.store.retrieve ? "afterDataRetrieve" : "afterDataSync";

			this.store.parentNode.once(ev, function () {
				if (datalist.garbage(this.store.parentNode, element.id, ev, "refresh-" + element.id)) return;
				if (!this.refreshing && (ev === "afterDataRetrieve" || this.store.loaded)) this.refresh();
				fn.call(this);
			}, "refresh-" + element.id, this);

			if (datalist.now.call(instance)) instance.refresh();
		}

		datalist.now.call(instance) ? fn.call(instance) : instance.store.parentNode.once(instance.store.parentNode.retrieve ? "afterDataRetrieve" : "afterDataSync", fn, "initialize-" + element.id, instance);

		target.fire("afterDataList", element);

		return instance;
	},

	/**
	 * Garbage collector which removes invalid events from the observer
	 * 
	 * @param  {Object} obj     Data store parentNode
	 * @param  {Object} element DataList Element id
	 * @param  {String} event   Event
	 * @param  {String} id      Observerable event id
	 * @return {Boolean}        True if invalid & removed from the observer
	 */
	garbage : function (obj, element, event, id) {
		var result = false;

		if (typeof $("#" + element) === "undefined") {
			obj.un(event, id);
			result = true;
		}

		return result;
	},

	/**
	 * Determines if a store is ready to refresh
	 * 
	 * @return {Boolean} True to refresh
	 */
	now : function () {
		return (this.store.uri === null || this.store.loaded);
	},

	/**
	 * Calculates the total pages
	 * 
	 * @return {Number} Total pages
	 */
	pages : function () {
		if (isNaN(this.pageSize)) throw Error(label.error.invalidArguments);
		return (this.total / this.pageSize).roundUp();
	},

	/**
	 * Calculates the page size as an Array of start & finish
	 * 
	 * @return {Array}  Array of start & end numbers
	 */
	range : function () {
		var start = (this.pageIndex * this.pageSize) - this.pageSize,
		    end   = (start          + this.pageSize) - 1;

		return [start, end];
	}
};
