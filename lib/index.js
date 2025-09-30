'use strict';

var ping = {};

ping.sys = require('./ping-sys');
// ping.pcap = require('./lib/ping-pcap');
ping.promise = require('./ping-promise');

module.exports = ping;
