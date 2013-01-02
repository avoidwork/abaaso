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
		 * @param  {String}  type    Type of action to perform (set/del/delete)
		 * @param  {Mixed}   data    Array of keys or indices to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync    [Optional] Syncs store with data, if true everything is erased
		 * @param  {Number}  chunk   [Optional] Size to chunk Array to batch set or delete
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		batch : function (type, data, sync, chunk, future) {
			type    = type.toString().toLowerCase();
			sync    = (sync === true);
			chunk   = chunk || 1000;

			if (!regex.set_del.test(type) || (sync && regex.del.test(type)) || typeof data !== "object") throw Error(label.error.invalidArguments);

			var obj      = this.parentNode,
			    self     = this,
			    r        = 0,
			    nth      = data.length,
			    f        = false,
			    guid     = utility.genId(true),
			    deferred = promise.factory(),
			    completed, failure, key, set, del, success, parsed;

			deferred.then(function (arg) {
				if (regex.del.test(type)) self.reindex();
				self.loaded = true;
				obj.fire("afterDataBatch", arg);
				if (future instanceof Promise) future.resolve(arg);
				return arg;
			}, function (arg) {
				obj.fire("failedDataBatch", arg);
				if (future instanceof Promise) future.reject(arg);
				return arg;
			});

			completed = function (arg) {
				deferred.resolve(arg);
			};

			failure = function (arg) {
				deferred.reject(arg);
			};

			set = function (data, key) {
				var deferred = promise.factory(),
				    guid     = utility.genId(),
				    rec      = {};

				if (typeof rec.batch !== "function") rec = utility.clone(data)
				else utility.iterate(data, function (v, k) {
					if (!self.collections.contains(k)) rec[k] = utility.clone(v);
				});

				if (self.key !== null && rec[self.key] !== undefined) {
					key = rec[self.key];
					delete rec[self.key];
				}

				deferred.then(function (arg) {
					if (++r === nth) completed(self.get());
					return arg;
				}, function (arg) {
					if (!f) {
						f = true;
						failure(arg);
					}
					return arg;
				});

				if (rec instanceof Array && self.uri !== null) self.generate(key, undefined, deferred);
				else self.set(key, rec, sync, deferred);
			};

			del = function (i) {
				var deferred = promise.factory();

				deferred.then(function (arg) {
					if (++r === nth) completed(arg);
					return arg;
				}, function (arg) {
					if (!f) {
						f = true;
						failure(arg);
					}
					return arg;
				});

				self.del(i, false, sync, deferred);
			};

			obj.fire("beforeDataBatch", data);

			if (sync) this.clear(sync);

			if (data.length === 0) completed(false);
			else {
				if (type === "set") array.each(data.chunk(chunk), function (a, adx) {
						var offset = adx * chunk;

						utility.defer(function () {
							array.each(a, function (i, idx) {
								idx = (offset + idx).toString();
								if (typeof i === "object") set(i, idx);
								else if (i.indexOf("//") === -1) {
									// Relative path to store, i.e. a child
									if (i.charAt(0) !== "/") i = self.uri + "/" + i;

									// Root path, relative to store, i.e. a domain
									else if (self.uri !== null && regex.root.test(i)) {
										parsed = utility.parse(self.uri);
										i      = parsed.protocol + "//" + parsed.host + i;
									}

									idx = i.replace(regex.not_endpoint, "");
									if (idx.isEmpty()) return;

									i.get(function (arg) {
										set(self.source === null ? arg : utility.walk(arg, self.source), idx);
									}, failure, utility.merge({withCredentials: self.credentials}, self.headers));
								}
								else {
									idx = i.replace(regex.not_endpoint, "");
									if (idx.isEmpty()) return;
									i.get(function (arg) {
										set(self.source === null ? arg : utility.walk(arg, self.source), idx);
									}, failure, utility.merge({withCredentials: self.credentials}, self.headers));
								}
							});
						});
					});
				else array.each(data.sort(array.sort).reverse(), function (i) {
					del(i);
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
		 * @param  {Boolean} sync    [Optional] Boolean to limit clearing of properties
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		clear : function (sync, future) {
			sync    = (sync === true);
			var obj = this.parentNode;

			if (!sync) {
				obj.fire("beforeDataClear");
				this.callback    = null;
				this.collections = [];
				this.crawled     = false;
				this.credentials = null;
				this.expires     = null;
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

			if (future instanceof Promise) future.resolve(true);
			return this;
		},

		/**
		 * Crawls a record's properties and creates data stores when URIs are detected
		 *
		 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
		 *         failedDataRetrieve Fires if an exception occurs
		 * 
		 * @method crawl
		 * @param  {Mixed}   arg     Record key or index
		 * @param  {String}  ignore  [Optional] Comma delimited fields to ignore
		 * @param  {String}  key     [Optional] data.key property to set on new stores, defaults to record.key
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Record
		 */
		crawl : function (arg, ignore, key, future) {
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
				var deferred = promise.factory();

				deferred.then(function (arg) {
					this.fire("afterDataRetrieve", arg);
					if (future instanceof Promise) future.resolve(arg);
					return arg;
				}, function (arg) {
					this.fire("failedDataRetrieve", arg);
					if (future instanceof Promise) future.reject(arg);
					return arg;
				});

				if ((ignored && ignore.contains(k)) || (!(v instanceof Array) && typeof v !== "string")) return;
				if (v instanceof Array) {
					// Possibly a subset of the collection, so it relies on valid URI paths
					if (!self.collections.contains(k)) self.collections.push(k);
					record.data[k] = data.factory({id: record.key + "-" + k}, null, {key: key, pointer: self.pointer, source: self.source});
					record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
					
					// Inheriting `ignored` collection
					if (ignored) array.each(ignore, function (i) {
						record.data[k].data.ignore.add(i);
					});

					// Inheriting `leafs` collection
					array.each(self.leafs, function (i) {
						record.data[k].data.leafs.add(i);
					});

					if (!self.leafs.contains(k) && self.recursive && self.retrieve) {
						record.data[k].data.recursive = true;
						record.data[k].data.retrieve  = true;
					}

					if (v.length > 0) record.data[k].data.batch("set", v, true, deferred);
				}
				else {
					// If either condition is satisified it's assumed that "v" is a URI because it's not ignored
					if (v.charAt(0) === "/" || v.indexOf("//") > -1) {
						// Possibly a subset of the collection, so it relies on valid URI paths
						if (!self.collections.contains(k)) self.collections.push(k);
						record.data[k] = data.factory({id: record.key + "-" + k}, null, {key: key, pointer: self.pointer, source: self.source});
						record.data[k].data.headers = utility.merge(record.data[k].data.headers, self.headers);
						
						// Inheriting `ignored` collection
						if (ignored) array.each(ignore, function (i) {
							record.data[k].data.ignore.add(i);
						});

						// Inheriting `leafs` collection
						array.each(self.leafs, function (i) {
							record.data[k].data.leafs.add(i);
						});

						if (!self.leafs.contains(k) && self.recursive && self.retrieve) {
							record.data[k].data.recursive = true;
							record.data[k].data.retrieve  = true;
						}

						record.data[k].data.setUri(v, deferred);
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
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		del : function (record, reindex, sync, future) {
			if (record === undefined || !regex.number_string.test(typeof record)) throw Error(label.error.invalidArguments);

			reindex      = (reindex !== false);
			sync         = (sync === true);
			var obj      = this.parentNode,
			    self     = this,
			    deferred = promise.factory(),
			    key, args, uri, p;

			deferred.then(function (arg) {
				var record = self.get(arg.record);

				self.records.remove(self.keys[arg.key]);
				delete self.keys[arg.key];
				self.total--;
				self.views = {};
				if (arg.reindex) self.reindex();
				utility.iterate(record.data, function (v, k) {
					if (v === null) return;
					if (v.data !== undefined && typeof v.data.teardown === "function") v.data.teardown();
				});
				obj.fire("afterDataDelete", record);
				if (future instanceof Promise) future.resolve(arg);
				return arg;
			}, function (arg) {
				obj.fire("failedDataDelete", args);
				if (future instanceof Promise) future.reject(arg);
				return arg;
			});

			if (typeof record === "string") {
				key    = record;
				record = this.keys[key];
				if (typeof record === "undefined") throw Error(label.error.invalidArguments);
			}
			else {
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

			if (sync || (this.callback !== null) || (this.uri === null)) deferred.resolve(args);
			else if (regex.true_undefined.test(p)) {
				uri.del(function (arg) {
					deferred.resolve(args);
				}, function (e) {
					deferred.reject(args);
				}, utility.merge({withCredentials: this.credentials}, this.headers));
			}
			else deferred.reject(args);
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
			if (needle === undefined) throw Error(label.error.invalidArguments);

			var result = [],
			    keys   = [],
			    regex  = new RegExp(),
			    fn     = typeof needle === "function";

			// Blocking unnecessary ops
			if (this.total === 0) return result;

			// Preparing parameters
			if (!fn) {
				needle = typeof needle === "string" ? needle.explode() : [needle];
				if (modifiers === undefined || String(modifiers).isEmpty()) modifiers = "gi";
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
						if (r.data[h] === undefined || typeof r.data[h].data === "object") return;

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

			if (record === undefined) throw Error(label.error.invalidArguments);
			else if (this.uri !== null && !this.uri.allows("post")) throw Error(label.error.serverInvalidMethod);

			key  = record.key;
			data = record.data;

			if (target !== undefined) target = utility.object(target);
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
						array.each(nodes, function (i) {
							if (typeof i.type !== "undefined" && regex.input_button.test(i.type)) return;
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
						array.each(v, function (o) {
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
		 * @param  {Object}  key     Record key
		 * @param  {String}  uri     [Optional] Related URI
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		generate : function (key, uri, future) {
			var deferred = promise.factory(),
			    params   = {},
			    idx;
			
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

			deferred.then(function (arg) {
				if (future instanceof Promise) future.resolve(arg);
				return arg;
			}, function (arg) {
				if (future instanceof Promise) future.reject(arg);
				return arg;
			});

			// Create stub or teardown existing data store
			if (this.keys[key] !== undefined) {
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

			// Constructing relational URI
			if (this.uri !== null && uri === undefined && !this.leafs.contains(key)) uri = this.uri + "/" + key;
			
			// Conditionally making the store RESTful
			if (uri !== undefined) this.records[idx].data.setUri(uri, deferred);
			else deferred.resolve(this.records[idx].data.get());

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
				array.each(record.explode(), function (i) {
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
		 * @method record
		 * @param  {Mixed}  key  Index or key
		 * @param  {Object} data Record properties
		 * @return {Object}      Record
		 */
		record : function (key, args) {
			return data.record.factory.call(this, key, args);
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
		 * @param  {Mixed}   key     Integer or String to use as a Primary Key
		 * @param  {Object}  data    Key:Value pairs to set as field values
		 * @param  {Boolean} sync    [Optional] True if called by data.sync
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		set : function (key, data, sync, future) {
			if (key === null) key = undefined;
			sync    = (sync === true);

			if (((key === undefined || String(key).isEmpty()) && this.uri === null) || (data === undefined)) throw Error(label.error.invalidArguments);
			else if (data instanceof Array) return this.generate(key).batch("set", data, true, future);
			else if ((data instanceof Number) || (data instanceof String) || (typeof data !== "object")) throw Error(label.error.invalidArguments);

			var record   = key === undefined ? undefined : this.get(key),
			    obj      = this.parentNode,
			    method   = key === undefined ? "post" : "put",
			    self     = this,
			    args     = {data: {}, key: key, record: undefined},
			    uri      = this.uri,
			    deferred = promise.factory(),
			    p;

			if (record !== undefined) {
				args.record = this.records[this.keys[record.key]];
				utility.iterate(args.record.data, function (v, k) {
					if (!self.collections.contains(k) && !self.ignore.contains(k)) args.data[k] = v;
				});
				utility.merge(args.data, data);
			}
			else args.data = data;

			deferred.then(function (arg) {
				var data     = typeof arg.record === "undefined" ? utility.clone(arg) : arg,
				    fire     = true,
				    deferred = promise.factory(),
				    record, uri;

				deferred.then(function (arg) {
					if (fire) self.parentNode.fire("afterDataSet", arg);
					if (future instanceof Promise) future.resolve(arg);
					return arg;
				}, function (arg) {
					self.fire("failedDataSet");
					if (future instanceof Promise) future.reject(arg);
					throw Error(arg);
				});

				self.views = {};

				if (typeof data.record === "undefined") {
					var index = self.total++;

					if (typeof data.key === "undefined") {
						if (typeof data.result === "undefined") {
							self.total--;
							deferred.reject(label.error.expectedObject);
						}
					
						if (self.source !== null) data.result = utility.walk(data.result, self.source);
					
						if (self.key === null) data.key = array.cast(data.result).first();
						else {
							data.key = data.result[self.key];
							delete data.result[self.key];
						}
					
						if (typeof data.key !== "string") data.key = data.key.toString();

						data.data = data.result;
					}

					self.keys[data.key] = index;
					self.records[index] = self.record(data.key, {});
					record              = self.records[index];

					if (self.pointer === null || typeof data.data[self.pointer] === "undefined") {
						record.data = data.data;
						if (self.key !== null && self.records[index].data.hasOwnProperty(self.key)) delete self.records[index].data[self.key];
					}
					else {
						fire = false;
						uri  = data.data[self.pointer];

						if (typeof uri === "undefined" || uri === null) {
							delete self.records[index];
							delete self.keys[data.key];
							deferred.reject(label.error.expectedObject);
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
							deferred.resolve(record);
						}, function (e) {
							deferred.reject(e);
						}, self.headers);
					}
				}
				else {
					record = self.records[self.keys[data.record.key]];
					utility.merge(record.data, data.data);
				}

				if (self.retrieve) self.crawl(record.key, self.ignore.length > 0 ? self.ignore.join(",") : undefined, self.key);
				deferred.resolve(record);
				return arg;
			}, function (arg) {
				obj.fire("failedDataSet", arg);
				if (future instanceof Promise) future.reject(arg);
				return arg;
			});

			if (!sync && this.callback === null && uri !== null) {
				if (typeof record !== "undefined") uri += "/" + record.key;
				p = uri.allows(method);
			}

			obj.fire("beforeDataSet", {key: key, data: data});

			if (sync || this.callback !== null || this.uri === null) deferred.resolve(args);
			else if (regex.true_undefined.test(p)) {
				uri[method](function (arg) {
					args["result"] = arg;
					deferred.resolve(args);
				}, function (e) {
					deferred.reject(e);
				}, data, utility.merge({withCredentials: this.credentials}, this.headers));
			}
			else deferred.reject(args);
			return this;
		},

		/**
		 * Gets or sets an explicit expiration of data
		 *
		 * @method setExpires
		 * @param  {Number} arg  Milliseconds until data is stale
		 * @return {Object}      Data store
		 */
		setExpires : function (arg) {
			// Expiry cannot be less than a second, and must be a valid scenario for consumption; null will disable repetitive expiration
			if ((arg !== null && this.uri === null) || (arg !== null && (isNaN(arg) || arg < 1000))) throw Error(label.error.invalidArguments);

			if (this.expires === arg) return;
			this.expires = arg;

			var id      = this.parentNode.id + "DataExpire",
			    expires = arg,
			    self    = this;

			utility.clearTimers(id);

			if (arg === null) return;

			utility.repeat(function () {
				if (self.uri === null) {
					self.setExpires(null);
					return false;
				}
				if (!cache.expire(self.uri)) self.uri.fire("beforeExpire, expire, afterExpire");
			}, expires, id, false);
		},

		/**
		 * Sets the RESTful API end point
		 * 
		 * @method setUri
		 * @param  {String}  arg     [Optional] API collection end point
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		setUri : function (arg, future) {
			var result;

			if (arg !== null && arg.isEmpty()) throw Error(label.error.invalidArguments);

			if (this.uri === arg) result = this.uri;
			else {
				if (this.uri !== null) this.uri.un();
				result = this.uri = arg;

				if (result !== null) {
					result.on("expire", function () {
						this.sync(true);
					}, "dataSync", this);
					cache.expire(result, true);
					this.sync(true, future);
				}
			}

			return result;
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
			if (query === undefined || String(query).isEmpty()) throw Error(label.error.invalidArguments);
			if (!regex.sensitivity_types.test(sensitivity)) sensitivity = "ci";

			create       = (create === true);
			var view     = (query.replace(regex.asc, "").replace(",", " ").toCamelCase()) + sensitivity.toUpperCase(),
			    queries  = query.explode(),
			    key      = this.key,
			    result   = [],
			    bucket, sort, crawl;

			array.each(queries, function (query) {
				if (String(query).isEmpty()) throw Error(label.error.invalidArguments);
			});

			if (!create && this.views[view] instanceof Array) return this.views[view];
			if (this.total === 0) return [];

			crawl = function (q, data) {
				var queries = q.clone(),
				    query   = q.first(),
				    sorted  = {},
				    result  = [];

				queries.remove(0);
				sorted = bucket(query, data, regex.desc.test(query));
				array.each(sorted.order, function (i) {
					if (sorted.registry[i].length < 2) return;
					if (queries.length > 0) sorted.registry[i] = crawl(queries, sorted.registry[i]);
				});
				array.each(sorted.order, function (i) {
					result = result.concat(sorted.registry[i]);
				});
				return result;
			}

			bucket = function (query, records, reverse) {
				query        = query.replace(regex.asc, "");
				var prop     = query.replace(regex.desc, ""),
				    pk       = (key === prop),
				    order    = [],
				    registry = {};

				array.each(records, function (r) {
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
				
				array.each(order, function (k) {
					if (registry[k].length === 1) return;
					registry[k] = sort(registry[k], query, prop, reverse, pk);
				});

				return {order: order, registry: registry};
			};

			sort = function (data, query, prop, reverse, pk) {
				var tmp    = [],
				    sorted = [];

				array.each(data, function (i, idx) {
					var v  = pk ? i.key : i.data[prop].toString();

					v = string.trim(v) + ":::" + idx;
					tmp.push(v.replace(regex.nil, "\"\""));
				});

				if (tmp.length > 1) {
					tmp.sort(array.sort);
					if (reverse) tmp.reverse();
				}

				array.each(tmp, function (v) {
					sorted.push(data[regex.sort_needle.exec(v)[1]]);
				});
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
			    self    = this,
			    session = (type === "session" && typeof sessionStorage !== "undefined"),
			    result, key, data;

			if (!/number|object|string/.test(typeof obj) || !/get|remove|set/.test(op)) throw Error(label.error.invalidArguments);

			record = (regex.number_string.test(obj) || (obj.hasOwnProperty("key") && !obj.hasOwnProperty("parentNode")));
			if (record && !(obj instanceof Object)) obj = this.get(obj);
			key    = record ? obj.key : obj.parentNode.id;

			switch (op) {
				case "get":
					result = session ? sessionStorage.getItem(key) : localStorage.getItem(key);
					if (result === null) throw Error(label.error.invalidArguments);
					result = json.decode(result);
					if (record) this.set(key, result, true);
					else {
						utility.merge(this, result);
						array.each(self.records, function (i, idx) {
							self.records[idx] = self.record(i.key, i.data);
						});
					}
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
		 * @param  {Boolean} reindex [Optional] True will reindex the data store
		 * @param  {Object}  future  [Optional] Promise
		 * @return {Object}          Data store
		 */
		sync : function (reindex, future) {
			if (this.uri === null || this.uri.isEmpty()) throw Error(label.error.invalidArguments);

			reindex      = (reindex === true);
			var self     = this,
			    obj      = self.parentNode,
			    guid     = utility.guid(true),
			    deferred = promise.factory(),
			    success, failure;

			deferred.then(function (arg) {
				if (typeof arg !== "object") throw Error(label.error.expectedObject);

				var found    = false,
				    deferred = promise.factory(),
				    data;

				if (self.source !== null) arg = utility.walk(arg, self.source);

				if (arg instanceof Array) data = arg;
				else utility.iterate(arg, function (i) {
					if (!found && i instanceof Array) {
						found = true;
						data  = i;
					}
				});

				if (data === undefined) data = [arg];

				deferred.then(function (arg) {
					var data = [];

					if (reindex) self.reindex();
					obj.fire("afterDataSync", arg);
					if (future instanceof Promise) future.resolve(arg);
					return data;
				}, function (arg) {
					self.clear(true);
					obj.fire("failedDataSync", arg);
					if (future instanceof Promise) future.reject(arg);
					return arg;
				});

				self.batch("set", data, true, 1000, deferred);
				return arg;
			}, function (arg) {
				obj.fire("failedDataSync", arg);
				if (future instanceof Promise) future.reject(arg);
				return arg;
			});

			success = function (arg) {
				deferred.resolve(arg);
			};

			failure = function (e) {
				deferred.reject(e);
			};

			obj.fire("beforeDataSync");
			this.callback !== null ? client.jsonp(this.uri, success, failure, {callback: this.callback})
			                       : client.request(this.uri, "GET", success, failure, utility.merge({withCredentials: this.credentials}, this.headers));
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
				array.each(records, function (i) {
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
			 * @param  {Object} future [Optional] Promise
			 * @return {Object}        Data Store
			 */
			del : function (future) {
				return this.parentNode.del(this.key, true, false, future);
			},

			/**
			 * Sets a data property of the record
			 * 
			 * @param  {String} key    Property to set
			 * @param  {Mixed}  value  Value to set
			 * @param  {Object} future [Optional] Promise
			 * @return {Object}        Record
			 */
			set : function (key, value, future) {
				this.parentNode.set(this.key, {key: value}, false, future);
				return this;
			}
		},

		/**
		 * DataStore Record factory
		 * 
		 * @param  {String} key  Record key
		 * @param  {Object} data Record data
		 * @return {Object}      Instance of `record`
		 */
		factory : function (key, args) {
			return utility.extend(data.record.methods, {key: key, data: args});
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

		// Setting records
		if (typeof recs === "object" && recs !== null) obj.data.batch("set", recs);
		
		obj.fire("afterDataStore");
		return obj;
	}
};
