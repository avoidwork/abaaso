/**
 * Using sugar because it returns a boolean which is easy to validate
 * Note: whitespace is trimmed before testing
 */
var validate = require("../lib/abaaso.js").abaaso.validate;

exports["alphanum"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(5);
		test.equal("asdf".isAlphaNum(), true, "Should be true");
		test.equal("12421".isAlphaNum(), true, "Should be true");
		test.equal("as23423df".isAlphaNum(), true, "Should be true");
		test.equal("".isAlphaNum(), false, "Should be false");
		test.equal("]".isAlphaNum(), false, "Should be false");
		test.done();
	}
};

exports["boolean"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal("true".isBoolean(), true, "Should be true");
		test.equal("abc".isBoolean(), false, "Should be false");
		test.done();
	}
};

exports["date"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal("2012/08/08".isDate(), true, "Should be true");
		test.equal("2012-08-08".isDate(), true, "Should be true");
		test.equal("abc".isBoolean(), false, "Should be false");
		test.done();
	}
};

exports["domain"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(4);
		test.equal("google.com".isDomain(), true, "Should be true");
		test.equal("www.google.com".isDomain(), true, "Should be true");
		test.equal("www.www.google.com".isDomain(), true, "Should be true");
		test.equal("abc".isDomain(), false, "Should be false"); // possible with dns, not valid as a tld
		test.done();
	}
};

exports["email"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(6);
		test.equal("a@b".isEmail(), true, "Should be true");
		test.equal("a@b.c".isEmail(), true, "Should be true");
		test.equal("a-b@c".isEmail(), true, "Should be true");
		test.equal("a-b@c.d".isEmail(), true, "Should be true");
		test.equal("a-b@c.d.e".isEmail(), true, "Should be true");
		test.equal("a@b@c".isEmail(), false, "Should be false"); // technically valid, but not supported by native browser validation
		test.done();
	}
};

exports["empty"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal("".isEmpty(), true, "Should be true");
		test.equal(" ".isEmpty(), true, "Should be true");
		test.equal("x".isEmpty(), false, "Should be false");
		test.done();
	}
};

exports["ip"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal("".isIP(), false, "Should be false");
		test.equal("260.0.0.1".isIP(), false, "Should be false");
		test.equal("10.0.0.1".isIP(), true, "Should be true");
		test.done();
	}
};

exports["integer"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(4);
		test.equal("".isInt(), false, "Should be false");
		test.equal("abc".isInt(), false, "Should be false");
		test.equal("10.5".isInt(), false, "Should be false");
		test.equal("10".isInt(), true, "Should be true");
		test.done();
	}
};

exports["number"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(4);
		test.equal("".isNumber(), false, "Should be false");
		test.equal("abc".isNumber(), false, "Should be false");
		test.equal("10.5".isNumber(), true, "Should be true");
		test.equal("10".isNumber(), true, "Should be true");
		test.done();
	}
};

// testing north american standard (can be overwritten)
exports["phone"] = {
	setUp: function (done) {
		done();
	},
	sugar: function (test) {
		test.expect(5);
		test.equal("".isPhone(), false, "Should be false");
		test.equal("abc".isPhone(), false, "Should be false");
		test.equal("456-8900".isPhone(), true, "Should be true");
		test.equal("123-456-8900".isPhone(), true, "Should be true");
		test.equal("1-123-456-8900".isPhone(), true, "Should be true");
		test.done();
	}
};
