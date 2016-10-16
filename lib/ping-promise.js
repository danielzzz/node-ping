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

// Our library
var linuxBuilder = require('./builder/linux');
var macBuilder = require('./builder/mac');
var winBuilder = require('./builder/win');

/**
 * Class::PromisePing
 *
 * @param {string} addr - Hostname or ip addres
 * @param {PingConfig} config - Configuration for command ping
 * @return {Promise}
 */
function probe(addr, config) {
    var p = os.platform();
    var ls = null;
    var outstring = '';
    var deferred = Q.defer();
    var args = [];
    // Do not reassign function argument
    var _config = config || {};

    if (p === 'linux') {
        // linux
        args = linuxBuilder.getResult(addr, _config);
        ls = cp.spawn('/bin/ping', args);
    } else if (p.match(/^win/)) {
        // windows
        args = winBuilder.getResult(addr, _config);
        ls = cp.spawn(process.env.SystemRoot + '/system32/ping.exe', args);
    } else if (p === 'darwin' || p === 'freebsd') {
        // mac osx
        args = macBuilder.getResult(addr, _config);
        ls = cp.spawn('/sbin/ping', args);
    } else if (p === 'aix') {
        // aix
        args = linuxBuilder.getResult(addr, _config);
        ls = cp.spawn('/usr/sbin/ping', args);
    }

    ls.on('error', function () {
        var err = new Error(
            util.format(
                'ping.probe: %s. %s',
                'there was an error while executing the ping program. ',
                'Check the path or permissions...'
            )
        );
        deferred.reject(err);
    });

    ls.stdout.on('data', function (data) {
        outstring += String(data);
    });

    ls.on('close', function (code) {
        var isAlive = code === 0;
        var lines = outstring.split('\n');

        // workaround for windows machines
        // if host is unreachable ping will return
        // a successfull error code
        // so we need to handle this ourself
        if (p.match(/^win/)) {
            // this is my solution on Chinese Windows8 64bit
            isAlive = false;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.search(/TTL=[0-9]+/i) > 0) {
                    isAlive = true;
                    break;
                }
            }
        }

        var time = null;
        var min = null;
        var max = null;
        var N = 0;
        var sum = 0;
        var sumsq = 0;
        for (var t = 0; t < lines.length; t++) {
            var match = /time=([0-9\.]+)\s*ms/i.exec(lines[t]);
            if (match) {
                var parsedTime = parseFloat(match[1], 10);
                if (time === null) {
                    time = parsedTime;
                }
                if (min === null || min > parsedTime) {
                    min = parsedTime;
                }
                if (max === null || max < parsedTime) {
                    max = parsedTime;
                }
                N += 1;
                sum += parsedTime;
                sumsq += parsedTime * parsedTime;
            }
        }
        var avg = sum / N;
        var stddev = Math.round(
            Math.sqrt((sumsq / N) - (avg * avg)) * 1000
        ) / 1000;

        var result = {
            host: addr,
            alive: isAlive,
            output: outstring,
            time: time,
            min: min,
            max: max,
            avg: avg,
            stddev: stddev,
        };

        deferred.resolve(result);
    });

    return deferred.promise;
}

exports.probe = probe;
