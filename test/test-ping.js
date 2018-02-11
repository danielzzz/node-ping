'use strict';
/* global describe it before after*/
/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect;
var sinon = require('sinon');
var os = require('os');
var cp = require('child_process');
var q = require('q');
var fs = require('fs');
var path = require('path');
var util = require('util');
var events = require('events');

var loadFixturePath = require('./load-fixture-path');
var ping = require('..');

// Some constants
var ANSWER = require('./fixture/answer');
var PLATFORMS = [
    'window',
    'darwin',
    'freebsd',
    // 'aix',
    'linux',
];
var PLATFORM_TO_EXTRA_ARGUMENTS = {
    window: ['-n', '2'],
    darwin: ['-c', '2'],
    freebsd: ['-c', '2'],
    linux: ['-c', '2'],
};

var pathToAnswerKey = function (p) {
    var basename = path.posix.basename(p, '.txt');
    var dirname = path.posix.basename(path.posix.dirname(p));
    var osname = path.posix.basename(
        path.posix.dirname(path.posix.dirname(p))
    );

    return [osname, dirname, basename].join('_');
};

var mockOutSpawn = function (fp) {
    return function () {
        var e = new events.EventEmitter();
        e.stdout = e;

        var s = fs.createReadStream(fp);
        s.on('data', function (line) {
            e.emit('data', line);
        });
        s.on('close', function () {
            e.emit('close', 0);
        });

        return e;
    };
};

var createTestCase = function (platform, pingExecution) {
    var stubs = [];

    describe(util.format('On %s platform', platform), function () {
        var fixturePaths = loadFixturePath(platform);

        before(function () {
            stubs.push(
                sinon.stub(os, 'platform', function () { return platform; })
            );
        });

        after(function () {
            stubs.forEach(function (stub) {
                stub.restore();
            });
        });

        describe('runs with default config', function () {
            fixturePaths.forEach(function (fp) {
                it(
                    util.format('Using |%s|', pathToAnswerKey(fp)),
                    function () {
                        return pingExecution(fp);
                    }
                );
            });
        });

        describe('runs with custom config', function () {
            fixturePaths.forEach(function (fp) {
                it(
                    util.format('Using |%s|', pathToAnswerKey(fp)),
                    function () {
                        return pingExecution(fp, {
                            timeout: 10,
                            extra: PLATFORM_TO_EXTRA_ARGUMENTS[platform],
                        });
                    }
                );
            });
        });

        describe('runs with custom config with default gone', function () {
            fixturePaths.forEach(function (fp) {
                it(
                    util.format('Using |%s|', pathToAnswerKey(fp)),
                    function () {
                        return pingExecution(fp, {
                            timeout: false,
                            extra: PLATFORM_TO_EXTRA_ARGUMENTS[platform],
                        });
                    }
                );
            });
        });
    });
};

describe('Ping in callback mode', function () {
    var pingExecution = function (fp, args) {
        var deferred = q.defer();

        var stub = sinon.stub(
            cp,
            'spawn',
            mockOutSpawn(fp)
        );

        var cb = function (isAlive, err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(isAlive);
            }
        };

        var _args = args;
        if (fp.includes('v6')) {
            _args = _args || {};
            _args.v6 = true;
        }

        ping.sys.probe('whatever', cb, _args);

        stub.restore();

        return deferred.promise.then(function (data) {
            var answerKey = pathToAnswerKey(fp);
            var actualIsAlive = data;
            var expectIsAlive = ANSWER[answerKey].alive;
            expect(actualIsAlive).to.equal(expectIsAlive);
        });
    };

    PLATFORMS.forEach(function (platform) {
        createTestCase(platform, pingExecution);
    });
});

describe('Ping in promise mode', function () {
    var pingExecution = function (fp, args) {
        var stub = sinon.stub(
            cp,
            'spawn',
            mockOutSpawn(fp)
        );

        var ret = null;
        var _args = args;
        if (fp.includes('v6')) {
            _args = _args || {};
            _args.v6 = true;
        }
        ret = ping.promise.probe('whatever', _args);

        stub.restore();

        return ret.then(function (data) {
            var answerKey = pathToAnswerKey(fp);
            var actualData = data;
            var expectData = ANSWER[answerKey];
            expect(actualData).to.deep.equal(expectData);
        });
    };

    PLATFORMS.forEach(function (platform) {
        createTestCase(platform, pingExecution);
    });
});

describe('Ping ipv6 on MAC OS', function () {
    var platform = 'darwin';
    var stubs = [];

    before(function () {
        stubs.push(
            sinon.stub(os, 'platform', function () { return platform; })
        );
    });

    after(function () {
        stubs.forEach(function (stub) {
            stub.restore();
        });
    });

    describe('With timeout setting', function () {
        var fixturePaths = loadFixturePath(platform);

        fixturePaths.forEach(function (fp) {
            it('Should raise an error', function (done) {
                var stub = sinon.stub(
                    cp,
                    'spawn',
                    mockOutSpawn(fp)
                );

                var ret = ping.promise.probe(
                    'whatever',
                    {v6: true, timeout: 10}
                );

                stub.restore();

                return ret.then(function () {
                    throw new Error('It should not be success');
                }).catch(function (err) {
                    expect(err.message).to.be.a('string');
                    expect(err.message).to.include('no timeout option');
                    done();
                });
            });
        });
    });
});
