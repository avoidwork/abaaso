var json = require("../lib/abaaso.js").json,
    data = [{name: "John Doe"}, {name: "Josh Davis"}];

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

exports["csv_array1"] = {
	setUp: function (done) {
		this.data = data;
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof json.csv(this.data), "string", "Should be `string`");
		test.equal(json.csv(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(json.csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(json.csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(json.csv(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};

exports["csv_array2"] = {
	setUp: function (done) {
		this.data   = [1,2,3,4,5];
		this.result = "\"" + this.data.toString() + "\"";
		done();
	},
	test: function (test) {
		test.expect(3);
		test.equal(typeof json.csv(this.data), "string", "Should be `string`");
		test.equal(json.csv(this.data).split("\n").length, 1, "Should be `1`");
		test.equal(json.csv(this.data), this.result, "Should be `" + this.result + "`");
		test.done();
	}
};

exports["csv_object"] = {
	setUp: function (done) {
		this.data = data[0];
		done();
	},
	test: function (test) {
		test.expect(4);
		test.equal(typeof json.csv(this.data), "string", "Should be `string`");
		test.equal(json.csv(this.data).split("\n").length, 2, "Should be `2`");
		test.equal(json.csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(json.csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.done();
	}
};

exports["csv_json"] = {
	setUp: function (done) {
		this.data = JSON.stringify(data);
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof json.csv(this.data), "string", "Should be `string`");
		test.equal(json.csv(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(json.csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(json.csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(json.csv(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};