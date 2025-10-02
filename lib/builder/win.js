'use strict';

var util = require('util');

/**
 * A builder builds command line arguments for ping in window environment
 * @module ping/builder/win
 * @exports builder
 */

var builder = {};

/**
 * Default configuration for Window ping
 * @type {import('../index').PingConfig}
 */
var defaultConfig = {
    numeric: true,
    timeout: 5,
    min_reply: 1,
    v6: false,
    sourceAddr: '',
    packetSize: 32,
    extra: [],
};

/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {import('../index').PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 */
builder.getCommandArguments = function (target, config) {
    /** @type {import('../index').PingConfig} */
    var _config = config || {};

    // Empty argument
    var ret = [];

    // Make every key in config has been setup properly
    var keys = [
        'numeric', 'timeout', 'min_reply', 'v6', 'sourceAddr', 'extra',
        'packetSize',
    ];
    keys.forEach(function (k) {
        // Falsy value will be overrided without below checking
        if (typeof (_config[k]) !== 'boolean') {
            _config[k] = _config[k] || defaultConfig[k];
        }
    });

    ret.push(_config.v6 ? '-6' : '-4');

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

    if (_config.deadline) {
        throw new Error('There is no deadline option on windows');
    }

    if (_config.min_reply) {
        ret = ret.concat([
            '-n',
            util.format('%d', _config.min_reply),
        ]);
    }

    if (_config.sourceAddr) {
        ret = ret.concat([
            '-S',
            util.format('%s', _config.sourceAddr),
        ]);
    }

    if (_config.packetSize) {
        ret = ret.concat([
            '-l',
            util.format('%d', _config.packetSize),
        ]);
    }

    if (_config.extra) {
        ret = ret.concat(_config.extra);
    }

    ret.push(target);

    return ret;
};

/**
 * @typedef {Object} WindowsSpawnOptions
 * @property {boolean} windowsHide - Hide the subprocess console window that would normally be created on Windows
 * systems
 */

/**
 * Compute an option object for child_process.spawn
 * @return {WindowsSpawnOptions} - Options object for child_process.spawn on Windows
 */
builder.getSpawnOptions = function () {
    return {
        windowsHide: true,
    };
};

module.exports = builder;
