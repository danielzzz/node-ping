/**
 * A builder builds command line arguments for ping in mac environment
 * @module lib/builder/mac
 */
var util = require('util');
var ret = {};

/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} numeric - Map IP address to hostname or not
 * @property {number} timeout - Time duration for ping command to exit
 * @property {number} min_reply - Exit after sending number of ECHO_REQUEST
 * @property {string[]} extra - Optional options does not provided
 */

var defaultConfig = {
    'numeric': true,
    'timeout': 2,
    'min_reply': 1,
    'extra': []
};

/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
ret.getResult = function (target, config) {
    config = config || {};

    // Empty argument
    var ret = [];

    // Make every key in config has been setup properly
    var keys = ['numeric', 'timeout', 'min_reply', 'extra'];
    keys.forEach(function (k) {
        // Falsy value will be overrided without below checking
        if (typeof(config[k]) !== 'boolean') {
            config[k] = config[k] || defaultConfig[k];
        }
    });

    if (config.numeric) {
        ret.push('-n');
    }

    if (config.timeout) {
        ret.push(util.format('-t %d', config.timeout));
    }

    if (config.min_reply) {
        ret.push(util.format('-c %d', config.min_reply));
    }

    if (config.extra) {
        ret = ret.concat(config.extra);
    }

    ret.push(target);

    return ret;
};

module.exports = ret;
