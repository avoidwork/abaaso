module.exports = function (grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
        	banner : "/**\n" + 
        	         " * <%= pkg.name %>\n" +
        	         " *\n" +
        	         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
        	         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        	         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
        	         " * @link <%= pkg.homepage %>\n" +
        	         " * @module <%= pkg.name %>\n" +
        	         " * @version <%= pkg.version %>\n" +
        	         " */"
		},
		concat: {
			dist: {
				src : [
					"<banner>",
					"src/intro.js",
					"src/array.js",
					"src/cache.js",
					"src/client.js",
					"src/cookie.js",
					"src/data.js",
					"src/datalist.js",
					"src/element.js",
					"src/filter.js",
					"src/json.js",
					"src/label.js",
					"src/message.js",
					"src/mouse.js",
					"src/number.js",
					"src/observer.js",
					"src/promise.js",
					"src/regex.js",
					"src/route.js",
					"src/string.js",
					"src/utility.js",
					"src/validate.js",
					"src/xhr.js",
					"src/xml.js",
					"src/bootstrap.js",
					"src/interface.js",
					"src/outro.js"
				],
				dest : "lib/abaaso.js"
			}
		},
		min : {
			"lib/abaaso.min.js" : ["<banner>", "lib/abaaso.js"]
		},
		test : {
			files : ["test/**/*.js"]
		},
	});

	grunt.registerTask("default", "concat version min test");

	grunt.registerTask("version", function () {
		var ver = grunt.config("pkg").version,
		    fn  = "lib/abaaso.js",
		    fp  = grunt.file.read("lib/abaaso.js");

		console.log("Setting version to: " + ver);
		grunt.file.write(fn, fp.replace(/\{\{VERSION\}\}/g, ver));
	});
};