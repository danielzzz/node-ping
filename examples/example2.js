var ping = require("../index");

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
        extra: ["-i", "2"]
    })
    .then(function (res) {
            console.log(res);
    })
    .done();
});
