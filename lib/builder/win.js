'use strict';

/**
 * A builder builds command line arguments for ping in window environment
 * @module lib/builder/win
 */
var util = require('util');

var builder = {};

/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} numeric - Map IP address to hostname or not
 * @property {number} timeout - Time duration for ping command to exit
 * @property {number} min_reply - Exit after sending number of ECHO_REQUEST
 * @property {string[]} extra - Optional options does not provided
 */

var defaultConfig = {
    numeric: true,
    timeout: 5,
    min_reply: 1,
    extra: [],
};

/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
builder.getResult = function (target, config) {
    var _config = config || {};

    // Empty argument
    var ret = [];

    // Make every key in config has been setup properly
    var keys = ['numeric', 'timeout', 'min_reply', 'extra'];
    keys.forEach(function (k) {
        // Falsy value will be overrided without below checking
        if (typeof(_config[k]) !== 'boolean') {
            _config[k] = _config[k] || defaultConfig[k];
        }
    });

    if (!_config.numeric) {
        ret.push('-a');
    }

    if (_config.timeout) {
        // refs #56: Unit problem
        // Our timeout is in second while timeout in window is in milliseconds
        // so we need to convert our units accordingly
        ret = ret.concat([
            '-w',
            util.format('%d', _config.timeout * 1000),
        ]);
    }

    if (_config.min_reply) {
        ret = ret.concat([
            '-n',
            util.format('%d', _config.min_reply),
        ]);
    }

    if (_config.extra) {
        ret = ret.concat(_config.extra);
    }

    ret.push(target);

    return ret;
};

module.exports = builder;
