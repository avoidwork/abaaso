var $     = require( "../lib/abaaso" ),
    data  = [],
    i     = -1, store, s;

console.log( "Preparing 100,000 records");

while ( ++i < 100000 ) {
	data.push( {uuid: $.uuid(), name: "abc" + i, exits: parseInt( ( i *.3 ).toFixed( 0 ), 10), value: i} );
}
 
store = $.data({id: "test"}, data, {events: false, key: "uuid"}).data
console.log( "DataStore.sort() benchmark - Sorting " + store.total.format() + " records" );

s = new Date();
store.records.sort( function ( a, b ) {
	var r1f1 = a.data.exits,
	    r2f1 = b.data.exits;

	if ( r1f1 < r2f1 ) {
		return 1;
	}
	else if ( r1f1 === r2f1 ) {
		return 0
	}
	else if ( r1f1 > r2f1 ) {
		return -1;
	}
} );
console.log( "1 field in " + (new Date() - s).format() + "ms (native)" );

s = new Date();
store.records.sort( function ( a, b ) {
	var r1f1 = a.data.exits,
	    r2f1 = b.data.exits,
	    r1f2 = a.data.name,
	    r2f2 = b.data.name;

	if ( r1f1 < r2f1 ) {
		return 1;
	}
	else if (( r1f1 > r2f1 ) || ( r1f2 > r2f2)) {
		return -1;
	}
	else {
		return 0;
	}
} );
console.log( "2 field in " + (new Date() - s).format() + "ms (native)" );

s = new Date();
store.sort( "exits desc" );
console.log( "1 field in " + (new Date() - s).format() + "ms" );

s = new Date();
store.sort( "exits desc, name" );
console.log( "2 fields in " + (new Date() - s).format() + "ms" );

s = new Date();
store.sort( "value desc, exits desc, name" );
console.log( "3 fields in " + (new Date() - s).format() + "ms" );

process.exit(0);
