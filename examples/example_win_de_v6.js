// -------- example -----------------------

'use strict';

var ping = require('../index');

var hosts = ['google.de']; // , '192.168.1.1', 'google.com', 'yahoo.com'];

// Running with custom config
hosts.forEach(function (host) {
    ping.promise.probe(host, {
        // v6: true,
        min_reply: 2,
        sourceAddr: 'your NIC\'s IPv6 address',
        // sourceAddr: false,
    })
    .then(function (res) {
        console.log('\n');
        console.log(res);
    })
    .done();

    // Running ping with some default argument gone
    ping.sys.probe(host, function (isAlive) {
        var msg = isAlive ?
            'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log('\n');
        console.log(msg);
    }, {
        timeout: false,
        // v6: true,
        min_reply: 2,
        sourceAddr: 'your NIC\'s IPv6 address',
    });
});
