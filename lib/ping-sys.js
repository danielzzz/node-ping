/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
*
*/

var sys   = require('util'),
    cp = require('child_process');
    os = require('os');


function probe(addr, cb) {
        var p = os.platform();
        var ls = null;


        if (p == 'linux') {
            //linux
            ls = cp.spawn('/bin/ping', ['-n', '-w 2', '-c 1', addr]);
        } else if (p.match(/^win/)) {
            //windows
            var ls = spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', addr]);

        } else if (p == 'darwin') {
            //mac ox
            var ls = spawn('/sbin/ping', ['-n', '-t 2', '-c 1', addr]);
        }

        ls.on('error', function(e) {
            throw new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
        });


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
