/**
 * Creates a custom Array of Elements by using `abaaso("selector")`
 *
 * @constructor
 * @memberOf abaaso
 * @param {string} query Comma delimited DOM query
 */
function Abaaso ( query ) {
	var self = this;

	if ( query && !string.isEmpty( query ) ) {
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

Abaaso.prototype.is = function ( arg ) {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.is( i, arg );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isAlphaNum = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isAlphaNum( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isBoolean = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isBoolean( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isChecked = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isChecked( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDate = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDate( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDisabled = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDisabled( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isDomain = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isDomain( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmail = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmail( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isEmpty = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isEmpty( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isHidden = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isHidden( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isIP = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isIP( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isInt = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isInt( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isNumber = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isNumber( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isPhone = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isPhone( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.isUrl = function () {
	var result = new Abaaso();

	array.each( this.filter( function ( i ) {
		return element.isUrl( i );
	}), function ( i ) {
		result.push( i );
	});

	return result;
};

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

Abaaso.prototype.limit = function ( start, offset ) {
	var result = new Abaaso();

	array.each( array.limit( this, start, offset ), function ( i ) {
		result.push( i );
	});

	return result;
};

Abaaso.prototype.listeners = function ( event ) {
	var result = [];

	array.each( this, function ( i ) {
		result.push( abaaso.listeners( i, event ) );
	});

	return result;
};

Abaaso.prototype.loading = function () {
	return array.each( this, function ( i ) {
		utility.loading( i );
	});
};

Abaaso.prototype.on = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.add( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.once = function ( event, listener, id, scope, state ) {
	return array.each( this, function ( i ) {
		observer.once( i, event, listener, id, scope || i, state );
	});
};

Abaaso.prototype.position = function () {
	var result = [];

	array.each( this, function ( i ) {
		result.push( element.position( i ) );
	});

	return result;
};

Abaaso.prototype.prepend = function ( type, args ) {
	var result = new Abaaso();

	array.each( this, function ( i ) {
		result.push( element.create( type, args, i, "first" ) );
	});

	return result;
};

Abaaso.prototype.remove = function ( start, end ) {
	return array.remove( this, start, end );
};

Abaaso.prototype.removeIf = function ( fn ) {
	return array.removeIf( this, fn );
};

Abaaso.prototype.removeWhile= function ( fn ) {
	return array.removeWhile( this, fn );
};

Abaaso.prototype.removeAttr = function ( key ) {
	return array.each( this, function ( i ) {
		element.removeAttr( i, key );
	});
};

Abaaso.prototype.removeClass= function ( arg ) {
	return array.each( this, function ( i ) {
		element.klass( i, arg, false );
	});
};

Abaaso.prototype.serialize = function ( string, encode ) {
	return this.map( function ( i ) {
		element.serialize( i, string, encode );
	});
};

Abaaso.prototype.size = function () {
	return this.map( function ( i ) {
		return element.size( i );
	});
};

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

Abaaso.prototype.tpl = function ( arg ) {
	return array.each( this, function ( i ) {
		utility.tpl ( arg, i );
	});
};

Abaaso.prototype.toggleClass = function ( arg ) {
	return array.each( this, function ( i ) {
		element.toggleClass( i, arg );
	});
};

Abaaso.prototype.un = function ( event, id, state ) {
	return array.each( this, function ( i ) {
		observer.remove( i, event, id, state );
	});
};

Abaaso.prototype.update = function ( arg ) {
	return array.each( this, function ( i ) {
		element.update( i, arg );
	});
};

Abaaso.prototype.val = function ( arg ) {
	var a    = [],
	    type = null,
	    same = true;

	array.each( this, function ( i ) {
		if ( type !== null ) {
			same = ( type === i.type );
		}

		type = i.type;

		if ( typeof i.val === "function" ) {
			a.push( element.val( i, arg ) );
		}
	});

	return same ? a[0] : a;
};

Abaaso.prototype.validate = function () {
	return this.map( function ( i ) {
		return element.validate( i );
	});
};
