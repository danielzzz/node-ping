#NODE-PING
a ping wrapper for nodejs

@last-modified: 2016-01-23 00:36

#LICENSE MIT

(C) Daniel Zelisko

http://github.com/danielzzz/node-ping

#DESCRIPTION

node-ping is a simple wrapper for the system ping utility

#INSTALLATION

npm install ping

#USAGE

Below are examples extracted from `examples`

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
        // WARNING: -i 2 argument may not work in other platform like window
        ping.promise.probe(host, {
            timeout: 10,
            extra: ["-i 2"],
        }).then(function (res) {
            console.log(res);
        });
    });

### Support configuration

Below is the possible configuration

```
/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} numeric - Map IP address to hostname or not
 * @property {number} timeout - Time duration for ping command to exit
 * @property {number} min_reply - Exit after sending number of ECHO_REQUEST
 * @property {string[]} extra - Optional options does not provided
 */
```

#### Note

* Since `ping` in this module relies on the `ping` from underlying platform,
arguments in `PingConfig.extra` will definitely be varied across different
platforms.

* However, `numeric`, `timeout` and `min_reply` have been abstracted. Values for
them are expected to be cross platform.

* By setting `numeric`, `timeout` or `min_reply` to false, you can run `ping`
without corresponding arguments.
