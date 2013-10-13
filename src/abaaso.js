/**
 * Creates a custom Array of Elements via `abaaso()`
 *
 * @constructor
 * @memberOf abaaso
 * @param {Mixed} arg Element, HTML, or comma delimited DOM query
 */
function Abaaso ( arg ) {
	var self = this;

	if ( arg ) {
		array.each( utility.$( arg ), function ( i ) {
			self.push( i );
		} );
	}
}

// Extending Array
Abaaso.prototype = [];

/**
 * Setting constructor loop
 *
 * @method constructor
 * @private
 * @memberOf abaaso.Abaaso
 * @type {Function}
 */
Abaaso.prototype.constructor = Abaaso;

/**
 * Adds CSS classes to indices
 *
 * @method addClass
 * @memberOf abaaso.Abaaso
 * @param  {String} arg CSS class to add
 * @see {@link abaaso.element.klass}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.addClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg );
	} );
};

/**
 * Creates new Element(s) after indices
 *
 * @method after
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {String} arg  Type of Element(s) to create
 * @param  {Object} args Options to set on new Element(s)
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.after = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "after" ) );
	} );

	return result;
};

/**
 * Creates new Element(s) inside indices
 *
 * @method append
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {String} arg  Type of Element(s) to create
 * @param  {Object} args Options to set on new Element(s)
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.append = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "last" ) );
	} );

	return result;
};

/**
 * Appends indices to `obj`
 *
 * @method appendTo
 * @memberOf abaaso.Abaaso
 * @param  {String} arg Element to receive indices
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.appendTo = function ( obj ) {
	var target = obj[0] || obj;

	return array.each( this, function ( i ) {
		target.appendChild( i );
	} );
};

/**
 * Gets an index `at` a specific position & returns a new instance of Abaaso
 *
 * @method at
 * @memberOf abaaso.Abaaso
 * @param  {Number} n Index position
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.at = function ( n ) {
	var result = new Abaaso();

	result.push( this[n] );

	return result;
};

/**
 * Sets attributes on indices
 *
 * @method attr
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.attr}
 * @param  {String} key   Attribute name
 * @param  {Object} value Attribute value
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.attr = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.attr( i, key, value );
	} );
};

/**
 * Creates new Element(s) before indices
 *
 * @method before
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {String} arg  Type of Element(s) to create
 * @param  {Object} args Options to set on new Element(s)
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.before = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "before" ) );
	} );

	return result;
};

/**
 * Clears indices
 *
 * @method clear
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.clear}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.clear = function () {
	return array.each( this, function ( i ) {
		element.clear( i );
	} );
};

/**
 * Creates new Element(s) with an optional relative position
 *
 * @method create
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {String} arg      Type of Element(s) to create
 * @param  {Object} args     Options to set on new Element(s)
 * @param  {String} position [Optional] Relative position, defaults to `after`
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.create = function ( type, args, position ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, position ) );
	} );

	return result;
};

/**
 * Sets CSS style attributes on indices
 *
 * @method css
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.css}
 * @param  {String} key   CSS style key (hyphenation supported)
 * @param  {String} value CSS style value
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.css = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.css( i, key, value );
	} );
};

/**
 * Sets `data` attributes on indices, or gets with coercion
 *
 * @method data
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.data}
 * @param  {String} key   Name of attribute, will be prepended with `data-`
 * @param  {String} value Value of attribute
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.data = function ( key, value ) {
	if ( value !== undefined ) {
		return array.each( this, function (i) {
			element.data( i, key, value );
		} );
	}
	else {
		return this.map( function (i) {
			return element.data( i, key );
		} );
	}
};

/**
 * Creates DataLists in indices
 *
 * @method datalist
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.DataList}
 * @param  {Object} store    Data store to feed the DataList
 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
 * @param  {Object} options  Optional parameters to set on the DataList
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.datalist = function ( store, template, options ) {
	return array.each( this, function ( i ) {
		datalist( i, store, template, options );
	} );
};

/**
 * Disables indices
 *
 * @method disable
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.disable}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.disable = function () {
	return array.each( this, function ( i ) {
		element.disable( i );
	} );
};

/**
 * Dispatches a CustomEvent from indices
 *
 * @method dispatch
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.dispatch}
 * @param  {String}  event      Type of Event to dispatch
 * @param  {Object}  data       Data to include with the Event
 * @param  {Boolean} bubbles    [Optional] Determines if the Event bubbles, defaults to `true`
 * @param  {Boolean} cancelable [Optional] Determines if the Event can be canceled, defaults to `true`
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.dispatch = function ( event, data, bubbles, cancelable ) {
	return array.each( this, function ( i ) {
		element.dispatch( i, event, data, bubbles, cancelable );
	} );
};

/**
 * Destroys indices & removes observer hooks; returns an empty instance of Abaaso
 *
 * @method destroy
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.destroy}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.destroy = function () {
	array.each( this, function ( i ) {
		element.destroy( i );
	} );

	return new Abaaso();
};

/**
 * Iterates & executes a function against indices; returning `false` will halt iteration
 *
 * @method each
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.array.each}
 * @param  {Function} arg     Function to execute
 * @param  {Boolean}  async   [Optional] Boolean to indicate asynchronous execution, i.e. batches
 * @param  {Number}   size    [Optional] Batch size, default is 1000
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.each = function ( arg, async, size ) {
	var self = this;

	return array.each( this, function ( i, idx ) {
		var instance = new Abaaso();

		instance.push( i );
		arg.call( self, instance, idx );
	}, async, size );
};

/**
 * Enables indices
 *
 * @method enable
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.enable}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.enable = function () {
	return array.each( this, function ( i ) {
		element.enable( i );
	} );
};

/**
 * Finds children of indices which match `arg`
 *
 * @method find
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.find}
 * @param {String} arg DOM query
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.find = function ( arg ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		array.each( element.find( i, arg ), function ( r ) {
			result.push( r );
		} );
	} );

	return result;
};

/**
 * Fires an event from indices, all arguments are 'fired'
 *
 * @method fire
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.fire}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.fire = function () {
	var args = arguments;

	return array.each( this, function ( i ) {
		observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
	} );
};

/**
 * Creates DataListFilters in indices
 *
 * @method filter
 * @memberOf abaaso.Abaaso
 * @param  {Object} datalist Data list linked to the data store
 * @param  {String} filters  Comma delimited string of fields to filter by
 * @param  {Number} debounce [Optional] Milliseconds to debounce
 * @see {@link abaaso.DataListFilter}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.filter = function ( datalist, filters, debounce ) {
	return array.each( this, function ( i ) {
		filter( i, datalist, filters, debounce );
	} );
};

/**
 * Iterates & executes a function against indices; returning `false` will halt iteration
 *
 * @method forEach
 * @memberOf abaaso.Abaaso
 * @param  {Function} arg     Function to execute
 * @param  {Boolean}  async   [Optional] Boolean to indicate asynchronous execution, i.e. batches
 * @param  {Number}   size    [Optional] Batch size, default is 1000
 * @see {@link abaaso.Abaaso.each}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.forEach = function ( arg, async, size ) {
	return this.each( arg, async, size );
};

/**
 * Generates IDs for indices
 *
 * @method genId
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.utility.genId}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.genId = function () {
	return array.each( this, function ( i ) {
		utility.genId( i );
	} );
};

/**
 * Makes GET requests and sets response as innerHTML of indices
 *
 * @method get
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.client.request}
 * @param {String} uri     URI to GET
 * @param {Object} headers [Optional] HTTP request headers
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.get = function ( uri, headers ) {
	return array.each( this, function ( i ) {
		client.request( "GET", uri, headers, function ( arg ) {
			element.html( i, arg );
		}, function ( e ) {
			element.html( i, e );
		} );
	} );
};

/**
 * Creates DataGrids in indices
 *
 * @method grid
 * @memberOf abaaso.Abaaso
 * @param  {Object}  store       DataStore
 * @param  {Array}   fields      Array of fields to display
 * @param  {Array}   sortable    [Optional] Array of sortable columns/fields
 * @param  {Object}  options     [Optional] DataList options
 * @param  {Boolean} filtered    [Optional] Create an input to filter the data grid
 * @param  {Number}  debounce    [Optional] DataListFilter input debounce, default is 250
 * @see {@link abaaso.DataGrid}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.grid = function ( store, fields, sortable, options, filtered, debounce ) {
	return array.each( this, function ( i ) {
		grid( i, store, fields, sortable, options, filtered, debounce );
	} );
};

/**
 * Filters indices to ones that contain `arg`
 *
 * @method has
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.has}
 * @param {String} arg Element type to query for
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.has = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.has( i, arg );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to once that have `arg` as a CSS class
 *
 * @method hasClass
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.hasClass}
 * @param {String} arg CSS class to query for
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.hasClass = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.hasClass( i, arg );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Sets innerHTML of indices
 *
 * @method html
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.html}
 * @param {String} arg HTML to set
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.html = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		array.each( this, function ( i ) {
			element.html( i, arg );
		} );

		return this;
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( element.html( i ) );
		} );

		return result;
	}
};

/**
 * Filters indices to type of `arg`
 *
 * @method is
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.is}
 * @param  {String}  arg Property to query
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.is = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.is( i, arg );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to alpha-numeric values
 *
 * @method isAlphaNum
 * @see {@link abaaso.element.isAlphaNum}
 * @memberOf abaaso.Abaaso
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isAlphaNum = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isAlphaNum( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to boolean values
 *
 * @method isBoolean
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isBoolean}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isBoolean = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isBoolean( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to checked values
 *
 * @method isChecked
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isChecked}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isChecked = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isChecked( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to date values
 *
 * @method isDate
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDate}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDate = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDate( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to disabled Elements
 *
 * @method isDisabled
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDisabled}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDisabled = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDisabled( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to domain values
 *
 * @method isDomain
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDomain}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDomain = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDomain( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to email values
 *
 * @method isEmail
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isEmail}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isEmail = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmail( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to empty values
 *
 * @method isEmpty
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isEmpty}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isEmpty = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmpty( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to hidden Elements
 *
 * @method isHidden
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isHidden}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isHidden = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isHidden( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to IP values
 *
 * @method isIP
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isIP}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isIP = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isIP( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to integer values
 *
 * @method isInt
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isInt}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isInt = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isInt( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to numeric values
 *
 * @method isNumber
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isNumber}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isNumber = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isNumber( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to phone number values
 *
 * @method isPhone
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isPhone}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isPhone = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isPhone( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Filters indices to URL values
 *
 * @method isUrl
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isUrl}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isUrl = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isUrl( i );
	}), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Returns the last index of the instance
 *
 * @method last
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.array.last}
 * @param  {Number} arg [Optional] Negative offset from last index to return
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.last = function ( arg ) {
	var result = new Abaaso(),
	    tmp    = array.last( this, arg );

	if ( isNaN( arg ) || arg < 2 ) {
		tmp = tmp !== undefined ? [tmp] : [];
	}

	array.each( tmp, function ( i ) {
		result.push ( i );
	} );

	return result;
};

/**
 * Returns a limited range of indices from the Array
 *
 * @method limit
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.array.limit}
 * @param  {Number} start  Starting index
 * @param  {Number} offset Number of indices to return
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.limit = function ( start, offset ) {
	var result = new Abaaso();

	array.each( array.limit( this, start, offset ), function ( i ) {
		result.push( i );
	} );

	return result;
};

/**
 * Gets the listeners for an event
 *
 * @method listeners
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.listeners}
 * @param  {String} event  Event being queried
 * @return {Array}         Array of listeners
 */
Abaaso.prototype.listeners = function ( event ) {
	var result = [];

	array.each( this, function ( i ) {
		result.push( abaaso.listeners( i, event ) );
	} );

	return result;
};

/**
 * Renders a loading icon in a target element,
 * with a class of "loading"
 *
 * @method loading
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.utility.loading}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.loading = function () {
	return array.each( this, function ( i ) {
		utility.loading( i );
	} );
};

/**
 * Adds a handler for an event
 *
 * @method on
 * @param  {String}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {Function} listener Event handler
 * @param  {String}   id       [Optional / Recommended] ID for the listener
 * @param  {String}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {String}   st       [Optional] Application state, default is current
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.add}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.on = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.add( i, event, listener, id, scope || i, state );
	} );
};

/**
 * Adds a listener for a single execution
 *
 * @method once
 * @param  {Mixed}    obj      Primitive
 * @param  {String}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {Function} listener Event handler
 * @param  {String}   id       [Optional / Recommended] ID for the listener
 * @param  {String}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {String}   st       [Optional] Application state, default is current
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.once}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.once = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.once( i, event, listener, id, scope || i, state );
	} );
};

/**
 * Finds the position of an element
 *
 * @method position
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.position}
 * @param  {Mixed} obj Element
 * @return {Array}     Array of Coordinates [left, top, right, bottom]
 */
Abaaso.prototype.position = function () {
	var result = [];

	array.each( this, function ( i ) {
		result.push( element.position( i ) );
	} );

	return result;
};

/**
 * Prepends an HTML Element or String
 *
 * @method prepend
 * @param  {String} type Type of Element to create, or HTML string
 * @param  {Object} args [Optional] Properties to set
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.prepend = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "first" ) );
	} );

	return result;
};

/**
 * Removes indices from instance
 *
 * @method remove
 * @memberOf abaaso.Abaaso
 * @param  {Mixed}  start Starting index, or value to find within obj
 * @param  {Number} end   [Optional] Ending index
 * @see {@link abaaso.array.remove}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.remove = function ( start, end ) {
	return array.remove( this, start, end );
};

/**
 * Deletes every element of `obj` for which `fn` evaluates to true
 *
 * @method removeIf
 * @memberOf abaaso.Abaaso
 * @param  {Function} fn  Function to test indices against
 * @see {@link abaaso.array.removeIf}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeIf = function ( fn ) {
	return array.removeIf( this, fn );
};

/**
 * Deletes elements of `obj` until `fn` evaluates to false
 *
 * @method removeWhile
 * @memberOf abaaso.Abaaso
 * @param  {Function} fn  Function to test indices against
 * @see {@link abaaso.array.removeWhile}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeWhile= function ( fn ) {
	return array.removeWhile( this, fn );
};

/**
 * Removes an attribute from indices
 *
 * @method removeAttr
 * @memberOf abaaso.Abaaso
 * @param  {String} key Attribute name
 * @see {@link abaaso.array.removeAttr}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeAttr = function ( key ) {
	return array.each( this, function ( i ) {
		element.removeAttr( i, key );
	} );
};

/**
 * Removes a CSS class from indices
 *
 * @method removeClass
 * @memberOf abaaso.Abaaso
 * @param  {String} arg CSS class
 * @see {@link abaaso.element.klass}
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeClass= function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg, false );
	} );
};

/**
 * Serializes the elements of an Element
 *
 * @method serialize
 * @memberOf abaaso.Abaaso
 * @param  {Boolean} string [Optional] true if you want a query string, default is false ( JSON )
 * @param  {Boolean} encode [Optional] true if you want to URI encode the value, default is true
 * @see {@link abaaso.element.serialize}
 * @return {Array} Serialized indices
 */
Abaaso.prototype.serialize = function ( string, encode ) {
	return this.map( function ( i ) {
		element.serialize( i, string, encode );
	} );
};

/**
 * Returns the size of the indices
 *
 * @method size
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.size}
 * @return {Array} Sizes of indices
 */
Abaaso.prototype.size = function () {
	return this.map( function ( i ) {
		return element.size( i );
	} );
};

/**
 * Getter / setter for an indice's text
 *
 * @method text
 * @memberOf abaaso.Abaaso
 * @param  {String} arg [Optional] Value to set
 * @see {@link abaaso.element.text}
 * @return {Mixed} {@link abaaso.Abaaso} or Array of text values
 */
Abaaso.prototype.text = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		return array.each( this, function ( i ) {
			var tmp;

			tmp = {};
			tmp[i.innerText ? "innerText" : "text"] = arg;
			element.update( i, tmp );
		} );
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( string.trim( i[i.innerText ? "innerText" : "text"] ) );
		} );

		return result;
	}
};

/**
 * Transforms JSON to HTML and appends to Body or target Element
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {Object} arg JSON Object describing HTML
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.tpl = function ( arg ) {
	return array.each( this, function ( i ) {
		utility.tpl ( arg, i );
	} );
};

/**
 * Toggles a CSS class
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {Object} arg JSON Object describing HTML
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.toggleClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.toggleClass( i, arg );
	} );
};

/**
 * Removes listeners of indices
 *
 * @method un
 * @param  {String} event [Optional] Event, or Events being fired ( comma delimited supported )
 * @param  {String} id    [Optional] Listener id
 * @param  {String} state [Optional] Application state, default is current
 * @return {Object} {@link abaaso.Abaaso}
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.remove}
 */
Abaaso.prototype.un = function ( event, id, state ) {
	return array.each( this, function ( i ) {
		observer.remove( i, event, id, state );
	} );
};

/**
 * Updates an Element
 *
 * @method update
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.update}
 * @param  {Object} args Properties to set
 * @return {Object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.update = function ( arg ) {
	return array.each( this, function ( i ) {
		element.update( i, arg );
	} );
};

/**
 * Gets or sets the value of indices
 *
 * @method val
 * @memberOf abaaso.Abaaso
 * @param  {Mixed} arg [Optional] Value to set
 * @return {Mixed} {@link abaaso.Abaaso} or Array of values
 * @see {@link abaaso.element.val}
 */
Abaaso.prototype.val = function ( arg ) {
	if ( arg === undefined ) {
		return this.map( function ( i ) {
			return element.val( i );
		} );
	}
	else {
		return array.each( this, function ( i ) {
			return element.val( i, arg );
		} );
	}
};

/**
 * Validates the contents of Element
 *
 * @method validate
 * @memberOf abaaso.Abaaso
 * @return {Array} Array of results
 * @see {@link abaaso.element.validate}
 */
Abaaso.prototype.validate = function () {
	return this.map( function ( i ) {
		return element.validate( i );
	} );
};
