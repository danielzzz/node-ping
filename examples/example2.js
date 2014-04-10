var ping = require("../index");

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

hosts.forEach(function (host) {
    ping.sys.promise_probe(host)
        .then(function (res) {
            console.log(res);
        });
});

hosts.forEach(function (host) {
    ping.sys.promise_probe(host, {
        timeout: 10,
        extra: ["-i 2"]
    }).then(function (res) {
            console.log(res);
        });
});
