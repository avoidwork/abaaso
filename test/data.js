var abaaso = require("../lib/abaaso.js"),
    data   = abaaso.data,
    sample = [];

sample.push({
	id        : "8ao7dhfga",
	firstname : "John",
	lastname  : "Doe",
	age       : 30,
	sex       : "male"
});

sample.push({
	id        : "as7d6fts3",
	firstname : "Pepsi",
	lastname  : "Coke",
	age       : 100,
	sex       : "other"
});

// Performing data.batch() "in" and "out" performs all core functions
exports["batch"] = {
	setUp: function (done) {
		this.store = data({id: "test"}, null, {key: "id"});
		done();
	},
	set: function (test) {
		test.expect(2);
		this.store.once("afterDataBatch", function () {
			test.equal(this.store.data.total, 2, "Should be 2");
			test.done();
		}, "setup", this);
		test.equal(this.store.data.batch("set", sample), this.store.data, "Should match");
	}/*,
	del: function (test) {
		test.expect(2);
		this.store.once("afterDataBatch", function () {
			test.equal(this.store.data.total, 0, "Should be 0");
			test.done();
		}, "teardown", this);
		test.equal(this.store.data.batch("delete", [0, 1]), this.store.data, "Should match");
	}*/
};

/*exports["delimited"] = {
	setUp: function (done) {
		this.id    = "test";
		this.store = {};
		done();
	},
	direct: function (test) {
		test.expect(5);
		this.id.on("afterDataBatch", function () {
			test.equal(this.store.data.get("0, 1").length, 2, "Should match");
			test.equal(this.store.data.get("0, 1")[0].key, "8ao7dhfga", "Should match");
			test.equal(this.store.data.get("0, 1")[1].key, "as7d6fts3", "Should match");
			test.equal(this.store.data.get("8ao7dhfga, as7d6fts3")[0].key, "8ao7dhfga", "Should match");
			test.equal(this.store.data.get("8ao7dhfga, as7d6fts3")[1].key, "as7d6fts3", "Should match");
			test.done();
		}, "setup", this);
		this.store = data({id: this.id}, sample, {key: "id"});
	}
};

exports["find"] = {
	setUp: function (done) {
		this.store = data({id: "test"}, null, {key: "id"});
		done();
	},
	direct: function (test) {
		test.expect(3);
		this.store.on("afterDataBatch", function () {
			test.equal(this.store.data.find("John")[0].key, "8ao7dhfga", "Should be true");
			test.equal(this.store.data.total, 2, "Should be 2");
			test.done();
		}, "setup", this);
		test.equal(this.store.data.batch("set", sample), this.store.data, "Should match");
	}
};

exports["sort"] = {
	setUp: function (done) {
		this.store = data({id: "test"}, null, {key: "id"});
		done();
	},
	direct: function (test) {
		test.expect(4);
		this.store.on("afterDataBatch", function () {
			test.equal(this.store.data.sort("lastname")[0].key, "as7d6fts3", "Should be true");
			test.equal(this.store.data.total, 2, "Should be 2");
			test.equal(this.store.data.views.lastnameCI.length, 2, "Should be 2");
			test.done();
		}, "setup", this);
		test.equal(this.store.data.batch("set", sample), this.store.data, "Should match");
	}
};

/*exports["storage"] = {
	setUp: function (done) {
		this.store = data({id: "test"}, null, {key: "id"});
		done();
	},
	direct: function (test) {
		test.expect(8);
		test.equal(this.store.data.batch("set", sample), this.store.data, "Should match");
		test.equal(this.store.data.storage(this.store.data, "set"), this.store.data, "Should match");
		test.equal(this.store.data.teardown(), this.store.data, "Should match");
		test.equal(this.store.data.total, 0, "Should be 0");
		test.equal(this.store.data.storage(this.store.data, "get"), this.store.data, "Should match");
		test.equal(this.store.data.total, 2, "Should be 2");
		test.equal(this.store.data.storage(this.store.data, "remove"), this.store.data, "Should match");
		test.equal(localStorage.getItem(this.store.id), null, "Should match");
		test.done();
	}
};

exports["teardown"] = {
	setUp: function (done) {
		this.store = data({id: "test"}, null, {key: "id"});
		done();
	},
	direct: function (test) {
		test.expect(2);
		this.store.on("afterDataBatch", function () {
			this.store.data.teardown();
		}, "setup", this);
		this.store.on("afterDataTeardown", function () {
			test.equal(this.store.data.total, 0, "Should be 0");
			test.done();
		}, "teardown", this);
		test.equal(this.store.data.batch("set", sample), this.store.data, "Should match");
	}
};
*/
