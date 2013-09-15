/**
 * LRU cache factory
 *
 * @method lru
 * @memberOf abaaso
 * @param  {number} max [Optional] Max size of cache, default is 1000
 * @return {object} {@link abaaso.LRU}
 */
var lru = function ( max ) {
	return new LRU( max );
};

/**
 * Creates a new Least Recently Used cache
 *
 * @constructor
 * @memberOf abaaso
 * @param  {number} max [Optional] Max size of cache, default is 1000
 */
function LRU ( max ) {
	this.cache  = {};
	this.max    = max || 1000;
	this.first  = null;
	this.last   = null;
	this.length = 0;
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso.LRU
 * @private
 * @type {function}
 */
LRU.prototype.constructor = LRU;

/**
 * Evicts the least recently used item from cache
 *
 * @method evict
 * @memberOf abaaso.LRU
 * @return {object} {@link abaaso.LRU}
 */
LRU.prototype.evict = function () {
	if ( this.last !== null ) {
		this.remove( this.last );
	}

	return this;
};

/**
 * Gets cached item and moves it to the front
 *
 * @method get
 * @memberOf abaaso.LRU
 * @param  {string} key Item key
 * @return {object} {@link abaaso.LRUItem}
 */
LRU.prototype.get = function ( key ) {
	var item = this.cache[key];

	if ( item === undefined ) {
		return;
	}

	this.set( key, item.value );

	return item.value;
};

/**
 * Removes item from cache
 *
 * @method remove
 * @memberOf abaaso.LRU
 * @param  {string} key Item key
 * @return {object} {@link abaaso.LRUItem}
 */
LRU.prototype.remove = function ( key ) {
	var item = this.cache[ key ];

	if ( item !== undefined ) {
		delete this.cache[key];

		this.length--;

		if ( item.previous !== null ) {
			this.cache[item.previous].next = item.next;
		}

		if ( item.next !== null ) {
			this.cache[item.next].previous = item.previous;
		}

		if ( this.first === key ) {
			this.first = item.previous;
		}

		if ( this.last === key ) {
			this.last = item.next;
		}
	}

	return item;
};

/**
 * Sets item in cache as `first`
 *
 * @method set
 * @memberOf abaaso.LRU
 * @param  {string} key   Item key
 * @param  {mixed}  value Item value
 * @return {object} {@link abaaso.LRU}
 */
LRU.prototype.set = function ( key, value ) {
	var item = this.remove( key );

	if ( item === undefined ) {
		item = new LRUItem( value );
	}
	else {
		item.value = value;
	}

	item.next       = null;
	item.previous   = this.first;
	this.cache[key] = item;

	if ( this.first !== null ) {
		this.cache[this.first].next = key;
	}

	this.first = key;

	if ( this.last === null ) {
		this.last = key;
	}

	if ( ++this.length > this.max ) {
		this.evict();
	}

	return this;
};

/**
 * Creates a new LRUItem
 *
 * @constructor
 * @memberOf abaaso
 * @param {mixed} value Item value
 */
function LRUItem ( value ) {
	this.next     = null;
	this.previous = null;
	this.value    = value;
}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf abaaso.LRUItem
 * @private
 * @type {function}
 */
LRUItem.prototype.constructor = LRUItem;
