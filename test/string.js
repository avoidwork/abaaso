var string = require("../lib/abaaso.js").string;

exports["capitalize"] = {
	setUp: function (done) {
		this.val = "hello world";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.capitalize(this.val), "Hello world", "Should be 'Hello world'");
		test.equal(string.capitalize(this.val, true), "Hello World", "Should be 'Hello World'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.capitalize(), "Hello world", "Should be 'Hello world'");
		test.equal(this.val.capitalize(true), "Hello World", "Should be 'Hello World'");
		test.done();
	}
};

exports["escape"] = {
	setUp: function (done) {
		this.val = "hello world! (goodbye!)";
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(string.escape(this.val), "hello\\ world!\\ \\(goodbye!\\)", "Should be 'hello\\ world!\\ \\(goodbye!\\)'");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.escape(), "hello\\ world!\\ \\(goodbye!\\)", "Should be 'hello\\ world!\\ \\(goodbye!\\)'");
		test.done();
	}
};

exports["explode"] = {
	setUp: function (done) {
		this.v1 = "123,456,789";
		this.v2 = "123 456 789";
		this.v3 = "";
		done();
	},
	direct: function (test) {
		test.expect(5);
		test.equal(string.explode(this.v1) instanceof Array, true, "Should be true");
		test.equal(string.explode(this.v1)[0] === "123", true, "Should be true");
		test.equal(string.explode(this.v2, " ") instanceof Array, true, "Should be true");
		test.equal(string.explode(this.v2, " ".escape())[0] === "123", true, "Should be true");
		test.equal(string.explode(this.v3)[0] === "", true, "Should be true");
		test.done();
	},
	sugar: function (test) {
		test.expect(5);
		test.equal(this.v1.explode() instanceof Array, true, "Should be true");
		test.equal(this.v1.explode()[0] === "123", true, "Should be true");
		test.equal(this.v2.explode(" ") instanceof Array, true, "Should be true");
		test.equal(this.v2.explode(" ")[0] === "123", true, "Should be true");
		test.equal(this.v3.explode()[0] === "", true, "Should be true");
		test.done();
	}
};

exports["hyphenate"] = {
	setUp: function (done) {
		this.val  = "hello world";
		this.val2 = "helloWorld";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.hyphenate(this.val), "hello-world", "Should be 'hello-world'");
		test.equal(string.hyphenate(this.val2, true), "hello-world", "Should be 'hello-world'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.hyphenate(), "hello-world", "Should be 'hello-world'");
		test.equal(this.val2.hyphenate(true), "hello-world", "Should be 'hello-world'");
		test.done();
	}
};

exports["isEmpty"] = {
	setUp: function (done) {
		this.val1 = "hello world";
		this.val2 = 1234;
		this.val3 = undefined;
		this.val4 = "";
		done();
	},
	direct: function (test) {
		test.expect(4);
		test.equal(string.isEmpty(this.val1), false, "Should be 'false'");
		test.throws(function () { string.isEmpty(this.val2) }, Error, "Invalid arguments");
		test.throws(function () { string.isEmpty(this.val3) }, Error, "Invalid arguments");
		test.equal(string.isEmpty(this.val4), true,  "Should be 'true'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val1.isEmpty(), false, "Should be 'false'");
		test.equal(this.val4.isEmpty(), true,  "Should be 'true'");
		test.done();
	}
};

exports["singular"] = {
	setUp: function (done) {
		this.v1 = "things";
		this.v2 = "it";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.singular(this.v1), "thing", "Should be 'thing'");
		test.equal(string.singular(this.v2), "it", "Should be 'it'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.v1.singular(), "thing", "Should be 'thing'");
		test.equal(this.v2.singular(), "it", "Should be 'it'");
		test.done();
	}
};

exports["toCamelCase"] = {
	setUp: function (done) {
		this.val1  = "hello world";
		this.val2 = "hello-world";
		this.val3 = "hello.world"
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.equal(string.toCamelCase(this.val1), "helloWorld", "Should be 'helloWorld'");
		test.equal(string.toCamelCase(this.val2), "helloWorld", "Should be 'helloWorld'");
		test.equal(string.toCamelCase(this.val3), "helloWorld", "Should be 'helloWorld'");
		test.done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal(this.val1.toCamelCase(), "helloWorld", "Should be 'helloWorld'");
		test.equal(this.val2.toCamelCase(), "helloWorld", "Should be 'helloWorld'");
		test.equal(this.val3.toCamelCase(), "helloWorld", "Should be 'helloWorld'");
		test.done();
	}
};

exports["trim"] = {
	setUp: function (done) {
		this.val = "    hello world     ";
		this.num = new Date().getFullYear();
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.trim(this.val), "hello world", "Should be 'hello world'");
		test.throws(function () { string.trim(this.num) }, Error, "Invalid arguments");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.trim(), "hello world", "Should be 'hello world'");
		test.done();
	}
};

exports["unCamelCase"] = {
	setUp: function (done) {
		this.val = "Hello world";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.unCamelCase(this.val), "hello world", "Should be 'hello world'");
		test.equal(string.unCamelCase(string.toCamelCase(this.val)), "hello world", "Should be 'hello world'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.unCamelCase(), "hello world", "Should be 'hello world'");
		test.equal(this.val.toCamelCase().unCamelCase(), "hello world", "Should be 'hello world'");
		test.done();
	}
};

exports["uncapitalize"] = {
	setUp: function (done) {
		this.val = "Hello world";
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(string.uncapitalize(this.val), "hello world", "Should be 'hello world'");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.uncapitalize(), "hello world", "Should be 'hello world'");
		test.done();
	}
};

exports["unhyphenate"] = {
	setUp: function (done) {
		this.val = "hello-world";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(string.unhyphenate(this.val), "hello world", "Should be 'hello world'");
		test.equal(string.unhyphenate(this.val, true), "Hello World", "Should be 'Hello World'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.unhyphenate(), "hello world", "Should be 'hello world'");
		test.equal(this.val.unhyphenate(true), "Hello World", "Should be 'Hello World'");
		test.done();
	}
};
