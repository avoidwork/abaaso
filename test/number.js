var number = require("../lib/abaaso.js").number;

exports["diff"] = {
	setUp: function (done) {
		this.v1 = -1;
		this.v2 =  5;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(number.diff(this.v1, this.v2), 6, "Should be 6");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.v1.diff(this.v2), 6, "Should be 6");
		test.done();
	}
};

exports["even"] = {
	setUp: function (done) {
		this.v1 = 1;
		this.v2 = 2;
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(number.even(this.v1), false, "Should be false");
		test.equal(number.even(this.v2), true, "Should be true");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.v1.isEven(), false, "Should be false");
		test.equal(this.v2.isEven(), true, "Should be true");
		test.done();
	}
};

exports["format"] = {
	setUp: function (done) {
		this.val = 123456789;
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.equal(number.format(this.val), "123,456,789", "Should be '123,456,789'");
		test.equal(number.format(this.val, " "), "123 456 789", "Should be '123 456 789'");
		test.equal(number.format(this.val, " ", 2), "1 23 45 67 89", "Should be '1 23 45 67 89'");
		test.done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal(this.val.format(), "123,456,789", "Should be '123,456,789'");
		test.equal(this.val.format(" "), "123 456 789", "Should be '123 456 789'");
		test.equal(this.val.format(" ", 2), "1 23 45 67 89", "Should be '1 23 45 67 89'");
		test.done();
	}
};

exports["half"] = {
	setUp: function (done) {
		this.val = 10;
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(number.half(this.val), 5, "Should be 5");
		test.equal(number.half(number.half(this.val)), 2.5, "Should be 2.5");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.half(), 5, "Should be 5");
		test.equal(number.half(this.val.half()), 2.5, "Should be 2.5");
		test.done();
	}
};

exports["odd"] = {
	setUp: function (done) {
		this.v1 = 1;
		this.v2 = 2;
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(number.odd(this.v1), true, "Should be true");
		test.equal(number.odd(this.v2), false, "Should be false");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.v1.isOdd(), true, "Should be true");
		test.equal(this.v2.isOdd(), false, "Should be false");
		test.done();
	}
};

exports["parse"] = {
	setUp: function (done) {
		this.v1 = "10";
		this.v2 = "2.5";
		this.v3 = "10a";
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.equal(number.parse(this.v1), 10, "Should be 10");
		test.equal(number.parse(this.v2), 2.5, "Should be 2.5");
		test.equal(number.parse(this.v3, 10), 10, "Should be 10");
		test.done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal(this.v1.toNumber(), 10, "Should be 10");
		test.equal(this.v2.toNumber(), 2.5, "Should be 2.5");
		test.equal(this.v3.toNumber(10), 10, "Should be 10");
		test.done();
	}
};

exports["round"] = {
	setUp: function (done) {
		this.val = 2.5;
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.equal(number.round(this.val), 2, "Should be 2");
		test.equal(number.round(this.val, "down"), 2, "Should be 2");
		test.equal(number.round(this.val, "up"), 3, "Should be 3");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.roundDown(), 2, "Should be 2");
		test.equal(this.val.roundUp(), 3, "Should be 3");
		test.done();
	}
};
