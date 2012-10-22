var promise = require("../lib/abaaso.js").promise;

exports["verify"] = {
	setUp: function (done) {
		this.outcome = "verified";
		this.handler = function (arg) { return arg; };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(4);
		test.equal(this.promise.when(this.handler), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unresolved", "Should be \"unresolved\"");
		test.equal(this.promise.waiting.length, 1, "Should be 1");
		test.equal(this.promise.failed.length, 0, "Should be 0");
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
		test.expect(7);
		test.equal(this.promise.when(this.handler), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unresolved", "Should be \"unresolved\"");
		test.equal(this.promise.waiting.length, 1, "Should be 1");
		test.equal(this.promise.fulfill(this.outcome).status(), "fulfilled", "Should match");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.waiting, null, "Should match");
		test.equal(this.promise.failed, null, "Should match");
		test.done();
	}
};

exports["unkept"] = {
	setUp: function (done) {
		this.outcome = "smashed";
		this.success = function (arg) { return arg; };
		this.failure = function (arg) { return arg; };
		this.promise = promise();
		done();
	},
	test: function (test) {
		test.expect(8);
		test.equal(this.promise.when(this.success, this.failure), this.promise, "Should be instance");
		test.equal(this.promise.status(), "unresolved", "Should be \"unresolved\"");
		test.equal(this.promise.waiting.length, 1, "Should be 1");
		test.equal(this.promise.failed.length, 1, "Should be 1");
		test.equal(this.promise.smash(this.outcome).status(), this.outcome, "Should match");
		test.equal(this.promise.outcome, this.outcome, "Should match");
		test.equal(this.promise.waiting, null, "Should match");
		test.equal(this.promise.failed, null, "Should match");
		test.done();
	}
};
