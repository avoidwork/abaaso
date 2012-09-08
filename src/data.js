/**
 * Template data store, use $.store(obj), abaaso.store(obj) or abaaso.data.register(obj)
 * to register it with an Object
 *
 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
 *
 * Do not use this directly!
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
		 * @param  {String}  type Type of action to perform
		 * @param  {Mixed}   data Array of keys or indices to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
		 * @return {Object}       Data store
		 */
		batch : function (type, data, sync) {
			type = type.toString().toLowerCase();
			sync = (sync === true);

			if (!/^(set|del)$/.test(type) || typeof data !== "object") throw Error(label.error.invalidArguments);

			var obj  = this.parentNode,
			    self = this,
			    r    = 0,
			    nth  = 0,
			    f    = false,
			    guid = utility.genId(true),
			    completed, failure, key, set, success;

			completed = function () {
				if (type === "del") self.reindex();
				self.loaded = true;
				obj.fire("afterDataBatch");
			};

			failure = function (arg) {
				obj.fire("failedDataSet, failedDataBatch", arg);
			};

			set = function (data, key) {
				var guid = utility.genId(),
				    rec  = {};

				if (typeof rec.batch !== "function") rec = utility.clone(data);
				else $.iterate(data, function (v, k) { if (!self.collections.contains(k)) rec[k] = utility.clone(v); });

				if (self.key !== null && typeof rec[self.key] !== "undefined") {
					key = rec[self.key];
					delete rec[self.key];
				}

				obj.once("afterDataSet", function () {
					this.un("failedDataSet", guid);
					if (++r && r === nth) completed();
				}, guid).once("failedDataSet", function () {
					this.un("afterDataSet", guid)
					if (!f) {
						f = true;
						this.fire("failedDataBatch");
					}
				}, guid);

				self.set(key, rec, sync);
			};

			obj.fire("beforeDataBatch", data);

			if (type === "del") {
				obj.on("afterDataDelete", function () {
					if (r++ && r === nth) {
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

			if (data instanceof Array) {
				nth = data.length;
				switch (nth) {
					case 0:
						completed();
						break;
					default:
						data.sort().reverse().each(function (i, idx) {
							idx = idx.toString();
							if (type === "set") switch (true) {
								case typeof i === "object":
									set(i, idx);
									break;
								case i.indexOf("//") === -1:
									i = self.uri + i;
								default:
									i.get(function (arg) { set(self.source === null ? arg : utility.walk(arg, self.source), idx); }, failure, utility.merge({withCredentials: self.credentials}, self.headers));
									break;
							}
							else self.del(i, false, sync);
						});
				}
			}
			else {
				nth = array.cast(data, true).length;
				utility.iterate(data, function (v, k) {
					if (type === "set") {
						if (self.key !== null && typeof v[self.key] !== "undefined") {
							key = v[self.key];
							delete v[self.key];
						}
						else key = k.toString();
						self.set(key, v, sync);
					}
					else self.del(v, false, sync);
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
			record       = this.records[this.keys[record.key].index];
			key          = key || this.key;

			if (typeof ignore === "string") {
				ignored = true;
				ignore  = ignore.explode();
			}

			utility.iterate(record.data, function (v, k) {
				var uri  = v,
				    pass = false;

				if (typeof uri !== "string" || (ignored && ignore.contains(k))) return;

				switch (true) {
					case (/^(?:https?|ftp):\/\//.test(uri)):
						pass = true;
						break
					case uri.indexOf("//") === 0:
						uri = self.uri.replace(/\/\/.*/, "") + uri;
						pass = true;
						break;
					case uri.indexOf("/") === 0:
						uri = self.uri + uri;
						pass = true;
						break;
				}

				if (pass) {
					if (!self.collections.contains(k)) self.collections.push(k);
					record.data[k] = data.register({id: record.key + "-" + k}, null, {key: key, pointer: self.pointer, source: self.source});
					record.data[k].once("afterDataSync", function () { this.fire("afterDataRetrieve"); }, "dataRetrieve");
					record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
					ignore.each(function (i) { record.data[k].data.ignore.add(i); });
					if (self.recursive && self.retrieve) {
						record.data[k].data.recursive = true;
						record.data[k].data.retrieve  = true;
					}
					typeof record.data[k].data.setUri === "function" ? record.data[k].data.setUri(uri) : record.data[k].data.uri = uri;
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
					if (typeof key === "undefined") throw Error(label.error.invalidArguments);
					record = record.index;
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
			switch (true) {
				case sync:
				case this.callback !== null:
				case this.uri === null:
					obj.fire("syncDataDelete", args);
					break;
				case r.test(p):
					uri.del(function () { obj.fire("syncDataDelete", args); }, function () { obj.fire("failedDataDelete", args); }, utility.merge({withCredentials: this.credentials}, this.headers));
					break;
				default:
					obj.fire("failedDataDelete", args);
			}
			return this;
		},

		/**
		 * Finds needle in the haystack
		 *
		 * @method find
		 * @param  {Mixed}  needle    String, Number or Pattern to test for
		 * @param  {String} haystack  [Optional] Commma delimited string of the field(s) to search
		 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
		 * @return {Array}            Array of results
		 */
		find : function (needle, haystack, modifiers) {
			if (typeof needle === "undefined") throw Error(label.error.invalidArguments);

			needle     = typeof needle   === "string" ? needle.explode() : [needle];
			haystack   = typeof haystack === "string" ? haystack.explode() : null;

			var result = [],
			    obj    = this.parentNode,
			    keys   = [],
			    regex  = new RegExp();

			if (this.total === 0) return result;

			switch (true) {
				case typeof modifiers === "undefined":
				case String(modifiers).isEmpty():
					modifiers = "gi";
					break;
				case modifiers === null:
					modifiers = "";
					break;
			}

			// No haystack, testing everything
			if (haystack === null) {
				this.records.each(function (r) {
					utility.iterate(r.data, function (v, k) {
						if (keys.contains(r.key)) return false;
						if (typeof v.data === "object") return;

						needle.each(function (n) {
							utility.compile(regex, n, modifiers);
							if (regex.test(v)) {
								keys.push(r.key);
								result.add(r);
								return false;
							}
						});
					});
				});
			}
			// Looking through the haystack
			else this.records.each(function (r) {
				haystack.each(function (h) {
					if (keys.contains(r.key)) return false;
					if (typeof r.data[h] === "undefined" || typeof r.data[h].data === "object") return;

					needle.each(function (n) {
						utility.compile(regex, n, modifiers);
						if (regex.test(r.data[h])) {
							keys.push(r.key);
							result.add(r);
							return false;
						}
					});
				});
			});

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

			switch (true) {
				case empty:
					record = this.get(0);
					break;
				case !(record instanceof Object):
					record = this.get(record);
					break;
			}

			switch (true) {
				case typeof record === "undefined":
					throw Error(label.error.invalidArguments);
				case this.uri !== null && !this.uri.allows("post"): // POST & PUT are interchangable for this bit
					throw Error(label.error.serverInvalidMethod);
			}

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
					switch (true) {
						case v instanceof Array:
							x = 0;
							v.each(function (o) { structure(o, obj, name + "[" + k + "][" + (x++) + "]"); });
							break;
						case v instanceof Object:
							structure(v, obj, name + "[" + k + "]");
							break;
						default:
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
		 * Retrieves a record based on key or index
		 *
		 * If the key is an integer, cast to a string before sending as an argument!
		 *
		 * @method get
		 * @param  {Mixed}  record Key, index or Array of pagination start & end; or comma delimited String of keys or indices
		 * @param  {Number} end    [Optional] Ceiling for pagination
		 * @return {Mixed}         Individual record, or Array of records
		 */
		get : function (record, end) {
			var records = this.records,
			    obj     = this.parentNode,
			    type    = typeof record,
			    self    = this,
			    r;

			switch (true) {
				case type === "undefined":
				case String(record).length === 0:
					r = records;
					break;
				case type === "string" && record.indexOf(",") > -1:
					r = [];
					record.explode().each(function (i) {
						if (!isNaN(i)) i = parseInt(i);
						r.push(self.get(i));
					});
					break;
				case type === "string" && typeof this.keys[record] !== "undefined":
					r = records[this.keys[record].index];
					break;
				case type === "number" && typeof end === "undefined":
					r = records[parseInt(record)];
					break;
				case type === "number" && typeof end === "number":
					r = records.range(parseInt(record), parseInt(end));
					break;
				default:
					r = undefined;
			}

			return r;
		},

		/**
		 * Reindices the data store
		 *
		 * @method reindex
		 * @return {Object} Data store
		 */
		reindex : function () {
			var nth = this.total,
			    obj = this.parentNode,
			    key = (this.key !== null),
			    i;

			this.views = {};
			if (nth === 0) return this;
			for(i = 0; i < nth; i++) {
				if (!key && this.records[i].key.isNumber()) {
					delete this.keys[this.records[i].key];
					this.keys[i.toString()] = {};
					this.records[i].key = i.toString();
				}
				this.keys[this.records[i].key].index = i;
			}
			return this;
		},

		/**
		 * Creates or updates an existing record
		 *
		 * If a POST is issued, and the data.key property is not set the
		 * first property of the response object will be used as the key
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

			switch (true) {
				case (typeof key === "undefined" || String(key).isEmpty()) && this.uri === null:
				case typeof data === "undefined":
				case data instanceof Array:
				case data instanceof Number:
				case data instanceof String:
				case typeof data !== "object":
					throw Error(label.error.invalidArguments);
			}

			var record = typeof key === "undefined" ? undefined : this.get(key),
			    obj    = this.parentNode,
			    method = typeof key === "undefined" ? "post" : "put",
			    self   = this,
			    args   = {data: {}, key: key, record: undefined},
			    uri    = this.uri,
			    r      = /true|undefined/,
			    p, success, failure;

			if (typeof record !== "undefined") {
				args.record = this.records[this.keys[record.key].index];
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
			switch (true) {
				case sync:
				case this.callback !== null:
				case this.uri === null:
					obj.fire("syncDataSet", args);
					break;
				case r.test(p):
					uri[method](success, failure, data, utility.merge({withCredentials: this.credentials}, this.headers));
					break;
				default:
					obj.fire("failedDataSet", args);
			}
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

				if (typeof $.repeating[id] !== "undefined") {
					clearTimeout($.repeating[id]);
					delete $.repeating[id];
				}

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
			return this;
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
	register : function (obj, data, args) {
		var methods = {
			expires : {
				getter : function () { return this._expires; },
				setter : function (arg) {
					if (arg !== null && this.uri === null  && isNaN(arg)) throw Error(label.error.invalidArguments);

					if (this._expires === arg) return;
					this._expires = arg;

					var id      = this.parentNode.id + "DataExpire",
					    expires = arg,
					    self    = this;

					clearTimeout($.repeating[id]);
					delete $.repeating[id];

					if (arg === null) return;

					utility.defer(function () {
						utility.repeat(function () {
							if (self.uri === null) {
								typeof self.setExpires === "function" ? self.setExpires(null) : self.expires = null;
								return false;
							}
							if (!cache.expire(self.uri)) self.uri.fire("beforeExpire, expire, afterExpire");
						}, expires, id);
					}, expires);
				}
			},
			uri : {
				getter : function () { return this._uri; },
				setter : function (arg) {
					if (arg !== null && arg.isEmpty()) throw Error(label.error.invalidArguments);

					switch (true) {
						case this._uri === arg:
							return;
						case this._uri !== null:
							this._uri.un();
						default:
							this._uri = arg;
					}

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
		if (typeof obj.fire === "undefined")      obj.fire      = function (event, arg) { return $.fire.call(this, event, arg); };
		if (typeof obj.listeners === "undefined") obj.listeners = function (event) { return $.listeners.call(this, event); };
		if (typeof obj.on === "undefined")        obj.on        = function (event, listener, id, scope, standby) { return $.on.call(this, event, listener, id, scope, standby); };
		if (typeof obj.once === "undefined")      obj.once      = function (event, listener, id, scope, standby) { return $.once.call(this, event, listener, id, scope, standby); };
		if (typeof obj.un === "undefined")        obj.un        = function (event, id) { return $.un.call(this, event, id); };

		obj.fire("beforeDataStore");

		obj.data = utility.extend(this.methods);
		obj.data.parentNode = obj; // Recursion, useful
		obj.data.clear();          // Setting properties

		if (args instanceof Object) utility.merge(obj.data, args);

		obj.on("syncDataDelete", function (data) {
			var record = this.get(data.record);

			this.records.remove(this.keys[data.key].index);
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

		obj.on("syncDataSet", function (arg) {
			var data = typeof arg.record === "undefined" ? utility.clone(arg) : arg,
			    fire = true,
			    self = this,
			    record, uri;

			switch (true) {
				case typeof data.record === "undefined":
					var index = this.total;
					this.total++;
					if (typeof data.key === "undefined") {
						if (typeof data.result === "undefined") {
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
					this.keys[data.key] = {};
					this.keys[data.key].index = index;
					this.records[index] = {};
					record     = this.records[index];
					record.key = data.key;
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
							if (self.retrieve) {
								self.crawl(record.key, self.ignore.length > 0 ? self.ignore.join(",") : undefined, self.key);
								self.loaded = true;
							}
							self.parentNode.fire("afterDataSet", record);
						}, function () { self.parentNode.fire("failedDataSet"); }, self.headers);
					}
					break;
				default:
					record = this.records[this.keys[data.record.key].index];
					utility.merge(record.data, data.data);
			}
			this.views = {};
			if (this.retrieve) this.crawl(record.key, this.ignore.length > 0 ? this.ignore.join(",") : undefined, this.key);
			if (fire) this.parentNode.fire("afterDataSet", record);
		}, "recordSet", obj.data);

		// Getters & setters
		switch (true) {
			case (!client.ie || client.version > 8):
				utility.property(obj.data, "uri",     {enumerable: true, get: methods.uri.getter,     set: methods.uri.setter});
				utility.property(obj.data, "expires", {enumerable: true, get: methods.expires.getter, set: methods.expires.setter});
				break;
			default: // Only exists when no getters/setters (IE8)
				obj.data.setExpires = function (arg) {
					obj.data.expires = arg;
					methods.expires.setter.call(obj.data, arg);
				};
				obj.data.setUri = function (arg) {
					obj.data.uri = arg;
					methods.uri.setter.call(obj.data, arg);
				};
		}

		if (typeof data === "object" && data !== null) obj.data.batch("set", data);
		obj.fire("afterDataStore");
		return obj;
	}
};
