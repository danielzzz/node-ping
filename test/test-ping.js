/* global describe it before after*/
'use strict'
var expect = require('chai').expect
var sinon = require('sinon')
var cp = require('child_process')
var os = require('os')
var events = require('events')
var ping = require('..')

var windows_output = "\n\
Pinging www.some-domain.com [127.0.0.1] with 32 bytes of\n\
\n\
Reply from 127.0.0.1: bytes=32 time=564ms TTL=237\n\
Reply from 127.0.0.1: bytes=32 time=555ms TTL=237\n\
Reply from 127.0.0.1: bytes=32 time=554ms TTL=237\n\
Reply from 127.0.0.1: bytes=32 time=548ms TTL=237\n\
\n\
Ping statistics for 127.0.0.1:\n\
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)\n\
Approximate round trip times in milli-seconds:\n\
Minimum = 548ms, Maximum = 564ms, Average = 555ms\n\
"

var emitter = new events.EventEmitter()
emitter.stdout = emitter

function fakePing () {
  windows_output.split('\n').forEach(function (line) {
    emitter.emit('data', line)
  })
  emitter.emit('close', 0)
}

describe('Ping', function () {
  var host = '127.0.0.1'
  describe('runs in callback mode', function () {
    it('plain pings ' + host, function (done) {
      ping.sys.probe(host, function (isAlive) {
        expect(isAlive).to.be.true
        done()
      })
    })
    it('pings ' + host + ' with custom config', function (done) {
      ping.sys.probe(host, function (isAlive) {
        expect(isAlive).to.be.true
        done()
      }, {extra: ['-i 2']})
    })
    it('pings ' + host + ' with some default argument gone', function (done) {
      ping.sys.probe(host, function (isAlive) {
        expect(isAlive).to.be.true
        done()
      }, {extra: ['-i 2'], timeout: false})
    })
  })
  describe('runs in promise mode', function () {
    it('plain pings ' + host, function () {
      var promise = ping.promise.probe(host)
          .then(function (res) {
            expect(res.alive).to.be.true
            expect(res.time).to.be.above(0)
            expect(res.host).to.equal(host)
            expect(res.output).to.not.be.empty
          })
      fakePing()
      return promise
    })
    it('pings ' + host + ' with custom config', function () {
      var promise = ping.promise.probe(host, {
        timeout: 10,
        extra: ['-i 2']
      }).then(function (res) {
        expect(res.alive).to.be.true
        expect(res.time).to.be.above(0)
        expect(res.host).to.equal(host)
        expect(res.output).to.not.be.empty
      })
      fakePing()
      return promise
    })
    it('pings ' + host + ' with some default argument gone', function () {
      var promise = ping.promise.probe(host, {
        timeout: false,
        extra: ['-i 2']
      }).then(function (res) {
        expect(res.alive).to.be.true
        expect(res.time).to.be.above(0)
        expect(res.host).to.equal(host)
        expect(res.output).to.not.be.empty
      })
      fakePing()
      return promise
    })
  })
  describe('runs in a simulated Windows environment', function () {
    // Pretend we're in Windows to test windows-specific features
    before(function () {
      this.stubs = [
        sinon.stub(cp, 'spawn', function () { return emitter }),
        sinon.stub(os, 'platform', function () { return 'windows' })
      ]
    })
    after(function () {
      this.stubs.forEach(function (stub) {
        stub.restore()
      })
    })
    it('plain pings ' + host, function () {
      var promise = ping.promise.probe(host)
          .then(function (res) {
            expect(res.alive).to.be.true
            expect(res.time).to.equal(564)
            expect(res.host).to.equal(host)
            expect(res.output).to.not.be.empty
          })
      fakePing()
      return promise
    })
    it('pings ' + host + ' with custom config', function () {
      var promise = ping.promise.probe(host, {
        timeout: 10,
        extra: ['-i 2']
      }).then(function (res) {
        expect(res.alive).to.be.true
        expect(res.time).to.equal(564)
        expect(res.host).to.equal(host)
        expect(res.output).to.not.be.empty
      })
      fakePing()
      return promise
    })
    it('pings ' + host + ' with some default argument gone', function () {
      var promise = ping.promise.probe(host, {
        timeout: false,
        extra: ['-i 2']
      }).then(function (res) {
        expect(res.alive).to.be.true
        expect(res.time).to.equal(564)
        expect(res.host).to.equal(host)
        expect(res.output).to.not.be.empty
      })
      fakePing()
      return promise
    })
  })
})
