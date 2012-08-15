var array = require("../lib/abaaso.js").array;

exports["add"] = {
	setUp: function (done) {
		this.val = [0];
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(array.add(this.val, 0).length, 1, "Should be 1");
		test.equal(array.add(this.val, 1).length, 2, "Should be 2");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.add(0).length, 1, "Should be 1");
		test.equal(this.val.add(1).length, 2, "Should be 2");
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
	direct: function (test) {
		test.expect(2);
		test.equal(array.clone(this.val)[0], true, "Should be true");
		test.equal(array.clone(this.val)[1], false, "Should be false");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.clone()[0], true, "Should be true");
		test.equal(this.val.clone()[1], false, "Should be false");
		test.done();
	}
};

exports["diff"] = {
	setUp: function (done) {
		this.a1 = ["abc", "def"];
		this.a2 = ["abc", "xyz"];
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

exports["each"] = {
	setUp: function (done) {
		this.val = ["abc"];
		self     = this;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.each(this.val, function (i, idx) { self.val[idx] = "blah"; })[0], "blah", "Should be 'blah'");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.each(function (i, idx) { self.val[idx] = "blah"; })[0], "blah", "Should be 'blah'");
		test.done();
	}
};

exports["first"] = {
	setUp: function (done) {
		this.val = ["abc"];
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.first(this.val), "abc", "Should be 'abc'");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.first(), "abc", "Should be 'abc'");
		test.done();
	}
};

exports["index"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(array.index(this.val, "abc"), 0, "Should be 0");
		test.equal(array.index(this.val, "xyz"), 1, "Should be 1");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.index("abc"), 0, "Should be 0");
		test.equal(this.val.index("xyz"), 1, "Should be 1");
		test.done();
	}
};

exports["indexed"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		this.val.someProperty      = true;
		this.val.someOtherProperty = true;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.indexed(this.val).length, 4, "Should be 4");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.indexed().length, 4, "Should be 4");
		test.done();
	}
};

exports["intersect"] = {
	setUp: function (done) {
		this.a1 = ["abc", "def"];
		this.a2 = ["abc", "xyz"];
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.intersect(this.a1, this.a2).length, 1, "Should be 1 match");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.a1.intersect(this.a2).length, 1, "Should be 1 match");
		test.done();
	}
};

exports["keys"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		this.val.someProperty      = true;
		this.val.someOtherProperty = true;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.keys(this.val).length, 4, "Should be 4");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.keys().length, 4, "Should be 4");
		test.done();
	}
};

exports["last"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.last(this.val), "xyz", "Should be 'xyz'");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.last(), "xyz", "Should be 'xyz'");
		test.done();
	}
};

exports["range"] = {
	setUp: function (done) {
		this.val = ["a", "b", "c", "d", "e"];
		done();
	},
	direct: function (test) {
		test.expect(3);
		test.equal(array.range(this.val, 3, 4).length, 2, "Should be 2");
		test.equal(array.range(this.val, 3, 4)[0], "d", "Should be 'd'");
		test.equal(array.range(this.val, 3, 4)[1], "e", "Should be 'e'");
		test.done();
	},
	sugar: function (test) {
		test.expect(3);
		test.equal(this.val.range(3, 4).length, 2, "Should be 2");
		test.equal(this.val.range(3, 4)[0], "d", "Should be 'd'");
		test.equal(this.val.range(3, 4)[1], "e", "Should be 'e'");
		test.done();
	}
};

exports["remove"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		done();
	},
	direct: function (test) {
		test.expect(4);
		test.equal(array.remove(this.val.clone(), 0).length, 1, "Should be 1");
		test.equal(array.remove(this.val.clone(), 1).length, 1, "Should be 1");
		test.equal(array.remove(this.val.clone(), "abc").length, 1, "Should be 'xyz'");
		test.equal(array.remove(this.val.clone(), "xyz").length, 1, "Should be 'abc'");
		test.done();
	},
	sugar: function (test) {
		test.expect(4);
		test.equal(this.val.clone().remove(0).length, 1, "Should be 1");
		test.equal(this.val.clone().remove(1).length, 1, "Should be 1");
		test.equal(this.val.clone().remove("abc")[0], "xyz", "Should be 'xyz'");
		test.equal(this.val.clone().remove("xyz")[0], "abc", "Should be 'abc'");
		test.done();
	}
};

exports["sort"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz", "A", "d", 123];
		done();
	},
	direct: function (test) {
		test.expect(5);
		test.equal(this.val.sort(array.sort)[0], 123, "Should be 123");
		test.equal(this.val[1], "A", "Should be 'A'");
		test.equal(this.val[2], "abc", "Should be 'abc'");
		test.equal(this.val[3], "d", "Should be 'd'");
		test.equal(this.val[4], "xyz", "Should be 'xyz'");
		test.done();
	}
};

exports["total"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz"];
		this.val.someProperty      = true;
		this.val.someOtherProperty = true;
		done();
	},
	direct: function (test) {
		test.expect(1);
		test.equal(array.total(this.val), 4, "Should be 4");
		test.done();
	},
	sugar: function (test) {
		test.expect(1);
		test.equal(this.val.total(), 4, "Should be 4");
		test.done();
	}
};

exports["toObject"] = {
	setUp: function (done) {
		this.val = ["abc", "xyz", "A", "d", 123];
		done();
	},
	direct: function (test) {
		test.expect(2);
		test.equal(array.toObject(this.val) instanceof Object, true, "Should be true");
		test.equal(this.val["0"], "abc", "Should be 'abc'");
		test.done();
	},
	sugar: function (test) {
		test.expect(2);
		test.equal(this.val.toObject() instanceof Object, true, "Should be true");
		test.equal(this.val["0"], "abc", "Should be 'abc'");
		test.done();
	}
};