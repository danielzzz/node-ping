/**
 * Generate TypeScript declaration files for the project.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Grunt configuration
 * @param {import('grunt')} grunt - The Grunt instance
 */
module.exports = function (grunt) {
    grunt.registerTask('makeDts', 'Generate TypeScript declaration files', function () {
        const done = this.async();
        const tsConfigFullPath = path.resolve(this.options('makeDts').config);
        grunt.log.writeln(`Reading config from ${tsConfigFullPath}`);
        if (!fs.existsSync(tsConfigFullPath)) {
            grunt.log.error(`TypeScript configuration file not found: ${tsConfigFullPath}`);
            return done(false);
        }

        const command = 'npx';
        const args = ['-p', 'typescript', 'tsc', '--project', tsConfigFullPath];
        const outputDirOption = this.options('makeDts').outDir;
        const outputDirectoryPath = path.resolve(outputDirOption);
        args.push('--outDir', outputDirectoryPath);

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
