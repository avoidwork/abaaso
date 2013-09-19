/**
 * Creates a custom Array of Elements by using `abaaso("selector")`
 *
 * @constructor
 * @memberOf abaaso
 * @param {string} query Comma delimited DOM query
 */
function Abaaso ( query ) {
	var self = this;

	if ( query ) {
		array.each( utility.$( query ), function ( i ) {
			self.push( i );
		});
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
 * @type {function}
 */
Abaaso.prototype.constructor = Abaaso;

/**
 * Adds CSS classes to indices
 *
 * @method addClass
 * @memberOf abaaso.Abaaso
 * @param  {string} arg CSS class to add
 * @see {@link abaaso.element.klass}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.addClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg );
	});
};

/**
 * Creates new Element(s) after indices
 *
 * @method after
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {string} arg  Type of Element(s) to create
 * @param  {object} args Options to set on new Element(s)
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.after = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "after" ) );
	});

	return result;
};

/**
 * Creates new Element(s) inside indices
 *
 * @method append
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {string} arg  Type of Element(s) to create
 * @param  {object} args Options to set on new Element(s)
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.append = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "last" ) );
	});

	return result;
};

/**
 * Gets an index `at` a specific position & returns a new instance of Abaaso
 *
 * @method at
 * @memberOf abaaso.Abaaso
 * @param  {number} n Index position
 * @return {object} {@link abaaso.Abaaso}
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
 * @param  {string} key   Attribute name
 * @param  {object} value Attribute value
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.attr = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.attr( i, key, value );
	});
};

/**
 * Creates new Element(s) before indices
 *
 * @method before
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {string} arg  Type of Element(s) to create
 * @param  {object} args Options to set on new Element(s)
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.before = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "before" ) );
	});

	return result;
};

/**
 * Clears indices
 *
 * @method clear
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.clear}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.clear = function () {
	return array.each( this, function ( i ) {
		element.clear( i );
	});
};

/**
 * Creates new Element(s) with an optional relative position
 *
 * @method create
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @param  {string} arg      Type of Element(s) to create
 * @param  {object} args     Options to set on new Element(s)
 * @param  {string} position [Optional] Relative position, defaults to `after`
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.create = function ( type, args, position ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, position ) );
	});

	return result;
};

/**
 * Sets CSS style attributes on indices
 *
 * @method css
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.css}
 * @param  {string} key   CSS style key (hyphenation supported)
 * @param  {string} value CSS style value
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.css = function ( key, value ) {
	return array.each( this, function ( i ) {
		element.css( i, key, value );
	});
};

/**
 * Sets `data` attributes on indices, or gets with coercion
 *
 * @method data
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.data}
 * @param  {string} key   Name of attribute, will be prepended with `data-`
 * @param  {string} value Value of attribute
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.data = function ( key, value ) {
	if ( value !== undefined ) {
		return array.each( this, function (i) {
			element.data( i, key, value );
		});
	}
	else {
		return this.map( function (i) {
			return element.data( i, key );
		});
	}
};

/**
 * Disables indices
 *
 * @method disable
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.disable}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.disable = function () {
	return array.each( this, function ( i ) {
		element.disable( i );
	});
};

/**
 * Dispatches a CustomEvent from indices
 *
 * @method dispatch
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.dispatch}
 * @param  {string}  event      Type of Event to dispatch
 * @param  {object}  data       Data to include with the Event
 * @param  {boolean} bubbles    [Optional] Determines if the Event bubbles, defaults to `true`
 * @param  {boolean} cancelable [Optional] Determines if the Event can be canceled, defaults to `true`
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.dispatch = function ( event, data, bubbles, cancelable ) {
	return array.each( this, function ( i ) {
		element.dispatch( i, event, data, bubbles, cancelable );
	});
};

/**
 * Destroys indices & removes observer hooks; returns an empty instance of Abaaso
 *
 * @method destroy
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.destroy}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.destroy = function () {
	array.each( this, function ( i ) {
		element.destroy( i );
	});

	return new Abaaso();
};

/**
 * Iterates & executes a function against indices; returning `false` will halt iteration
 *
 * @method each
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.array.each}
 * @param  {function} arg     Function to execute
 * @param  {boolean}  async   [Optional] Boolean to indicate asynchronous execution, i.e. batches
 * @param  {number}   size    [Optional] Batch size, default is 1000
 * @return {object} {@link abaaso.Abaaso}
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
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.enable = function () {
	return array.each( this, function ( i ) {
		element.enable( i );
	});
};

/**
 * Finds children of indices which match `arg`
 *
 * @method find
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.find}
 * @param {string} arg DOM query
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.find = function ( arg ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		array.each( element.find( i, arg ), function ( r ) {
			result.push( r );
		});
	});

	return result;
};

/**
 * Fires an event from indices, all arguments are 'fired'
 *
 * @method fire
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.fire}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.fire = function () {
	var args = arguments;

	return array.each( this, function ( i ) {
		observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
	});
};

/**
 * Iterates & executes a function against indices; returning `false` will halt iteration
 *
 * @method forEach
 * @memberOf abaaso.Abaaso
 * @param  {function} arg     Function to execute
 * @param  {boolean}  async   [Optional] Boolean to indicate asynchronous execution, i.e. batches
 * @param  {number}   size    [Optional] Batch size, default is 1000
 * @see {@link abaaso.Abaaso.each}
 * @return {object} {@link abaaso.Abaaso}
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
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.genId = function () {
	return array.each( this, function ( i ) {
		utility.genId( i );
	});
};

/**
 * Makes GET requests and sets response as innerHTML of indices
 *
 * @method get
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.client.request}
 * @param {string} uri     URI to GET
 * @param {object} headers [Optional] HTTP request headers
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.get = function ( uri, headers ) {
	return array.each( this, function ( i ) {
		client.request( "GET", uri, headers, function ( arg ) {
			element.html( i, arg );
		}, function ( e ) {
			element.html( i, e );
		});
	});
};

/**
 * Filters indices to ones that contain `arg`
 *
 * @method has
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.has}
 * @param {string} arg Element type to query for
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.has = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.has( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to once that have `arg` as a CSS class
 *
 * @method hasClass
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.hasClass}
 * @param {string} arg CSS class to query for
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.hasClass = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.hasClass( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Sets innerHTML of indices
 *
 * @method html
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.html}
 * @param {string} arg HTML to set
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.html = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		array.each( this, function ( i ) {
			element.html( i, arg );
		});

		return this;
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( element.html( i ) );
		});

		return result;
	}
};

/**
 * Filters indices to type of `arg`
 *
 * @method is
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.is}
 * @param  {string}  arg Property to query
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.is = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.is( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to alpha-numeric values
 *
 * @method isAlphaNum
 * @see {@link abaaso.element.isAlphaNum}
 * @memberOf abaaso.Abaaso
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isAlphaNum = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isAlphaNum( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to boolean values
 *
 * @method isBoolean
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isBoolean}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isBoolean = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isBoolean( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to checked values
 *
 * @method isChecked
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isChecked}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isChecked = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isChecked( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to date values
 *
 * @method isDate
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDate}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDate = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDate( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to disabled Elements
 *
 * @method isDisabled
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDisabled}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDisabled = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDisabled( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to domain values
 *
 * @method isDomain
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isDomain}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isDomain = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDomain( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to email values
 *
 * @method isEmail
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isEmail}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isEmail = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmail( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to empty values
 *
 * @method isEmpty
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isEmpty}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isEmpty = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmpty( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to hidden Elements
 *
 * @method isHidden
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isHidden}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isHidden = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isHidden( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to IP values
 *
 * @method isIP
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isIP}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isIP = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isIP( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to integer values
 *
 * @method isInt
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isInt}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isInt = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isInt( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to numeric values
 *
 * @method isNumber
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isNumber}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isNumber = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isNumber( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to phone number values
 *
 * @method isPhone
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isPhone}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isPhone = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isPhone( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Filters indices to URL values
 *
 * @method isUrl
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.isUrl}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.isUrl = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isUrl( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Returns the last index of the instance
 *
 * @method last
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.array.last}
 * @param  {number} arg [Optional] Negative offset from last index to return
 * @return {object} {@link abaaso.Abaaso}
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
 * @param  {number} start  Starting index
 * @param  {number} offset Number of indices to return
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.limit = function ( start, offset ) {
	var result = new Abaaso();

	array.each( array.limit( this, start, offset ), function ( i ) {
		result.push( i );
	});

	return result;
};

/**
 * Gets the listeners for an event
 *
 * @method listeners
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.listeners}
 * @param  {string} event  Event being queried
 * @return {array}         Array of listeners
 */
Abaaso.prototype.listeners = function ( event ) {
	var result = [];

	array.each( this, function ( i ) {
		result.push( abaaso.listeners( i, event ) );
	});

	return result;
};

/**
 * Renders a loading icon in a target element,
 * with a class of "loading"
 *
 * @method loading
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.utility.loading}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.loading = function () {
	return array.each( this, function ( i ) {
		utility.loading( i );
	});
};

/**
 * Adds a handler for an event
 *
 * @method on
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] ID for the listener
 * @param  {string}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.add}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.on = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.add( i, event, listener, id, scope || i, state );
	});
};

/**
 * Adds a listener for a single execution
 *
 * @method once
 * @param  {mixed}    obj      Primitive
 * @param  {string}   event    Event, or Events being fired ( comma delimited supported )
 * @param  {function} listener Event handler
 * @param  {string}   id       [Optional / Recommended] ID for the listener
 * @param  {string}   scope    [Optional / Recommended] ID of the object or element to be set as 'this'
 * @param  {string}   st       [Optional] Application state, default is current
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.once}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.once = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.once( i, event, listener, id, scope || i, state );
	});
};

/**
 * Finds the position of an element
 *
 * @method position
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.position}
 * @param  {mixed} obj Element
 * @return {array}     Array of Coordinates [left, top, right, bottom]
 */
Abaaso.prototype.position = function () {
	var result = [];

	array.each( this, function ( i ) {
		result.push( element.position( i ) );
	});

	return result;
};

/**
 * Prepends an HTML Element or String
 *
 * @method prepend
 * @param  {string} type Type of Element to create, or HTML string
 * @param  {object} args [Optional] Properties to set
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.create}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.prepend = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "first" ) );
	});

	return result;
};

/**
 * Removes indices from instance
 *
 * @method remove
 * @memberOf abaaso.Abaaso
 * @param  {mixed}  start Starting index, or value to find within obj
 * @param  {number} end   [Optional] Ending index
 * @see {@link abaaso.array.remove}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.remove = function ( start, end ) {
	return array.remove( this, start, end );
};

/**
 * Deletes every element of `obj` for which `fn` evaluates to true
 *
 * @method removeIf
 * @memberOf abaaso.Abaaso
 * @param  {function} fn  Function to test indices against
 * @see {@link abaaso.array.removeIf}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeIf = function ( fn ) {
	return array.removeIf( this, fn );
};

/**
 * Deletes elements of `obj` until `fn` evaluates to false
 *
 * @method removeWhile
 * @memberOf abaaso.Abaaso
 * @param  {function} fn  Function to test indices against
 * @see {@link abaaso.array.removeWhile}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeWhile= function ( fn ) {
	return array.removeWhile( this, fn );
};

/**
 * Removes an attribute from indices
 *
 * @method removeAttr
 * @memberOf abaaso.Abaaso
 * @param  {string} key Attribute name
 * @see {@link abaaso.array.removeAttr}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeAttr = function ( key ) {
	return array.each( this, function ( i ) {
		element.removeAttr( i, key );
	});
};

/**
 * Removes a CSS class from indices
 *
 * @method removeClass
 * @memberOf abaaso.Abaaso
 * @param  {string} arg CSS class
 * @see {@link abaaso.element.klass}
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.removeClass= function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg, false );
	});
};

/**
 * Serializes the elements of an Element
 *
 * @method serialize
 * @memberOf abaaso.Abaaso
 * @param  {boolean} string [Optional] true if you want a query string, default is false ( JSON )
 * @param  {boolean} encode [Optional] true if you want to URI encode the value, default is true
 * @see {@link abaaso.element.serialize}
 * @return {array} Serialized indices
 */
Abaaso.prototype.serialize = function ( string, encode ) {
	return this.map( function ( i ) {
		element.serialize( i, string, encode );
	});
};

/**
 * Returns the size of the indices
 *
 * @method size
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.size}
 * @return {array} Sizes of indices
 */
Abaaso.prototype.size = function () {
	return this.map( function ( i ) {
		return element.size( i );
	});
};

/**
 * Getter / setter for an indice's text
 *
 * @method text
 * @memberOf abaaso.Abaaso
 * @param  {string} arg [Optional] Value to set
 * @see {@link abaaso.element.text}
 * @return {mixed} {@link abaaso.Abaaso} or Array of text values
 */
Abaaso.prototype.text = function ( arg ) {
	var result;

	if ( arg !== undefined ) {
		return array.each( this, function ( i ) {
			var tmp;

			tmp = {};
			tmp[i.innerText ? "innerText" : "text"] = arg;
			element.update( i, tmp );
		});
	}
	else {
		result = [];
		array.each( this, function ( i ) {
			result.push( string.trim( i[i.innerText ? "innerText" : "text"] ) );
		});

		return result;
	}
};

/**
 * Transforms JSON to HTML and appends to Body or target Element
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {object} arg JSON Object describing HTML
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.tpl = function ( arg ) {
	return array.each( this, function ( i ) {
		utility.tpl ( arg, i );
	});
};

/**
 * Toggles a CSS class
 *
 * @method tpl
 * @memberOf abaaso
 * @see {@link abaaso.utility.tpl}
 * @param  {object} arg JSON Object describing HTML
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.toggleClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.toggleClass( i, arg );
	});
};

/**
 * Removes listeners of indices
 *
 * @method un
 * @param  {string} event [Optional] Event, or Events being fired ( comma delimited supported )
 * @param  {string} id    [Optional] Listener id
 * @param  {string} state [Optional] Application state, default is current
 * @return {object} {@link abaaso.Abaaso}
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.observer.remove}
 */
Abaaso.prototype.un = function ( event, id, state ) {
	return array.each( this, function ( i ) {
		observer.remove( i, event, id, state );
	});
};

/**
 * Updates an Element
 *
 * @method update
 * @memberOf abaaso.Abaaso
 * @see {@link abaaso.element.update}
 * @param  {object} args Properties to set
 * @return {object} {@link abaaso.Abaaso}
 */
Abaaso.prototype.update = function ( arg ) {
	return array.each( this, function ( i ) {
		element.update( i, arg );
	});
};

/**
 * Gets or sets the value of indices
 *
 * @method val
 * @memberOf abaaso.Abaaso
 * @param  {mixed} arg [Optional] Value to set
 * @return {mixed} {@link abaaso.Abaaso} or Array of values
 * @see {@link abaaso.element.val}
 */
Abaaso.prototype.val = function ( arg ) {
	if ( arg === undefined ) {
		return this.map( function ( i ) {
			return element.val( i );
		});
	}
	else {
		return array.each( this, function ( i ) {
			return element.val( i, arg );
		});
	}
};

/**
 * Validates the contents of Element
 *
 * @method validate
 * @memberOf abaaso.Abaaso
 * @return {array} Array of results
 * @see {@link abaaso.element.validate}
 */
Abaaso.prototype.validate = function () {
	return this.map( function ( i ) {
		return element.validate( i );
	});
};
