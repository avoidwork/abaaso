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
		test.equal(this.promise.then(this.handler), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfilled.length, 1, "Should be 1");
		test.equal(this.promise.error.length, 0, "Should be 0");
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
		test.expect(9);
		test.equal(this.promise.then(this.handler), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfilled.length, 1, "Should be 1");
		test.equal(this.promise.done(this.outcome).status(), "fulfilled", "Should match");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.fulfilled, null, "Should match");
		test.equal(this.promise.error, null, "Should match");
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
		test.expect(10);
		test.equal(this.promise.then(this.success, this.failure), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unfulfilled", "Should be \"unfulfilled\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfilled.length, 1, "Should be 1");
		test.equal(this.promise.error.length, 1, "Should be 1");
		test.equal(this.promise.reject(this.outcome).status(), this.outcome, "Should match");
		test.equal(this.promise.resolved(), true, "Should be true");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.fulfilled, null, "Should match");
		test.equal(this.promise.error, null, "Should match");
		test.done();
	}
};
