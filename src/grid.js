/**
 * DataGrid factory
 *
 * @method grid
 * @param  {Object}  element     Element to receive DataGrid
 * @param  {Object}  store       DataStore
 * @param  {Array}   fields      Array of fields to display
 * @param  {Array}   sortable    [Optional] Array of sortable columns/fields
 * @param  {Object}  options     [Optional] DataList options
 * @param  {Boolean} filtered    [Optional] Create an input to filter the data grid
 * @param  {Number}  debounce    [Optional] DataListFilter input debounce, default is 250
 * @return {Object}              DataGrid instance
 */
var grid = function ( element, store, fields, sortable, options, filtered, debounce ) {
	var ref = [store];

	return new DataGrid( element, ref[0], fields, sortable, options, filtered ).init( debounce );
};

/**
 * DataGrid factory
 *
 * @constructor
 * @param  {Object}  element  Element to receive DataGrid
 * @param  {Object}  store    DataStore
 * @param  {Array}   fields   Array of fields to display
 * @param  {Array}   sortable [Optional] Array of sortable columns/fields
 * @param  {Object}  options  [Optional] DataList options
 * @param  {Boolean} filtered [Optional] Create an input to filter the DataGrid
 */
function DataGrid ( element, store, fields, sortable, options, filtered ) {
	var sortOrder;

	if ( options.order && !string.isEmpty( options.order ) ) {
		sortOrder = string.explode( options.order ).map( function ( i ) {
			return i.replace( regex.after_space, "" );
		});
	}

	this.element     = element;
	this.fields      = fields;
	this.filter      = null;
	this.filtered    = ( filtered === true );
	this.initialized = false;
	this.list        = null;
	this.options     = options   || {};
	this.store       = store;
	this.sortable    = sortable  || [];
	this.sortOrder   = sortOrder || sortable || [];
}

// Setting constructor loop
DataGrid.prototype.constructor = DataGrid;

/**
 * Exports data grid records
 *
 * @method dump
 * @return {Array} Record set
 */
DataGrid.prototype.dump = function () {
	return this.store.dump( this.list.records, this.fields );
};

/**
 * Initializes DataGrid
 *
 * @method init
 * @param  {Number} debounce [Optional] Debounce value for DataListFilter, defaults to 250
 * @return {Object}          DataGrid instance
 */
DataGrid.prototype.init = function ( debounce ) {
	var self, ref, template, container, header, width, css, sort;

	if ( !this.initialized ) {
		self      = this;
		ref       = [];
		template  = "";
		container = element.create( "section", {"class": "grid"}, this.element );
		header    = element.create( "li", {}, element.create( "ul", {"class": "header"}, container ) );
		width     = ( 100 / this.fields.length ) + "%";
		css       = "display:inline-block;width:" + width;
		sort      = this.options.order ? string.explode( this.options.order ) : [];

		// Creating DataList template based on fields
		array.each( this.fields, function ( i ) {
			var trimmed =  i.replace( /.*\./g, "" ),
			    obj     = element.create( "span", {innerHTML: string.capitalize( string.unCamelCase( string.unhyphenate( trimmed, true ) ), true ), style: css, "class": trimmed, "data-field": i}, header );

			// Adding CSS class if "column" is sortable
			if ( self.sortable.contains( i ) ) {
				element.klass( obj, "sortable", true );

				// Applying default sort, if specified
				if ( sort.filter( function ( x ) { return ( x.indexOf( i ) === 0 ); } ).length > 0 ) {
					element.data( obj, "sort", array.contains( sort, i + " desc" ) ? "desc" : "asc" );
				}
			}

			template += "<span class=\"" + i + "\" data-field=\"" + i + "\" style=\"" + css + "\">{{" + i + "}}</span>";
		});

		// Setting click handler on sortable "columns"
		if ( this.sortable.length > 0 ) {
			observer.add( header, "click", this.sort, "sort", this );
		}

		// Creating DataList
		ref.push( datalist.factory( container, this.store, template, this.options ) );

		// Setting by-reference DataList on DataGrid
		this.list = ref[0];

		if ( this.filtered === true ) {
			// Creating DataListFilter
			ref.push( filter( element.create( "input", {"class": "filter", "type": "text"}, container, "first" ), ref[0], this.fields.join( "," ), debounce || 250 ) );
			
			// Setting by-reference DataListFilter on DataGrid
			this.filter = ref[1];
		}

		this.initialized = true;
	}

	return this;
};

/**
 * Refreshes the DataGrid
 *
 * @method refresh
 * @return {Object} DataGrid instance
 */
DataGrid.prototype.refresh = function () {
	var sort = [],
	    self = this;

	if ( this.sortOrder.length > 0 ) {
		array.each( this.sortOrder, function ( i ) {
			var obj = element.find( self.element, ".header span[data-field='" + i + "']" )[0];

			sort.push( string.trim( i + " " + ( element.data( obj, "sort" ) || "" ) ) );
		} );

		this.options.order = this.list.order = sort.join( ", " );
	}

	this.list.where = null;
	utility.merge( this.list, this.options );
	this.list.refresh();

	return this;
};

/**
 * Sorts the DataGrid when a column header is clicked
 *
 * @method sort
 * @param  {Object} e Event
 * @return {Object}   DataGrid instance
 */
DataGrid.prototype.sort = function ( e ) {
	var target = utility.target( e ),
	    field;

	// Stopping event propogation
	utility.stop( e );

	// Refreshing list if target is sortable
	if ( element.hasClass( target, "sortable" ) ) {
		field = element.data( target, "field" );

		element.data( target, "sort", element.data( target, "sort" ) === "asc" ? "desc" : "asc" );
		array.remove( this.sortOrder, field );
		this.sortOrder.splice( 0, 0, field );
		this.refresh();
	}

	return this;
};

/**
 * Tears down the DataGrid
 *
 * @method teardown
 * @return {Object} DataGrid instance
 */
DataGrid.prototype.teardown = function () {
	if ( this.filter !== null ) {
		this.filter.teardown();
	}

	this.list.teardown();

	// Removing click handler on DataGrid header
	observer.remove( element.find( this.element, ".header" )[0], "click", "sort" );

	// Destroying DataGrid (from DOM)
	element.destroy( element.find( this.element, ".grid" )[0] );

	return this;
};
