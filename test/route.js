var route = require("../dist/abaaso.js").route,
    path  = "/.*",
    fn    = function (arg) { return true; };

exports["enabled"] = {
	setUp: function (done) {
		route.enabled = true;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(route.enabled, true, "Should be true");
		test.done();
	}
};

exports["set"] = {
	setUp: function (done) {
		done();
	},
	all: function (test) {
		test.expect(1);
		test.equal(route.set(path, fn), true, "Should be true");
		test.done();
	},
	get: function (test) {
		test.expect(1);
		test.equal(route.set(path, fn, "get"), true, "Should be true");
		test.done();
	}
};

exports["list"] = {
	setUp: function (done) {
		this.route  = "/.*";
		done();
	},
	all: function (test) {
		test.expect(2);
		test.equal(route.list("all").contains("error"), true, "Should be true");
		test.equal(route.list("all").contains(path), true, "Should be true");
		test.done();
	},
	get: function (test) {
		test.expect(2);
		test.equal(route.list("get").contains("error"), false, "Should be false");
		test.equal(route.list("get").contains(path), true, "Should be true");
		test.done();
	}
};

exports["load"] = {
	setUp: function (done) {
		this.path = "/test"
		done();
	},
	all: function (test) {
		test.expect(1);
		test.equal(route.load(this.path), true, "Should be true");
		test.done();
	},
	get: function (test) {
		test.expect(1);
		test.equal(route.load(this.path, "get"), true, "Should be true");
		test.done();
	},
	put: function (test) {
		test.expect(3);
		test.equal(route.del(path), true, "Should be true");
		test.throws(function () { route.load(this.path, "put"); }, Error, "Invalid route");
		test.equal(route.set(path, fn), true, "Should be true");
		test.done();
	}
};

exports["del"] = {
	setUp: function (done) {
		done();
	},
	all: function (test) {
		test.expect(1);
		test.equal(route.del(path), true, "Should be true");
		test.done();
	},
	get: function (test) {
		test.expect(1);
		test.equal(route.del(path, "get"), true, "Should be true");
		test.done();
	}
};
