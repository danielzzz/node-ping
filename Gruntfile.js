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
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('test', ['eslint', 'mochaTest']);
};
