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
		test.equal(this.promise.state, "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfill.length, 1, "Should be \"1\"");
		test.equal(this.promise.error.length, 0, "Should be \"0\"");
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
		test.equal(this.promise.state, "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfill.length, 1, "Should be \"1\"");
		test.equal(this.promise.resolve(this.outcome).state, "fulfilled", "Should match");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.fulfill.length, 0, "Should match");
		test.equal(this.promise.error.length, 0, "Should be \"0\"");
		test.equal(Object.isFrozen(this.promise), true, "Should match");
		test.throws(function () { this.promise.resolve(this.outcome); }, Error, "Promise is fulfilled");
		test.done();
	}
};

exports["unkept"] = {
	setUp: function (done) {
		this.outcome = "failed";
		this.success = function (arg) { return arg; };
		this.failure = function (arg) { throw Error(arg); };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(12);
		test.notEqual(this.promise.then(this.success, this.failure), this.promise, "Should be a new instance");
		test.equal(this.promise.state, "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfill.length, 1, "Should be \"1\"");
		test.equal(typeof this.promise.error[0], "function", "Should be \"function\"");
		test.equal(this.promise.reject(this.outcome).state, this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.fulfill.length, 0, "Should be \"0\"");
		test.equal(this.promise.error.length, 0, "Should be \"0\"");
		test.equal(Object.isFrozen(this.promise), true, "Should be frozen");
		test.throws(function () { this.promise.resolve(this.outcome); }, Error, "Promise is fulfilled");
		test.done();
	}
};
