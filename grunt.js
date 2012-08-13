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
		concat: {
			dist: {
				src : [
					"src/intro.js",
					"src/array.js",
					"src/cache.js",
					"src/client.js",
					"src/cookie.js",
					"src/data.js",
					"src/element.js",
					"src/json.js",
					"src/label.js",
					"src/message.js",
					"src/mouse.js",
					"src/number.js",
					"src/observer.js",
					"src/route.js",
					"src/string.js",
					"src/utility.js",
					"src/validate.js",
					"src/xml.js",
					"src/bootstrap.js",
					"src/outro.js"
				],
				dest : "dist/abaaso.js"
			}
		},
		min : {
			"dist/abaaso.min.js": [ "<banner>", "dist/abaaso.js" ]
		}
	});

	grunt.registerTask("default", "lint test");
};