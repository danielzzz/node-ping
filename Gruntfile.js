'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            src: ['lib/*.js', 'lib/**/*.js'],
            options: {
                overrideConfigFile: '.eslintrc.json',
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
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nyc-mocha');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.registerTask('test', ['eslint', 'mochaTest']);
    grunt.registerTask('coverage', ['nyc_mocha']);
};
