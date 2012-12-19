var $      = require("../lib/abaaso.js"),
    sample = {};

sample.obj   = {id: "test"};
sample.event = "custom";
sample.fn    = function () { void(0); };
sample.id    = "handler";
sample.scope = sample.obj;
sample.state = "all";

exports["on"] = {
	setUp: function (done) {
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.throws(function () { $.on(sample.obj, undefined, sample.fn, sample.id, sample.scope, sample.state); }, Error, "Event is undefined");
		test.throws(function () { $.on(sample.obj, sample.event, undefined, sample.id, sample.scope, sample.state); }, Error, "Handler is not a function");
		test.equal($.on(sample.obj, sample.event, sample.fn, sample.id, sample.scope, sample.state), sample.obj, "Should match");
		test.done();
	}
};

exports["list"] = {
	setUp: function (done) {
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal($.listeners("invalid", sample.event).hasOwnProperty(sample.state), false, "Should be false");
		test.equal($.listeners(sample.obj, sample.event).hasOwnProperty(sample.state), true, "Should be true");
		test.done();
	}
};

exports["fire"] = {
	setUp: function (done) {
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal($.fire(sample.obj, sample.event), sample.obj, "Should match");
		test.done();
	}
};

exports["un"] = {
	setUp: function (done) {
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal($.un(sample.obj, sample.event, sample.id, sample.state), sample.obj, "Should match");
		test.done();
	}
};

exports["once"] = {
	setUp: function (done) {
		done();
	},
	direct: function (test) {
		test.expect(5);
		test.throws(function () { $.once(sample.obj, undefined, sample.fn, sample.id, sample.scope, sample.state); }, Error, "Event is undefined");
		test.throws(function () { $.once(sample.obj, sample.event, undefined, sample.id, sample.scope, sample.state); }, Error, "Handler is not a function");
		test.equal($.once(sample.obj, sample.event, sample.fn, sample.id, sample.scope, sample.state), sample.obj, "Should match");
		test.equal($.fire(sample.obj, sample.event), sample.obj, "Should match");
		test.equal($.listeners(sample.obj, sample.event)[sample.state].hasOwnProperty(sample.id), false, "Should be false");
		test.done();
	}
};
