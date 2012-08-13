var json = require("../dist/abaaso.js").json;

exports["decode"] = {
	setUp: function (done) {
		this.val = "{\"abc\":true}";
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(json.decode(this.val) instanceof Object, true, "Should be true");
		test.equal(json.decode(this.val)["abc"], true, "Should be true");
		test.done();
	}
};

exports["encode"] = {
	setUp: function (done) {
		this.val = {abc:true};
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(typeof json.encode(this.val) === "string", true, "Should be true");
		test.done();
	}
};