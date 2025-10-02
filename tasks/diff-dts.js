/**
 * Differentially compare two sets of TypeScript declaration files.
 */

'use strict';

const path = require('path');
const {mkdtempSync, rmSync} = require('fs');
const {sep} = require('path');
const {tmpdir} = require('os');

/**
 * Grunt configuration
 * @param {import('grunt')} grunt - The Grunt instance
 */
module.exports = function (grunt) {
    grunt.registerTask('diffDts', 'Diff two sets of TypeScript declaration files', function () {
        const done = this.async();

        const tempDirectoryFullPath = mkdtempSync(`${tmpdir()}${sep}`);
        grunt.log.writeln(`Created temporary directory: ${tempDirectoryFullPath}`);

        const tsConfigOption = path.resolve(this.options('diffDts').config);
        const tsConfigFullPath = path.resolve(tsConfigOption);
        const tsConfig = require(tsConfigOption);
        const originalDtsOutDirOption = tsConfig.compilerOptions.outDir;
        const originalDtsOutDirFullPath = path.resolve(originalDtsOutDirOption);
        const npxCommand = 'npx';
        const npxArgs = [
            '-p', 'typescript', 'tsc',
            '--project', tsConfigFullPath,
            '--outDir', tempDirectoryFullPath,
        ];

        const runTscPromise = () => new Promise((resolve, reject) => {
            grunt.log.writeln(`Running shell command |${npxCommand} ${npxArgs.join(' ')}|`);
            grunt.util.spawn({
                cmd: npxCommand,
                args: npxArgs,
            }, (error, result, code) => {
                grunt.log.writeln(result.stdout);
                if (error) {
                    grunt.log.error(`Error generating declaration files: ${error.message}`);
                    return reject(error);
                }
                const isSuccess = code === 0;
                if (!isSuccess) {
                    grunt.log.error(`TypeScript compiler exited with code: ${code}`);
                    return reject(new Error(`Fail to run tsc with exitcode: ${code}`));
                }
                grunt.log.oklns('TypeScript declaration files generated successfully.');
                return resolve(true);
            });
        });

        const diffCommand = 'diff';
        const diffArgs = [
            '-x',
            'index.test-d.ts',
            '-x',
            '*.map',
            '-qr',
            originalDtsOutDirFullPath,
            tempDirectoryFullPath,
        ];
        const runDiffPromise = () => new Promise((resolve, reject) => {
            grunt.log.writeln(`Running shell command |${diffCommand} ${diffArgs.join(' ')}|`);
            grunt.util.spawn({
                cmd: diffCommand,
                args: diffArgs,
            }, (error, result) => {
                grunt.log.writeln(result.stdout);
                if (error) {
                    grunt.log.error(`Error diffing declaration files: ${error.message}`);
                    return reject(error);
                }
                grunt.log.oklns('Declaration files are up to dates.');
                return resolve(true);
            });
        });

        runTscPromise()
            .then(runDiffPromise)
            .then(() => rmSync(tempDirectoryFullPath, {recursive: true}))
            .then(() => done(true))
            .catch((err) => {
                grunt.log.error(`Error during running the shell command: ${err.message}`);
                return done(false);
            });
    });
};
