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
	/**
	 * Creates an instance of datalist
	 *
	 * @method factory
	 * @param  {Object} target   Element to receive the DataList
	 * @param  {Object} store    Data store to feed the DataList
	 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
	 * @param  {Object} options  Optional parameters to set on the DataList
	 * @return {Object}          DataList instance
	 */
	factory : function ( target, store, template, options ) {
		var ref = [store],
		    obj, instance;

		if ( !( target instanceof Element ) || typeof store !== "object" || !regex.string_object.test( typeof template ) ) {
			throw new Error( label.error.invalidArguments );
		}

		obj = element.create( "ul", {"class": "list", id: store.parentNode.id + "-datalist"}, target );

		// Creating instance
		instance = new DataList( obj, ref[0], template );

		if ( options instanceof Object) {
			utility.merge( instance, options );
		}

		instance.store.datalists.push( instance );

		// Rendering if not tied to an API or data is ready
		if ( instance.store.uri === null || instance.store.loaded ) {
			instance.refresh( true );
		}

		return instance;
	},

	/**
	 * Calculates the total pages
	 *
	 * @method pages
	 * @private
	 * @return {Number} Total pages
	 */
	pages : function () {
		if ( isNaN( this.pageSize ) ) {
			throw new Error( label.error.invalidArguments );
		}

		return number.round( this.total / this.pageSize, "up" );
	},

	/**
	 * Calculates the page size as an Array of start & finish
	 *
	 * @method range
	 * @private
	 * @return {Array}  Array of start & end numbers
	 */
	range : function () {
		var start = ( this.pageIndex * this.pageSize ) - this.pageSize,
		    end   = this.pageSize;

		return [start, end];
	}
};

/**
 * DataList factory
 *
 * @class DataList
 * @namespace abaaso
 * @constructor
 * @private
 * @method DataList
 * @param  {Object} element  DataList element
 * @param  {Object} store    Data store to feed the DataList
 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
 * @return {Object}          Instance of DataList
 */
function DataList ( element, store, template ) {
	this.callback    = null;
	this.element     = element;
	this.emptyMsg    = "Nothing to display";
	this.filter      = null;
	this.id          = utility.genId();
	this.pageIndex   = 1;
	this.pageSize    = null;
	this.pageRange   = 5;
	this.pagination  = "bottom"; // "top" or "bottom|top" are also valid
	this.placeholder = "";
	this.order       = "";
	this.records     = [];
	this.template    = template;
	this.total       = 0;
	this.sensitivity = "ci";
	this.store       = store;
	this.where       = null;
}

// Setting constructor loop
DataList.prototype.constructor = DataList;

/**
 * Delete sync handler
 *
 * @method del
 * @param  {Object} rec Record
 * @return {Object}     DataList instance
 */
DataList.prototype.del = function ( rec ) {
	if ( typeof this.pageIndex === "number" && typeof this.pageSize === "number" ) {
		this.refresh();
	}
	else {
		observer.fire( this.element, "beforeDataListRefresh" );
		
		array.each( this.element.find( "> li[data-key='" + rec.key + "']" ), function ( i ) {
			element.destroy( i );
		});

		observer.fire( this.element, "afterDataListRefresh" );
	}

	return this;
};

/**
 * Exports data list records
 *
 * @method dump
 * @return {Array} Record set
 */
DataList.prototype.dump = function () {
	return this.store.dump( this.records );
};

/**
 * Changes the page index of the DataList
 *
 * @method page
 * @param  {Boolean} redraw [Optional] Boolean to force clearing the DataList ( default ), false toggles "hidden" class of items
 * @param  {Boolean} create [Optional] Recreates cached View of data
 * @return {Object}         DataList instance
 */
DataList.prototype.page = function ( arg, redraw, create ) {
	this.pageIndex = arg;
	return this.refresh( redraw, create );
};

/**
 * Adds pagination Elements to the View
 *
 * @method pages
 * @return {Object}  DataList instance
 */
DataList.prototype.pages = function () {
	var obj   = this.element,
	    page  = this.pageIndex,
	    pos   = this.pagination,
	    range = this.pageRange,
	    mid   = number.round( number.half( range ), "down" ),
	    start = page - mid,
	    end   = page + mid,
	    self  = this,
	    total = datalist.pages.call( this ),
	    diff;

	if ( !regex.top_bottom.test( pos ) ) {
		throw new Error( label.error.invalidArguments );
	}

	// Removing the existing controls
	array.each( utility.$( "#" + obj.id + "-pages-top, #" + obj.id + "-pages-bottom" ), function ( i ) {
		if ( i ) {
			element.destroy( i );
		}
	});
	
	// Halting because there's 1 page, or nothing
	if ( this.total === 0 || total === 1 ) {
		return this;
	}

	// Getting the range to display
	if ( start < 1 ) {
		diff  = number.diff( start, 1 );
		start = start + diff;
		end   = end   + diff;
	}

	if ( end > total ) {
		end   = total;
		start = ( end - range ) + 1;

		if ( start < 1 ) {
			start = 1;
		}
	}

	array.each( string.explode( pos ), function ( i ) {
		var current = false,
		    more    = page > 1,
		    next    = ( page + 1 ) <= total,
		    last    = ( page >= total ),
		    el, n;

		// Setting up the list
		el = element.create( "ul", {"class": "list pages hidden " + i, id: obj.id + "-pages-" + i}, obj, i === "bottom" ? "after" : "before" );

		// First page
		element.create( more ? "a" : "span", {"class": "first page", "data-page": 1, innerHTML: "&lt;&lt;"}, element.create( "li", {}, el) );

		// Previous page
		element.create( more ? "a" : "span", {"class": "prev page", "data-page": (page - 1), innerHTML: "&lt;"}, element.create( "li", {}, el) );

		// Rendering the page range
		for ( n = start; n <= end; n++ ) {
			current = ( n === page );
			element.create( current ? "span" : "a", {"class": current ? "current page" : "page", "data-page": n, innerHTML: n}, element.create( "li", {}, el) );
		}

		// Next page
		element.create( next ? "a" : "span", {"class": "next page", "data-page": next ? (page + 1) : null, innerHTML: "&gt;"}, element.create( "li", {}, el) );

		// Last page
		element.create( last ? "span" : "a", {"class": "last page", "data-page": last ? null : total, innerHTML: "&gt;&gt;"}, element.create( "li", {}, el) );

		// Adding to DOM
		element.klass( el, "hidden", false );

		// Click handler scrolls to top the top of page
		observer.add( el, "click", function (e ) {
			var target = utility.target( e );

			utility.stop( e );

			if ( target.nodeName === "A" ) {
				self.page( element.data( target, "page") );
				element.scrollTo( obj );
			}
		}, "pagination");
	});

	return this;
};

/**
 * Refreshes element
 *
 * Events: beforeDataListRefresh  Fires from the element containing the DataList
 *         afterDataListRefresh   Fires from the element containing the DataList
 *
 * @method refresh
 * @param  {Boolean} redraw [Optional] Boolean to force clearing the DataList ( default ), false toggles "hidden" class of items
 * @param  {Boolean} create [Optional] Recreates cached View of data
 * @return {Object}         DataList instance
 */
DataList.prototype.refresh = function ( redraw, create ) {
	redraw       = ( redraw !== false );
	create       = ( create === true );
	var el       = this.element,
	    template = ( typeof this.template === "object" ),
	    consumed = [],
	    items    = [],
	    self     = this,
	    callback = ( typeof this.callback === "function" ),
	    reg      = new RegExp(),
	    registry = [], // keeps track of records in the list ( for filtering )
	    limit    = [],
	    fn, ceiling;

	observer.fire( el, "beforeDataListRefresh" );

	// Creating templates for the html rep
	if ( !template ) {
		fn = function ( i ) {
			var html  = self.template,
			    items = array.unique( html.match( /\{\{[\w\.\-]+\}\}/g ) );

			// Replacing record key
			html = html.replace( "{{" + self.store.key + "}}", i.key );
			
			// Replacing dot notation properties
			array.each( items, function ( attr ) {
				var key   = attr.replace( /\{\{|\}\}/g, "" ),
				    value = utility.walk( i.data, key );

				reg.compile( attr, "g" );
				html = html.replace( reg, value );
			});

			// Filling in placeholder value
			html = html.replace( /\{\{.*\}\}/g, self.placeholder );

			return "<li data-key=\"" + i.key + "\">" + html + "</li>";
		};
	}
	else {
		fn = function ( i ) {
			var obj   = json.encode( self.template ),
			    items = array.unique( obj.match( /\{\{[\w\.\-]+\}\}/g ) );

			// Replacing record key
			obj = obj.replace( "{{" + self.store.key + "}}", i.key );
			
			// Replacing dot notation properties
			array.each( items, function ( attr ) {
				var key   = attr.replace( /\{\{|\}\}/g, "" ),
				    value = utility.walk( i.data, key );

				reg.compile( attr, "g" );

				// Stripping first and last " to concat to valid JSON
				obj = obj.replace( reg, json.encode( value ).replace( /(^")|("$)/g, "" ) );
			});

			// Filling in placeholder value
			obj = json.decode( obj.replace( /\{\{.*\}\}/g, self.placeholder ) );

			return {li: obj};
		};
	}

	// Consuming records based on sort
	if ( this.where === null ) {
		consumed = string.isEmpty( this.order ) ? this.store.get() : this.store.sort( this.order, create, this.sensitivity );
	}
	else {
		consumed = string.isEmpty( this.order ) ? this.store.select( this.where ) : this.store.sort( this.order, create, this.sensitivity, this.where );
	}

	// Processing ( filtering ) records & generating templates
	array.each( consumed, function ( i ) {
		if ( self.filter === null || !( self.filter instanceof Object ) ) {
			items.push( {key: i.key, template: fn( i )} );
		}
		else {
			utility.iterate( self.filter, function ( v, k ) {
				var reg, key;

				if ( array.contains( registry, i.key ) ) {
					return;
				}
				
				v   = string.explode( v );
				reg = new RegExp(),
				key = ( k === self.store.key );

				array.each( v, function ( query ) {
					utility.compile( reg, query, "i" );
					if ( ( key && reg.test( i.key ) ) || ( i.data[k] !== undefined && reg.test( i.data[k] ) ) ) {
						registry.push( i.key );
						items.push( {key: i.key, template: fn( i )} );

						return false;
					}
				});
			});
		}
	});

	// Exposting records & total count of items in the list
	this.records = items;
	this.total   = items.length;

	// Pagination ( supports filtering )
	if ( typeof this.pageIndex === "number" && typeof this.pageSize === "number" ) {
		ceiling = datalist.pages.call( this );

		// Passed the end, so putting you on the end
		if ( ceiling > 0 && this.pageIndex > ceiling ) {
			return this.page( ceiling );
		}

		// Paginating the items
		else if ( this.total > 0 ) {
			limit = datalist.range.call( this );
			items = items.limit( limit[0], limit[1] );
		}
	}

	// Preparing the target element
	if ( redraw ) {
		if ( this.total === 0 ) {
			el.innerHTML = "<li class=\"empty\">" + this.emptyMsg + "</li>";
		}
		else {
			el.innerHTML = items.map( function ( i ) {
				return i.template;
			}).join( "\n" );

			if ( callback ) {
				array.each( element.find( el, "> li" ), function ( i ) {
					self.callback( i );
				});
			}
		}
	}
	else {
		array.each( element.find( el, "> li" ), function ( i ) {
			element.addClass( i, "hidden" );
		});

		array.each( items, function ( i ) {
			array.each( element.find( el, "> li[data-key='" + i.key + "']" ), function ( o ) {
				element.removeClass( o, "hidden" );
			});
		});
	}

	// Rendering pagination elements
	if ( regex.top_bottom.test( this.pagination ) && typeof this.pageIndex === "number" && typeof this.pageSize === "number") {
		this.pages();
	}
	else {
		array.each( utility.$( "#" + el.id + "-pages-top, #" + el.id + "-pages-bottom" ), function ( i ) {
			element.destroy( i );
		});
	}

	observer.fire( el, "afterDataListRefresh" );

	return this;
};

/**
 * Sorts data list & refreshes element
 *
 * @method sort
 * @param  {String}  order       SQL "order by" statement
 * @param  {String}  sensitivity [Optional] Defaults to "ci" ( "ci" = insensitive, "cs" = sensitive, "ms" = mixed sensitive )
 * @param  {Boolean} create      [Optional] Recreates cached View of data store
 * @return {Object}              DataList instance
 */
DataList.prototype.sort = function ( order, sensitivity, create ) {
	this.order       = order;
	this.sensitivity = sensitivity || "ci";
	return this.refresh( true, create );
};

/**
 * Tears down references to the DataList
 *
 * @method teardown
 * @param  {Boolean} destroy [Optional] `true` will remove the DataList from the DOM
 * @return {Object}  DataList instance
 */
DataList.prototype.teardown = function ( destroy ) {
	destroy  = ( destroy === true );
	var self = this,
	    id   = this.element.id;

	observer.remove( id );

	array.each( utility.$( "#" + id + "-pages-top, #" + id + "-pages-bottom" ), function ( i ) {
		observer.remove( i );
	});

	array.each( this.store.datalists, function ( i, idx ) {
		if ( i.id === self.id ) {
			this.remove( idx );

			return false;
		}
	});

	if ( destroy ) {
		element.destroy( this.element );
		this.element = null;
	}

	return this;
};
