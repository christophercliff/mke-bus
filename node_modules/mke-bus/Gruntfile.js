var path = require('path')

var PORT = 3000

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-connect')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-mocha')

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                options: {
                    bundleOptions: {
                        standalone: 'MKE_BUS'
                    }
                },
                src: './lib/index.js',
                dest: './dist/<%= pkg.name %>.js'
            },
            test: {
                options: {
                    bundleOptions: {
                        debug: true
                    }
                },
                src: './test/index.js',
                dest: './test/runner/index.js'
            }
        },
        connect: {
            options: {
                port: PORT
            },
            test: {
                options: {
                    base: path.resolve(__dirname, './test/runner/')
                }
            }
        },
        copy: {
            test: {
                files: [
                    {
                        src: path.resolve(__dirname, './node_modules/grunt-mocha/node_modules/mocha/mocha.js'),
                        dest: path.resolve(__dirname, './test/runner/mocha.js')
                    },
                    {
                        src: path.resolve(__dirname, './node_modules/grunt-mocha/node_modules/mocha/mocha.css'),
                        dest: path.resolve(__dirname, './test/runner/mocha.css')
                    }
                ]
            }
        },
        mocha: {
            test: {
                options: {
                    log: true,
                    reporter: 'Spec',
                    run: true,
                    urls: ['http://127.0.0.1:' + PORT + '/'],
                    mocha: {
                        grep: ''
                    }
                }
            }
        }
    })

    grunt.registerTask('test:browser', [
        'browserify:test',
        'copy:test',
        'connect:test',
        'mocha:test'
    ])

    grunt.registerTask('test:browser:keepalive', [
        'browserify:test',
        'copy:test',
        'connect:test:keepalive'
    ])

};
