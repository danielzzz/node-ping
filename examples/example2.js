'use strict';

var ping = require('../index');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

// Running with default config
hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (res) {
            console.log(res);
        })
        .done();
});

// Running with custom config
hosts.forEach(function (host) {
    // WARNING: -i 2 argument may not work in other platform like window
    ping.promise.probe(host, {
        timeout: 10,
        extra: ['-i', '2'],
    })
    .then(function (res) {
        console.log(res);
    })
    .done();
});

// Running ping with some default argument gone
hosts.forEach(function (host) {
    // WARNING: -i 2 argument may not work in other platform like window
    ping.promise.probe(host, {
        timeout: false,
        // Below extra arguments may not work in platforms other than linux
        extra: ['-i', '2'],
    })
    .then(function (res) {
        console.log(res);
    })
    .done();
});
