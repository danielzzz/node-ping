'use strict';

/**
 * Grunt configuration
 * @param {import('grunt')} grunt - The Grunt instance
 */
module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            src: ['Gruntfile.js', 'tasks/*.js', 'lib/*.js', 'lib/**/*.js'],
            options: {
                overrideConfigFile: 'eslint.config.js',
            },
        },
        mochaTest: {
            src: ['test/test-*.js'],
            options: {
                reporter: 'dot',
            },
        },
        nyc_mocha: {
            src: ['test/test-*.js'],
            options: {
                nyc: {
                    coverage: {
                        dir: 'dist/coverage',
                        reporter: ['text', 'html', 'lcov', 'cobertura'],
                    },
                },
                mocha: {
                    color: true,
                    opts: ['--reporter', 'dot'],
                },
            },
        },
        coveralls: {
            src: 'dist/coverage/*.info',
            options: {},
        },
        makeDts: {
            options: {
                config: 'tsconfig.json',
            },
        },
        diffDts: {
            options: {
                config: 'tsconfig.json',
            },
        },
        runTsdTest: {
            options: {},
        },
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nyc-mocha');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['eslint', 'mochaTest', 'runTsdTest']);
    grunt.registerTask('coverage', ['nyc_mocha']);
};
