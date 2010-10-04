/** 
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* wrapper for ping
* 
*/

var sys   = require('sys'),
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
            cb(result);
        });
}

exports.probe = probe;


//-------- example -----------------------
var host = '192.168.1.1';
probe(host, function(isAlive){
    var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
    console.log(msg);
});



