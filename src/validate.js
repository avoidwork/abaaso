/**
 * Validation methods and patterns
 *
 * pattern.url is authored by Diego Perini
 *
 * @class validate
 * @namespace abaaso
 */
var validate = {
	/**
	 * Validates args based on the type or pattern specified
	 *
	 * @method test
	 * @param  {Object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
	 * @return {Object}      Results
	 */
	test : function ( args ) {
		var exception = false,
		    invalid   = [],
		    tracked   = {},
		    value     = null,
		    result    = [],
		    c         = [],
		    inputs    = [],
		    selects   = [],
		    i, p, o, x, nth;

		if ( args.nodeName !== undefined && args.nodeName === "FORM" ) {
			if ( string.isEmpty( args.id ) ) {
				utility.genId( args );
			}

			c = $( "#" + args.id + " input", "#" + args.id + " select" );

			array.each( c, function ( i ) {
				var z = {},
				    p, v, r;

				p = regex[i.nodeName.toLowerCase()] ? regex[i.nodeName.toLowerCase()] : ( ( !string.isEmpty( i.id ) && regex[i.id.toLowerCase()] ) ? regex[i.id.toLowerCase()] : "notEmpty" );
				v = i.val();

				if ( v === null ) v = "";

				z[p] = v;
				r    = validate.test( z )

				if ( !r.pass ) {
					invalid.push( {element: i, test: p, value: v} );
					exception = true;
				}
			});
		}
		else {
			utility.iterate( args, function ( i, k ) {
				if ( k === undefined || i === undefined ) {
					invalid.push( {test: k, value: i} );
					exception = true;

					return
				}

				value = i.toString().charAt( 0 ) === "#" ? ( $( i ) !== undefined ? $( i ).val() : "" ) : i;

				switch ( k ) {
					case "date":
						if ( isNaN( new Date( value ).getYear() ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					case "domain":
						if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					case "domainip":
						if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) || !regex.ip.test( value ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					default:
						p = regex[k] || k;

						if ( !p.test( value ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
				}
			});
		}

		return {pass: !exception, invalid: invalid};
	}
};
