var $     = require("../lib/abaaso"),
    data  = require("./datastore_data"),
    store = $.data({id: "test"}, data, {events: false, key: "uuid"}).data,
    s;

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
store.sort( "exits desc" );
console.log( "1 field in " + (new Date() - s).format() + "ms" );

s = new Date();
store.sort( "exits desc, name" );
console.log( "2 fields in " + (new Date() - s).format() + "ms" );

s = new Date();
store.sort( "value desc, exits desc, name" );
console.log( "3 fields in " + (new Date() - s).format() + "ms" );

process.exit(0);
