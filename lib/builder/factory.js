'use strict';

var util = require('util');

// Our library
var linuxBuilder = require('./linux');
var macBuilder = require('./mac');
var winBuilder = require('./win');

/**
 * A factory to create a builder for building cli arguments
 * @module ping/builder/factory
 * @exports factory
 */
var factory = {};

/**
 * Check out linux platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is Linux-based, false otherwise
 */
factory.isLinux = function (p) {
    var platforms = [
        'aix',
        'android',
        'linux',
    ];

    return platforms.indexOf(p) >= 0;
};

/**
 * Check out macos platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is macos-based, false otherwise
 */
factory.isMacOS = function (p) {
    var platforms = [
        'darwin',
        'freebsd',
    ];

    return platforms.indexOf(p) >= 0;
};

/**
 * Check out window platform
 * @param {string} p - Platform name to check
 * @return {boolean} - True if platform is window-based, false otherwise
 */
factory.isWindow = function (p) {
    return p && p.match(/^win/) !== null;
};

/**
 * Check whether given platform is supported
 * @param {string} p - Name of the platform
 * @return {boolean} - True or False
 */
factory.isPlatformSupport = function (p) {
    return this.isWindow(p) || this.isLinux(p) || this.isMacOS(p);
};

/**
 * Return a path to the ping executable in the system
 * @param {string} platform - Name of the platform
 * @param {boolean} v6 - Ping via ipv6 or not
 * @return {string} - Executable path for system command ping
 * @throws {Error} if given platform is not supported
 */
factory.getExecutablePath = function (platform, v6) {
    if (!this.isPlatformSupport(platform)) {
        throw new Error(util.format('Platform |%s| is not support', platform));
    }

    var ret = null;

    if (platform === 'aix') {
        ret = '/usr/sbin/ping';
    } else if (factory.isLinux(platform)) {
        ret = v6 ? 'ping6' : 'ping';
    } else if (factory.isWindow(platform)) {
        ret = process.env.SystemRoot + '/system32/ping.exe';
    } else if (factory.isMacOS(platform)) {
        ret = v6 ? '/sbin/ping6' : '/sbin/ping';
    }

    return ret;
};

/**
 * @typedef {typeof linuxBuilder} LinuxBuilder
 * @typedef {typeof winBuilder} WindowsBuilder
 * @typedef {typeof macBuilder} MacBuilder
 */

/**
 * Create a builder
 * @param {string} platform - Name of the platform
 * @return {LinuxBuilder|WindowsBuilder|MacBuilder} - Argument builder
 * @throws {Error} if given platform is not supported
 */
factory.createBuilder = function (platform) {
    if (!this.isPlatformSupport(platform)) {
        throw new Error(util.format('Platform |%s| is not support', platform));
    }

    var ret = null;

    if (factory.isLinux(platform)) {
        ret = linuxBuilder;
    } else if (factory.isWindow(platform)) {
        ret = winBuilder;
    } else if (factory.isMacOS(platform)) {
        ret = macBuilder;
    }

    return ret;
};

module.exports = factory;
