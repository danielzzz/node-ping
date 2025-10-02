'use strict';

var util = require('util');

var builderFactory = require('../builder/factory');
var WinParserClass = require('./win');
var MacParserClass = require('./mac');
var LinuxParserClass = require('./linux');

/**
 * A factory creates a parser for parsing output from system ping
 * @module ping/parser/factory
 */
var factory = {};

/**
 * @typedef {typeof import('./linux')} LinuxParser
 * @typedef {typeof import('./win')} WinParser
 * @typedef {typeof import('./mac')} MacParser
 */

/**
 * Create a parser for a given platform
 * @param {string} addr - Hostname or ip address
 * @param {string} platform - Name of the platform
 * @param {PingConfig} [config] - Config object in probe()
 * @return {LinuxParserClass|WinParserClass|MacParserClass} - Parser
 * @throws {Error} If given platform is not supported
 */
factory.createParser = function (addr, platform, config) {
    // Avoid function reassignment
    var _config = config || {};

    if (!builderFactory.isPlatformSupport(platform)) {
        throw new Error(util.format('Platform |%s| is not support', platform));
    }

    var ret = null;
    if (builderFactory.isWindow(platform)) {
        ret = new WinParserClass(addr, _config);
    } else if (builderFactory.isMacOS(platform)) {
        ret = new MacParserClass(addr, _config);
    } else if (builderFactory.isLinux(platform)) {
        ret = new LinuxParserClass(addr, _config);
    }

    return ret;
};

module.exports = factory;
