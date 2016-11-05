'use strict';

var util = require('util');

var builderFactory = require('../builder/factory');
var WinParser = require('./win');
var MacParser = require('./mac');
var LinuxParser = require('./linux');

/**
 * A factory creates a parser for parsing output from system ping
 * @constructor
 */
function factory() {}

/**
 * Create a parser for a given platform
 * @param {string} platform - Name of the platform
 * @return {object} - Parser
 * @throw if given platform is not supported
 */
factory.createParser = function (platform) {
    if (!builderFactory.isPlatformSupport(platform)) {
        throw new Error(util.format('Platform |%s| is not support', platform));
    }

    var ret = null;
    if (builderFactory.isWindow(platform)) {
        ret = new WinParser();
    } else if (builderFactory.isMacOS(platform)) {
        ret = new MacParser();
    } else if (builderFactory.isLinux(platform)) {
        ret = new LinuxParser();
    }

    return ret;
};

module.exports = factory;
