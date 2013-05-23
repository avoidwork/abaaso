/**
 * Cookie methods
 *
 * @class cookie
 * @namespace abaaso
 */
var cookie = {
	/**
	 * Expires a cookie if it exists
	 *
	 * @method expire
	 * @param  {String}  name   Name of the cookie to expire
	 * @param  {String}  domain [Optional] Domain to set the cookie for
	 * @param  {Boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {String}  path   [Optional] Path the cookie is for
	 * @param  {String}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {String}        Name of the expired cookie
	 */
	expire : function ( name, domain, secure, path, jar ) {
		cookie.set( name, "", "-1s", domain, secure, path, jar );
		return name;
	},

	/**
	 * Gets a cookie
	 *
	 * @method get
	 * @param  {String} name Name of the cookie to get
	 * @param  {String} jar  [Optional] Cookie jar, defaults to document.cookie
	 * @return {Mixed}       Cookie or undefined
	 */
	get : function ( name, jar ) {
		return utility.coerce( cookie.list( jar )[name] );
	},

	/**
	 * Gets the cookies for the domain
	 *
	 * @method list
	 * @param  {String} jar [Optional] Cookie jar, defaults to document.cookie
	 * @return {Object}                Collection of cookies
	 */
	list : function ( jar ) {
		jar        = jar || document.cookie;
		var result = {};

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
	 * @param  {String}  name   Name of the cookie to create
	 * @param  {String}  value  Value to set
	 * @param  {String}  offset A positive or negative integer followed by "d", "h", "m" or "s"
	 * @param  {String}  domain [Optional] Domain to set the cookie for
	 * @param  {Boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {String}  path   [Optional] Path the cookie is for
	 * @param  {String}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {Object}        The new cookie
	 */
	set : function ( name, value, offset, domain, secure, path, jar ) {
		value      = ( value || "" ) + ";"
		offset     = offset || "";
		domain     = typeof domain === "string" ? ( " domain=" + domain + ";" ) : "";
		secure     = ( secure === true ) ? "; secure" : "";
		path       = typeof path === "string" ? ( " path=" + path + ";" ) : "";
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
				throw Error( label.error.invalidArguments );
			}

			expire = new Date();

			switch ( type ) {
				case "d":
					expire.setDate( expire.getDate() + span );
					break;
				case "h":
					expire.setHours( expire.getHours() + span );
					break;
				case "m":
					expire.setMinutes( expire.getMinutes() + span );
					break;
				case "s":
					expire.setSeconds( expire.getSeconds() + span );
					break;
			}
		}

		if ( expire instanceof Date) {
			expire = " expires=" + expire.toUTCString() + ";";
		}

		if ( !server ) {
			document.cookie = ( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure );
		}
		else {
			cookies = jar.getHeader( "Set-Cookie" ) || [];
			cookies.push( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure );
			jar.setHeader( "Set-Cookie", cookies );
		}

		return cookie.get( name, jar );
	}
};
