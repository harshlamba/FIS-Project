module.exports = function (grunt) {

    var

        buildTasks = [
                'sass:compile',        
                'csscomb:build',
                //'csslint:build',
                //'concat:css',
                'cssmin'
            ],

        watchTasks = [
                'sass:compile'
            ],

        serverTasks = [
				'connect',
				'open',
				'watch'
        	],

        config = {
            package: grunt.file.readJSON('package.json'),

            connect: {
                server: {
                    options: {
                        port: 9000,
                        base: './',
                        livereload: true
                    }
                }
            },

            watch: {
                live: {
                  files: 'sass/**/*.scss',
                  tasks: watchTasks,
                  options: {
				        livereload: true,
				    }
                }
            },

		    open: {
		      all: {
		        // Gets the port from the connect configuration
		        path: 'http://localhost:<%= connect.server.options.port %>'
		      }
		    },

            //sass: {
            //  compile: {
            //    options: {
            //      sourcemap: true,
            //      loadPath: ['bower_components'
            //                , '../extend/Math'
            //                , '../extend/Helpers'
            //                , '../extend/Typography'
            //                , '../extend/Color']
            //    },
            //    files: {
            //      'build/css/app.css': 'sass/app.scss'
            //    }
            //  }
            //},

		    sass: {
		        compile: {
		            files: {
		                'build/css/app.css': 'bower_components/bootstrap-sass/vendor/assets/stylesheets/bootstrap.scss'
		            }
		        }
		    },

            csscomb: {
              build: {
                files: {
                  'build/css/app.css': 'build/css/app.css'
                }
              }
            },

            csslint: {
              options: {
                csslintrc: 'sass/.csslintrc'
              },
              build: {
                src: ['build/css/app.css']
              }
            },

            concat: {
                options:{
                    separator:';'
                },
              css: {
                src: ['lib/normalize-css/normalize-css', 'sass/base/print.css', 'build/css/app.css'],
                dest: 'build/css/app.css'
              }
            },

            cssmin: {
              compress: {
                options: {
                  report: 'min',
                },
                src: 'build/css/app.css',
                dest: 'build/css/app.css'
              }
            }

        };

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    grunt.initConfig(config);

    grunt.registerTask('build', buildTasks);
  	grunt.registerTask('server', serverTasks);

}
