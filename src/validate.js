/**
 * @namespace abaaso.validate
 * @private
 */
var validate = {
	/**
	 * Validates args based on the type or pattern specified
	 *
	 * @method test
	 * @memberOf abaaso.validate
	 * @param  {Object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
	 * @return {Object}      Results
	 */
	test : function ( args ) {
		var exception = false,
		    invalid   = [],
		    value     = null,
		    c         = [],
		    p;

		if ( args.nodeName && args.nodeName === "FORM" ) {
			if ( string.isEmpty( args.id ) ) {
				utility.genId( args );
			}

			c = utility.dom( "#" + args.id + " input, #" + args.id + " select" );

			array.each( c, function ( i ) {
				var z = {},
				    p, v, r;

				p = regex[i.nodeName.toLowerCase()] ? regex[i.nodeName.toLowerCase()] : ( ( !string.isEmpty( i.id ) && regex[i.id.toLowerCase()] ) ? regex[i.id.toLowerCase()] : "notEmpty" );
				v = element.val( i );

				if ( v === null ) {
					v = "";
				}

				z[p] = v;
				r    = validate.test( z );

				if ( !r.pass ) {
					invalid.push( {element: i, test: p, value: v} );
					exception = true;
				}
			} );
		}
		else {
			utility.iterate( args, function ( v, k ) {
				if ( v === undefined || v === null ) {
					invalid.push( {test: k, value: v} );
					exception = true;
					return;
				}

				value = v.toString().charAt( 0 ) === "#" ? ( utility.dom( v ) ? element.val( utility.dom( v ) ) : "" ) : v;

				if ( k === "date" ) {
					if ( isNaN( new Date( value ).getYear() ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else if ( k === "domain" ) {
					if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else if ( k === "domainip" ) {
					if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) || !regex.ip.test( value ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else {
					p = regex[k] || k;

					if ( !p.test( value ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
			} );
		}

		return {pass: !exception, invalid: invalid};
	}
};
