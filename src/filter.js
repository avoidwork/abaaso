/**
 * DataListFilter
 * 
 * @class filter
 * @namespace abaaso
 */
var filter = {
	/**
	 * DataListFilter factory
	 * 
	 * @param  {Object} obj      Element to receive the filter
	 * @param  {Object} datalist Data list linked to the data store
	 * @param  {String} filters  Comma delimited string of fields to filter by
	 * @param  {Number} debounce [Optional] Milliseconds to debounce
	 * @return {Object}          Filter instance
	 */
	factory : function ( obj, datalist, filters, debounce ) {
		debounce = debounce || 250;
		var ref  = [datalist],
		    instance;

		if ( !( obj instanceof Element ) || ( datalist !== undefined && datalist.store === undefined ) || ( typeof filters !== "string" || string.isEmpty( filters ) ) ) {
			throw Error( label.error.invalidArguments );
		}

		instance = new DataListFilter( obj, ref[0], filters, debounce );

		return instance;
	},

	// Inherited by DataListFilters
	methods : {
		/**
		 * Initiate all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		init : function () {
			observer.add( this.element, "keyup", this.update, "filter", this );
			observer.add( this.element, "input", this.update, "value",  this );

			return this;
		},

		/**
		 * Set the filters
		 * 
		 * Create an object based on comma separated key string
		 * 
		 * @param {String} fields Comma separated filters
		 * @returns {Undefined} undefined
		 */
		set : function ( fields ) {
			var obj = {};

			if ( typeof fields !== "string" || string.isEmpty( fields ) ) {
				throw Error( label.error.invalidArguments );
			}

			array.each( string.explode( fields ), function (v ) {
				obj[v] = "";
			});

			this.filters = obj;

			return this;
		},

		/**
		 * Cancel all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		teardown : function () {
			observer.remove( this.element, "keyup", "filter" );
			observer.remove( this.element, "input", "value" );

			return this;
		},

		/**
		 * Update the results list
		 *
		 * @returns {Undefined} undefined
		 */
		update : function ( e ) {
			var self = this;

			utility.defer( function () {
				var val = element.val( self.element );
				
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
		}
	}
};

/**
 * DataListFilter factory
 *
 * @class DataListFilter
 * @namespace abaaso
 * @param  {String} filters DataStore fields to filter DataList by
 * @return {Object}         Instance of DataListFilter
 */
function DataListFilter ( element, datalist, filters, debounce ) {
	this.element  = element;
	this.datalist = datalist;
	this.debounce = debounce;
	this.set( filters );
	this.init();
};

// Setting prototype & constructor loop
DataListFilter.prototype = filter.methods;
DataListFilter.prototype.constructor = DataListFilter;
