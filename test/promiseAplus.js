var $                  = require("../lib/abaaso.js"),
    promisesAplusTests = require("promises-aplus-tests"),
    adapter            = {};

adapter.fulfilled = function(value) {
	var promise = $.promise();
	promise.resolve(value);
	return promise;
};

adapter.rejected = function(error) {
	var promise = $.promise();
	promise.reject(error);
	return promise;
};

adapter.pending = function() {
	var promise = $.promise();

	return {
		promise: promise,
		fulfill: promise.resolve.bind(promise),
		reject: promise.reject.bind(promise)
	};
};

promisesAplusTests( adapter, function ( err ) {
    // All done; output is in the console. Or check `err` for number of failures.
});
