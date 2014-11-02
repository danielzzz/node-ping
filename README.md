#NODE-PING
a ping wrapper for nodejs

#LICENSE MIT

(C) Daniel Zelisko

http://github.com/danielzzz/node-ping

#DESCRIPTION

node-ping is a simple wrapper for the system ping utility

#INSTALLATION

npm install ping

#USAGE

##Tradition calls

    var ping = require('ping');

    var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
    hosts.forEach(function(host){
        ping.sys.probe(host, function(isAlive){
            var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
            console.log(msg);
        });
    });

##Promise wrapper

    var ping = require('ping');

    var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

    hosts.forEach(function (host) {
        ping.promise.probe(host)
            .then(function (res) {
                console.log(res);
            });
    });

##Promise Wrapper with configable ping options

    //Only promise wrapper supports configable ping options
    hosts.forEach(function (host) {
        ping.promise.probe(host, {
            timeout: 10,
            extra: ["-i 2"]
        }).then(function (res) {
                console.log(res);
            });
    });

