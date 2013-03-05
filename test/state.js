var state   = require("../lib/abaaso.js").state,
    initial = "active",
    empty   = null;

exports["current"] = {
	setUp: function (done) {
		done();
	},
	test: function (test) {
		test.expect(1);
		test.equal(state.current, initial, "Should be '" + initial + "'");
		test.done();
	}
};

exports["previous"] = {
	setUp: function (done) {
		this.val = "new"
		done();
	},
	test: function (test) {
		test.expect(3);
		test.equal(state.previous, empty, "Should be '" + empty + "'");
		test.equal(state.current = this.val, this.val, "Should be '" + this.val + "'");
		test.equal(state.previous, initial, "Should be '" + initial + "'");
		test.done();
	}
};

exports["header"] = {
	setUp: function (done) {
		this.val = "x-state";
		done();
	},
	test: function (test) {
		test.expect(3);
		test.equal(state.header, empty, "Should be '" + empty + "'");
		test.equal(state.header = this.val, this.val, "Should be '" + this.val + "'");
		test.equal(state.header, this.val, "Should be '" + this.val + "'");
		test.done();
	}
};
