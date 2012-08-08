var array = require("../lib/abaaso.js").abaaso.array;

exports["add"] = {
	setUp: function (done) {
		this.val = [];
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(array.add(this.val, 1).length, 1, "Should be 1");
		test.equal(array.add(this.val, 1)[0], 1, "Should be 1");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.add(1).length, 1, "Should be 1");
		test.equal(this.val.add(1)[0], 1, "Should be 1");
		test.done();
	}
};

exports["cast"] = {
	setUp: function (done) {
		this.val = {abc: true, xyz: false};
		done();
	},
	indices: function (test) {
		test.expect(2);
		test.equal(array.cast(this.val)[0], true, "Should be true");
		test.equal(array.cast(this.val)[1], false, "Should be false");
		test.done();
	},
	keys: function (test) {
		test.expect(2);
		test.equal(array.cast(this.val, true)[0], "abc", "Should be 'abc'");
		test.equal(array.cast(this.val, true)[1], "xyz", "Should be 'xyz'");
		test.done();
	}
};

exports["clone"] = {
	setUp: function (done) {
		this.val = [true, false];
		done();
	},
	"clone - direct": function (test) {
		test.expect(2);
		test.equal(array.clone(this.val)[0], true, "Should be true");
		test.equal(array.clone(this.val)[1], false, "Should be false");
		test.done();
	},
	"clone - sugar": function (test) {
		test.expect(2);
		test.equal(this.val.clone()[0], true, "Should be true");
		test.equal(this.val.clone()[1], false, "Should be false");
		test.done();
	}
};

exports["diff"] = {
	setUp: function (done) {
		this.a1 = ['abc', 'def'];
		this.a2 = ['abc', 'xyz'];
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.diff(this.a1, this.a2).length, 2, "Should be 2 differences");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.a1.diff(this.a2).length, 2, "Should be 2 differences");
		test.done();
	}
};