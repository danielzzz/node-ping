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
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.loadTasks('tasks');
};
