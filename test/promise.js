var promise = require("../lib/abaaso.js").promise,
    delay;

delay = ( function () {
	if ( typeof setImmediate !== "undefined" ) {
		return setImmediate;
	}
	else {
		return process.nextTick;
	}
})();

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
		test.equal(this.promise.state, "pending", "Should be \"pending\"");
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
		var self = this;

		test.expect(10);
		test.notEqual(this.promise.then(this.handler), this.promise, "Should be a new instance");
		test.equal(this.promise.state, "pending", "Should be \"pending\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfill.length, 1, "Should be \"1\"");
		test.equal(this.promise.resolve(this.outcome), this.promise, "Should match");
		delay(function () {
			test.equal(self.promise.outcome, self.outcome, "Should match");
			test.equal(self.promise.resolved(), true, "Should be true");
			test.equal(self.promise.fulfill.length, 0, "Should match");
			test.equal(self.promise.error.length, 0, "Should be \"0\"");
			test.equal(Object.isFrozen(self.promise), true, "Should match");
			test.done();
		});
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
		var self = this;

		test.expect(11);
		test.notEqual(this.promise.then(this.success, this.failure), this.promise, "Should be a new instance");
		test.equal(this.promise.state, "pending", "Should be \"pending\"");
		test.equal(this.promise.resolved(), false, "Should be false");
		test.equal(this.promise.fulfill.length, 1, "Should be \"1\"");
		test.equal(typeof this.promise.error[0], "function", "Should be \"function\"");
		test.equal(this.promise.reject(this.outcome), this.promise, "Should match");
		delay(function () {
			test.equal(self.promise.resolved(), true, "Should be true");
			test.equal(self.promise.outcome, self.outcome, "Should match");
			test.equal(self.promise.fulfill.length, 0, "Should be \"0\"");
			test.equal(self.promise.error.length, 0, "Should be \"0\"");
			test.equal(Object.isFrozen(self.promise), true, "Should be frozen");
			test.done();
		});
	}
};
