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

        //Configuration start start 
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

            //object for watch task
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

            //Object for sass compile
            sass: {
              compile: {
                options: {
                  sourcemap: true,
                  loadPath: ['bower-components'
                            , 'sass/bootstrap'
                            , 'sass']
                },
                files: {
                    'build/css/app.css': 'sass/bootstrap.scss'
                }
              }
            },
            
            //Object to combine css
            csscomb: {
              build: {
                files: {
                  'build/css/app.css': 'build/css/app.css'
                }
              }
            },

            //Object for linting in css
            csslint: {
              options: {
                csslintrc: 'sass/.csslintrc'
              },
              build: {
                src: ['build/css/app.css']
              }
            },
            
            //Object to concatenate css or js files
            concat: {
                options:{
                    separator:';'
                },
              css: {
                  src: ['build/css/app.css.map', 'build/css/app.css'],
                dest: 'build/css/app.css'
              }
            },

            //Object to minify css or js file
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

    //HOW TO USE THESE TASK IN GRUNT
    //Syntax: $ Grunt build or watch-sass
    grunt.registerTask('build', buildTasks);        
    grunt.registerTask('watch-sass', watchTasks);
  	grunt.registerTask('server', serverTasks);

}
