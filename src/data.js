/**
 * Decorates a DataStore on an Object
 *
 * @method decorator
 * @param  {Object} obj  Object
 * @param  {Mixed}  recs [Optional] Data to set with this.batch
 * @param  {Object} args [Optional] Arguments to set on the store
 * @return {Object}      Decorated Object
 */
var data = function ( obj, recs, args ) {
	utility.genId( obj );

	// Decorating observer if not present in prototype chain
	if ( typeof obj.fire !== "function" ) {
		observer.decorate( obj );
	}

	// Creating store
	obj.data = new DataStore( obj );

	if ( args instanceof Object ) {
		utility.merge( obj.data, args );
	}

	if ( recs !== null && typeof recs === "object" ) {
		obj.data.batch( "set", recs );
	}

	return obj;
};

/**
 * DataStore factory
 *
 * @method DataStore
 * @constructor
 * @private
 * @param  {Object} obj Object being decorated with a DataStore
 * @return {Object}     Instance of DataStore
 */
function DataStore ( obj ) {
	this.autosave    = false;
	this.callback    = null;
	this.collections = [];
	this.crawled     = false;
	this.credentials = null;
	this.datalists   = [];
	this.depth       = 0;
	this.events      = false;
	this.expires     = null;
	this.headers     = {Accept: "application/json"};
	this.ignore      = [];
	this.key         = null;
	this.keys        = {};
	this.leafs       = [];
	this.loaded      = false;
	this.maxDepth    = 0;
	this.mongodb     = "";
	this.parentNode  = obj;
	this.pointer     = null;
	this.records     = [];
	this.recursive   = false;
	this.retrieve    = false;
	this.source      = null;
	this.total       = 0;
	this.views       = {};
	this.uri         = null;
}

// Setting constructor loop
DataStore.prototype.constructor = DataStore;

/**
 * Batch sets or deletes data in the store
 *
 * Events: beforeDataBatch  Fires before the batch is queued
 *         afterDataBatch   Fires after the batch is queued
 *         failedDataBatch  Fires when an exception occurs
 *
 * @method batch
 * @param  {String}  type Type of action to perform ( set/del/delete )
 * @param  {Array}   data Array of keys or indices to delete, or Object containing multiple records to set
 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
 * @return {Object}          Deferred
 */
DataStore.prototype.batch = function ( type, data, sync ) {
	if ( !regex.set_del.test( type ) || ( sync && regex.del.test( type ) ) || typeof data !== "object" ) {
		throw new Error( label.error.invalidArguments );
	}

	sync          = ( sync === true );
	var self      = this,
	    events    = this.events,
	    defer     = deferred(),
	    defer2    = undefined,
	    deferreds = [];

	if ( events ) {
		observer.fire( self.parentNode, "beforeDataBatch", data );
	}

	if ( data.length === 0 ) {
		defer.resolve( this.records );
	}
	else {
		if ( sync ) {
			this.clear( sync );
		}

		if ( type === "del" ) {
			array.each( data, function ( i ) {
				deferreds.push( self.del( i,  ) );
			});
		}
		else {
			array.each( data, function ( i ) {
				deferreds.push( self.set( null, i ) );
			});
		}

		utility.when( deferreds ).then( function () {
			self.loaded = true;

			if ( events ) {
				observer.fire( self.parentNode, "afterDataBatch", self.records );
			}

			array.each( self.datalists, function ( i ) {
				i.refresh( true );
			});

			if ( type === "del" ) {
				self.reindex();
			}

			if ( self.autosave ) {
				self.save();
			}
		}, function ( e ) {
			observer.fire( self.parentNode, "failedDataBatch", e );
			defer.reject( e );
		});
	}

	return defer.then;
};

/**
 * Clears the data object, unsets the uri property
 *
 * Events: beforeDataClear Fires before the data is cleared
 *         afterDataClear  Fires after the data is cleared
 *
 * @method clear
 * @param  {Boolean} sync [Optional] Boolean to limit clearing of properties
 * @return {Object}       Data store
 */
DataStore.prototype.clear = function ( sync ) {
	sync       = ( sync === true );
	var events = ( this.events === true );

	if ( !sync ) {
		if ( events ) {
			observer.fire( this.parentNode, "beforeDataClear" );
		}

		array.each( this.datalists, function ( i ) {
			i.teardown( true );
		});

		this.autosave    = false;
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

		if ( events ) {
			observer.fire( this.parentNode, "afterDataClear" );
		}
	}
	else {
		this.collections = [];
		this.crawled     = false;
		this.keys        = {};
		this.loaded      = false;
		this.records     = [];
		this.total       = 0;
		this.views       = {};

		array.each( this.datalists, function ( i ) {
			i.refresh( true, true );
		});
	}

	return this;
};

/**
 * Crawls a record's properties and creates DataStores when URIs are detected
 *
 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
 *         failedDataRetrieve Fires if an exception occurs
 *
 * @method crawl
 * @param  {Mixed}  arg Record, key or index
 * @return {Object}     Deferred
 */
DataStore.prototype.crawl = function ( arg ) {
	var self   = this,
	    events = ( this.events === true ),
	    record = ( arg instanceof Object ) ? arg : this.get( arg ),
	    uri    = this.uri === null ? "" : this.uri,
	    defer  = deferred(),
	    i      = 0,
	    nth    = 0,
	    build, complete, setup;

	if ( record === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	this.crawled = true;

	/**
	 * Concats URIs together
	 *
	 * @method build
	 * @private
	 * @param  {String} entity Entity URI
	 * @param  {String} store  Data store URI
	 * @return {String}        URI
	 */
	build = function ( entity, store ) {
		var result = "",
		    parsed;

		if ( regex.double_slash.test( entity ) ) {
			result = entity;
		}
		else if ( entity.charAt( 0 ) === "/" && store.charAt( 0 ) !== "/" ) {
			parsed = utility.parse( store );
			result = parsed.protocol + "//" + parsed.host + entity;
		}
		else {
			result = entity;
		}

		return result;
	};

	/**
	 * Crawl complete handler
	 *
	 * @method complete
	 * @private
	 * @return {Undefined} undefined
	 */
	complete = function () {
		if ( ++i === nth ) {
			defer.resolve( nth );
		}
	};

	/**
	 * Sets up a DataStore
	 *
	 * Possibly a subset of the collection, so it relies on valid URI paths
	 *
	 * @method setup
	 * @private
	 * @param  {String} key Record key
	 * @return {Object}     Data store
	 */
	setup = function ( key, self ) {
		var obj = {};

		if ( !array.contains( self.collections, key ) ) {
			self.collections.push( key );
		}

		obj = data.decorator( {id: record.key + "-" + key}, null, {key: self.key, pointer: self.pointer, source: self.source, ignore: utility.clone( self.ignore ), leafs: utility.clone( self.leafs ), depth: self.depth + 1, maxDepth: self.maxDepth} );
		obj.data.headers = utility.merge( obj.data.headers, self.headers );

		if ( !array.contains( self.leafs, key ) && self.recursive && self.retrieve && ( obj.data.maxDepth === 0 || obj.data.depth < obj.data.maxDepth ) ) {
			obj.data.recursive = true;
			obj.data.retrieve  = true;
		}

		return obj;
	};

	// Depth of recursion is controled by `maxDepth`
	utility.iterate( record.data, function ( v, k ) {
		var defer;

		if ( array.contains( self.ignore, k ) || array.contains( self.leafs, k ) || self.depth >= self.maxDepth || ( !( v instanceof Array ) && typeof v !== "string" ) ) {
			return;
		}

		nth   = array.cast( record.data ).length;
		defer = deferred();
		defer.then( function ( arg ) {
			if ( events ) {
				observer.fire( record.data[k], "afterDataRetrieve", arg );
			}

			complete();
		}, function ( e ) {
			if ( events) {
				observer.fire( record.data[k], "failedDataRetrieve", e );
			}

			complete();
		});

		if ( ( v instanceof Array ) && v.length > 0 ) {
			record.data[k] = setup( k, self );

			if ( typeof v[0] === "string" ) {
				array.each( v, function ( i, idx ) {
					v[idx] = build( i, uri );
				});
			}

			record.data[k].data.batch( "set", v, true, undefined ).then( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});
		}
		// If either condition is satisified it's assumed that "v" is a URI because it's not ignored
		else if ( v.charAt( 0 ) === "/" || v.indexOf( "//" ) > -1 ) {
			record.data[k] = setup( k, self );
			v = build( v, uri );
			record.data[k].data.setUri( v ).then( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});
		}
	});

	return defer;
};

/**
 * Deletes a record based on key or index
 *
 * Events: beforeDataDelete  Fires before the record is deleted
 *         afterDataDelete   Fires after the record is deleted
 *         failedDataDelete  Fires if the store is RESTful and the action is denied
 *
 * @method del
 * @param  {Mixed}   record  Record, key or index
 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
 * @param  {Boolean} batch   [Optional] True if called by data.batch
 * @return {Object}          Deferred
 */
DataStore.prototype.del = function ( record, reindex, batch ) {
	record     = record.key ? record : this.get ( record );
	reindex    = ( reindex !== false );
	batch      = ( batch === true );
	var self   = this,
	    events = ( this.events === true ),
	    defer  = deferred(),
	    key, uri, p;

	if ( record === undefined ) {
		defer.reject( new Error( label.error.invalidArguments ) );
	}
	else {
		if ( this.uri === null ) {
			delete this.keys[record.key];
			this.records.remove( record.index );
			this.total--;
			this.views = {};

			if ( !batch ) {
				if ( reindex ) {
					this.reindex();
				}

				if ( this.autosave ) {
					self.purge( arg.key );
				}
			}

			defer.resolve( record.key );
		}
		else {
			client.request( "DELETE", this.uri + "/" record.key, function () {
				defer.resolve( record.key );
			}, function ( e ) {
				defer.reject( e );
			}, undefined, this.headers );
		}
	}

	return defer;
};

/**
 * Exports a subset or complete record set of DataStore
 *
 * @method dump
 * @public
 * @param  {Array} args   [Optional] Sub-data set of DataStore
 * @param  {Array} fields [Optional] Fields to export, defaults to all
 * @return {Array}        Records
 */
DataStore.prototype.dump = function ( args, fields ) {
	args       = args || this.records;
	var self   = this,
	    custom = ( fields instanceof Array && fields.length > 0 ),
	    fn;

	if ( custom ) {
		fn = function ( i ) {
			var record = {};

			array.each( fields, function ( f ) {
				record[f] = f === self.key ? i.key : ( !array.contains( self.collections, f ) ? utility.clone( i.data[f], true ) : i.data[f].data.uri );
			});

			return record;
		};
	}
	else {
		fn = function ( i ) {
			var record = {};

			record[self.key] = i.key;

			utility.iterate( i.data, function ( v, k ) {
				record[k] = !array.contains( self.collections, k ) ? utility.clone( v, true ) : v.data.uri;
			});

			return record;
		};
	}

	return args.map( fn );
};

/**
 * Finds needle in the haystack
 *
 * @method find
 * @param  {Mixed}  needle    String, Number, RegExp Pattern or Function
 * @param  {String} haystack  [Optional] Commma delimited string of the field( s ) to search
 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
 * @return {Array}            Array of results
 */
DataStore.prototype.find = function ( needle, haystack, modifiers ) {
	if ( needle === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	var result = [],
	    keys   = [],
	    regex  = new RegExp(),
	    fn     = typeof needle === "function";

	// Blocking unnecessary ops
	if ( this.total === 0 ) {
		return result;
	}

	// Preparing parameters
	if ( !fn ) {
		needle = typeof needle === "string" ? string.explode( needle ) : [needle];

		if ( modifiers === undefined || string.isEmpty( modifiers ) ) {
			modifiers = "gi";
		}
		else if ( modifiers === null ) {
			modifiers = "";
		}
	}

	haystack = typeof haystack === "string" ? string.explode( haystack ) : null;

	// No haystack, testing everything
	if ( haystack === null ) {
		array.each( this.records, function ( r ) {
			if ( !fn ) {
				utility.iterate( r.data, function ( v ) {
					if ( array.contains( keys, r.key ) ) {
						return false;
					}

					if ( v === null || typeof v.data === "object" ) {
						return;
					}

					array.each( needle, function ( n ) {
						utility.compile( regex, n, modifiers );

						if ( regex.test( v ) ) {
							keys.push( r.key );
							result.push( r );

							return false;
						}
					});
				});
			}
			else if ( needle( r ) === true ) {
				keys.push( r.key );
				result.push( r );
			}
		});
	}
	// Looking through the haystack
	else {
		array.each( this.records, function ( r ) {
			array.each( haystack, function ( h ) {
				if ( array.contains( keys, r.key ) ) {
					return false;
				}

				if ( r.data[h] === undefined || typeof r.data[h].data === "object" ) {
					return;
				}

				if ( !fn ) {
					array.each( needle, function ( n ) {
						utility.compile( regex, n, modifiers );

						if ( regex.test( r.data[h] ) ) {
							keys.push( r.key );
							result.push( r );

							return false;
						}
					});
				}
				else if ( needle( r.data[h] ) === true ) {
					keys.push( r.key );
					result.push( r );

					return false;
				}
			});
		});
	}

	return result;
};

/**
 * Generates a RESTful store ( replacing a record ) when consuming an API end point
 *
 * @method generate
 * @param  {Object} key Record key
 * @param  {Mixed}  arg [Optional] Array or URI String
 * @return {Object}     Deferred
 */
DataStore.prototype.generate = function ( key, arg ) {
	var self  = this,
	    defer = deferred(),
	    recs  = null,
	    fn, idx, params;
	
	params = {
		depth     : this.depth + 1,
		headers   : this.headers,
		ignore    : array.clone( this.ignore ),
		leafs     : array.clone( this.leafs ),
		key       : this.key,
		maxDepth  : this.maxDepth,
		pointer   : this.pointer,
		recursive : this.recursive,
		retrieve  : this.retrieve,
		source    : this.source
	};

	fn = function () {
		// Creating new child DataStore
		if ( typeof arg === "object" ) {
			recs = arg;
		}

		if ( params.maxDepth === 0 || params.depth <= params.maxDepth ) {
			self.records[idx] = data.decorator( {id: key}, recs, params );

			// Not batching in a data set
			if ( recs === null ) {
				// Constructing relational URI
				if ( self.uri !== null && arg === undefined && !array.contains( self.leafs, key ) ) {
					arg = self.uri + "/" + key;
				}
				
				// Conditionally making the store RESTful
				if ( arg !== undefined ) {
					self.records[idx].data.setUri( arg ).then( function (arg ) {
						defer.resolve( arg );
					}, function ( e ) {
						defer.reject( e );
					});
				}
				else {
					defer.resolve( self.records[idx].data.records );
				}
			}
		}
	};

	// Create stub or teardown existing DataStore
	if ( this.keys[key] !== undefined ) {
		idx = this.keys[key];

		if ( typeof this.records[idx].data.teardown === "function" ) {
			this.records[idx].data.teardown();
		}

		fn();
	}
	else {
		this.set( key, {}, true ).then( function ( arg ) {
			idx = self.keys[arg.key];
			self.collections.add( arg.key );
			fn();
		});
	}

	return defer;
};

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
DataStore.prototype.get = function ( record, offset ) {
	var records = this.records,
	    type    = typeof record,
	    self    = this,
	    r;

	if ( type === "undefined" || record.toString().length === 0 ) {
		r = records;
	}
	else if ( type === "string" && record.indexOf( "," ) > -1 ) {
		r = [];
		array.each( string.explode( record ), function ( i ) {
			if ( !isNaN( i ) ) {
				i = number.parse( i, 10 );
			}

			r.push( self.get( i ) );
		});
	}
	else if ( type === "string" && this.keys[record] !== undefined ) {
		r = records[this.keys[record]];
	}
	else if ( type === "number" && offset === undefined) {
		r = records[number.parse( record, 10 )];
	}
	else if ( type === "number" && typeof offset === "number") {
		r = records.limit( number.parse( record, 10 ), number.parse( offset, 10 ) );
	}

	return r;
},

/**
 * Performs an (INNER/LEFT/RIGHT) JOIN on two DataStores
 *
 * @method join
 * @public
 * @param  {String} arg   DataStore to join
 * @param  {String} field Field in both DataStores
 * @param  {String} join  Type of JOIN to perform, defaults to `inner`
 * @return {Array}        Array of records
 */
DataStore.prototype.join = function ( arg, field, join ) {
	join        = join || "inner";
	var self    = this,
	    results = [],
	    key     = field === this.key,
	    keys    = array.merge( array.cast( this.records[0].data, true ), array.cast( arg.data.records[0].data, true ) ),
		fn;

	if ( join === "inner" ) {
		fn = function ( i ) {
			var where = {},
				match;

			where[field] = key ? i.key : i.data[field];
			match        = arg.data.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( i.data, true ), utility.clone( match[0].data, true ) ) );
			}
		};
	}
	else if ( join === "left" ) {
		fn = function ( i ) {
			var where  = {},
			    record = utility.clone( i.data, true ),
				match;

			where[field] = key ? i.key : i.data[field];
			match        = arg.data.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( record, true ), utility.clone( match[0].data, true ) ) );
			}
			else {
				array.each( keys, function ( i ) {
					if ( record[i] === undefined ) {
						record[i] = null;
					}
				});

				results.push( record );
			}
		};
	}
	else if ( join === "right" ) {
		fn = function ( i ) {
			var where  = {},
			    record = utility.clone( i.data, true ),
				match;

			where[field] = key ? i.key : i.data[field];
			match        = self.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( record, true ), utility.clone( match[0].data, true ) ) );
			}
			else {
				array.each( keys, function ( i ) {
					if ( record[i] === undefined ) {
						record[i] = null;
					}
				});

				results.push( record );
			}
		};
	}

	array.each( join === "right" ? arg.data.records : this.records, fn);

	return results;
};

/**
 * Retrieves only 1 field/property
 *
 * @method only
 * @param  {String} arg Field/property to retrieve
 * @return {Array}      Array of values
 */
DataStore.prototype.only = function ( arg ) {
	if ( arg === this.key ) {
		return this.records.map( function ( i ) {
			return i.key;
		});
	}
	else {
		return this.records.map( function ( i ) {
			return i.data[arg];
		});
	}
};

/**
 * Purges DataStore or record from localStorage
 *
 * @method purge
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Record or store
 */
DataStore.prototype.purge = function ( arg ) {
	return this.storage( arg || this, "remove" );
};

/**
 * Reindexes the DataStore
 *
 * @method reindex
 * @return {Object} Data store
 */
DataStore.prototype.reindex = function () {
	var nth = this.total,
	    i   = -1;

	this.views = {};

	if ( nth > 0 ) {
		while ( ++i < nth ) {
			this.records[i].index = i;
			this.keys[this.records[i].key] = i;
		}
	}

	return this;
};

/**
 * Restores DataStore or record frome localStorage
 *
 * @method restore
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Record or store
 */
DataStore.prototype.restore = function ( arg ) {
	return this.storage( arg || this, "get" );
};

/**
 * Saves DataStore or record to localStorage, sessionStorage or MongoDB (node.js only)
 *
 * @method save
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Deferred
 */
DataStore.prototype.save = function ( arg ) {
	return this.storage( arg || this, "set" );
};

/**
 * Selects records based on an explcit description
 *
 * @method select
 * @param  {Object} where  Object describing the WHERE clause
 * @return {Array}         Array of records
 */
DataStore.prototype.select = function ( where ) {
	var result;

	if ( !( where instanceof Object ) ) {
		throw new Error( label.error.invalidArguments );
	}

	result = this.records.filter( function ( rec ) {
		var match = true;

		utility.iterate( where, function ( v, k ) {
			var type = typeof v;

			if ( type !== "function" && rec.data[k] !== v ) {
				return ( match = false );
			}
			else if ( type === "function" && !v( rec.data[k], rec ) ) {
				return ( match = false );
			}
		});

		return match;
	});

	return result;
};

/**
 * Creates or updates an existing record
 *
 * Events: beforeDataSet  Fires before the record is set
 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
 *         failedDataSet  Fires if the store is RESTful and the action is denied
 *
 * @method set
 * @param  {Mixed}   key   [Optional] Integer or String to use as a Primary Key
 * @param  {Object}  arg   Key:Value pairs to set as field values
 * @param  {Boolean} batch [Optional] True if called by data.batch
 * @return {Object}        Deferred
 */
DataStore.prototype.set = function ( key, arg, batch ) {
	batch       = ( batch === true );
	var self    = this,
	    defer   = deferred(),
	    defer2  = deferred(),
	    partial = false,
	    data, record, method, events, args, uri, p, reconcile;

	if ( !( arg instanceof Object ) ) {
		throw new Error( label.error.invalidArguments );
	}

	reconcile = function ( success, arg ) {
		defer2[success ? "resolve" : "reject"]( arg );
	};

	// Chaining a promise to return
	defer.then( function ( arg ) {
		var data  = {data: arg.data, key: arg.key, record: arg.record, result: arg.result},
		    defer = deferred(),
		    record, uri;

		defer.then( function ( arg ) {
			var success;

			success = function () {
				array.each( self.datalists, function ( i ) {
					i.refresh();
				});

				if ( events ) {
					observer.fire( self.parentNode, "afterDataSet", arg );
				}

				reconcile( true, arg );
			};

			if ( self.retrieve ) {
				self.crawl( arg );
			}

			if ( !batch && self.autosave ) {
				self.save( data.key ).then( success, function ( e ) {
					if ( events ) {
						observer.fire( self.parentNode, "failedDataSet", e );
					}

					reconcile( false, e );
				});
			}
			else {
				success();
			}
		}, function ( e ) {
			if ( events ) {
				observer.fire( self.parentNode, "failedDataSet", e );
			}

			reconcile( false, e );
		});

		self.views = {};

		// Getting the record again due to scheduling via promises, via data.batch()
		if ( data.key !== undefined ) {
			data.record = self.get( data.key );
		}

		if ( data.record === undefined ) {
			var index = self.total++;

			if ( data.key === undefined ) {
				if ( data.result === undefined ) {
					self.total--;
					defer.reject( label.error.expectedObject );
				}
			
				if ( self.source !== null ) {
					data.result = utility.walk( data.result, self.source );
				}
			
				if ( self.key === null ) {
					data.key = utility.uuid();
				}
				else {
					data.key = data.result[self.key];
					delete data.result[self.key];
				}
			
				if ( typeof data.key !== "string" ) {
					data.key = data.key.toString();
				}

				data.data = data.result;
			}

			self.keys[data.key] = index;
			self.records[index] = {key: data.key, data: {}, index: index};
			record              = self.records[index];

			if ( self.pointer === null || data.data[self.pointer] === undefined ) {
				record.data = data.data;

				if ( self.key !== null && record.data.hasOwnProperty( self.key ) ) {
					delete record.data[self.key];
				}

				defer.resolve( record );
			}
			else {
				uri  = data.data[self.pointer];

				if ( uri === undefined || uri === null ) {
					delete self.records[index];
					delete self.keys[data.key];
					defer.reject( label.error.expectedObject );
				}

				record.data = {};

				client.request(uri, "GET", function ( args ) {
					if ( self.source !== null) {
						args = utility.walk( args, self.source );
					}

					if ( args[self.key] !== undefined ) {
						delete args[self.key];
					}

					record.data = args;
					defer.resolve( record );
				}, function ( e ) {
					defer.reject( e );
				}, self.headers );
			}
		}
		else {
			record = self.records[self.keys[data.record.key]];
			record.data = data.data;
			defer.resolve( record );
		}

		return record;
	}, function ( e ) {
		if ( events) {
			observer.fire( self.parentNode, "failedDataSet", e );
		}

		throw e;
	});

	if ( key instanceof Object ) {
		batch = arg;
		arg   = key;
		key   = null;
	}

	// Cloning data to avoid `by reference` issues
	data = utility.clone( arg, true );

	// Finding or assigning the record key
	if ( key === null && this.uri === null ) {
		if ( this.key === null || data[this.key] === undefined ) {
			key = utility.uuid();
		}
		else {
			key = data[this.key];
			delete data[this.key];
		}
	}
	else if ( key === null ) {
		key = undefined;
	}

	// Generating a child store
	if ( data instanceof Array ) {
		return this.generate( key ).then( function () {
			self.get( key ).data.batch( "set", data ).then( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});
		});
	}

	// Setting variables for ops
	record = key === undefined ? undefined : this.get( key );
	method = key === undefined ? "post" : "put";
	events = ( this.events === true );
	args   = {data: {}, key: key, record: undefined};
	uri    = this.uri;

	// Determining permissions
	if ( !batch && this.callback === null && uri !== null ) {
		if ( record !== undefined && uri.replace( regex.not_endpoint, "" ) !== record.key ) {
			uri += "/" + record.key;
		}

		// Can we use a PATCH request?
		if ( method === "put" && client.allows( uri, "patch" ) && ( !client.ie || ( client.version > 8 || client.activex ) ) ) {
			method = "patch";
			p = partial = true;
		}

		if ( p === undefined ) {
			p = ( client.cors ( uri ) || client.allows( uri, method ) );
		}
	}

	// Setting the data to pass to the promise
	if ( record !== undefined ) {
		args.record = this.records[this.keys[record.key]];

		// Getting primitive values
		utility.iterate( args.record.data, function ( v, k ) {
			if ( !array.contains( self.ignore, k ) ) {
				args.data[k] = v;
			}
		});

		// Merging the difference with the record data
		utility.merge( args.data, data );

		// PATCH is not supported, send the entire record
		if ( !partial ) {
			data = args.data;
		}
	}
	else {
		args.data = data;
	}

	if ( events ) {
		observer.fire( self.parentNode, "beforeDataSet", {key: key, data: data} );
	}

	if ( batch || this.callback !== null || this.uri === null ) {
		defer.resolve( args );
	}
	else if ( regex.true_undefined.test( p ) ) {
		client.request( uri, method.toUpperCase(), function ( arg ) {
			args.result = arg;
			defer.resolve( args );
		}, function ( e ) {
			defer.reject( e );
		}, data, utility.merge( {withCredentials: this.credentials}, this.headers ) );
	}
	else {
		defer.reject( args );
	}

	return defer2;
};

/**
 * Gets or sets an explicit expiration of data
 *
 * @method setExpires
 * @param  {Number} arg  Milliseconds until data is stale
 * @return {Object}      Data store
 */
DataStore.prototype.setExpires = function ( arg ) {
	// Expiry cannot be less than a second, and must be a valid scenario for consumption; null will disable repetitive expiration
	if ( ( arg !== null && this.uri === null ) || ( arg !== null && ( isNaN( arg ) || arg < 1000 ) ) ) {
		throw new Error( label.error.invalidArguments );
	}

	if ( this.expires === arg ) {
		return;
	}

	this.expires = arg;

	var id      = this.parentNode.id + "DataExpire",
	    expires = arg,
	    self    = this;

	utility.clearTimers( id );

	if ( arg === null ) {
		return;
	}

	utility.repeat( function () {
		if ( self.uri === null ) {
			self.setExpires( null );
			return false;
		}

		if ( !cache.expire( self.uri ) ) {
			observer.fire( self.uri, "beforeExpire, expire, afterExpire" );
		}
	}, expires, id, false);
};

/**
 * Sets the RESTful API end point
 *
 * @method setUri
 * @param  {String} arg [Optional] API collection end point
 * @return {Object}     Deferred
 */
DataStore.prototype.setUri = function ( arg ) {
	var defer = deferred(),
	    result;

	if ( arg !== null && string.isEmpty( arg ) ) {
		throw new Error( label.error.invalidArguments );
	}

	arg = utility.parse( arg ).href;

	if ( this.uri === arg ) {
		result = this.uri;
	}
	else {
		if ( this.uri !== null) {
			observer.remove( this.uri );
		}

		result = this.uri = arg;

		if ( result !== null ) {
			observer.add( result, "expire", function () {
				this.sync( true );
			}, "dataSync", this);

			cache.expire( result, true );

			this.sync( true ).then( function (arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});
		}
	}

	return defer;
};

/**
 * Returns a view, or creates a view and returns it
 *
 * @method sort
 * @param  {String} query       SQL ( style ) order by
 * @param  {String} create      [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
 * @param  {String} sensitivity [Optional] Sort sensitivity, defaults to "ci" ( insensitive = "ci", sensitive = "cs", mixed = "ms" )
 * @param  {Object} where       [Optional] Object describing the WHERE clause
 * @return {Array}              View of data
 */
DataStore.prototype.sort = function ( query, create, sensitivity, where ) {
	if ( query === undefined || string.isEmpty( query ) ) {
		throw new Error( label.error.invalidArguments );
	}

	if ( !regex.sensitivity_types.test( sensitivity ) ) {
		sensitivity = "ci";
	}

	query        = query.replace( /\s*asc/ig, "" );
	create       = ( create === true || ( where instanceof Object ) );
	var queries  = string.explode( query ),
	    view     = ( queries.join( " " ).toCamelCase() ) + sensitivity.toUpperCase(),
	    key      = this.key,
	    result   = [],
	    bucket, crawl, sort, sorting;

	/**
	 * Recursively crawls queries & data
	 *
	 * @method crawl
	 * @private
	 * @param  {Array}  q    Queries
	 * @param  {Object} data Records
	 * @return {Array}       Sorted records
	 */
	crawl = function ( q, data ) {
		var queries = utility.clone( q ),
		    query   = q[0],
		    sorted  = {},
		    result  = [];

		array.remove( queries, 0 );

		sorted = bucket( query, data, regex.desc.test( query ) );

		array.each( sorted.order, function ( i ) {
			if ( sorted.registry[i].length < 2 ) {
				return;
			}

			if ( queries.length > 0) {
				sorted.registry[i] = crawl( queries, sorted.registry[i] );
			}
		});

		array.each( sorted.order, function ( i ) {
			result = result.concat( sorted.registry[i] );
		});

		return result;
	};

	/**
	 * Creates a bucket of records
	 *
	 * @method bucket
	 * @private
	 * @param  {String}  query   Query to execute
	 * @param  {Array}   records Records to sort
	 * @param  {Boolean} reverse `true` to reverse records
	 * @return {Object}          Describes bucket
	 */
	bucket = function ( query, records, reverse ) {
		var prop     = query.replace( regex.desc, "" ),
		    pk       = ( key === prop ),
		    order    = [],
		    registry = {};

		array.each( records, function ( r ) {
			var val = pk ? r.key : r.data[prop],
			    k   = val === null ? "null" : val.toString();

			if ( sensitivity === "ci" ) {
				k = string.toCamelCase( k );
			}
			else if ( sensitivity === "cs" ) {
				k = string.trim( k );
			}
			else if ( sensitivity === "ms" ) {
				k = string.trim( k ).slice( 0, 1 ).toLowerCase();
			}

			if ( !( registry[k] instanceof Array ) ) {
				registry[k] = [];
				order.push( k );
			}

			registry[k].push( r );
		});

		order.sort( sorting );

		if ( reverse) {
			order.reverse();
		}
		
		array.each( order, function ( k ) {
			if ( registry[k].length === 1 ) {
				return;
			}

			registry[k] = sort( registry[k], query, prop, reverse, pk );
		});

		return {order: order, registry: registry};
	};

	/**
	 * Sorts bucket
	 *
	 * @method sort
	 * @private
	 * @param  {Object}  data    Records to sort
	 * @param  {String}  query   Query to execute
	 * @param  {String}  prop    Property / field
	 * @param  {Boolean} reverse `true` to reverse records
	 * @param  {Boolean} pk      `true` if sorting on Primary Key
	 * @return {Array}           Sorted records
	 */
	sort = function ( data, query, prop, reverse, pk ) {
		var tmp    = [],
		    sorted = [];

		array.each( data, function ( i, idx ) {
			var v  = pk ? i.key : i.data[prop] || "!";

			v = string.trim( v.toString() ) + ":::" + idx;
			tmp.push( v );
		});

		if ( tmp.length > 1 ) {
			tmp.sort( sorting );

			if ( reverse ) {
				tmp.reverse();
			}

			sorted = tmp.map( function ( i ) {
				return data[i.replace( regex.sort_needle, "" )];
			});
		}

		return sorted;
	};

	/**
	 * Sorts based on parsed value
	 *
	 * @method sort
	 * @private
	 * @param  {String} a [description]
	 * @param  {String} b [description]
	 * @return {Number}   -1, 0, or 1
	 */
	sorting = function ( a, b ) {
		a = a.replace( regex.sort_value, "" );
		b = b.replace( regex.sort_value, "" );

		return array.sort( number.parse( a ) || a, number.parse( b ) || b );
	};

	if ( !create && this.views[view] instanceof Array ) {
		return this.views[view];
	}

	if ( this.total === 0 ) {
		return [];
	}

	result           = crawl( queries, where === undefined ? this.records : this.select( where ) );
	this.views[view] = result;

	return result;
};

/**
 * Storage interface
 *
 * SQL/NoSQL backends will be used if configured in lieu of localStorage (node.js only)
 *
 * @methd storage
 * @param  {Mixed}  obj  Record ( Object, key or index ) or store
 * @param  {Object} op   Operation to perform ( get, remove or set )
 * @param  {String} type [Optional] Type of Storage to use ( local, session [local] )
 * @return {Object}      Deferred
 */
DataStore.prototype.storage = function ( obj, op, type ) {
	var self    = this,
	    record  = false,
	    mongo   = !string.isEmpty( this.mongodb ),
	    session = ( type === "session" && typeof sessionStorage !== "undefined" ),
	    defer   = deferred(),
	    data, deferreds, key, result;

	if ( !regex.number_string_object.test( typeof obj ) || !regex.get_remove_set.test( op ) ) {
		throw new Error( label.error.invalidArguments );
	}

	record = ( regex.number_string.test( typeof obj ) || ( obj.hasOwnProperty( "key" ) && !obj.hasOwnProperty( "parentNode" ) ) );

	if ( op !== "remove" ) {
		if ( record && !( obj instanceof Object ) ) {
			obj = this.get( obj );
		}

		key = record ? obj.key : obj.parentNode.id;
	}
	else if ( op === "remove" && record ) {
		key = obj.key || obj;
	}

	if ( op === "get" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					defer.reject( e );
					db.close();
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						if ( e ) {
							defer.reject( e );
							db.close();
						}
						else if ( record ) {
							collection.find( {_id: obj.key} ).limit( 1 ).toArray( function ( e, recs ) {
								if ( e ) {
									defer.reject( e );
								}
								else {
									delete recs[0]._id;
									self.set( key, recs[0], true ).then( function ( rec ) {
										defer.resolve( rec );
									}, function ( e ) {
										defer.reject( e );
									} );
								}

								db.close();
							} );
						}
						else {
							collection.find( {} ).toArray( function ( e, recs ) {
								var i   = -1,
								    nth = recs.length;
								
								if ( e ) {
									defer.reject( e );
								}
								else {
									if ( nth > 0 ) {
										self.records = recs.map( function ( r ) {
											var rec = {key: r._id, index: ++i, data: {}};

											self.keys[rec.key] = rec.index;
											rec.data = r;
											delete rec.data._id;

											return rec;
										} );
										
										self.total = nth;
									}
									
									defer.resolve( self.records );
								}

								db.close();
							} );
						}
					} );
				}
			} );
		}
		else {
			result = session ? sessionStorage.getItem( key ) : localStorage.getItem( key );

			if ( result !== null ) {
				result = json.decode( result );

				if ( record ) {
					self.set( key, result, true ).then( function ( rec ) {
						defer.resolve( rec );
					}, function ( e ) {
						defer.reject( e );
					} );
				}
				else {
					utility.merge( self, result );
					defer.resolve( self );
				}
			}
			else {
				defer.resolve( self );
			}
		}
	}
	else if ( op === "remove" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					defer.reject( e );
					db.close();
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						collection.remove( record ? {_id: key} : {}, {safe: true}, function ( e, arg ) {
							if ( e ) {
								defer.reject( e );
							}
							else {
								defer.resolve( arg );
							}

							db.close();
						} );
					} );
				}
			} );
		}
		else {
			session ? sessionStorage.removeItem( key ) : localStorage.removeItem( key );
			defer.resolve( this );
		}
	}
	else if ( op === "set" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					defer.reject( e );
					db.close();
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						if ( e ) {
							defer.reject( e );
							db.close();
						}
						else if ( record ) {
							collection.update( {_id: obj.key}, {$set: obj.data}, {w: 1, safe: true, upsert: true}, function ( e, arg ) {
								if ( e ) {
									defer.reject( e );
								}
								else {
									defer.resolve( arg );
								}

								db.close();
							} );
						}
						else {
							// Removing all documents & re-inserting
							collection.remove( {}, {w: 1, safe: true}, function ( e ) {
								if ( e ) {
									defer.reject( e );
									db.close();
								}
								else {
									deferreds = [];

									array.each( self.records, function ( i ) {
										var data   = {},
										    defer2 = deferred();

										deferreds.push( defer2 );

										utility.iterate( i.data, function ( v, k ) {
											if ( !array.contains( self.collections, k ) ) {
												data[k] = v;
											}
										} );

										collection.update( {_id: i.key}, {$set: data}, {w:1, safe:true, upsert:true}, function ( e, arg ) {
											if ( e ) {
												defer2.reject( e );
											}
											else {
												defer2.resolve( arg );
											}
										} );
									} );

									utility.when( deferreds ).then( function ( result ) {
										defer.resolve( result );
										db.close();
									}, function ( e ) {
										defer.reject( e );
										db.close();
									} );
								}
							} );
						}
					} );
				}
			} );
		}
		else {
			data = json.encode( record ? obj.data : {total: this.total, keys: this.keys, records: this.records} );
			session ? sessionStorage.setItem( key, data ) : localStorage.setItem( key, data );
			defer.resolve( this );
		}
	}

	return defer;
};

/**
 * Syncs the DataStore with a URI representation
 *
 * Events: beforeDataSync  Fires before syncing the DataStore
 *         afterDataSync   Fires after syncing the DataStore
 *         failedDataSync  Fires when an exception occurs
 *
 * @method sync
 * @param  {Boolean} reindex [Optional] True will reindex the DataStore
 * @return {Object}          Deferred
 */
DataStore.prototype.sync = function ( reindex ) {
	if ( this.uri === null || string.isEmpty( this.uri ) ) {
		throw new Error( label.error.invalidArguments );
	}

	reindex    = ( reindex === true );
	var self   = this,
	    events = ( this.events === true ),
	    defer  = deferred(),
	    success, failure;

	defer.then( function ( arg ) {
		if ( reindex ) {
			self.reindex();
		}

		if ( events ) {
			observer.fire( self.parentNode, "afterDataSync", arg );
		}
	}, function ( e ) {
		if ( events ) {
			observer.fire( self.parentNode, "failedDataSync", e );
		}

		throw e;
	});

	/**
	 * Resolves public deferred
	 *
	 * @method success
	 * @private
	 * @param  {Object} arg API response
	 * @return {Undefined}  undefined
	 */
	success = function ( arg ) {
		var data;

		if ( typeof arg !== "object" ) {
			throw new Error( label.error.expectedObject );
		}

		if ( self.source !== null ) {
			arg = utility.walk( arg, self.source );
		}

		if ( arg instanceof Array ) {
			data = arg;
		}
		else {
			utility.iterate( arg, function ( i ) {
				if ( i instanceof Array ) {
					data = i;

					return false;
				}
			});
		}

		if ( data === undefined ) {
			data = [arg];
		}

		self.batch( "set", data, true, undefined ).then( function ( arg ) {
			defer.resolve( arg );
		}, function ( e ) {
			defer.reject( e );
		});
	};

	/**
	 * Rejects public deferred
	 *
	 * @method failure
	 * @private
	 * @param  {Object} e Error instance
	 * @return {Undefined} undefined
	 */
	failure = function ( e ) {
		defer.reject( e );
	};

	if ( events) {
		observer.fire( self.parentNode, "beforeDataSync" );
	}

	if ( this.callback !== null ) {
		client.jsonp( this.uri, success, failure, {callback: this.callback} );
	}
	else {
		client.request( this.uri, "GET", success, failure, null, utility.merge( {withCredentials: this.credentials}, this.headers) );
	}

	return defer;
};

/**
 * Tears down a store & expires all records associated to an API
 *
 * @method teardown
 * @return {Undefined} undefined
 */
DataStore.prototype.teardown = function () {
	var uri = this.uri,
	    id;

	if ( uri !== null ) {
		cache.expire( uri, true );
		observer.remove( uri );

		id = this.parentNode.id + "DataExpire";
		utility.clearTimers( id );

		array.each( this.datalists, function (i ) {
			i.teardown();
		});

		array.each( this.records, function ( i ) {
			var recordUri = uri + "/" + i.key;

			cache.expire( recordUri, true );
			observer.remove( recordUri );

			utility.iterate( i.data, function ( v ) {
				if ( v === null ) {
					return;
				}

				if ( v.hasOwnProperty( "data" ) && typeof v.data.teardown === "function" ) {
					observer.remove( v.id );
					v.data.teardown();
				}
			});
		});
	}

	this.clear( true );
	observer.fire( this.parentNode, "afterDataTeardown" );

	return this;
};

/**
 * Returns Array of unique values of `key`
 *
 * @method unique
 * @param  {String} key Field to compare
 * @return {Array}      Array of values
 */
DataStore.prototype.unique = function ( key ) {
	return array.unique( this.records.map( function ( i ) {
		return i.data[key];
	}));
};

/**
 * Applies a difference to a record
 *
 * Use `data.set()` if `data` is the complete field set
 *
 * @method update
 * @param  {Mixed}  key  Key or index
 * @param  {Object} data Key:Value pairs to set as field values
 * @return {Object}      Deferred
 */
DataStore.prototype.update = function ( key, data ) {
	var record = this.get( key ),
	    defer  = deferred();

	if ( record === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	utility.iterate( record.data, function ( v, k ) {
		data[v] = k;
	});
	
	this.set( key, data ).then( function ( arg ) {
		defer.resolve( arg );
	}, function ( e ) {
		defer.reject( e );
	});

	return defer;
};
