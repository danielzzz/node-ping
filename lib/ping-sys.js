'use strict';

/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
* Now with support of not only english Windows.
*
*/

// Promise implementation
var ping = require('./ping-promise');


/**
 * @module ping/ping-sys
 */

// TODO:
// 1. Port round trip time to this callback
// 2. However, it may breaks backward compatability
// 3. Need discussion
/**
 * Callback after probing given host
 * @callback probeCallback
 * @param {import('./parser/base').PingResponse} response - Ping response object
 * @param {Error|null} error - Error object if error occurs, null otherwise
 */

/**
 * Probe a host using ping command with callback interface
 * @param {string} addr - Hostname or ip address
 * @param {probeCallback} cb - Callback
 * @param {import('./index').PingConfig} [config] - Configuration for command ping
 * @return {Promise<import('./parser/base').PingResponse>} Promise from the underlying ping operation
 */
function probe(addr, cb, config) {
    // Do not reassign function parameter
    var _config = config || {};

    return ping.probe(addr, _config).then(function (res) {
        cb(res, null);
    }).catch(function (err) {
        cb(null, err);
    });
}

exports.probe = probe;
