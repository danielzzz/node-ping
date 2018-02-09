// -------- example -----------------------

'use strict';

var ping = require('../index');

var hosts = ['google.de']; // ['192.168.1.1', 'google.com', 'yahoo.com'];

// Running with custom config
hosts.forEach(function (host) {
    ping.promise.probe(host, {
        v6: true,
        min_reply: 4,
        sourceAddr: '3001:4cb0:0:f282:ddf1:bec9:1e0:bfa9',
    })
    .then(function (res) {
        console.log(res);
    })
    .done();
});
