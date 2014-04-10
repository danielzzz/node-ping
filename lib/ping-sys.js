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

/**
 * Class::Ping construtor
 *
 * @param addr string
 * @param cb function (data, err)
 *      arguments order is based on compatabile issue
 */
function probe(addr, cb) {
        var p = os.platform();
        var ls = null;
        var outstring = "";


        if (p == 'linux') {
            //linux
            ls = cp.spawn('/bin/ping', ['-n', '-w 2', '-c 1', addr]);
        } else if (p.match(/^win/)) {
            //windows
            ls = cp.spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', addr]);
        } else if (p == 'darwin') {
            //mac osx
            ls = cp.spawn('/sbin/ping', ['-n', '-t 2', '-c 1', addr]);
        }

        ls.on('error', function(e) {
            var err = new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
            cb(null, err);
        });


        ls.stdout.on('data', function (data) {
            outstring += String(data);
        });

        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            var result;
            // workaround for windows machines
            // if host is unreachable ping will return
            // a successfull error code
            // so we need to handle this ourself
            if (p.match(/^win/)) {
                var lines = outstring.split ('\n');
                for (var t = 0; t < lines.length; t++) {
                    if (lines[t].match (/[0-9]:/)) {
                        result = (lines[t].indexOf ("=") != -1);
                        break;
                    }
                }
            }
            else {
                result = (code === 0 ? true : false);
            }
            if (cb) {
                cb(result, null);
            }
        });
}

/**
 * Class::PromisePing
 *
 * @param addr string
 * @param config dict
 * {
 *      options: [...]
 * }
 *
 * @return Class::Q promise
 */
function promise_probe (addr, config) {
        var p = os.platform();
        var ls = null;
        var outstring = "";
        var deferred = Q.defer();
        var default_cfg = {
            "numeric": true,
            "timeout": 2,
            "min_reply": 1,
            "extra": []
        };
        var args = [];
        config = config ? config : default_cfg;

        if (p == 'linux') {
            //linux
            args = [];
            if (config.numeric !== false) {
                args.push("-n");
            }
            if (config.timeout !== false) {
                args.push(sys.format("-w %d",
                            config.timeout ?
                            config.timeout : default_cfg.timeout));
            }
            if (config.min_reply !== false) {
                args.push(sys.format("-c %d",
                            config.min_reply ?
                            config.min_reply : default_cfg.min_reply));
            }
            if (config.extra !== false) {
                args = args.concat(config.extra ?
                        config.extra : default_cfg.extra);
            }
            args.push(addr);
            ls = cp.spawn('/bin/ping', args);
        } else if (p.match(/^win/)) {
            //windows
            args = [];
            //TODO: No idea for how to write ping commands in Window
            if (config.extra !== false) {
                args = args.concat(config.extra ?
                        config.extra : default_cfg.extra);
            }
            args.push(addr);
            ls = cp.spawn('C:/windows/system32/ping.exe', args);
        } else if (p == 'darwin') {
            //mac osx
            args = [];
            //TODO: No idea for how to write ping commands in MAC osx
            if (config.extra !== false) {
                args = args.concat(config.extra ?
                        config.extra : default_cfg.extra);
            }
            args.push(addr);
            ls = cp.spawn('/sbin/ping', args);
        }

        ls.on('error', function(e) {
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
            var result;
            // workaround for windows machines
            // if host is unreachable ping will return
            // a successfull error code
            // so we need to handle this ourself
            if (p.match(/^win/)) {
                var lines = outstring.split ('\n');
                // this is my solution on Chinese Windows8 64bit
                result  = false;
                for (var t = 0; t < lines.length; t++) {
                    if (lines[t].indexOf ('(0%')>0) {
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
                result = (code === 0 ? true : false);
            }
            deferred.resolve({
                host: addr,
                alive: result
            });
        });
        return deferred.promise;
}

exports.probe = probe;
exports.promise_probe = promise_probe;
