module.exports = function (grunt) {

    var

        buildTasks = [
                'sass:compile',        
                'csscomb:build',
                //'csslint:build',
                'concat:css',
                'cssmin'
            ],

        watchTasks = [
                'watch:styles'
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
                styles: {
                    files: ['sass/**/*.scss'],
                    tasks: ['sass:compile'],
                    options: {
                        nospawn: true
                    }
                }
            },

		    open: {
		      all: {
		        // Gets the port from the connect configuration
		        path: 'http://localhost:<%= connect.server.options.port %>'
		      }
		    },

            sass: {
              compile: {
                options: {
                  sourcemap: true,
                  loadPath: ['bower_components'
                            , 'sass/bootstrap'
                            , 'sass']
                },
                files: {
                    'build/css/app.css': 'sass/bootstrap.scss'
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
                  src: ['build/css/app.css.map', 'build/css/app.css'],
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
    grunt.registerTask('watch-sass', watchTasks);
  	grunt.registerTask('server', serverTasks);

}
