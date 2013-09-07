/**
 * Channel factory
 *
 * @method channel
 * @return {Object} Channel instance
 */
var channel = function () {
	return new Channel();
};

/**
 * Channel
 *
 * @constructor
 * @return {Object} Channel instance
 */
function Channel () {
	this.queue = [];
}

// Setting constructor loop
Channel.prototype.constructor = Channel;

/**
 * Puts an item into the Channel
 *
 * @method put
 * @param  {Mixed} arg Item
 * @return {Object}     Deferred instance
 */
Channel.prototype.put = function ( arg ) {
	var defer = deferred();

	if ( this.queue.length === 0 ) {
		this.queue.push( arg );

		defer.resolve( ["continue", null] );
	}
	else {
		defer.resolve( ["pause", null] );
	}

	return defer;
};

/**
 * Takes an item from the Channel
 *
 * @method take
 * @return {Object} Deferred instance
 */
Channel.prototype.take = function () {
	var defer = deferred();

	if ( this.queue.length === 0 ) {
		defer.resolve( ["pause", null] );
	}
	else {
		defer.resolve( ["continue", this.queue.pop()] );
	}

	return defer;
};
