/**
 * DataStore
 *
 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
 *
 * @class data
 * @namespace abaaso
 */
var data = {
	/**
	 * Decorates a data store on an Object
	 *
	 * @method decorator
	 * @param  {Object} obj  Object to decorate
	 * @param  {Mixed}  recs [Optional] Data to set with this.batch
	 * @param  {Object} args [Optional] Arguments to set on the store
	 * @return {Object}      Object to decorate
	 */
	decorator : function (obj, recs, args) {
		obj = utility.object(obj);
		utility.genId(obj);

		// Decorating observer if not present in prototype chain
		if (typeof obj.fire !== "function") observer.decorate(obj);

		// Creating store
		obj.data = new DataStore(obj);
		if (args instanceof Object) utility.merge(obj.data, args);
		if (recs !== null && typeof recs === "object") obj.data.batch("set", recs);

		return obj;
	},

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
		 * @return {Object}          Promise
		 */
		batch : function (type, data, sync, chunk) {
			type    = type.toString().toLowerCase();
			sync    = (sync === true);
			chunk   = chunk || 1000;

			if (!regex.set_del.test(type) || (sync && regex.del.test(type)) || typeof data !== "object") throw Error(label.error.invalidArguments);

			var obj      = this.parentNode,
			    self     = this,
			    events   = (this.events === true),
			    r        = 0,
			    nth      = data.length,
			    f        = false,
			    guid     = utility.genId(true),
			    deferred = promise.factory(),
			    complete, deferred2, failure, key, set, del, success, parsed;

			deferred2 = deferred.then(function (arg) {
				self.loaded = true;

				if (regex.del.test(type)) self.reindex();

				array.each(self.datalists, function (i) {
					if (!i.ready) i.display();
				});

				if (events) obj.fire("afterDataBatch", arg);
			}, function (e) {
				if (events) obj.fire("failedDataBatch", e);
				throw e;
			});

			complete = function (arg) {
				deferred.resolve(arg);
			};

			failure = function (arg) {
				deferred.reject(arg);
			};

			set = function (data, key) {
				var deferred = promise.factory(),
				    guid     = utility.genId(),
				    rec      = {};

				if (typeof data.batch !== "function") rec = utility.clone(data)
				else utility.iterate(data, function (v, k) {
					if (!array.contains(self.collections, k)) rec[k] = utility.clone(v);
				});

				if (self.key !== null && rec[self.key] !== undefined) {
					key = rec[self.key];
					delete rec[self.key];
				}

				deferred.then(function (arg) {
					if (++r === nth) complete(self.get());
				}, function (e) {
					if (!f) {
						f = true;
						failure(e);
					}
				});

				if (rec instanceof Array && self.uri !== null) {
					self.generate(key, undefined)
					    .then(function (arg) {
					    	deferred.resolve(arg);
					     }, function (e) {
					    	deferred.reject(e);
					     });
				}
				else {
					self.set(key, rec, true)
					    .then(function (arg) {
					    	deferred.resolve(arg);
					     }, function (e) {
					    	deferred.reject(e);
					     });
				}
			};

			del = function (i) {
				var deferred = promise.factory();

				deferred.then(function (arg) {
					if (++r === nth) complete(arg);
					return arg;
				}, function (arg) {
					if (!f) {
						f = true;
						failure(arg);
					}
					return arg;
				});

				self.del(i, false, true)
				    .then(function (arg) {
				    	deferred.resolve(arg);
				     }, function (e) {
				    	deferred.reject(e);
				     });
			};

			if (events) obj.fire("beforeDataBatch", data);

			if (sync) this.clear(sync);

			array.each(this.datalists, function (i) {
				i.ready = false;
			});

			if (data.length === 0) complete([]);
			else {
				if (type === "set") {
					array.each(array.chunk(data, chunk), function (a, adx) {
						var offset = adx * chunk;

						array.each(a, function (i, idx) {
							if (self.leafs.contains(i)) {
								idx = i;
								i   = {};
							}
							else idx = (offset + idx).toString();

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
				}
				else {
					array.each(data.sort(array.sort).reverse(), function (i) {
						del(i);
					});
				}
			}

			return deferred2;
		},

		/**
		 * Clears the data object, unsets the uri property
		 *
		 * Events: beforeDataClear  Fires before the data is cleared
		 *         afterDataClear   Fires after the data is cleared
		 *
		 * @method clear
		 * @param  {Boolean} sync    [Optional] Boolean to limit clearing of properties
		 * @return {Object}          Data store
		 */
		clear : function (sync) {
			sync       = (sync === true);
			var obj    = this.parentNode,
			    events = (this.events === true);

			if (!sync) {
				if (events) obj.fire("beforeDataClear");
				this.callback    = null;
				this.collections = [];
				this.crawled     = false;
				this.credentials = null;
				this.datalists   = [];
				this.depth       = 0;
				this.events      = true;
				this.expires     = null;
				this.headers     = {Accept: "application/json"};
				this.ignore      = [];
				this.key         = null;
				this.keys        = {};
				this.leafs       = [];
				this.loaded      = false;
				this.maxDepth    = 0;
				this.pointer     = null;
				this.records     = [];
				this.recursive   = false;
				this.retrieve    = false;
				this.source      = null;
				this.total       = 0;
				this.views       = {};
				this.uri         = null;
				if (events) obj.fire("afterDataClear");
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
		 *         failedDataRetrieve Fires if an exception occurs
		 * 
		 * @method crawl
		 * @param  {Mixed}  arg Record, key or index
		 * @return {Object}     Promise
		 */
		crawl : function (arg) {
			var self     = this,
			    events   = (this.events === true),
			    record   = (arg instanceof Object) ? arg : this.get(arg),
			    uri      = this.uri === null ? "" : this.uri,
			    deferred = promise.factory(),
			    i        = 0,
			    nth      = 0,
			    build, complete, deferred2, setup;

			if (record === undefined) throw Error(label.error.invalidArguments);

			this.crawled = true;

			deferred2 = deferred.then(function (arg) {
				return arg;
			});

			/**
			 * Concats URIs together
			 * 
			 * @method build
			 * @param  {String} entity Entity URI
			 * @param  {String} store  Data store URI
			 * @return {String}        URI
			 */
			build = function (entity, store) {
				var result = "",
				    parsed;

				if (/\/\//.test(entity)) result = entity;
				else if (entity.charAt(0) === "/" && store.charAt(0) !== "/") {
					parsed = utility.parse(store);
					result = parsed.protocol + "//" + parsed.host + entity;
				}
				else result = entity;

				return result;
			};

			/**
			 * Crawl complete handler
			 * 
			 * @method complete
			 * @return {Undefined} undefined
			 */
			complete = function () {
				if (++i === nth) deferred.resolve(nth);
			};

			/**
			 * Sets up a data store
			 *
			 * Possibly a subset of the collection, so it relies on valid URI paths
			 * 
			 * @method setup
			 * @param  {String} key Record key
			 * @return {Object}     Data store
			 */
			setup = function (key, self) {
				var obj = {};

				if (!array.contains(self.collections, key)) self.collections.push(key);

				obj = data.decorator({id: record.key + "-" + key}, null, {key: self.key, pointer: self.pointer, source: self.source, ignore: utility.clone(self.ignore), leafs: utility.clone(self.leafs), depth: self.depth + 1, maxDepth: self.maxDepth});
				obj.data.headers = utility.merge(obj.data.headers, self.headers);

				if (!array.contains(self.leafs, key) && self.recursive && self.retrieve && (obj.data.maxDepth === 0 || obj.data.depth < obj.data.maxDepth)) {
					obj.data.recursive = true;
					obj.data.retrieve  = true;
				}

				return obj;
			};

			// Depth of recursion is controled by `maxDepth`
			utility.iterate(record.data, function (v, k) {
				var deferred, store, parsed;

				if (array.contains(self.ignore, k) || array.contains(self.leafs, k) || self.depth >= self.maxDepth || (!(v instanceof Array) && typeof v !== "string")) return;

				nth      = array.cast(record.data).length;
				deferred = promise.factory();
				deferred.then(function (arg) {
					if (events) record.data[k].fire("afterDataRetrieve", arg);
					complete();
				}, function (e) {
					if (events) record.data[k].fire("failedDataRetrieve", e);
					complete();
				});

				if ((v instanceof Array) && v.length > 0) {
					record.data[k] = setup(k, self);
					if (typeof v[0] === "string") {
						array.each(v, function (i, idx) {
							v[idx] = build(i, uri);
						});
					}
					record.data[k].data.batch("set", v, true, undefined)
					                   .then(function (arg) {
					                   		deferred.resolve(arg);
					                   	}, function (e) {
					                   		deferred.reject(e);
					                   	});
				}
				// If either condition is satisified it's assumed that "v" is a URI because it's not ignored
				else if (v.charAt(0) === "/" || v.indexOf("//") > -1) {
					record.data[k] = setup(k, self);
					v = build(v, uri);
					record.data[k].data.setUri(v)
					                   .then(function (arg) {
					                   		deferred.resolve(arg);
					                   	}, function (e) {
					                   		deferred.reject(e);
					                   	});
				}
			});

			return deferred2;
		},

		/**
		 * Deletes a record based on key or index
		 *
		 * Events: beforeDataDelete  Fires before the record is deleted
		 *         afterDataDelete   Fires after the record is deleted
		 *         failedDataDelete  Fires if the store is RESTful and the action is denied
		 *
		 * @method del
		 * @param  {Mixed}   record  Record key or index
		 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
		 * @param  {Boolean} batch   [Optional] True if called by data.batch
		 * @return {Object}          Promise
		 */
		del : function (record, reindex, batch) {
			if (record === undefined || !regex.number_string.test(typeof record)) throw Error(label.error.invalidArguments);

			reindex      = (reindex !== false);
			batch        = (batch === true);
			var obj      = this.parentNode,
			    self     = this,
			    events   = (this.events === true),
			    deferred = promise.factory(),
			    deferred2, key, args, uri, p;

			deferred2 = deferred.then(function (arg) {
				var record = self.get(arg.record);

				self.records.remove(self.keys[arg.key]);
				delete self.keys[arg.key];
				self.total--;
				self.views = {};

				utility.iterate(record.data, function (v, k) {
					if (v === null) return;
					if (v.data !== undefined && typeof v.data.teardown === "function") v.data.teardown();
				});

				if (arg.reindex) self.reindex();

				if (!batch) {
					array.each(self.datalists, function (i) {
						if (i.ready) i.del(record);
					});
				}

				if (events) obj.fire("afterDataDelete", record);
			}, function (e) {
				if (events) obj.fire("failedDataDelete", e);
				throw e;
			});

			if (typeof record === "string") {
				key    = record;
				record = this.keys[key];
				if (record === undefined) throw Error(label.error.invalidArguments);
			}
			else {
				key = this.records[record];
				if (key === undefined) throw Error(label.error.invalidArguments);
				key = key.key;
			}

			args   = {key: key, record: record, reindex: reindex};

			if (!batch && this.callback === null && this.uri !== null) {
				uri = this.uri + "/" + key;
				p   = uri.allows("delete");
			}

			if (events) obj.fire("beforeDataDelete", args);

			if (batch || this.callback !== null || this.uri === null) deferred.resolve(args);
			else if (regex.true_undefined.test(p)) {
				uri.del(function (arg) {
					deferred.resolve(args);
				}, function (e) {
					deferred.reject(args);
				}, utility.merge({withCredentials: this.credentials}, this.headers));
			}
			else deferred.reject(args);

			return deferred2;
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
							if (array.contains(keys, r.key)) return false;
							if (v === null || typeof v.data === "object") return;

							array.each(needle, function (n) {
								utility.compile(regex, n, modifiers);
								if (regex.test(v)) {
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
						if (array.contains(keys, r.key)) return false;
						if (r.data[h] === undefined || typeof r.data[h].data === "object") return;

						if (!fn) {
							array.each(needle, function (n) {
								utility.compile(regex, n, modifiers);
								if (regex.test(r.data[h])) {
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
			test       = (test !== false);
			var empty  = (record === null),
			    self   = this,
			    events = (this.events === true),
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
			handler = function (e) {
				var form    = utility.target(e).parentNode,
				    nodes   = $("#" + form.id + " input"),
				    entity  = nodes[0].name.match(/(.*)\[/)[1],
				    result  = true,
				    newData = {},
				    guid;

				utility.stop(e);

				if (events) self.parentNode.fire("beforeDataFormSubmit");

				if (test) result = form.validate();

				switch (result) {
					case false:
						if (events) self.parentNode.fire("failedDataFormSubmit");
						break;
					case true:
						array.each(nodes, function (i) {
							if (typeof i.type !== "undefined" && regex.input_button.test(i.type)) return;
							utility.define(i.name.replace("[", ".").replace("]", ""), i.value, newData);
						});
						guid = utility.genId(true);
						self.parentNode.once("afterDataSet", function () {
							form.destroy();
						});
						self.set(key, newData[entity]);
						break;
				}

				if (events) self.parentNode.fire("afterDataFormSubmit", key);
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

			if (events) this.parentNode.fire("beforeDataForm");
			obj = element.create("form", {style: "display:none;"}, target);
			structure(data, obj, entity);
			obj.create("input", {type: "button", value: label.common.submit}).on("click", function(e) {
				handler(e);
			});
			obj.create("input", {type: "reset", value: label.common.reset});
			obj.css("display", "inherit");
			if (events) this.parentNode.fire("afterDataForm", obj);
			return obj;  
		},

		/**
		 * Generates a RESTful store (replacing a record) when consuming an API end point
		 *
		 * @param  {Object} key Record key
		 * @param  {Mixed}  arg [Optional] Array or URI String
		 * @return {Object}     Promise
		 */
		generate : function (key, arg) {
			var self     = this,
			    deferred = promise.factory(),
			    params   = {},
			    recs     = null,
			    deferred2, fn, idx;
			
			params = {
				depth     : this.depth + 1,
				headers   : this.headers,
				ignore    : array.clone(this.ignore),
				leafs     : array.clone(this.leafs),
				key       : this.key,
				maxDepth  : this.maxDepth,
				pointer   : this.pointer,
				recursive : this.recursive,
				retrieve  : this.retrieve,
				source    : this.source
			};

			deferred2 = deferred.then(function (arg) {
				return arg;
			}, function (e) {
				throw e;
			});

			fn = function () {
				// Creating new child data store
				if (typeof arg === "object") recs = arg;
				if (params.maxDepth === 0 || params.depth <= params.maxDepth) {
					self.records[idx] = data.decorator({id: key}, recs, params);

					// Not batching in a data set
					if (recs === null) {
						// Constructing relational URI
						if (self.uri !== null && arg === undefined && !array.contains(self.leafs, key)) arg = self.uri + "/" + key;
						
						// Conditionally making the store RESTful
						if (arg !== undefined) {
							self.records[idx].data.setUri(arg)
							                      .then(function (arg) {
							                      		deferred.resolve(arg);
							                       }, function (e) {
							                      		deferred.reject(e);
							                       });
						}
						else deferred.resolve(self.records[idx].data.get());
					}
				}
			}

			// Create stub or teardown existing data store
			if (this.keys[key] !== undefined) {
				idx = this.keys[key];
				if (typeof this.records[idx].data.teardown === "function") this.records[idx].data.teardown();
				fn();
			}
			else {
				this.set(key, {}, true).then(function (arg) {
					idx = self.keys[arg.key];
					self.collections.add(arg.key);
					fn();
				});
			}

			return deferred2;
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
			else if (type === "string" && this.keys[record] !== undefined) r = records[this.keys[record]];
			else if (type === "number" && offset === undefined)            r = records[parseInt(record)];
			else if (type === "number" && typeof offset === "number")      r = records.limit(parseInt(record), parseInt(offset));
			else r = undefined;
			return r;
		},

		/**
		 * Purges data store or record from localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		purge : function (arg) {
			return this.storage(arg || this, "remove");
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
		 * Restores data store or record frome localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		restore : function (arg) {
			return this.storage(arg || this, "get");
		},

		/**
		 * Saves data store or record to localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		save : function (arg) {
			return this.storage(arg || this, "set");
		},

		/**
		 * Creates or updates an existing record
		 *
		 * If a POST is issued and the data.key property is not set, the
		 * URI is parsed for the key
		 *
		 * Events: beforeDataSet  Fires before the record is set
		 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
		 *         failedDataSet  Fires if the store is RESTful and the action is denied
		 *
		 * @method set
		 * @param  {Mixed}   key   [Optional] Integer or String to use as a Primary Key
		 * @param  {Object}  data  Key:Value pairs to set as field values
		 * @param  {Boolean} batch [Optional] True if called by data.batch
		 * @return {Object}        Promise
		 */
		set : function (key, data, batch) {
			var self     = this,
			    deferred = promise.factory(),
			    deferred2, record, obj, method, events, args, uri, p, success, failure;

			deferred2 = deferred.then(function (arg) {
				var data     = utility.clone(arg),
				    deferred = promise.factory(),
				    record, uri;

				// Decorating Functions that were lost with JSON encode/decode of `utility.clone()`
				utility.iterate(arg.data, function (v, k) {
					if (typeof v === "function") data.data[k] = v;
				});

				deferred.then(function (arg) {
					if (self.retrieve) self.crawl(arg);

					if (!batch) {
						array.each(self.datalists, function (i) {
							if (i.ready) i.set();
						});
					}

					if (events) self.parentNode.fire("afterDataSet", arg);
				}, function (e) {
					if (events) self.parentNode.fire("failedDataSet", e);
				});

				self.views = {};

				// Getting the record again due to scheduling via promises, via data.batch()
				if (data.key !== undefined) data.record = self.get(data.key);

				if (data.record === undefined) {
					var index = self.total++;

					if (data.key === undefined) {
						if (data.result === undefined) {
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
					self.records[index] = {key: data.key, data: {}};
					record              = self.records[index];

					if (self.pointer === null || data.data[self.pointer] === undefined) {
						record.data = data.data;
						if (self.key !== null && record.data.hasOwnProperty(self.key)) delete record.data[self.key];
						deferred.resolve(record);
					}
					else {
						uri  = data.data[self.pointer];

						if (uri === undefined || uri === null) {
							delete self.records[index];
							delete self.keys[data.key];
							deferred.reject(label.error.expectedObject);
						}

						record.data = {};

						uri.get(function (args) {
							if (self.source !== null) args = utility.walk(args, self.source);
							if (args[self.key] !== undefined) delete args[self.key];
							record.data = args;
							deferred.resolve(record);
						}, function (e) {
							deferred.reject(e);
						}, self.headers);
					}
				}
				else {
					record = self.records[self.keys[data.record.key]];
					record.data = data.data;
					deferred.resolve(record);
				}
			}, function (e) {
				if (events) obj.fire("failedDataSet", e);
				throw e;
			});

			if (key instanceof Object) {
				batch = data;
				data  = key;
				key   = null;
			}

			if (key === null && this.uri === null) key = utility.guid();
			else if (key === null) key = undefined;

			batch = (batch === true);

			if (!(data instanceof Object)) throw Error(label.error.invalidArguments);
			else if (data instanceof Array) {
				return this.generate(key)
				           .then(function () {
				           		self.get(key).data.batch("set", data)
				           		                  .then(function (arg) {
				           		                  		deferred.resolve(arg);
				           		                   }, function (e) {
				           		                   		deferred.reject(e);
				           		                   });
				           });
			}

			record   = key === undefined ? undefined : this.get(key);
			obj      = this.parentNode;
			method   = key === undefined ? "post" : "put";
			events   = (this.events === true);
			args     = {data: {}, key: key, record: undefined};
			uri      = this.uri;

			if (record !== undefined) {
				args.record = this.records[this.keys[record.key]];
				utility.iterate(args.record.data, function (v, k) {
					if (!array.contains(self.collections, k) && !array.contains(self.ignore, k)) args.data[k] = v;
				});
				args.data = data;
			}
			else args.data = data;

			if (!batch && this.callback === null && uri !== null) {
				if (record !== undefined) uri += "/" + record.key;
				p = uri.allows(method);
			}

			if (events) obj.fire("beforeDataSet", {key: key, data: data});

			if (batch || this.callback !== null || this.uri === null) deferred.resolve(args);
			else if (regex.true_undefined.test(p)) {
				uri[method](function (arg) {
					args["result"] = arg;
					deferred.resolve(args);
					return args;
				}, function (e) {
					deferred.reject(e);
					return e;
				}, data, utility.merge({withCredentials: this.credentials}, this.headers));
			}
			else deferred.reject(args);

			return deferred2;
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
		 * @param  {String} arg [Optional] API collection end point
		 * @return {Object}     Promise
		 */
		setUri : function (arg) {
			var deferred = promise.factory(),
			    result;

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
					this.sync(true)
					    .then(function (arg) {
					    	deferred.resolve(arg);
					     }, function (e) {
					    	deferred.reject(e);
					     });
				}
			}

			return deferred;
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
			var view     = (query.replace(/\s*asc/ig, "").replace(",", " ").toCamelCase()) + sensitivity.toUpperCase(),
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
				query        = query.replace(/\s*asc/ig, "");
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
							k = string.trim(k);
							break;
						case "ms":
							k = string.trim(k).slice(0, 1).toLowerCase();
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
					var v  = pk ? i.key : i.data[prop];

					v = string.trim(v.toString()) + ":::" + idx;
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

			if (!regex.number_string_object.test(typeof obj) || !regex.get_remove_set.test(op)) throw Error(label.error.invalidArguments);

			record = (regex.number_string.test(obj) || (obj.hasOwnProperty("key") && !obj.hasOwnProperty("parentNode")));
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
		 * @param  {Boolean} reindex [Optional] True will reindex the data store
		 * @return {Object}          Promise
		 */
		sync : function (reindex) {
			if (this.uri === null || this.uri.isEmpty()) throw Error(label.error.invalidArguments);

			reindex       = (reindex === true);
			var self      = this,
			    events    = (this.events === true),
			    obj       = self.parentNode,
			    guid      = utility.guid(true),
			    deferred1 = promise.factory(),
			    deferred2 = promise.factory(),
			    deferred3, success, failure;

			deferred1.then(function (arg) {
				if (typeof arg !== "object") throw Error(label.error.expectedObject);

				var found = false,
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

				self.batch("set", data, true, undefined)
				    .then(function (arg) {
				    	deferred2.resolve(arg);
				    }, function (e) {
				    	deferred2.reject(e);
				    });
				return data;
			}, function (e) {
				deferred2.reject(e);
			});

			deferred3 = deferred2.then(function (arg) {
				if (reindex) self.reindex();
				if (events) obj.fire("afterDataSync", arg);
			}, function (e) {
				if (events) obj.fire("failedDataSync", e);
				throw e;
			});

			success = function (arg) {
				deferred1.resolve(arg);
			};

			failure = function (e) {
				deferred1.reject(e);
			};

			if (events) obj.fire("beforeDataSync");

			this.callback !== null ? client.jsonp(this.uri, success, failure, {callback: this.callback})
			                       : client.request(this.uri, "GET", success, failure, null, utility.merge({withCredentials: this.credentials}, this.headers));

			return deferred3;
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

				array.each(this.datalists, function (i) {
					i.teardown();
				});

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
		},

		/**
		 * Updates an existing Record
		 * 
		 * @param  {Mixed}  key  Integer or String to use as a Primary Key
		 * @param  {Object} data Key:Value pairs to set as field values
		 * @return {Object}      Promise
		 */
		update : function (key, data) {
			var record = this.get(key),
			    self   = this,
			    args, deferred;

			if (record === undefined) throw Error(label.error.invalidArguments);

			args     = utility.merge(record.data, data);
			deferred = promise.factory();

			this.set(key, args).then(function (arg) {
				deferred.resolve(arg);
			}, function (e) {
				error(e, arguments, self);
			});

			return deferred;

		}
	}
};

/**
 * DataStore factory
 * 
 * @class DataStore
 * @namespace abaaso
 * @param  {Object} obj Object being decorated with a DataStore
 * @return {Object}     Instance of DataStore
 */
function DataStore (obj) {
	this.parentNode = obj;
	this.clear();
};

// Setting prototype & constructor loop
DataStore.prototype = data.methods;
DataStore.prototype.constructor = DataStore;
