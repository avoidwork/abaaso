/**
 * Message handler
 *
 * @method onmessage
 * @param  {Object} ev Event
 * @return {Undefined} undefined
 */
onmessage = function ( ev ) {
	var cmd = ev.data.cmd,
	    result, where;

	if ( cmd === "find" ) {

	}
	else if ( cmd === "join" ) {
		
	}
	else if ( cmd === "select" ) {
		where = JSON.parse( ev.data.where );

		array.each( ev.data.functions, function ( i ) {
			var args = where[i].match( /\((.*)\)/ )[1],
			    body = where[i].match( /\{(.*)\}/ )[1];

			where[i] = Function.apply( Function, string.explode( args ).concat( [body] ) );
		});

		result = ev.data.records.filter( function ( rec ) {
			var match = true;

			utility.iterate( where, function ( v, k ) {
				var type = typeof v;

				if ( type !== "function" && rec.data[k] !== v ) {
					return ( match = false );
				}
				else if ( type === "function" && !v( rec.data[k], rec ) ) {
					return ( match = false );
				}
			});

			return match;
		});
	}
	else if ( cmd === "sort" ) {
		result = array.keySort( ev.data.records, ev.data.query, "data" );
	}

	postMessage( result );
};
