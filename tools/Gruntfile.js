module.exports = function(grunt) {
	grunt.file.setBase("../");

	// 1. Общая конфигурация
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		project: {
			buildDir: 'public',
			version: +new Date()
		},

		concat: {
			// 2. Настройки для склеивания файлов
			dist: {
				src: [
					'js/*/*.js' // Все js-файлы в директории libs
				],
				dest: '<%= project.buildDir %>/app_angular.js'
			}
		},

		less: {
			options: {
				paths: [ 'css' ],
				compress: {},
				report: 'min',
				sourceMap: true
			},

			production: {
				files: {
					'<%= project.buildDir %>/app.css': ['app/css/*/*.*', 'app/css/*.*']
				}
			}
		},

		watch: {
			less: {
				files: "app/css/*",
				tasks: ["less"]
			},
			js: {
				files: "app/js/*",
				tasks: ["js", "clean:afterminjs"]
			}
		},

		uglify: {
			options: {
				compress: {},
				preserveComments: 'some',
				report: 'min'
			},

			project: {
				src: '<%= project.buildDir %>/app_angular.js',
				dest: '<%= project.buildDir %>/app.min.js'
			}
		},

		jshint: {

			project: {
				options: {
					jshintrc: '.jshintrc'
				},

				files: {
					src: [ 'js/**/*.js' ]
				}
			}

		},

		sprite:{
			all: {
				src: 'app/images/icons/*.png',
				dest: '<%= project.buildDir %>/img/icons.png',
				destCss: 'css/icons.css',
				imgPath: "img/icons.png"
			}
		},

		clean: {
			build: {
				src: ["<%= project.buildDir %>"]
			},

			afterminjs: {
				src: ["<%= project.buildDir %>/app_angular.js"]
			}
		},

		/*postcss: {
			options: {
				processors: [
					require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
					require('cssnano')() // minify the result
				]
			},
			dist: {
				src: '<%= project.buildDir %>/*.css'
			}
		}
*/
	});

	// 3. Сообщаем, какие плагины мы собираемся использовать

	// for less to css compiling
	grunt.loadNpmTasks('grunt-contrib-less');

	// watcher for files changing
	grunt.loadNpmTasks('grunt-contrib-watch');

	// for cleaning directories
	grunt.loadNpmTasks('grunt-contrib-clean');

	// for conating js files
	grunt.loadNpmTasks('grunt-contrib-concat');

	// for minifying js files
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// for jshint testing
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// for creating sprites
	grunt.loadNpmTasks('grunt-spritesmith');

	/* for post processing css
	grunt.loadNpmTasks('grunt-postcss'); */

	// load our custom task
	grunt.loadTasks('tools/task');

	// 4. Определяем задачу по умолчанию, которая будет выполняться при запуске команды grunt в терминале.
	grunt.registerTask('js', ['concat', 'uglify', 'clean:afterminjs']);

	grunt.registerTask('css', ['less']);

	grunt.registerTask('default', ['clean:build', 'js', 'sprite', 'css', 'copy:all']);

};