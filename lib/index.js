'use strict';

/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} [numeric] - Map IP address to hostname or not
 * @property {number} [timeout] - Time to wait for a response, in seconds.
 * The option affects only timeout  in  absence  of any responses,
 * otherwise ping waits for two RTTs.
 * @property {number} [deadline] - Specify a timeout, in seconds,
 * before ping exits regardless of how many packets have been sent or received.
 * In this case ping does not stop after count packet are sent,
 * it waits either for deadline expire or until count probes are answered
 * or for some error notification from network.
 * This option is only available on linux and mac.
 * @property {number} [min_reply] - Exit after sending number of ECHO_REQUEST
 * @property {boolean} [v6] - Use IPv4 (default) or IPv6
 * @property {string} [sourceAddr] - source address for sending the ping
 * @property {number} [packetSize] - Specifies the number of data bytes to be sent
 *                                 Default: Linux / MAC: 56 Bytes,
 *                                          Window: 32 Bytes
 * @property {string[]} [extra] - Optional options does not provided
 */

var ping = {};

ping.sys = require('./ping-sys');
// ping.pcap = require('./lib/ping-pcap');
ping.promise = require('./ping-promise');

module.exports = ping;
