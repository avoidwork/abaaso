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
	decorator : function ( obj, recs, args ) {
		obj = utility.object( obj );
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
		 * @param  {String}  type    Type of action to perform ( set/del/delete )
		 * @param  {Mixed}   data    Array of keys or indices to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync    [Optional] Syncs store with data, if true everything is erased
		 * @param  {Number}  chunk   [Optional] Size to chunk Array to batch set or delete
		 * @return {Object}          Deferred
		 */
		batch : function ( type, data, sync, chunk ) {
			type    = type.toString().toLowerCase();
			sync    = ( sync === true );
			chunk   = chunk || 1000;

			if ( !regex.set_del.test( type ) || ( sync && regex.del.test( type ) ) || typeof data !== "object" ) {
				throw new Error( label.error.invalidArguments );
			}

			var self   = this,
			    events = ( this.events === true ),
			    r      = 0,
			    nth    = data.length,
			    f      = false,
			    defer  = deferred.factory(),
			    complete, failure, set, del, parsed;

			defer.then( function ( arg ) {
				self.loaded = true;

				if ( regex.del.test( type ) ) {
					self.reindex();
				}

				if ( self.autosave ) {
					self.save();
				}

				array.each( self.datalists, function ( i ) {
					i.refresh( true );
				});

				if ( events ) {
					observer.fire( self.parentNode, "afterDataBatch", arg );
				}
			}, function ( e ) {
				if ( events ) {
					observer.fire( self.parentNode, "failedDataBatch", e );
				}

				throw e;
			});

			complete = function ( arg ) {
				defer.resolve( arg );
			};

			failure = function ( arg ) {
				defer.reject( arg );
			};

			set = function ( arg, key ) {
				var data  = utility.clone( arg ),
				    defer = deferred.factory(),
				    rec   = {};

				if ( typeof data.batch !== "function" ) {
					rec = data;
				}
				else {
					utility.iterate( data, function ( v, k ) {
						if ( !array.contains( self.collections, k ) ) {
							rec[k] = v;
						}
					});
				}

				if ( self.key !== null && rec[self.key] !== undefined ) {
					key = rec[self.key];
					delete rec[self.key];
				}

				defer.then( function () {
					if ( ++r === nth ) {
						complete( self.records );
					}
				}, function ( e ) {
					if ( !f ) {
						f = true;
						failure( e );
					}
				});

				if ( rec instanceof Array && self.uri !== null ) {
					self.generate( key, undefined ).then( function ( arg ) {
						defer.resolve( arg );
					}, function ( e ) {
						defer.reject( e );
					});
				}
				else {
					self.set( key, rec, true ).then( function ( arg ) {
						defer.resolve( arg );
					}, function ( e ) {
						defer.reject( e );
					});
				}
			};

			del = function ( i ) {
				self.del( i, false, true ).then( function () {
					if ( ++r === nth ) {
						complete( self.records );
					}
				}, function ( e ) {
					if ( !f ) {
						f = true;
						failure( e );
					}
				});
			};

			if ( events ) {
				observer.fire( self.parentNode, "beforeDataBatch", data );
			}

			if ( sync ) {
				this.clear( sync );
			}

			if ( data.length === 0 ) {
				complete( self.records );
			}
			else {
				if ( type === "set" ) {
					array.each( array.chunk( data, chunk ), function ( a, adx ) {
						utility.defer(function () {
							array.each( a, function ( i, idx ) {
								var id;

								if ( array.contains ( self.ignore, i ) || array.contains ( self.leafs, i ) ) {
									id = i;
									i  = {};
								}

								if ( typeof i === "object" ) {
									set( i, id || utility.uuid() );
								}
								else if ( i.indexOf( "//" ) === -1 ) {
									// Relative path to store, i.e. a child
									if ( i.charAt( 0 ) !== "/" ) {
										i = self.uri + "/" + i;
									}

									// Root path, relative to store, i.e. a domain
									else if ( self.uri !== null && regex.root.test( i ) ) {
										parsed = utility.parse( self.uri );
										i      = parsed.protocol + "//" + parsed.host + i;
									}

									idx = i.replace( regex.not_endpoint, "" );

									if ( string.isEmpty( idx ) ) {
										return;
									}

									client.request( i, "GET", function ( arg ) {
										set( self.source === null ? arg : utility.walk( arg, self.source ), idx );
									}, failure, utility.merge( {withCredentials: self.credentials}, self.headers ) );
								}
								else {
									idx = i.replace( regex.not_endpoint, "" );

									if ( string.isEmpty( idx ) ) {
										return;
									}

									client.request( i, "GET", function ( arg ) {
										set( self.source === null ? arg : utility.walk( arg, self.source ), idx );
									}, failure, utility.merge( {withCredentials: self.credentials}, self.headers) );
								}
							});
						}, adx );
					});
				}
				else {
					array.each( data.sort( array.sort ).reverse(), function ( i ) {
						del( i );
					});
				}
			}

			return defer;
		},

		/**
		 * Clears the data object, unsets the uri property
		 *
		 * Events: beforeDataClear  Fires before the data is cleared
		 *         afterDataClear   Fires after the data is cleared
		 *
		 * @method clear
		 * @param  {Boolean} sync [Optional] Boolean to limit clearing of properties
		 * @return {Object}       Data store
		 */
		clear : function ( sync ) {
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
		},

		/**
		 * Crawls a record's properties and creates data stores when URIs are detected
		 *
		 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
		 *         failedDataRetrieve Fires if an exception occurs
		 *
		 * @method crawl
		 * @param  {Mixed}  arg Record, key or index
		 * @return {Object}     Deferred
		 */
		crawl : function ( arg ) {
			var self   = this,
			    events = ( this.events === true ),
			    record = ( arg instanceof Object ) ? arg : this.get( arg ),
			    uri    = this.uri === null ? "" : this.uri,
			    defer  = deferred.factory(),
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
			 * @param  {String} entity Entity URI
			 * @param  {String} store  Data store URI
			 * @return {String}        URI
			 */
			build = function ( entity, store ) {
				var result = "",
				    parsed;

				if ( /\/\//.test( entity ) ) {
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
			 * @return {Undefined} undefined
			 */
			complete = function () {
				if ( ++i === nth ) {
					defer.resolve( nth );
				}
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
				defer = deferred.factory();
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
		 * @return {Object}          Deferred
		 */
		del : function ( record, reindex, batch ) {
			if ( record === undefined || !regex.number_string.test( typeof record ) ) {
				throw new Error( label.error.invalidArguments );
			}

			reindex    = ( reindex !== false );
			batch      = ( batch === true );
			var self   = this,
			    events = ( this.events === true ),
			    defer  = deferred.factory(),
			    key, args, uri, p;

			defer.then( function ( arg ) {
				var record = self.get( arg.record );

				self.records.remove( self.keys[arg.key] );
				delete self.keys[arg.key];
				self.total--;
				self.views = {};

				utility.iterate( record.data, function ( v ) {
					if ( v === null ) {
						return;
					}

					if ( v.data !== undefined && typeof v.data.teardown === "function") {
						v.data.teardown();
					}
				});

				if ( arg.reindex ) {
					self.reindex();
				}

				if ( !batch ) {
					if ( self.autosave ) {
						self.save();
					}

					array.each( self.datalists, function ( i ) {
						i.del( record );
					});
				}

				if ( events ) {
					observer.fire( self.parentNode, "afterDataDelete", record );
				}
			}, function ( e ) {
				if ( events ) {
					observer.fire( self.parentNode, "failedDataDelete", e );
				}

				throw e;
			});

			if ( typeof record === "string" ) {
				key    = record;
				record = this.keys[key];

				if ( record === undefined ) {
					throw new Error( label.error.invalidArguments );
				}
			}
			else {
				key = this.records[record];

				if ( key === undefined ) {
					throw new Error( label.error.invalidArguments );
				}

				key = key.key;
			}

			args   = {key: key, record: record, reindex: reindex};

			if ( !batch && this.callback === null && this.uri !== null ) {
				uri = this.uri + "/" + key;
				p   = ( client.cors( uri ) || client.allows( uri, "delete" ) );
			}

			if ( events ) {
				observer.fire( self.parentNode, "beforeDataDelete", args );
			}

			if ( batch || this.callback !== null || this.uri === null ) {
				defer.resolve( args );
			}
			else if ( regex.true_undefined.test( p ) ) {
				client.request(uri, "DELETE", function () {
					defer.resolve( args );
				}, function ( e ) {
					defer.reject( e );
				}, utility.merge( {withCredentials: this.credentials}, this.headers) );
			}
			else {
				defer.reject( args );
			}

			return defer;
		},

		/**
		 * Exports a subset or complete record set of data store
		 *
		 * @param  {Array} args   [Optional] Sub-data set of data store
		 * @param  {Array} fields [Optional] Fields to export, defaults to all
		 * @return {Array}        Records
		 */
		dump : function ( args, fields ) {
			args       = args || this.records;
			var self   = this,
			    custom = ( fields instanceof Array && fields.length > 0 ),
			    fn;

			if ( custom ) {
				fn = function ( i ) {
					var record = {};

					array.each( fields, function ( f ) {
						record[f] = f === self.key ? i.key : ( !array.contains( self.collections, f ) ? utility.clone( i.data[f] ) : i.data[f].data.uri );
					});

					return record;
				};
			}
			else {
				fn = function ( i ) {
					var record = {};

					record[self.key] = i.key;

					utility.iterate( i.data, function ( v, k ) {
						record[k] = !array.contains( self.collections, k ) ? utility.clone( v ) : v.data.uri;
					});

					return record;
				};
			}

			return args.map( fn );
		},

		/**
		 * Finds needle in the haystack
		 *
		 * @method find
		 * @param  {Mixed}  needle    String, Number, RegExp Pattern or Function
		 * @param  {String} haystack  [Optional] Commma delimited string of the field( s ) to search
		 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
		 * @return {Array}            Array of results
		 */
		find : function ( needle, haystack, modifiers ) {
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
		form : function ( record, target, test ) {
			test      = ( test !== false );
			var empty = ( record === null ),
			    self  = this,
			    entity, obj, handler, structure, key, data;

			if ( empty ) {
				record = this.get( 0 );
			}
			else if ( !( record instanceof Object ) ) {
				record = this.get( record );
			}

			if ( record === undefined ) {
				throw new Error( label.error.invalidArguments );
			}
			else if ( this.uri !== null && !client.cors ( this.uri ) && !client.allows( this.uri, "post" ) ) {
				throw new Error( label.error.serverInvalidMethod );
			}

			key  = record.key;
			data = record.data;

			if ( target !== undefined ) {
				target = utility.object( target );
			}

			if ( this.uri !== null ) {
				entity = this.uri.replace( regex.not_endpoint, "" ).replace( /\?.*/, "" );

				if ( string.isDomain( entity ) ) {
					entity = entity.replace( /\..*/g, "" );
				}
			}
			else {
				entity = "record";
			}

			/**
			 * Button handler
			 *
			 * @method handler
			 * @param  {Object} event Window event
			 * @return {Undefined}    undefined
			 */
			handler = function ( e ) {
				var form    = utility.target( e ).parentNode,
				    nodes   = utility.$( "#" + form.id + " input" ),
				    entity  = nodes[0].name.match( /(.*)\[/ )[1],
				    result  = true,
				    newData = {};

				utility.stop( e );

				if ( test ) {
					result = element.validate( form );
				}

				if ( result ) {
					array.each( nodes, function ( i ) {
						if ( i.type !== undefined && regex.input_button.test( i.type ) ) {
							return;
						}

						utility.define( i.name.replace( "[", "." ).replace( "]", "" ), i.value, newData );
					});

					self.set( key, newData[entity] ).then( function () {
						element.destroy( form );
					}, function () {
						element.destroy( form );
					});
				}
			};

			/**
			 * Data structure in micro-format
			 *
			 * @method structure
			 * @param  {Object} record Data store record
			 * @param  {Object} obj    Element
			 * @param  {String} name   Property
			 * @return {Undefined}     undefined
			 */
			structure = function ( record, obj, name ) {
				var x, id;

				utility.iterate( record, function ( v, k ) {
					if ( v instanceof Array ) {
						x = 0;
						array.each( v, function ( o ) {
							structure( o, obj, name + "[" + k + "][" + ( x++ ) + "]" );
						});
					}
					else if ( v instanceof Object ) {
						structure( v, obj, name + "[" + k + "]" );
					}
					else {
						id = ( name + "[" + k + "]" ).replace( /\[|\]/g, "" );
						obj.create( "label", {"for": id, innerHTML: string.capitalize( k )} );
						obj.create( "input", {id: id, name: name + "[" + k + "]", type: "text", value: empty ? "" : v} );
					}
				});
			};

			obj = element.create( "form", { style: "display:none;"}, target );
			structure( data, obj, entity );

			observer.add( element.create( "input", {type: "button", value: label.common.submit}, obj ), "click", function ( e ) {
				handler( e );
			});

			element.create( "input", {type: "reset", value: label.common.reset}, obj );
			element.css( obj, "display", "inherit" );

			return obj;
		},

		/**
		 * Generates a RESTful store ( replacing a record ) when consuming an API end point
		 *
		 * @param  {Object} key Record key
		 * @param  {Mixed}  arg [Optional] Array or URI String
		 * @return {Object}     Deferred
		 */
		generate : function ( key, arg ) {
			var self  = this,
			    defer = deferred.factory(),
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
				// Creating new child data store
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

			// Create stub or teardown existing data store
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
		get : function ( record, offset ) {
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
		 * Retrieves only 1 field/property
		 *
		 * @param  {String} arg Field/property to retrieve
		 * @return {Array}      Array of values
		 */
		only : function ( arg ) {
			return this.records.map( function( i ) {
				return i.data[arg];
			} );
		},

		/**
		 * Purges data store or record from localStorage
		 *
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		purge : function ( arg ) {
			return this.storage( arg || this, "remove" );
		},

		/**
		 * Reindexes the data store
		 *
		 * @method reindex
		 * @return {Object} Data store
		 */
		reindex : function () {
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
		},

		/**
		 * Restores data store or record frome localStorage
		 *
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		restore : function ( arg ) {
			return this.storage( arg || this, "get" );
		},

		/**
		 * Saves data store or record to localStorage
		 *
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		save : function ( arg ) {
			return this.storage( arg || this, "set" );
		},

		/**
		 * Selects records based on an explcit description
		 *
		 * @param  {Object} where  Object describing the WHERE clause
		 * @return {Array}         Array of records
		 */
		select : function ( where ) {
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
					else if ( type === "function" && !v( rec.data[k] ) ) {
						return ( match = false );
					}
				});

				return match;
			});

			return result;
		},

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
		set : function ( key, arg, batch ) {
			batch       = ( batch === true );
			var self    = this,
			    defer   = deferred.factory(),
			    partial = false,
			    data, record, method, events, args, uri, p, reconcile;

			if ( !( arg instanceof Object ) ) {
				throw new Error( label.error.invalidArguments );
			}

			reconcile = function ( success, arg ) {
				defer[success ? "resolve" : "reject"]( arg );
			};

			// Chaining a promise to return
			defer.then( function ( arg ) {
				var data  = {data: null, key: arg.key, record: arg.record, result: arg.result},
				    defer = deferred.factory(),
				    record, uri;

				// Making sure nothing is by reference
				data.data = utility.clone( arg.data );

				defer.then( function ( arg ) {
					if ( self.retrieve ) {
						self.crawl( arg );
					}

					if ( !batch ) {
						if ( self.autosave ) {
							self.save();
						}

						array.each( self.datalists, function ( i ) {
							i.refresh();
						});
					}

					if ( events ) {
						observer.fire( self.parentNode, "afterDataSet", arg );
					}

					reconcile( true, arg );
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
			data = utility.clone( arg );

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

			return defer;
		},

		/**
		 * Gets or sets an explicit expiration of data
		 *
		 * @method setExpires
		 * @param  {Number} arg  Milliseconds until data is stale
		 * @return {Object}      Data store
		 */
		setExpires : function ( arg ) {
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
		},

		/**
		 * Sets the RESTful API end point
		 *
		 * @method setUri
		 * @param  {String} arg [Optional] API collection end point
		 * @return {Object}     Deferred
		 */
		setUri : function ( arg ) {
			var defer = deferred.factory(),
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
		},

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
		sort : function ( query, create, sensitivity, where ) {
			if ( query === undefined || string.isEmpty( query ) ) {
				throw new Error( label.error.invalidArguments );
			}

			if ( !regex.sensitivity_types.test( sensitivity ) ) {
				sensitivity = "ci";
			}

			create       = ( create === true || ( where instanceof Object ) );
			var view     = ( query.replace( /\s*asc/ig, "" ).explode().join( " " ).toCamelCase() ) + sensitivity.toUpperCase(),
			    queries  = string.explode( query ),
			    key      = this.key,
			    result   = [],
			    bucket, crawl, sort, sorting;

			queries = queries.map( function ( query ) {
				if ( string.isEmpty( query ) ) {
					throw new Error( label.error.invalidArguments );
				}

				return query.replace( regex.asc, "" );
			});

			if ( !create && this.views[view] instanceof Array ) {
				return this.views[view];
			}

			if ( this.total === 0 ) {
				return [];
			}

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

			sort = function ( data, query, prop, reverse, pk ) {
				var tmp = [],
				    sorted;

				array.each( data, function ( i, idx ) {
					var v  = pk ? i.key : i.data[prop];

					v = string.trim( v.toString() ) + ":::" + idx;
					tmp.push( v.replace(regex.nil, "\"\"") );
				});

				if ( tmp.length > 1 ) {
					tmp.sort( sorting );

					if ( reverse ) {
						tmp.reverse();
					}
				}

				sorted = tmp.map( function ( i ) {
					return data[i.replace( regex.sort_needle, "" )];
				});

				return sorted;
			};

			sorting = function ( a, b ) {
				a = a.replace( regex.sort_value, "" );
				b = b.replace( regex.sort_value, "" );

				return array.sort( number.parse( a ) || a, number.parse( b ) || b );
			};

			result           = crawl( queries, where === undefined ? this.records : this.select( where ) );
			this.views[view] = result;

			return result;
		},

		/**
		 * Storage interface
		 *
		 * @param  {Mixed}  obj  Record ( Object, key or index ) or store
		 * @param  {Object} op   Operation to perform ( get, remove or set )
		 * @param  {String} type [Optional] Type of Storage to use ( local or session, default is local )
		 * @return {Object}      Record or store
		 */
		storage : function ( obj, op, type ) {
			var record  = false,
			    session = ( type === "session" && typeof sessionStorage !== "undefined" ),
			    result, key, data;

			if ( !regex.number_string_object.test( typeof obj ) || !regex.get_remove_set.test( op ) ) {
				throw new Error( label.error.invalidArguments );
			}

			record = ( regex.number_string.test( obj ) || ( obj.hasOwnProperty( "key" ) && !obj.hasOwnProperty( "parentNode" ) ) );

			if ( record && !( obj instanceof Object ) ) {
				obj = this.get( obj );
			}

			key = record ? obj.key : obj.parentNode.id;

			if ( op === "get" ) {
				result = session ? sessionStorage.getItem( key ) : localStorage.getItem( key );

				if ( result === null ) {
					throw new Error( label.error.invalidArguments );
				}

				result = json.decode( result );
				record ? this.set( key, result, true ) : utility.merge( this, result );
				result = record ? obj : this;
			}
			else if ( op === "remove" ) {
				session ? sessionStorage.removeItem( key ) : localStorage.removeItem( key );
				result = this;
			}
			else if ( op === "set" ) {
				data = json.encode( record ? obj.data : {total: this.total, keys: this.keys, records: this.records} );
				session ? sessionStorage.setItem( key, data ) : localStorage.setItem( key, data );
				result = this;
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
		 * @return {Object}          Deferred
		 */
		sync : function ( reindex ) {
			if ( this.uri === null || string.isEmpty( this.uri ) ) {
				throw new Error( label.error.invalidArguments );
			}

			reindex    = ( reindex === true );
			var self   = this,
			    events = ( this.events === true ),
			    defer  = deferred.factory(),
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
		},

		/**
		 * Tears down a store & expires all records associated to an API
		 *
		 * @return {Undefined} undefined
		 */
		teardown : function () {
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
					cache.expire( (uri + "/" + i.key), true );
					observer.remove( uri + "/" + i.key );
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
		},

		/**
		 * Returns Array of unique values of `key`
		 *
		 * @param  {String} key Field to compare
		 * @return {Array}      Array of values
		 */
		unique : function ( key ) {
			var results = [];

			array.each( this.records, function ( i ) {
				array.add( results, i.data[key] );
			});

			return results;
		},

		/**
		 * Updates an existing Record
		 *
		 * Use `data.set()` if the record contains child data stores
		 *
		 * @param  {Mixed}  key  Integer or String to use as a Primary Key
		 * @param  {Object} data Key:Value pairs to set as field values
		 * @return {Object}      Deferred
		 */
		update : function ( key, data ) {
			var record = this.get( key ),
			    defer  = deferred.factory(),
			    args;

			if ( record === undefined ) {
				throw new Error( label.error.invalidArguments );
			}

			args = utility.merge( utility.clone ( record.data ) , data );

			this.set( key, args ).then( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});

			return defer;

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
function DataStore ( obj ) {
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

// Setting prototype & constructor loop
DataStore.prototype = data.methods;
DataStore.prototype.constructor = DataStore;
