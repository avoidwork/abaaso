var promise = require("../lib/abaaso.js").promise;

exports["verify"] = {
	setUp: function (done) {
		this.outcome = "verified";
		this.handler = function (arg) { return arg; };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(5);
		test.notEqual(this.promise.then(this.handler), this.promise, "Should be a new instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(typeof this.promise.fulfilled, "function", "Should be \"function\"");
		test.equal(this.promise.error, null, "Should be null");
		test.done();
	}
};

exports["kept"] = {
	setUp: function (done) {
		this.outcome = "verified";
		this.handler = function (arg) { return arg; };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(11);
		test.notEqual(this.promise.then(this.handler), this.promise, "Should be a new instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(typeof this.promise.fulfilled, "function", "Should be \"function\"");
		test.equal(this.promise.resolve(this.outcome).status(), "fulfilled", "Should match");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.fulfilled, null, "Should match");
		test.equal(this.promise.error, null, "Should match");
		test.equal(Object.isFrozen(this.promise), true, "Should match");
		test.throws(function () { this.promise.resolve(this.outcome); }, Error, "Promise is fulfilled");
		test.done();
	}
};

exports["unkept"] = {
	setUp: function (done) {
		this.outcome = "failed";
		this.success = function (arg) { return arg; };
		this.failure = function (arg) { return arg; };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(12);
		test.notEqual(this.promise.then(this.success, this.failure), this.promise, "Should be a new instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(typeof this.promise.fulfilled, "function", "Should be \"function\"");
		test.equal(typeof this.promise.error, "function", "Should be \"function\"");
		test.equal(this.promise.reject(this.outcome).status(), this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.fulfilled, null, "Should be null");
		test.equal(this.promise.error, null, "Should be null");
		test.equal(Object.isFrozen(this.promise), true, "Should be frozen");
		test.throws(function () { this.promise.resolve(this.outcome); }, Error, "Promise is fulfilled");
		test.done();
	}
};
