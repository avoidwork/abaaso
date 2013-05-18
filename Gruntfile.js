module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat : {
			options : {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n"
			},
			dist : {
				src : [
					"src/intro.js",
					"src/regex.js",
					"src/array.js",
					"src/cache.js",
					"src/client.js",
					"src/cookie.js",
					"src/data.js",
					"src/datalist.js",
					"src/deferred.js",
					"src/element.js",
					"src/filter.js",
					"src/grid.js",
					"src/json.js",
					"src/label.js",
					"src/message.js",
					"src/mouse.js",
					"src/number.js",
					"src/observer.js",
					"src/promise.js",
					"src/route.js",
					"src/state.js",
					"src/string.js",
					"src/utility.js",
					"src/validate.js",
					"src/xhr.js",
					"src/xml.js",
					"src/bootstrap.js",
					"src/interface.js",
					"src/outro.js"
				],
				dest : "lib/<%= pkg.name %>.js"
			}
		},
		nodeunit: {
			all : ["test/*.js"]
		},
		shell: {
			closure: {
				command: "cd lib\nclosure-compiler --js abaaso.js --js_output_file abaaso.min.js --create_source_map ./abaaso.map"
			},
			sourcemap: {
				command: "echo //@ sourceMappingURL=abaaso.map >> lib/abaaso.min.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");

	grunt.registerTask("test", ["nodeunit"]);

	grunt.registerTask("compress", function () {
		process.platform !== "win32" ? grunt.task.run("shell") : console.log("Couldn't compress files on your OS")
	});

	grunt.registerTask("version", function () {
		var cfg = grunt.config("pkg"),
		    ver = cfg.version,
		    fn  = "lib/" + cfg.name + ".js",
		    fp  = grunt.file.read(fn);

		console.log("Setting version to: " + ver);
		grunt.file.write(fn, fp.replace(/\{\{VERSION\}\}/g, ver));
	});

	grunt.registerTask("default", ["concat", "version", "test", "compress"]);
};