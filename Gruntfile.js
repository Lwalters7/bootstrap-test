'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        browserSync: 'grunt-browser-sync', // Ensure BrowserSync is loaded
        useminPrepare: 'grunt-usemin',
        filerev: 'grunt-filerev',
        htmlmin: 'grunt-contrib-htmlmin'
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

        copy: {
            html: {
                files: [
                    {
                        // Copy HTML files
                        expand: true,
                        dot: true,
                        cwd: './',
                        src: ['*.html'],
                        dest: 'dist'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        // Copy Font Awesome fonts
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    }
                ]
            }
        },

        clean: {
            build: {
                src: ['dist/']
            }
        },

        // Optimize images using imagemin
        imagemin: {
            dynamic: {
                files: [
                    {
                        expand: true, // Enable dynamic expansion
                        cwd: './', // Src matches are relative to this path
                        src: ['img/*.{png,jpg,gif}'], // Actual patterns to match
                        dest: 'dist/' // Destination path prefix
                    }
                ]
            }
        },

        // Prepare files for minification and concatenation
        useminPrepare: {
            foo: {
                dest: 'dist',
                src: ['contactus.html', 'aboutus.html', 'index.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0,
                                    rebase: false
                                };
                            }
                        }]
                    }
                }
            }
        },

        // Concat task (configured by useminPrepare)
        concat: {
            options: {
                separator: ';'
            },
            dist: {}
        },

        // Uglify task (configured by useminPrepare)
        uglify: {
            dist: {}
        },

        // Minify CSS files (configured by useminPrepare)
        cssmin: {
            dist: {}
        },

        // File Revisioning for Cache Busting
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css'
                    ]
                }]
            }
        },

        // Replaces asset references with their revved versions
        usemin: {
            html: ['dist/contactus.html', 'dist/aboutus.html', 'dist/index.html'],
            options: {
                assetsDirs: ['dist', 'dist/css', 'dist/js']
            }
        },

        // Minify HTML files in the `dist` folder
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                    'dist/contactus.html': 'dist/contactus.html',
                    'dist/aboutus.html': 'dist/aboutus.html'
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
    grunt.registerTask('optimize-images', ['imagemin']);

    // ✅ Full build process for production
    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    // ✅ Default task (same as `serve`)
    grunt.registerTask('default', ['browserSync', 'watch']);
};
