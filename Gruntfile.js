'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        browserSync: 'grunt-browser-sync' // Ensure BrowserSync is loaded
    });

    // Define the configuration for all the tasks
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    implementation: require('sass') // Use Dart Sass
                },
                files: {
                    'css/styles.css': 'css/styles.scss'
                }
            }
        },

        // Watch task for changes
        watch: {
            files: 'css/*.scss',
            tasks: ['sass']
        },

        // BrowserSync task for live reloading
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });

    // Register tasks
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('serve', ['browserSync', 'watch']);

    grunt.registerTask('default', ['browserSync', 'watch']);

};
