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

// System library
var util = require('util');
var cp = require('child_process');
var os = require('os');

// 3rd-party library
var Q = require('q');
var __ = require('underscore');

// Our library
var builderFactory = require('./builder/factory');
var parserFactory = require('./parser/factory');

/**
 * Class::PromisePing
 *
 * @param {string} addr - Hostname or ip addres
 * @param {PingConfig} config - Configuration for command ping
 * @return {Promise}
 */
function probe(addr, config) {
    // Do not reassign function argument
    var _config = config || {};

    // Convert callback base system command to promise base
    var deferred = Q.defer();

    // Spawn a ping process
    var ping = null;
    var platform = os.platform();
    var argumentBuilder = builderFactory.createBuilder(platform);
    ping = cp.spawn(
        builderFactory.getExecutablePath(platform),
        argumentBuilder.getResult(addr, _config)
    );

    // Initial parser
    var parser = parserFactory.createParser(platform);

    ping.once('error', function () {
        var err = new Error(
            util.format(
                'ping.probe: %s. %s',
                'there was an error while executing the ping program. ',
                'Check the path or permissions...'
            )
        );
        deferred.reject(err);
    });

    var outstring = [];
    ping.stdout.on('data', function (data) {
        outstring.push(String(data));
    });

    ping.once('close', function () {
        var lines = outstring.join('').split('\n');

        __.each(lines, parser.eat, parser);

        var ret = parser.getResult();

        deferred.resolve(ret);
    });

    return deferred.promise;
}

exports.probe = probe;
