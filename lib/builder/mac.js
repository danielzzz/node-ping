'use strict';

var util = require('util');

/**
 * A builder builds command line arguments for ping in mac environment
 * @module ping/builder/mac
 * @exports builder
 */

var builder = {};

/**
 * Default configuration for Linux ping
 * @type {import('../index').PingConfig}
 */
var defaultConfig = {
    numeric: true,
    timeout: 2,
    deadline: false,
    min_reply: 1,
    v6: false,
    sourceAddr: '',
    packetSize: 56,
    extra: [],
};

/**
 * Get the finalized array of command line arguments
 * @param {string} target - hostname or ip address
 * @param {import('../index').PingConfig} [config] - Configuration object for cmd line argument
 * @return {string[]} - Command line argument according to the configuration
 * @throws {Error} If there are errors on building arguments with given inputs
 */
builder.getCommandArguments = function (target, config) {
    /** @type {import('../index').PingConfig} */
    var _config = config || {};

    // Empty argument
    var ret = [];

    // Make every key in config has been setup properly
    var keys = ['numeric', 'timeout', 'deadline', 'min_reply', 'v6',
        'sourceAddr', 'extra', 'packetSize'];
    keys.forEach(function (k) {
        // Falsy value will be overridden without below checking
        if (typeof (_config[k]) !== 'boolean') {
            _config[k] = _config[k] || defaultConfig[k];
        }
    });

    if (_config.numeric) {
        ret.push('-n');
    }

    if (_config.timeout) {
        // XXX: There is no timeout option on mac's ping6
        if (config.v6) {
            throw new Error('There is no timeout option on ping6');
        }

        ret = ret.concat([
            '-W',
            util.format('%d', _config.timeout * 1000),
        ]);
    }

    if (_config.deadline) {
        ret = ret.concat([
            '-t',
            util.format('%d', _config.deadline),
        ]);
    }

    if (_config.min_reply) {
        ret = ret.concat([
            '-c',
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
            '-s',
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
 * Compute an option object for child_process.spawn
 * @return {{}}
 */
builder.getSpawnOptions = function () {
    return {};
};

module.exports = builder;
