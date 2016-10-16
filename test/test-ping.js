'use strict';
/* global describe it before after*/
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;
var sinon = require('sinon');
var cp = require('child_process');
var os = require('os');
var events = require('events');
var util = require('util');

var ping = require('..');

var windowOutput = [
    'Pinging www.some-domain.com [127.0.0.1] with 32 bytes of',
    '',
    'Reply from 127.0.0.1: bytes=32 time=564ms TTL=237',
    'Reply from 127.0.0.1: bytes=32 time=555ms TTL=237',
    'Reply from 127.0.0.1: bytes=32 time=554ms TTL=237',
    'Reply from 127.0.0.1: bytes=32 time=548ms TTL=237',
    'Ping statistics for 127.0.0.1:',
    'Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
    'Approximate round trip times in milli-seconds:',
    'Minimum = 548ms, Maximum = 564ms, Average = 555ms',
].join('\n');

var emitter = new events.EventEmitter();
emitter.stdout = emitter;

function fakePing() {
    windowOutput.split('\n').forEach(function (line) {
        emitter.emit('data', line);
    });
    emitter.emit('close', 0);
}

describe('Ping', function () {
    var host = '127.0.0.1';

    describe('runs in callback mode', function () {
        it(util.format('plain pings %s', host), function (done) {
            ping.sys.probe(host, function (isAlive) {
                expect(isAlive).to.be.true;
                done();
            });
        });

        it(
            util.format(
                'pings %s with custom config',
                host
            ),
            function (done) {
                ping.sys.probe(host, function (isAlive) {
                    expect(isAlive).to.be.true;
                    done();
                }, {extra: ['-i 2']});
            }
        );

        it(
            util.format(
                'pings %s with some default argument gone',
                host
            ),
            function (done) {
                ping.sys.probe(host, function (isAlive) {
                    expect(isAlive).to.be.true;
                    done();
                }, {extra: ['-i 2'], timeout: false});
            }
        );
    });

    describe('runs in promise mode', function () {
        it(
            util.format('plain pings %s', host),
            function () {
                var promise = ping.promise.probe(host)
                .then(function (res) {
                    expect(res.alive).to.be.true;
                    expect(res.time).to.be.above(0);
                    expect(res.max).to.be.above(0);
                    expect(res.min).to.be.above(0);
                    expect(res.stddev).to.be.equal(0);
                    expect(res.host).to.equal(host);
                    expect(res.output).to.not.be.empty;
                });
                fakePing();
                return promise;
            }
        );

        it(util.format('pings %s with custom config', host), function () {
            var promise = ping.promise.probe(host, {
                timeout: 10,
                extra: ['-i 2'],
            }).then(function (res) {
                expect(res.alive).to.be.true;
                expect(res.time).to.be.above(0);
                expect(res.host).to.equal(host);
                expect(res.output).to.not.be.empty;
            });
            fakePing();
            return promise;
        });

        it(
            util.format(
                'pings %s with some default argument gone',
                host
            ),
            function () {
                var promise = ping.promise.probe(host, {
                    timeout: false,
                    extra: ['-i 2'],
                }).then(function (res) {
                    expect(res.alive).to.be.true;
                    expect(res.time).to.be.above(0);
                    expect(res.host).to.equal(host);
                    expect(res.output).to.not.be.empty;
                });
                fakePing();
                return promise;
            }
        );
    });

    describe('runs in a simulated Windows environment', function () {
        // Pretend we're in Windows to test windows-specific features
        before(function () {
            this.stubs = [
                sinon.stub(cp, 'spawn', function () { return emitter; }),
                sinon.stub(os, 'platform', function () { return 'windows'; }),
            ];
        });

        after(function () {
            this.stubs.forEach(function (stub) {
                stub.restore();
            });
        });

        it(util.format('plain pings %s', host), function () {
            var promise = ping.promise.probe(host).then(function (res) {
                expect(res.alive).to.be.true;
                expect(res.time).to.equal(564);
                expect(res.host).to.equal(host);
                expect(res.output).to.not.be.empty;
            });
            fakePing();
            return promise;
        });

        it(
            util.format('pings %s with custom config', host),
            function () {
                var promise = ping.promise.probe(host, {
                    timeout: 10,
                    extra: ['-i 2'],
                }).then(function (res) {
                    expect(res.alive).to.be.true;
                    expect(res.time).to.equal(564);
                    expect(res.host).to.equal(host);
                    expect(res.output).to.not.be.empty;
                });
                fakePing();
                return promise;
            }
        );

        it(
            util.format('pings %s with some default argument gone', host),
            function () {
                var promise = ping.promise.probe(host, {
                    timeout: false,
                    extra: ['-i 2'],
                }).then(function (res) {
                    expect(res.alive).to.be.true;
                    expect(res.time).to.equal(564);
                    expect(res.host).to.equal(host);
                    expect(res.output).to.not.be.empty;
                });
                fakePing();
                return promise;
            }
        );
    });
});
