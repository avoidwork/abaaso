/**
 * DataListFilter factory
 *
 * @method filter
 * @memberOf abaaso
 * @param  {object} obj      Element to receive the filter
 * @param  {object} datalist Data list linked to the data store
 * @param  {string} filters  Comma delimited string of fields to filter by
 * @param  {number} debounce [Optional] Milliseconds to debounce
 * @return {@link abaaso.DataListFilter}
 */
var filter = function ( obj, datalist, filters, debounce ) {
	debounce = debounce || 250;
	var ref  = [datalist];

	if ( !( obj instanceof Element ) || ( datalist !== undefined && datalist.store === undefined ) || ( typeof filters !== "string" || string.isEmpty( filters ) ) ) {
		throw new Error( label.error.invalidArguments );
	}

	return new DataListFilter( obj, ref[0], debounce ).set( filters ).init();
};

/**
 * Creates a new DataListFilter
 *
 * @constructor
 * @memberOf abaaso
 * @param  {object} obj      Element to receive the filter
 * @param  {object} datalist Data list linked to the data store
 * @param  {number} debounce [Optional] Milliseconds to debounce
 */
function DataListFilter ( element, datalist, debounce ) {
	this.element  = element;
	this.datalist = datalist;
	this.debounce = debounce;
	this.filters  = {};
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso.DataListFilter
 * @private
 * @type {function}
 */
DataListFilter.prototype.constructor = DataListFilter;

/**
 * Initiate all event listeners
 *
 * @method init
 * @memberOf abaaso.DataListFilter
 * @return {@link abaaso.DataListFilter}
 */
DataListFilter.prototype.init = function () {
	observer.add( this.element, "keyup", this.update, "filter", this );
	observer.add( this.element, "input", this.update, "value",  this );

	return this;
};

/**
 * Set the filters
 *
 * Create an object based on comma separated key string
 *
 * @method set
 * @memberOf abaaso.DataListFilter
 * @param  {string} fields Comma separated filters
 * @return {@link abaaso.DataListFilter}
 */
DataListFilter.prototype.set = function ( fields ) {
	var obj = {};

	array.each( string.explode( fields ), function ( v ) {
		obj[v] = "";
	});

	this.filters = obj;

	return this;
};

/**
 * Cancel all event listeners
 *
 * @method teardown
 * @memberOf abaaso.DataListFilter
 * @return {@link abaaso.DataListFilter}
 */
DataListFilter.prototype.teardown = function () {
	observer.remove( this.element, "keyup", "filter" );
	observer.remove( this.element, "input", "value" );

	return this;
};

/**
 * Update the results list
 *
 * @method update
 * @memberOf abaaso.DataListFilter
 * @return {@link abaaso.DataListFilter}
 */
DataListFilter.prototype.update = function () {
	var self = this;

	utility.defer( function () {
		var val = element.val( self.element ).toString();
		
		if ( !string.isEmpty( val ) ) {
			utility.iterate( self.filters, function ( v, k ) {
				var queries = string.explode( val );

				// Ignoring trailing commas
				queries = queries.filter( function ( i ) {
					return !string.isEmpty( i );
				});

				// Shaping valid pattern
				array.each( queries, function ( i, idx ) {
					this[idx] = "^" + string.escape( i ).replace( "\\*", ".*" );
				});

				this[k] = queries.join( "," );
			});

			self.datalist.filter = self.filters;
		}
		else {
			self.datalist.filter = null;
		}

		self.datalist.pageIndex = 1;
		self.datalist.refresh( true, ( self.datalist.store.datalists.length > 1 ) );
	}, this.debounce, this.element.id + "Debounce");

	return this;
};
