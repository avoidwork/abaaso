/**
 * Labels for localization
 *
 * Override this with another language pack
 *
 * @class label
 * @namespace abaaso
 */
var label = {
	// Common labels
	common : {
		back    : "Back",
		cancel  : "Cancel",
		clear   : "Clear",
		close   : "Close",
		cont    : "Continue",
		create	: "Create",
		del     : "Delete",
		edit    : "Edit",
		find    : "Find",
		gen     : "Generate",
		go      : "Go",
		loading : "Loading",
		next    : "Next",
		login   : "Login",
		ran     : "Random",
		reset   : "Reset",
		save    : "Save",
		search  : "Search",
		submit  : "Submit"
	},

	// Days of the week
	day : {
		0 : "Sunday",
		1 : "Monday",
		2 : "Tuesday",
		3 : "Wednesday",
		4 : "Thursday",
		5 : "Friday",
		6 : "Saturday"
	},

	// Error messages
	error : {
		databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
		databaseNotSupported  : "Client does not support local database storage",
		databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
		elementNotCreated     : "Could not create the Element",
		elementNotFound       : "Could not find the Element",
		expectedArray         : "Expected an Array",
		expectedArrayObject   : "Expected an Array or Object",
		expectedBoolean       : "Expected a Boolean value",
		expectedNumber        : "Expected a Number",
		expectedProperty      : "Expected a property, and it was not set",
		expectedObject        : "Expected an Object",
		invalidArguments      : "One or more arguments is invalid",
		invalidDate           : "Invalid Date",
		invalidFields         : "The following required fields are invalid: ",
		invalidRoute          : "The route could not be found",
		notAvailable          : "Requested method is not available",
		notSupported          : "This feature is not supported by this platform",
		propertyNotFound      : "Could not find the requested property",
		promisePending        : "The promise cannot be resolved while pending result",
		promiseResolved       : "The promise has been resolved: {{outcome}}",
		serverError           : "Server error has occurred",
		serverForbidden       : "Forbidden to access URI",
		serverInvalidMethod   : "Method not allowed",
		serverUnauthorized    : "Authorization required to access URI"
	},

	// Months of the Year
	month : {
		0  : "January",
		1  : "February",
		2  : "March",
		3  : "April",
		4  : "May",
		5  : "June",
		6  : "July",
		7  : "August",
		8  : "September",
		9  : "October",
		10 : "November",
		11 : "December"
	}
};
