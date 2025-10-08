/**
 * Running tests to validate TypeScript declaration files.
 */

'use strict';

const path = require('path');

/**
 * Grunt configuration
 * @param {import('grunt')} grunt - The Grunt instance
 */
module.exports = function (grunt) {
    grunt.registerTask('runTsdTest', 'Run TypeScript declaration files tests', function () {
        const done = this.async();

        const packageJsonPath = path.resolve('package.json');
        const packageJsonFolder = path.dirname(packageJsonPath);

        const command = 'npx';
        const args = ['tsd', packageJsonFolder];

        grunt.log.writeln(`Running shell command |${command} ${args.join(' ')}|`);
        grunt.util.spawn({
            cmd: command,
            args: args,
        }, (error, result, code) => {
            grunt.log.writeln(result.stdout);
            if (error) {
                grunt.log.error(`Error running tsd tests: ${error.message}`);
                return done(false);
            }
            const isSuccess = code === 0;
            if (!isSuccess) {
                grunt.log.error(`tsd exited with code: ${code}`);
                return done(false);
            }
            grunt.log.writeln('TypeScript declaration files tests passed successfully.');
            return done(true);
        });
    });
};
