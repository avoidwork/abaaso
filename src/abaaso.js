/**
 * abaaso factory
 *
 * @method factory
 * @public
 * @param  {Mixed} arg Primitive
 * @return {Mixed}     Instance of Abaaso
 */
function abaaso ( arg ) {
	return new Abaaso( arg );
};

utility.merge( abaaso, iface );

function Abaaso ( arg ) {
	var self = this;

	array.each( utility.$( arg ), function ( i ) {
		self.push( i );
	});
};

Abaaso.prototype = utility.merge( Array.prototype, prototypes.array );
Abaaso.prototype.constructor = abaaso;
