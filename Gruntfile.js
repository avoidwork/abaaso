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
			prepare : {
				command : "rm -rf lib/compressed/*"
			},
			copy : {
				command : "cp lib/*.js lib/compressed"
			},
			compress : {
				command : "gzip -9 lib/compressed/*"
			}
		},
		uglify: {
			options: {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n",
				mangle: {
					except: ["abaaso", "DataList", "DataListFilter", "DataStore", "Deferred", "Promise"]
				}
			},
			dist: {
				options : {
					sourceMap : "lib/<%= pkg.name %>.source-map.js",
					sourceMappingURL : "<%= pkg.name %>.source-map.js",
					sourceMapRoot : ".."
				},
				files: {
					"lib/<%= pkg.name %>.min.js" : ["<%= concat.dist.dest %>"]
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-uglify");

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

	grunt.registerTask("default", ["concat", "version", "uglify", "test", "compress"]);
};