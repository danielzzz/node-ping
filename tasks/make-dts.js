/**
 * Generate TypeScript declaration files for the project.
 */

'use strict';

const path = require('path');

/**
 * Grunt configuration
 * @param {import('grunt')} grunt - The Grunt instance
 */
module.exports = function (grunt) {
    grunt.registerTask('makeDts', 'Generate TypeScript declaration files', function () {
        const done = this.async();
        const tsConfigFullPath = path.resolve(this.options('makeDts').config);

        const command = 'npx';
        const args = ['-p', 'typescript', 'tsc', '--project', tsConfigFullPath];

        grunt.log.writeln(`Running shell command |${command} ${args.join(' ')}|`);
        grunt.util.spawn({
            cmd: command,
            args: args,
        }, (error, result, code) => {
            grunt.log.writeln(result.stdout);
            if (error) {
                grunt.log.error(`Error generating declaration files: ${error.message}`);
                return done(false);
            }
            const isSuccess = code === 0;
            if (!isSuccess) {
                grunt.log.error(`TypeScript compiler exited with code: ${code}`);
                return done(false);
            }
            grunt.log.oklns('TypeScript declaration files generated successfully.');
            return done(true);
        });

        return true;
    });
};
