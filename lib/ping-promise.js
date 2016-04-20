/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
* Now with support of not only english Windows.
*
*/

//system library
var sys = require('util'),
    cp = require('child_process'),
    os = require('os');

//3rd-party library
var Q = require("q");

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
    var outstring = "";
    var deferred = Q.defer();
    var args = [];
    config = config ? config : {};

    if (p === 'linux') {
        //linux
        args = linuxBuilder.getResult(addr, config);
        ls = cp.spawn('/bin/ping', args);
    } else if (p.match(/^win/)) {
        //windows
        args = winBuilder.getResult(addr, config);
        ls = cp.spawn(process.env.SystemRoot + '/system32/ping.exe', args);
    } else if (p === 'darwin' || p === 'freebsd') {
        //mac osx
        args = macBuilder.getResult(addr, config);
        ls = cp.spawn('/sbin/ping', args);
    }
    ls.on('error', function (e) {
        var err = new Error(
            "ping.probe: there was an error while executing the ping program. check the path or permissions...");
        deferred.reject(err);
    });


    ls.stdout.on('data', function (data) {
        outstring += String(data);
    });

    /*
    ls.stderr.on('data', function (data) {
      //sys.print('stderr: ' + data);
    });
    **/

    ls.on('exit', function (code) {
        var result, time;
        var lines = outstring.split('\n');
        // workaround for windows machines
        // if host is unreachable ping will return
        // a successfull error code
        // so we need to handle this ourself
        if (p.match(/^win/)) {
            // this is my solution on Chinese Windows8 64bit
            result  = false;
            for (var t = 0; t < lines.length; t++) {
                if (lines[t].search(/TTL=[0-9]+/i) > 0) {
                    result	= true;
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
        }
        else {
            result = (code === 0) ? true : false;
        }
        for (var t = 0; t < lines.length; t++) {
            var match = /time=([0-9\.]+)\s*ms/i.exec(lines[t]);
            if (match) {
                time = parseInt(match[1]);
                break;
            }
        }
        deferred.resolve({
            host: addr,
            alive: result,
            output: outstring,
            time: time
        });
    });
    return deferred.promise;
}

exports.probe = probe;
