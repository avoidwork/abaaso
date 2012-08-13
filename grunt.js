module.exports = function (grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			banner : "/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.homepage %> */"
		},
		test : {
			files : ["test/**/*.js"]
		},
		lint : {
			files : ["grunt.js"]
		},
		watch : {
			files : "<config:lint.files>",
			tasks : "default"
		},
		jshint : {
			options : {
				curly   : true,
				eqeqeq  : true,
				immed   : true,
				latedef : true,
				newcap  : true,
				noarg   : true,
				sub     : true,
				undef   : true,
				boss    : true,
				eqnull  : true,
				node    : true
			},
			globals: {
			  exports : true
			}
		},
		min : {
			"dist/abaaso.min.js": [ "<banner>", "src/abaaso.js" ]
		}
	});

	grunt.registerTask("default", "lint test");
};