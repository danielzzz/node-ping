'use strict';

var path = require('path');
var glob = require('glob');

/**
 * Check out linux platform
 */
function isLinux(p) {
    var platforms = [
        'aix',
        'linux',
    ];

    return platforms.indexOf(p) >= 0;
}

/**
 * Check out macos platform
 */
function isMacOS(p) {
    var platforms = [
        'darwin',
        'freebsd',
    ];

    return platforms.indexOf(p) >= 0;
}

/**
 * Check out window platform
 */
function isWindow(p) {
    return p && p.match(/^win/) !== null;
}

module.exports = function (platform) {
    var dirname = null;

    if (isLinux(platform)) {
        dirname = 'linux';
    } else if (isMacOS(platform)) {
        dirname = 'macos';
    } else if (isWindow(platform)) {
        dirname = 'window';
    }

    var currentDirectory = path.dirname(__filename);

    var targetDirectory = [currentDirectory, 'fixture'];
    if (dirname) {
        targetDirectory.push(dirname);
    }
    targetDirectory = targetDirectory.concat([
        '**',
        '*.txt',
    ]);
	targetDirectory = path.posix.join.apply(path.posix, targetDirectory);

    return glob.sync(targetDirectory);
};
