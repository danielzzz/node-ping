/** 
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
* 
*/

var sys   = require('util'),
    spawn = require('child_process').spawn;


function probe(addr, cb) {
        var ls    = spawn('/bin/ping', ['-n', '-w 2', '-c 1', addr]);
        /*ls.stdout.on('data', function (data) {
          //sys.print('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
        });*/

        ls.on('exit', function (code) {
            var result = (code === 0 ? true : false);
            cb && cb(result);
        });
}

exports.probe = probe;






