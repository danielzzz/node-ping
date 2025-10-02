# NODE-PING ![Workflow Status](https://github.com/danielzzz/node-ping/actions/workflows/build-test-coverage.yml/badge.svg)

a ping wrapper for nodejs

@last-modified: 2025-09-29

# License MIT

(C) Daniel Zelisko

http://github.com/danielzzz/node-ping

# Description

node-ping is a simple wrapper for the system ping utility.

# Installation

npm install ping

Notes:

* Although it is marked with node >=22, it should technially working in all node version for production purpose. The version is marked for development point of view

# Usage

Below are examples extracted from `examples`

## Tradition calls

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});
```

## Tradition calls with configuration

```js
var cfg = {
    timeout: 10,
    // WARNING: -i 2 may not work in other platform like windows
    extra: ['-i', '2'],
};

hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    }, cfg);
});
```

## Promise wrapper

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (res) {
            console.log(res);
        });
});
```

## Promise Wrapper with configurable ping options

```js
hosts.forEach(function (host) {
    // WARNING: -i 2 argument may not work in other platform like windows
    ping.promise.probe(host, {
        timeout: 10,
        extra: ['-i', '2'],
    }).then(function (res) {
        console.log(res);
    });
});
```


## Async-Await

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

for(let host of hosts){
    let res = await ping.promise.probe(host);
    console.log(res);
}
```

## Async-Await with configurable ping options

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

for(let host of hosts){
     // WARNING: -i 2 argument may not work in other platform like windows
    let res = await ping.promise.probe(host, {
           timeout: 10,
           extra: ['-i', '2'],
       });
    console.log(res);
}
```
### Support configuration

See `PingConfig` in `types/index.d.ts`

### Output specification

* For callback based implementation:

See `probeCallback` in `types/ping-sys.d.ts`

* For promise based implementation

See `PingResponse` in `types/ping-promise.d.ts`

#### Note

* Since `ping` in this module relies on the `ping` from underlying platform,
arguments in `PingConfig.extra` will definitely be varied across different
platforms.

* However, `numeric`, `timeout` and `min_reply` have been abstracted. Values for
them are expected to be cross platform.

* By setting `numeric`, `timeout` or `min_reply` to false, you can run `ping`
without corresponding arguments.

# FAQ

* It does not work with busybox's ping implemetation [#89](https://github.com/danielzzz/node-ping/issues/89)

Try to install package `iputils`. For example, running `apk add iputils`

* For questions regarding to the implementation of `timeout`, and `deadline`, please checkout discussions in
  [#101](https://github.com/danielzzz/node-ping/issues/101)

* For questions regarding to the defintions of `host`, `inputHost`, and `numeric_host`, please checkout
  discussions in [#133](https://github.com/danielzzz/node-ping/issues/133)

# Contributing

Before opening a pull request please make sure your changes follow the
[contribution guidelines][1].

[1]: https://github.com/danielzzz/node-ping/blob/master/CONTRIBUTING.md


# Contributors
<a href="https://github.com/danielzzz/node-ping/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=danielzzz/node-ping" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
