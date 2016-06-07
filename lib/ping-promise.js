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
        var result;
        var time;
        var lines = outstring.split('\n');
        // workaround for windows machines
        // if host is unreachable ping will return
        // a successfull error code
        // so we need to handle this ourself
        if (p.match(/^win/)) {
            // this is my solution on Chinese Windows8 64bit
            result = false;
            for (var line in lines) {
                if (line.search(/TTL=[0-9]+/i) > 0) {
                    result = true;
                    break;
                }
            }

            // below is not working on My Chinese Windows8 64bit
            /*
            for (var t = 0; t < lines.length; t++) {
                if (lines[t].match (/[0-9]:/)) {
                    result = (lines[t].indexOf ("=") != -1);
                    break;
                }
            }
            */
        } else {
            result = code === 0;
        }

        for (var t = 0; t < lines.length; t++) {
            var match = /time=([0-9\.]+)\s*ms/i.exec(lines[t]);
            if (match) {
                time = parseFloat(match[1], 10);
                break;
            }
        }
        deferred.resolve({
            host: addr,
            alive: result,
            output: outstring,
            time: time,
        });
    });

    return deferred.promise;
}

exports.probe = probe;
