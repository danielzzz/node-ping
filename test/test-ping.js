'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var os = require('os');
var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var events = require('events');

var loadFixturePath = require('./load-fixture-path');
var ping = require('..');

// Some constants
var ANSWER = require('./fixture/answer.json');

var PLATFORMS = [
    'window',
    'darwin',
    'freebsd',
    // 'aix',
    'android',
    'linux',
];
var PLATFORM_TO_EXTRA_ARGUMENTS = {
    window: ['-n', '2'],
    darwin: ['-c', '2'],
    freebsd: ['-c', '2'],
    android: ['-c', '2'],
    linux: ['-c', '2'],
};

var pathToAnswerKey = function (p) {
    var basename = path.posix.basename(p, '.txt');
    var dirname = path.posix.basename(path.posix.dirname(p));
    var osname = path.posix.basename(path.posix.dirname(path.posix.dirname(p)));

    return [osname, dirname, basename].join('_');
};

var mockOutSpawn = function (fp) {
    return function () {
        var fakeProcessEventEmitter = new events.EventEmitter();
        var stdoutEmitter = new events.EventEmitter();
        var stderrEmitter = new events.EventEmitter();

        fakeProcessEventEmitter.stdout = stdoutEmitter;
        fakeProcessEventEmitter.stderr = stderrEmitter;

        var s = fs.createReadStream(fp);
        s.on('data', function (fileContentsBuffer) {
            var fileContents = String(fileContentsBuffer);
            var lines = fileContents.split('\n');
            var normalizedLines = lines.map((line) => `${line}\n`);
            normalizedLines.forEach((line) => {
                var isSystemPingErrorMessage = line.startsWith('ping: ');

                var str2Buffer = Buffer.from ? (string) => Buffer.from(string, 'utf8') : (string) => new Buffer(string);
                var lineBuffer = str2Buffer(line);

                if (isSystemPingErrorMessage) {
                    stderrEmitter.emit('data', lineBuffer);
                } else {
                    stdoutEmitter.emit('data', lineBuffer);
                }
            });
        });
        s.on('close', function () {
            fakeProcessEventEmitter.emit('close', 0);
        });

        return fakeProcessEventEmitter;
    };
};

var createTestCase = function (platform, pingExecution) {
    var stubs = [];
    var fixturePaths = loadFixturePath(platform);

    describe(`On ${platform} platform`, function () {
        before(function () {
            stubs.push(
                sinon.stub(os, 'platform').callsFake(function () {
                    return platform;
                }),
            );
        });

        after(function () {
            stubs.forEach(function (stub) {
                stub.restore();
            });
        });

        describe('runs with default config', function () {
            fixturePaths.forEach(function (fp) {
                it(`Using |${pathToAnswerKey(fp)}|`, function () {
                    return pingExecution(fp);
                });
            });
        });

        describe('runs with custom config', function () {
            fixturePaths.forEach(function (fp) {
                it(`Using |${pathToAnswerKey(fp)}|`, function () {
                    return pingExecution(fp, {
                        timeout: 10,
                        extra: PLATFORM_TO_EXTRA_ARGUMENTS[platform],
                    });
                });
            });
        });

        describe('runs with custom config with default gone', function () {
            fixturePaths.forEach(function (fp) {
                it(`Using |${pathToAnswerKey(fp)}|`, function () {
                    return pingExecution(fp, {
                        timeout: false,
                        extra: PLATFORM_TO_EXTRA_ARGUMENTS[platform],
                    });
                });
            });
        });
    });
};

describe('ping reply from a different address', function () {
    describe('on linux platform', function() {
        beforeEach(function() {
            this.platformStub = sinon.stub(os, 'platform').callsFake(function() {
                return 'linux';
            });
            const fixturePath = path.join(__dirname, 'fixture', 'linux', 'en', 'sample_reply_from_different_address.txt');
            this.spawnStub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fixturePath));
        });

        afterEach(function() {
            this.platformStub.restore();
            this.spawnStub.restore();
        });

        it('host is not considered alive if ignoreDifferentAddressReply is true', async function() {
            const res = await ping.promise
                .probe('whatever', {
                    ignoreDifferentAddressReply: true,
                });
            expect(res.alive).to.be.false;
        });

        it('host is considered alive if ignoreDifferentAddressReply is false', async function() {
            const res = await ping.promise
                .probe('whatever', {
                    ignoreDifferentAddressReply: false,
                });
            expect(res.alive).to.be.true;
        });

        it('does not keep footer stats when every reply address is ignored', async function() {
            const res = await ping.promise
                .probe('whatever', {
                    ignoreDifferentAddressReply: true,
                });
            expect(res.alive).to.be.false;
            expect(res.packetLoss).to.equal('100.000');
            expect(res.time).to.equal('unknown');
            expect(res.times).to.deep.equal([]);
            expect(res.min).to.equal('unknown');
            expect(res.avg).to.equal('unknown');
            expect(res.max).to.equal('unknown');
            expect(res.stddev).to.equal('unknown');
        });

        ['sample1', 'sample2', 'v6_sample1', 'v6_sample2'].forEach(function (fixtureName) {
            it(`keeps replies and stats from the target address using ${fixtureName}`, async function () {
                const fixturePath = path.join(__dirname, 'fixture', 'linux', 'en', `${fixtureName}.txt`);
                this.spawnStub.callsFake(mockOutSpawn(fixturePath));

                const res = await ping.promise.probe('whatever', {
                    ignoreDifferentAddressReply: true,
                    v6: fixtureName.startsWith('v6'),
                });
                const expected = ANSWER[`linux_en_${fixtureName}`];
                expect({...res, output: res.output.trim()}).to.deep.equal({
                    ...expected,
                    output: expected.output.trim(),
                });
            });
        });
    });

    describe('on linux platform when the reply IP only contains the target as a substring', function() {
        afterEach(function() {
            this.platformStub.restore();
            this.spawnStub.restore();
        });

        var stubFixture = function (fixtureName) {
            this.platformStub = sinon.stub(os, 'platform').callsFake(function() {
                return 'linux';
            });
            const fixturePath = path.join(__dirname, 'fixture', 'ignore-address', fixtureName);
            this.spawnStub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fixturePath));
        };

        it('does not treat 18.8.8.8 as a reply for 8.8.8.8', async function() {
            stubFixture.call(this, 'reply_from_18.8.8.8.txt');
            const res = await ping.promise.probe('8.8.8.8', {
                ignoreDifferentAddressReply: true,
            });
            expect(res.alive).to.be.false;
        });

        it('does not treat 8.8.8.80 as a reply for 8.8.8.8', async function() {
            stubFixture.call(this, 'reply_from_8.8.8.80.txt');
            const res = await ping.promise.probe('8.8.8.8', {
                ignoreDifferentAddressReply: true,
            });
            expect(res.alive).to.be.false;
        });
    });
});

describe('ping timeout and deadline options', function () {
    describe('on linux platform', function () {
        beforeEach(function () {
            this.platformStub = sinon.stub(os, 'platform').callsFake(function () {
                return 'linux';
            });
            const fixturePath = path.join(__dirname, 'fixture', 'linux', 'en', 'sample1.txt');
            this.spawnStub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fixturePath));
        });

        afterEach(function () {
            this.platformStub.restore();
            this.spawnStub.restore();
        });

        it('are forwarded to the ping binary', function () {
            return ping.promise
                .probe('whatever', {
                    timeout: 47,
                    deadline: 83,
                })
                .then(
                    function () {
                        const spawnArgs = this.spawnStub.getCalls()[0].args;
                        const pingArgs = spawnArgs[1];
                        expect(pingArgs[pingArgs.indexOf('-W') + 1]).to.equal('47');
                        expect(pingArgs[pingArgs.indexOf('-w') + 1]).to.equal('83');
                    }.bind(this),
                );
        });
    });

    describe('on windows platform', function () {
        beforeEach(function () {
            this.platformStub = sinon.stub(os, 'platform').callsFake(function () {
                return 'window';
            });
            const fixturePath = path.join(__dirname, 'fixture', 'window', 'en', 'sample1.txt');
            this.spawnStub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fixturePath));
        });

        afterEach(function () {
            this.platformStub.restore();
            this.spawnStub.restore();
        });

        it('results in an error as deadline is not supported', function () {
            return ping.promise
                .probe('whatever', {
                    timeout: 47,
                    deadline: 83,
                })
                .then(function () {
                    throw new Error('deadline should result in an error');
                })
                .catch(function () { });
        });
    });

    describe('on mac platform', function () {
        beforeEach(function () {
            this.platformStub = sinon.stub(os, 'platform').callsFake(function () {
                return 'freebsd';
            });
            const fixturePath = path.join(__dirname, 'fixture', 'macos', 'en', 'sample1.txt');
            this.spawnStub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fixturePath));
        });

        afterEach(function () {
            this.platformStub.restore();
            this.spawnStub.restore();
        });

        it('are forwarded to the ping binary', function () {
            return ping.promise
                .probe('whatever', {
                    timeout: 47,
                    deadline: 83,
                })
                .then(
                    function () {
                        const spawnArgs = this.spawnStub.getCalls()[0].args;
                        const pingArgs = spawnArgs[1];
                        expect(pingArgs[pingArgs.indexOf('-W') + 1]).to.equal('47000');
                        expect(pingArgs[pingArgs.indexOf('-t') + 1]).to.equal('83');
                    }.bind(this),
                );
        });
    });
});

describe('Ping in callback mode', function () {
    var pingExecution = function (fp, args) {
        return new Promise(function (resolve, reject) {
            var stub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fp));

            var cb = function (isAlive, err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(isAlive);
                }
            };

            var _args = args;
            if (fp.includes('v6')) {
                _args = _args || {};
                _args.v6 = true;
            }

            ping.sys.probe('whatever', cb, _args);

            stub.restore();
        }).then(function (data) {
            var answerKey = pathToAnswerKey(fp);
            var actualData = data;
            var expectData = ANSWER[answerKey];
            var trimTraillingNewlineActualOutput = actualData.output.trim();
            var trimTraillingNewlineExpectOutput = expectData.output.trim();
            actualData.output = trimTraillingNewlineActualOutput;
            expectData.output = trimTraillingNewlineExpectOutput;
            expect(actualData).to.deep.equal(expectData);
        });
    };

    PLATFORMS.forEach(function (platform) {
        createTestCase(platform, pingExecution);
    });
});

describe('Ping in promise mode', function () {
    var pingExecution = function (fp, args) {
        var stub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fp));

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
            var trimTraillingNewlineActualOutput = actualData.output.trim();
            var trimTraillingNewlineExpectOutput = expectData.output.trim();
            actualData.output = trimTraillingNewlineActualOutput;
            expectData.output = trimTraillingNewlineExpectOutput;
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
    var fixturePaths = loadFixturePath(platform);

    before(function () {
        stubs.push(
            sinon.stub(os, 'platform').callsFake(function () {
                return platform;
            }),
        );
    });

    after(function () {
        stubs.forEach(function (stub) {
            stub.restore();
        });
    });

    describe('With timeout setting', function () {
        fixturePaths.forEach(function (fp) {
            it('Should raise an error', function (done) {
                var stub = sinon.stub(cp, 'spawn').callsFake(mockOutSpawn(fp));

                var ret = ping.promise.probe('whatever', {
                    v6: true,
                    timeout: 10,
                });

                stub.restore();

                ret.then(function () {
                    done(new Error('It should not be success'));
                }).catch(function (err) {
                    expect(err.message).to.be.a('string');
                    expect(err.message).to.include('no timeout option');
                    done();
                });
            });
        });
    });
});

describe('Ping in promise mode with unknown exception', function () {
    var pingExecution = function (fp, args) {
        var unknownException = new Error('Unknown error!');
        var stub = sinon.stub(cp, 'spawn').throws(unknownException);

        var ret = null;
        var _args = args;
        if (fp.includes('v6')) {
            _args = _args || {};
            _args.v6 = true;
        }
        ret = ping.promise.probe('whatever', _args);

        stub.restore();

        return ret.catch(function (err) {
            expect(err.message).to.be.a('string');
            expect(err.message).to.include('Unknown error!');
        });
    };

    PLATFORMS.forEach(function (platform) {
        createTestCase(platform, pingExecution);
    });
});
