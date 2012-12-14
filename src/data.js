/**
 * DataStore
 *
 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
 *
 * @class data
 * @namespace abaaso
 */
var data = {
	// Inherited by data stores
	methods : {
		/**
		 * Batch sets or deletes data in the store
		 *
		 * Events: beforeDataBatch  Fires before the batch is queued
		 *         afterDataBatch   Fires after the batch is queued
		 *         failedDataBatch  Fires when an exception occurs
		 *
		 * @method batch
		 * @param  {String}  type  Type of action to perform (set/del/delete)
		 * @param  {Mixed}   data  Array of keys or indices to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync  [Optional] Syncs store with data, if true everything is erased
		 * @param  {Number}  chunk Size to chunk Array to batch set or delete
		 * @return {Object}        Data store
		 */
		batch : function (type, data, sync, chunk) {
			type  = type.toString().toLowerCase();
			sync  = (sync === true);
			chunk = chunk || 1000;

			if (!/^(set|del|delete)$/.test(type) || (sync && /^del/.test(type)) || typeof data !== "object") throw Error(label.error.invalidArguments);

			var obj  = this.parentNode,
			    self = this,
			    r    = 0,
			    nth  = data.length,
			    f    = false,
			    guid = utility.genId(true),
			    root = /^\/[^\/]/,
			    del  = /^del/,
			    completed, failure, key, set, success, parsed;

			completed = function (reindex) {
				if (del.test(type) && reindex !== false) self.reindex();
				self.loaded = true;
				obj.fire("afterDataBatch");
			};

			failure = function (arg) {
				obj.fire("failedDataSet, failedDataBatch", arg);
			};

			set = function (data, key) {
				var guid = utility.genId(),
				    rec  = {};

				if (typeof rec.batch !== "function") rec = utility.clone(data)
				else utility.iterate(data, function (v, k) {
					if (!self.collections.contains(k)) rec[k] = utility.clone(v);
				});

				if (self.key !== null && typeof rec[self.key] !== "undefined") {
					key = rec[self.key];
					delete rec[self.key];
				}

				obj.once("afterDataSet", function () {
					this.un("failedDataSet", guid);
					if (++r === nth) completed();
				}, guid).once("failedDataSet", function () {
					this.un("afterDataSet", guid)
					if (!f) {
						f = true;
						this.fire("failedDataBatch");
					}
				}, guid);

				if (rec instanceof Array && self.uri !== null) self.generate(key);
				else self.set(key, rec, sync);
			};

			obj.fire("beforeDataBatch", data);

			if (sync) this.clear(sync);

			if (del.test(type)) {
				obj.on("afterDataDelete", function () {
					if (++r === nth) {
						obj.un("afterDataDelete, failedDataDelete", guid);
						completed();
					}
				}, guid).once("failedDataDelete", function () {
					obj.un("afterDataDelete", guid);
					if (!f) {
						f = true;
						obj.fire("failedDataBatch");
					}
				}, guid);
			}

			if (data.length === 0) completed(false);
			else {
				if (type === "set") data.chunk(chunk).each(function (a, adx) {
						var offset = adx * chunk;

						utility.defer(function () {
							a.each(function (i, idx) {
								idx = (offset + idx).toString();
								if (typeof i === "object") set(i, idx);
								else if (i.indexOf("//") === -1) {
									// Relative path to store, i.e. a child
									if (i.charAt(0) !== "/") i = self.uri + "/" + i;
									// Root path, relative to store, i.e. a domain
									else if (self.uri !== null && root.test(i)) {
										parsed = utility.parse(self.uri);
										i      = parsed.protocol + "//" + parsed.host + i;
									}
								}
								else {
									idx = i.replace(/.*\//, "");
									if (idx.isEmpty()) return;
									i.get(function (arg) {
										set(self.source === null ? arg : utility.walk(arg, self.source), idx);
									}, failure, utility.merge({withCredentials: self.credentials}, self.headers));
								}
							});
						});
					});
				else data.sort(array.sort).reverse().each(function (i) {
					self.del(i, false, sync);
				});
			}

			return this;
		},

		/**
		 * Clears the data object, unsets the uri property
		 *
		 * Events: beforeDataClear  Fires before the data is cleared
		 *         afterDataClear   Fires after the data is cleared
		 *
		 * @method clear
		 * @param {Boolean} sync [Optional] Boolean to limit clearing of properties
		 * @return {Object}      Data store
		 */
		clear : function (sync) {
			sync    = (sync === true);
			var obj = this.parentNode;

			if (!sync) {
				obj.fire("beforeDataClear");
				this.callback    = null;
				this.collections = [];
				this.crawled     = false;
				this.credentials = null;
				this.expires     = null;
				this._expires    = null;
				this.headers     = {Accept: "application/json"};
				this.ignore      = [];
				this.key         = null;
				this.keys        = {};
				this.leafs       = [];
				this.loaded      = false;
				this.pointer     = null;
				this.records     = [];
				this.recursive   = false;
				this.retrieve    = false;
				this.source      = null;
				this.total       = 0;
				this.views       = {};
				this.uri         = null;
				this._uri        = null;
				obj.fire("afterDataClear");
			}
			else {
				this.collections = [];
				this.crawled     = false;
				this.keys        = {};
				this.loaded      = false;
				this.records     = [];
				this.total       = 0;
				this.views       = {};
			}
			return this;
		},

		/**
		 * Crawls a record's properties and creates data stores when URIs are detected
		 *
		 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
		 * 
		 * @method crawl
		 * @param  {Mixed}  arg    Record key or index
		 * @param  {String} ignore [Optional] Comma delimited fields to ignore
		 * @param  {String} key    [Optional] data.key property to set on new stores, defaults to record.key
		 * @return {Object}        Record
		 */
		crawl : function (arg, ignore, key) {
			var ignored = false,
			    self    = this,
			    record;

			if (typeof arg !== "number" && typeof arg !== "string") throw Error(label.error.invalidArguments);

			this.crawled = true;
			this.loaded  = false;
			record       = this.get(arg);
			record       = this.records[this.keys[record.key]];
			key          = key || this.key;

			if (typeof ignore === "string") {
				ignored = true;
				ignore  = ignore.explode();
			}

			utility.iterate(record.data, function (v, k) {
				if ((ignored && ignore.contains(k)) || (!(v instanceof Array) && typeof v !== "string")) return;
				if (v instanceof Array) {
					// Possibly a subset of the collection, so it relies on valid URI paths
					if (!self.collections.contains(k)) self.collections.push(k);
					record.data[k] = data.factory({id: record.key + "-" + k}, null, {key: key, pointer: self.pointer, source: self.source});
					record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
					if (ignored) ignore.each(function (i) { record.data[k].data.ignore.add(i); });
					self.leafs.each(function (i) { record.data[k].data.leafs.add(i); });
					if (!self.leafs.contains(k) && self.recursive && self.retrieve) {
						record.data[k].data.recursive = true;
						record.data[k].data.retrieve  = true;
					}

					if (v.length > 0) {
						record.data[k].once("afterDataBatch", function () { this.fire("afterDataRetrieve"); }, "dataRetrieve");
						record.data[k].data.batch("set", v, true);
					}
				}
				else {
					// If either condition is satisified it's assumed that "v" is a URI because it's not ignored
					if (v.charAt(0) === "/" || v.indexOf("//") > -1) {
						if (!self.collections.contains(k)) self.collections.push(k);
						record.data[k] = data.factory({id: record.key + "-" + k}, null, {key: key, pointer: self.pointer, source: self.source});
						record.data[k].once("afterDataSync", function () { this.fire("afterDataRetrieve"); }, "dataRetrieve");
						record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
						if (ignored) ignore.each(function (i) { record.data[k].data.ignore.add(i); });
						self.leafs.each(function (i) { record.data[k].data.leafs.add(i); });
						if (!self.leafs.contains(k) && self.recursive && self.retrieve) {
							record.data[k].data.recursive = true;
							record.data[k].data.retrieve  = true;
						}
						typeof record.data[k].data.setUri === "function" ? record.data[k].data.setUri(v) : record.data[k].data.uri = v;
					}
				}
			});
			return this.get(arg);
		},

		/**
		 * Deletes a record based on key or index
		 *
		 * Events: beforeDataDelete  Fires before the record is deleted
		 *         afterDataDelete   Fires after the record is deleted
		 *         syncDataDelete    Fires when the local store is updated
		 *         failedDataDelete  Fires if the store is RESTful and the action is denied
		 *
		 * @method del
		 * @param  {Mixed}   record  Record key or index
		 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
		 * @param  {Boolean} sync    [Optional] True if called by data.sync
		 * @return {Object}          Data store
		 */
		del : function (record, reindex, sync) {
			if (typeof record === "undefined" || !/number|string/.test(typeof record)) throw Error(label.error.invalidArguments);

			reindex  = (reindex !== false);
			sync     = (sync === true);
			var obj  = this.parentNode,
			    r    = /true|undefined/,
			    key, args, uri, p;

			switch (typeof record) {
				case "string":
					key    = record;
					record = this.keys[key];
					if (typeof record === "undefined") throw Error(label.error.invalidArguments);
					break;
				default:
					key = this.records[record];
					if (typeof key === "undefined") throw Error(label.error.invalidArguments);
					key = key.key;
			}

			args   = {key: key, record: record, reindex: reindex};

			if (!sync && this.callback === null && this.uri !== null) {
				uri = this.uri + "/" + key;
				p   = uri.allows("delete");
			}

			obj.fire("beforeDataDelete", args);
			if (sync || (this.callback !== null) || (this.uri === null)) obj.fire("syncDataDelete", args);
			else if (r.test(p)) uri.del(function () { obj.fire("syncDataDelete", args); }, function () { obj.fire("failedDataDelete", args); }, utility.merge({withCredentials: this.credentials}, this.headers));
			else obj.fire("failedDataDelete", args);
			return this;
		},

		/**
		 * Finds needle in the haystack
		 *
		 * @method find
		 * @param  {Mixed}  needle    String, Number, RegExp Pattern or Function
		 * @param  {String} haystack  [Optional] Commma delimited string of the field(s) to search
		 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
		 * @return {Array}            Array of results
		 */
		find : function (needle, haystack, modifiers) {
			if (typeof needle === "undefined") throw Error(label.error.invalidArguments);

			var result = [],
			    keys   = [],
			    regex  = new RegExp(),
			    fn     = typeof needle === "function";

			// Blocking unnecessary ops
			if (this.total === 0) return result;

			// Preparing parameters
			if (!fn) {
				needle = typeof needle === "string" ? needle.explode() : [needle];
				if (typeof modifiers === "undefined" || String(modifiers).isEmpty()) modifiers = "gi";
				else if (modifiers === null) modifiers = "";
			}
			haystack = typeof haystack === "string" ? haystack.explode() : null;

			// No haystack, testing everything
			if (haystack === null) {
				array.each(this.records, function (r) {
					if (!fn) {
						utility.iterate(r.data, function (v, k) {
							if (keys.contains(r.key)) return false;
							if (v === null || typeof v.data === "object") return;

							array.each(needle, function (n) {
								utility.compile(regex, n, modifiers);
								if (regex.test(String(v).escape())) {
									keys.push(r.key);
									result.add(r);
									return false;
								}
							});
						});
					}
					else if (needle(r) === true) {
						keys.push(r.key);
						result.add(r);
					}
				});
			}
			// Looking through the haystack
			else {
				array.each(this.records, function (r) {
					array.each(haystack, function (h) {
						if (keys.contains(r.key)) return false;
						if (typeof r.data[h] === "undefined" || typeof r.data[h].data === "object") return;

						if (!fn) {
							array.each(needle, function (n) {
								utility.compile(regex, n, modifiers);
								if (regex.test(String(r.data[h]).escape())) {
									keys.push(r.key);
									result.add(r);
									return false;
								}
							});
						}
						else if (needle(r.data[h]) === true) {
							keys.push(r.key);
							result.add(r);
							return false;
						}
					});
				});
			}

			return result;
		},

		/**
		 * Generates a micro-format form from a record
		 * 
		 * If record is null, an empty form based on the first record is generated.
		 * The submit action is data.set() which triggers a POST or PUT
		 * from the data store.
		 * 
		 * @method form
		 * @param  {Mixed}   record null, record, key or index
		 * @param  {Object}  target Target HTML Element
		 * @param  {Boolean} test   [Optional] Test form before setting values
		 * @return {Object}         Generated HTML form
		 */
		form : function (record, target, test) {
			test      = (test !== false);
			var empty = (record === null),
			    self  = this,
			    entity, obj, handler, structure, key, data;

			if (empty) record = this.get(0);
			else if (!(record instanceof Object)) record = this.get(record);

			if (typeof record === "undefined") throw Error(label.error.invalidArguments);
			else if (this.uri !== null && !this.uri.allows("post")) throw Error(label.error.serverInvalidMethod);

			key  = record.key;
			data = record.data;

			if (typeof target !== "undefined") target = utility.object(target);
			if (this.uri !== null) {
				entity = this.uri.replace(/.*\//, "").replace(/\?.*/, "")
				if (entity.isDomain()) entity = entity.replace(/\..*/g, "");
			}
			else entity = "record";

			/**
			 * Button handler
			 * 
			 * @method handler
			 * @param  {Object} event Window event
			 * @return {Undefined}    undefined
			 */
			handler = function (event) {
				var form    = event.srcElement.parentNode,
				    nodes   = $("#" + form.id + " input"),
				    entity  = nodes[0].name.match(/(.*)\[/)[1],
				    result  = true,
				    newData = {},
				    guid;

				self.parentNode.fire("beforeDataFormSubmit");

				if (test) result = form.validate();

				switch (result) {
					case false:
						self.parentNode.fire("failedDataFormSubmit");
						break;
					case true:
						nodes.each(function (i) {
							if (typeof i.type !== "undefined" && /button|submit|reset/.test(i.type)) return;
							utility.define(i.name.replace("[", ".").replace("]", ""), i.value, newData);
						});
						guid = utility.genId(true);
						self.parentNode.once("afterDataSet", function () { form.destroy(); });
						self.set(key, newData[entity]);
						break;
				}

				self.parentNode.fire("afterDataFormSubmit", key);
			};

			/**
			 * Data structure in micro-format
			 * 
			 * @method structure
			 * @param  {Object} record Data store record
			 * @param  {Object} obj    [description]
			 * @param  {String} name   [description]
			 * @return {Undefined}     undefined
			 */
			structure = function (record, obj, name) {
				var x, id;
				utility.iterate(record, function (v, k) {
					if (v instanceof Array) {
						x = 0;
						v.each(function (o) {
							structure(o, obj, name + "[" + k + "][" + (x++) + "]");
						});
					}
					else if (v instanceof Object) structure(v, obj, name + "[" + k + "]");
					else {
						id = (name + "[" + k + "]").replace(/\[|\]/g, "");
						obj.create("label", {"for": id}).html(k.capitalize());
						obj.create("input", {id: id, name: name + "[" + k + "]", type: "text", value: empty ? "" : v});
					}
				});
			};

			this.parentNode.fire("beforeDataForm");
			obj = element.create("form", {style: "display:none;"}, target);
			structure(data, obj, entity);
			obj.create("input", {type: "button", value: label.common.submit}).on("click", function(e) { handler(e); });
			obj.create("input", {type: "reset", value: label.common.reset});
			obj.css("display", "inherit");
			this.parentNode.fire("afterDataForm", obj);
			return obj;  
		},

		/**
		 * Generates a RESTful store (replacing a record) when consuming an API end point
		 *
		 * @param  {Object} key  Record key
		 * @param  {String} uri  [Optional] Related URI
		 * @return {Object}      Data store
		 */
		generate : function (key, uri) {
			var params, idx;
			
			params = {
				headers   : this.headers,
				ignore    : array.clone(this.ignore),
				leafs     : array.clone(this.leafs),
				key       : this.key,
				pointer   : this.pointer,
				recursive : this.recursive,
				retrieve  : this.retrieve,
				source    : this.source
			};

			// Create stub or teardown existing data store
			if (typeof this.keys[key] !== "undefined") {
				idx = this.keys[key];
				if (typeof this.records[idx].data.teardown === "function") this.records[idx].data.teardown();
			}
			else {
				this.set(key, {}, true);
				idx = this.keys[key];
				this.collections.add(key);
			}

			// Creating new child data store
			this.records[idx] = data.factory({id: this.parentNode.id + "-" + key}, null, params);

			// Conditionally making the store RESTful
			if (this.uri !== null && typeof uri === "undefined") {
				uri = this.uri + "/" + key;
				typeof this.records[idx].data.setUri === "function" ? this.records[idx].data.setUri(uri) : this.records[idx].data.uri = uri;
			}

			return this.records[idx].data;
		},

		/**
		 * Retrieves a record based on key or index
		 *
		 * If the key is an integer, cast to a string before sending as an argument!
		 *
		 * @method get
		 * @param  {Mixed}  record Key, index or Array of pagination start & end; or comma delimited String of keys or indices
		 * @param  {Number} offset [Optional] Offset from `record` for pagination
		 * @return {Mixed}         Individual record, or Array of records
		 */
		get : function (record, offset) {
			var records = this.records,
			    obj     = this.parentNode,
			    type    = typeof record,
			    self    = this,
			    r;

			if (type === "undefined" || String(record).length === 0) r = records;
			else if (type === "string" && record.indexOf(",") > -1) {
				r = [];
				record.explode().each(function (i) {
					if (!isNaN(i)) i = parseInt(i);
					r.push(self.get(i));
				});
			}
			else if (type === "string" && typeof this.keys[record] !== "undefined") r = records[this.keys[record]];
			else if (type === "number" && typeof offset === "undefined")            r = records[parseInt(record)];
			else if (type === "number" && typeof offset === "number")               r = records.limit(parseInt(record), parseInt(offset));
			else r = undefined;
			return r;
		},

		/**
		 * Record factory
		 * 
		 * @param  {Mixed}  key  Index or key
		 * @param  {Object} data Record properties
		 * @return {Object}      Record
		 */
		record : function (key, data) {
			return data.record.factory.call(this, key, data);
		},

		/**
		 * Reindexes the data store
		 *
		 * @method reindex
		 * @return {Object} Data store
		 */
		reindex : function () {
			var nth = this.total,
			    obj = this.parentNode,
			    key = (this.key !== null),
			    i   = -1;

			this.views = {};
			if (nth > 0) {
				while (++i < nth) {
					if (!key && this.records[i].key.isNumber()) {
						delete this.keys[this.records[i].key];
						this.records[i].key = i.toString();
					}
					this.keys[this.records[i].key] = i;
				}
			}
			return this;
		},

		/**
		 * Creates or updates an existing record
		 *
		 * If a POST is issued and the data.key property is not set, the
		 * URI is parsed for the key
		 *
		 * Events: beforeDataSet  Fires before the record is set
		 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
		 *         syncDataSet    Fires when the local store is updated
		 *         failedDataSet  Fires if the store is RESTful and the action is denied
		 *
		 * @method set
		 * @param  {Mixed}   key  Integer or String to use as a Primary Key
		 * @param  {Object}  data Key:Value pairs to set as field values
		 * @param  {Boolean} sync [Optional] True if called by data.sync
		 * @return {Object}       The data store
		 */
		set : function (key, data, sync) {
			if (key === null) key = undefined;
			sync = (sync === true);

			if (((typeof key === "undefined" || String(key).isEmpty()) && this.uri === null) || (typeof data === "undefined")) throw Error(label.error.invalidArguments);
			else if (data instanceof Array) return this.generate(key).batch("set", data, true);
			else if ((data instanceof Number) || (data instanceof String) || (typeof data !== "object")) throw Error(label.error.invalidArguments);

			var record = typeof key === "undefined" ? undefined : this.get(key),
			    obj    = this.parentNode,
			    method = typeof key === "undefined" ? "post" : "put",
			    self   = this,
			    args   = {data: {}, key: key, record: undefined},
			    uri    = this.uri,
			    r      = /true|undefined/,
			    p, success, failure;

			if (typeof record !== "undefined") {
				args.record = this.records[this.keys[record.key]];
				utility.iterate(args.record.data, function (v, k) {
					if (!self.collections.contains(k) && !self.ignore.contains(k)) args.data[k] = v;
				});
				utility.merge(args.data, data);
			}
			else args.data = data;

			success = function (arg) {
				args["result"] = arg;
				obj.fire("syncDataSet", args);
			};

			failure = function (e) {
				obj.fire("failedDataSet");
			};

			if (!sync && this.callback === null && uri !== null) {
				if (typeof record !== "undefined") uri += "/" + record.key;
				p = uri.allows(method);
			}

			obj.fire("beforeDataSet", {key: key, data: data});
			if (sync || this.callback !== null || this.uri === null) obj.fire("syncDataSet", args);
			else if (r.test(p)) uri[method](success, failure, data, utility.merge({withCredentials: this.credentials}, this.headers));
			else obj.fire("failedDataSet", args);
			return this;
		},

		/**
		 * Returns a view, or creates a view and returns it
		 *
		 * @method sort
		 * @param  {String} query       SQL (style) order by
		 * @param  {String} create      [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
		 * @param  {String} sensitivity [Optional] Sort sensitivity, defaults to "ci" (insensitive = "ci", sensitive = "cs", mixed = "ms")
		 * @return {Array}               View of data
		 */
		sort : function (query, create, sensitivity) {
			if (typeof query === "undefined" || String(query).isEmpty()) throw Error(label.error.invalidArguments);
			if (!/ci|cs|ms/.test(sensitivity)) sensitivity = "ci";

			create       = (create === true);
			var view     = (query.replace(/\s*asc/g, "").replace(/,/g, " ").toCamelCase()) + sensitivity.toUpperCase(),
			    queries  = query.explode(),
			    needle   = /:::(.*)$/,
			    asc      = /\s*asc$/i,
			    desc     = /\s*desc$/i,
			    nil      = /^null/,
			    key      = this.key,
			    result   = [],
			    bucket, sort, crawl;

			queries.each(function (query) { if (String(query).isEmpty()) throw Error(label.error.invalidArguments); });

			if (!create && this.views[view] instanceof Array) return this.views[view];
			if (this.total === 0) return [];

			crawl = function (q, data) {
				var queries = q.clone(),
				    query   = q.first(),
				    sorted  = {},
				    result  = [];

				queries.remove(0);
				sorted = bucket(query, data, desc.test(query));
				sorted.order.each(function (i) {
					if (sorted.registry[i].length < 2) return;
					if (queries.length > 0) sorted.registry[i] = crawl(queries, sorted.registry[i]);
				});
				sorted.order.each(function (i) { result = result.concat(sorted.registry[i]); });
				return result;
			}

			bucket = function (query, records, reverse) {
				query        = query.replace(asc, "");
				var prop     = query.replace(desc, ""),
				    pk       = (key === prop),
				    order    = [],
				    registry = {};

				records.each(function (r) {
					var val = pk ? r.key : r.data[prop],
					    k   = val === null ? "null" : String(val);

					switch (sensitivity) {
						case "ci":
							k = k.toCamelCase();
							break;
						case "cs":
							k = k.trim();
							break;
						case "ms":
							k = k.trim().slice(0, 1).toLowerCase();
							break;
					}

					if (!(registry[k] instanceof Array)) {
						registry[k] = [];
						order.push(k);
					}
					registry[k].push(r);
				});

				order.sort(array.sort);
				if (reverse) order.reverse();
				
				order.each(function (k) {
					if (registry[k].length === 1) return;
					registry[k] = sort(registry[k], query, prop, reverse, pk);
				});

				return {order: order, registry: registry};
			};

			sort = function (data, query, prop, reverse, pk) {
				var tmp    = [],
				    sorted = [];

				data.each(function (i, idx) {
					var v  = pk ? i.key : i.data[prop];

					v = String(v).trim() + ":::" + idx;
					tmp.push(v.replace(nil, "\"\""));
				});

				if (tmp.length > 1) {
					tmp.sort(array.sort);
					if (reverse) tmp.reverse();
				}

				tmp.each(function (v) { sorted.push(data[needle.exec(v)[1]]); });
				return sorted;
			};

			result           = crawl(queries, this.records);
			this.views[view] = result;
			return result;
		},

		/**
		 * Storage interface
		 * 
		 * @param  {Mixed}  obj  Record (Object, key or index) or store
		 * @param  {Object} op   Operation to perform (get, remove or set)
		 * @param  {String} type [Optional] Type of Storage to use (local or session, default is local)
		 * @return {Object}      Record or store
		 */
		storage : function (obj, op, type) {
			var record  = false,
			    session = (type === "session" && typeof sessionStorage !== "undefined"),
			    ns      = /number|string/,
			    result, key, data;

			if (!/number|object|string/.test(typeof obj) || !/get|remove|set/.test(op)) throw Error(label.error.invalidArguments);

			record = (ns.test(obj) || (obj.hasOwnProperty("key") && !obj.hasOwnProperty("parentNode")));
			if (record && !(obj instanceof Object)) obj = this.get(obj);
			key    = record ? obj.key : obj.parentNode.id;

			switch (op) {
				case "get":
					result = session ? sessionStorage.getItem(key) : localStorage.getItem(key);
					if (result === null) throw Error(label.error.invalidArguments);
					result = json.decode(result);
					record ? this.set(key, result, true) : utility.merge(this, result);
					result = record ? obj : this;
					break;
				case "remove":
					session ? sessionStorage.removeItem(key) : localStorage.removeItem(key);
					result = this;
					break;
				case "set":
					data = json.encode(record ? obj.data : {total: this.total, keys: this.keys, records: this.records});
					session ? sessionStorage.setItem(key, data) : localStorage.setItem(key, data);
					result = this;
					break;
			}

			return result;
		},

		/**
		 * Syncs the data store with a URI representation
		 *
		 * Events: beforeDataSync  Fires before syncing the data store
		 *         afterDataSync   Fires after syncing the data store
		 *         failedDataSync  Fires when an exception occurs
		 *
		 * @method sync
		 * @param {Boolean} reindex [Optional] True will reindex the data store
		 * @return {Object}         Data store
		 */
		sync : function (reindex) {
			if (this.uri === null || this.uri.isEmpty()) throw Error(label.error.invalidArguments);

			reindex  = (reindex === true);
			var self = this,
			    obj  = self.parentNode,
			    guid = utility.guid(true),
			    success, failure;

			success = function (arg) {
				try {
					if (typeof arg !== "object") throw Error(label.error.expectedObject);

					var data, found = false, guid = utility.genId(true);

					if (self.source !== null) arg = utility.walk(arg, self.source);

					if (arg instanceof Array) data = arg;
					else utility.iterate(arg, function (i) {
						if (!found && i instanceof Array) {
							found = true;
							data  = i;
						}
					});

					if (typeof data === "undefined") data = [arg];

					obj.once("afterDataBatch", function (arg) {
						if (reindex) self.reindex();
						this.un("failedDataBatch", guid).fire("afterDataSync", self.get());
					}, guid);

					obj.once("failedDataBatch", function (arg) {
						self.clear(true);
						this.un("afterDataBatch", guid).fire("failedDataSync");
					}, guid);

					self.batch("set", data, true);
				}
				catch (e) {
					error(e, arguments, this);
					obj.fire("failedDataSync", arg);
				}
			};

			failure = function (e) { obj.fire("failedDataSync", e); };

			obj.fire("beforeDataSync");
			this.callback !== null ? this.uri.jsonp(success, failure, {callback: this.callback}) : this.uri.get(success, failure, utility.merge({withCredentials: this.credentials}, this.headers));
			return this;
		},

		/**
		 * Tears down a store & expires all records associated to an API
		 * 
		 * @return {Undefined} undefined
		 */
		teardown : function () {
			var uri = this.uri,
			    records, id;

			if (uri !== null) {
				cache.expire(uri, true);
				observer.remove(uri);
				id = this.parentNode.id + "DataExpire";

				utility.clearTimers(id);

				records = this.get();
				records.each(function (i) {
					cache.expire((uri + "/" + i.key), true);
					observer.remove(uri + "/" + i.key);
					utility.iterate(i.data, function (v, k) {
						if (v === null) return;
						if (v.hasOwnProperty("data") && typeof v.data.teardown === "function") {
							observer.remove(v.id);
							v.data.teardown();
						}
					});
				});
			}
			this.clear(true);
			this.parentNode.fire("afterDataTeardown");
			return this;
		}
	},

	// DataStore record sub class
	record : {
		methods : {
			/**
			 * Deletes the record from it's store
			 * 
			 * @return {Object} DataStore
			 */
			del : function () {
				return this.parentNode.del(this.key);
			},

			/**
			 * Sets a data property of the record
			 * 
			 * @param {String} key   Property to set
			 * @param {Mixed}  value Value to set
			 * @return {Object}      Record
			 */
			set : function (key, value) {
				this.parentNode.set(this.key, {key: value});
				return this;
			},
		},

		/**
		 * DataStore Record factory
		 * 
		 * @param  {[type]} key  [description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		factory : function (key, data) {
			return utility.extend(data.record.methods, {key: key, data: data, parentNode: this});
		}
	},

	/**
	 * Registers a data store on an Object
	 *
	 * Events: beforeDataStore  Fires before registering the data store
	 *         afterDataStore   Fires after registering the data store
	 *
	 * @method register
	 * @param  {Object} obj  Object to register with
	 * @param  {Mixed}  data [Optional] Data to set with this.batch
	 * @param  {Object} args [Optional] Arguments to set on the store
	 * @return {Object}      Object registered with
	 */
	factory : function (obj, recs, args) {
		var methods = {
			expires : {
				getter : function () { return this._expires; },
				setter : function (arg) {
					// Expiry cannot be less than a second, and must be a valid scenario for consumption; null will disable repetitive expiration
					if ((arg !== null && this.uri === null) || (arg !== null && (isNaN(arg) || arg < 1000))) throw Error(label.error.invalidArguments);

					if (this._expires === arg) return;
					this._expires = arg;

					var id      = this.parentNode.id + "DataExpire",
					    expires = arg,
					    self    = this;

					utility.clearTimers(id);

					if (arg === null) return;

					utility.repeat(function () {
						if (self.uri === null) {
							typeof self.setExpires === "function" ? self.setExpires(null) : self.expires = null;
							return false;
						}
						if (!cache.expire(self.uri)) self.uri.fire("beforeExpire, expire, afterExpire");
					}, expires, id);
				}
			},
			uri : {
				getter : function () { return this._uri; },
				setter : function (arg) {
					if (arg !== null && arg.isEmpty()) throw Error(label.error.invalidArguments);

					if (this._uri === arg) return;
					else if (this._uri !== null) this._uri.un();
					else this._uri = arg;

					if (arg !== null) {
						arg.on("expire", function () { this.sync(true); }, "dataSync", this);
						cache.expire(arg, true);
						this.sync();
					}
				}
			}
		};

		obj = utility.object(obj);
		utility.genId(obj);

		// Hooking observer if not present in prototype chain
		if (typeof obj.fire === "undefined") observer.hook(obj);

		obj.fire("beforeDataStore");

		// Creating store
		obj.data = utility.extend(data.methods);
		obj.data.parentNode = obj;
		obj.data.clear();

		// Customizing store
		if (args instanceof Object) utility.merge(obj.data, args);

		// Delete listener
		obj.on("syncDataDelete", function (data) {
			var record = this.get(data.record);

			this.records.remove(this.keys[data.key]);
			delete this.keys[data.key];
			this.total--;
			this.views = {};
			if (data.reindex) this.reindex();
			utility.iterate(record.data, function (v, k) {
				if (v === null) return;
				if (typeof v.data !== "undefined" && typeof v.data.teardown === "function") v.data.teardown();
			});
			this.parentNode.fire("afterDataDelete", record);
			return this.parentNode;
		}, "recordDelete", obj.data);

		// Set listener
		obj.on("syncDataSet", function (arg) {
			var data = typeof arg.record === "undefined" ? utility.clone(arg) : arg,
			    fire = true,
			    self = this,
			    record, uri;

			this.views = {};

			if (typeof data.record === "undefined") {
				var index = this.total++;

				if (typeof data.key === "undefined") {
					if (typeof data.result === "undefined") {
						this.total--;
						this.fire("failedDataSet");
						throw Error(label.error.expectedObject);
					}
					if (this.source !== null) data.result = utility.walk(data.result, this.source);
					if (this.key === null) data.key = array.cast(data.result).first();
					else {
						data.key = data.result[this.key];
						delete data.result[this.key];
					}
					if (typeof data.key !== "string") data.key = data.key.toString();
					data.data = data.result;
				}
				this.keys[data.key] = index;
				this.records[index] = {};
				record              = this.records[index];
				record.key          = data.key;
				if (this.pointer === null || typeof data.data[this.pointer] === "undefined") {
					record.data = data.data;
					if (this.key !== null && this.records[index].data.hasOwnProperty(this.key)) delete this.records[index].data[this.key];
				}
				else {
					fire = false;
					uri  = data.data[this.pointer];
					if (typeof uri === "undefined" || uri === null) {
						delete this.records[index];
						delete this.keys[data.key];
						this.fire("failedDataSet");
						throw Error(label.error.expectedObject);
					}
					record.data = {};
					uri.get(function (args) {
						if (self.source !== null) args = utility.walk(args, self.source);
						if (typeof args[self.key] !== "undefined") delete args[self.key];
						utility.merge(record.data, args);
						//record = self.record(record.key, record.data);
						if (self.retrieve) {
							self.crawl(record.key, self.ignore.length > 0 ? self.ignore.join(",") : undefined, self.key);
							self.loaded = true;
						}
						self.parentNode.fire("afterDataSet", record);
					}, function () {
						self.parentNode.fire("failedDataSet");
					}, self.headers);
				}
			}
			else {
				record = this.records[this.keys[data.record.key]];
				utility.merge(record.data, data.data);
			}

			if (this.retrieve) this.crawl(record.key, this.ignore.length > 0 ? this.ignore.join(",") : undefined, this.key);
			if (fire) this.parentNode.fire("afterDataSet", record);
		}, "recordSet", obj.data);

		// Getters & setters
		if (!client.ie || client.version > 8) {
			utility.property(obj.data, "uri",     {enumerable: true, get: methods.uri.getter,     set: methods.uri.setter});
			utility.property(obj.data, "expires", {enumerable: true, get: methods.expires.getter, set: methods.expires.setter});
		}
		// Only exists when no getters/setters (IE8)
		else {
			obj.data.setExpires = function (arg) {
				obj.data.expires = arg;
				methods.expires.setter.call(obj.data, arg);
			};
			obj.data.setUri = function (arg) {
				obj.data.uri = arg;
				methods.uri.setter.call(obj.data, arg);
			};
		}

		if (typeof recs === "object" && recs !== null) obj.data.batch("set", recs);
		obj.fire("afterDataStore");
		return obj;
	}
};
