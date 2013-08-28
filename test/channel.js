var channel = require("../lib/abaaso.js").channel;

exports["put_success"] = {
	setUp: function (done) {
		this.chan = channel();
		done();
	},
	test: function (test) {
		var self = this;

		test.expect(4);
		test.equal(this.chan.queue.length, 0, "Should be '0'");
		this.chan.put(true).then(function (arg) {
			test.equal(arg[0], "continue", "Should be 'continue'");
			test.equal(arg[1], null, "Should be 'null'");
			test.equal(self.chan.queue.length, 1, "Should be '1'");
			test.done();
		});
	}
};

exports["put_failure"] = {
	setUp: function (done) {
		this.chan = channel();
		this.chan.put(false).then(function () {
			done();
		});
	},
	test: function (test) {
		var self = this;

		test.expect(4);
		test.equal(this.chan.queue.length, 1, "Should be '1'");
		this.chan.put(true).then(function (arg) {
			test.equal(arg[0], "pause", "Should be 'pause'");
			test.equal(arg[1], null, "Should be 'null'");
			test.equal(self.chan.queue.length, 1, "Should be '1'");
			test.done();
		});
	}
};

exports["take_success"] = {
	setUp: function (done) {
		this.chan = channel();
		this.chan.put(false).then(function () {
			done();
		});
	},
	test: function (test) {
		var self = this;

		test.expect(4);
		test.equal(this.chan.queue.length, 1, "Should be '1'");
		this.chan.take().then(function (arg) {
			test.equal(arg[0], "continue", "Should be 'continue'");
			test.equal(arg[1], false, "Should be 'false'");
			test.equal(self.chan.queue.length, 0, "Should be '0'");
			test.done();
		});
	}
};

exports["take_failure"] = {
	setUp: function (done) {
		this.chan = channel();
		done();
	},
	test: function (test) {
		var self = this;

		test.expect(4);
		test.equal(this.chan.queue.length, 0, "Should be '0'");
		this.chan.take().then(function (arg) {
			test.equal(arg[0], "pause", "Should be 'pause'");
			test.equal(arg[1], null, "Should be 'null'");
			test.equal(self.chan.queue.length, 0, "Should be '0'");
			test.done();
		});
	}
};
