/**
 * Cookie methods
 *
 * @namespace abaaso.cookie
 */
var cookie = {
	/**
	 * Expires a cookie if it exists
	 *
	 * @method expire
	 * @memberOf abaaso.cookie
	 * @param  {string}  name   Name of the cookie to expire
	 * @param  {string}  domain [Optional] Domain to set the cookie for
	 * @param  {boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {string}  path   [Optional] Path the cookie is for
	 * @param  {string}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {string}        Name of the expired cookie
	 */
	expire : function ( name, domain, secure, path, jar ) {
		cookie.set( name, "", "-1s", domain, secure, path, jar );
		return name;
	},

	/**
	 * Gets a cookie
	 *
	 * @method get
	 * @memberOf abaaso.cookie
	 * @param  {string} name Name of the cookie to get
	 * @param  {string} jar  [Optional] Cookie jar, defaults to document.cookie
	 * @return {mixed}       Cookie or undefined
	 */
	get : function ( name, jar ) {
		return utility.coerce( cookie.list( jar )[name] );
	},

	/**
	 * Gets the cookies for the domain
	 *
	 * @method list
	 * @memberOf abaaso.cookie
	 * @param  {string} jar [Optional] Cookie jar, defaults to document.cookie
	 * @return {object}                Collection of cookies
	 */
	list : function ( jar ) {
		var result = {};

		if ( jar === undefined ) {
			jar = server ? "" : document.cookie;
		}

		if ( !string.isEmpty( jar ) ) {
			array.each( string.explode( jar, ";" ), function ( i ) {
				var item = string.explode( i, "=" );

				result[decodeURIComponent( item[0] )] = utility.coerce( decodeURIComponent( item[1] ) );
			});
		}

		return result;
	},

	/**
	 * Creates a cookie
	 *
	 * The offset specifies a positive or negative span of time as day, hour, minute or second
	 *
	 * @method set
	 * @memberOf abaaso.cookie
	 * @param  {string}  name   Name of the cookie to create
	 * @param  {string}  value  Value to set
	 * @param  {string}  offset A positive or negative integer followed by "d", "h", "m" or "s"
	 * @param  {string}  domain [Optional] Domain to set the cookie for
	 * @param  {boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {string}  path   [Optional] Path the cookie is for
	 * @param  {string}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {undefined}      undefined
	 */
	set : function ( name, value, offset, domain, secure, path, jar ) {
		value      = ( value || "" ) + ";";
		offset     = offset || "";
		domain     = typeof domain === "string" ? ( " Domain=" + domain + ";" ) : "";
		secure     = ( secure === true ) ? " secure" : "";
		path       = typeof path === "string" ? ( " Path=" + path + ";" ) : "";
		var expire = "",
		    span   = null,
		    type   = null,
		    types  = ["d", "h", "m", "s"],
		    regex  = new RegExp(),
		    i      = types.length,
		    cookies;

		if ( !string.isEmpty( offset ) ) {
			while ( i-- ) {
				utility.compile( regex, types[i] );

				if ( regex.test( offset ) ) {
					type = types[i];
					span = number.parse( offset, 10 );
					break;
				}
			}

			if ( isNaN( span ) ) {
				throw new Error( label.error.invalidArguments );
			}

			expire = new Date();

			if ( type === "d" ) {
				expire.setDate( expire.getDate() + span );
			}
			else if ( type === "h" ) {
				expire.setHours( expire.getHours() + span );
			}
			else if ( type === "m" ) {
				expire.setMinutes( expire.getMinutes() + span );
			}
			else if ( type === "s" ) {
				expire.setSeconds( expire.getSeconds() + span );
			}
		}

		if ( expire instanceof Date) {
			expire = " Expires=" + expire.toUTCString() + ";";
		}

		if ( !server ) {
			document.cookie = ( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure );
		}
		else {
			cookies = jar.getHeader( "Set-Cookie" ) || [];
			cookies.push( ( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure ).replace( /;$/, "" ) );
			jar.setHeader( "Set-Cookie", cookies );
		}
	}
};
