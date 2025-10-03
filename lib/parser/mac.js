'use strict';

var util = require('util');
var base = require('./base');
const {getFloatOrUnknown} = require('../utils');

/**
 * @module ping/parser/mac
 */

/**
 * @class MacParser
 * @param {string} addr - Hostname or ip addres
 * @param {import('../index').PingConfig} config - Config object in probe()
 */
function MacParser(addr, config) {
    base.call(this, addr, config);
}

util.inherits(MacParser, base);

/**
 * Process output's header
 * @param {string} line - A line from system ping
 */
MacParser.prototype._processHeader = function (line) {
    // Get host and numeric_host
    var tokens = line.split(' ');

    this._response.host = tokens[1];
    this._response.numeric_host = tokens[2].slice(1, -2);

    this._changeState(base.STATES.BODY);
};

/**
 * Process output's body
 * @param {string} line - A line from system ping
 */
MacParser.prototype._processBody = function (line) {
    // XXX: Assume there is at least 3 '=' can be found
    var count = (line.match(/=/g) || []).length;
    if (count >= 3) {
        var regExp = /([0-9.]+)[ ]*ms/;
        var match = regExp.exec(line);
        this._times.push(getFloatOrUnknown(match[1]));
    }

    // Change state if it see a '---'
    if (line.indexOf('---') >= 0) {
        this._changeState(base.STATES.FOOTER);
    }
};

/**
 * Process output's footer
 * @param {string} line - A line from system ping
 */
MacParser.prototype._processFooter = function (line) {
    var packetLoss = line.match(/ ([\d.]+(\.?[\d]*))%/);
    if (packetLoss) {
        this._response.packetLoss = getFloatOrUnknown(packetLoss[1]);
    }

    // XXX: Assume number of keywords '/' more than 3
    var count = (line.match(/[/]/g) || []).length;
    if (count >= 3) {
        var regExp = /(([0-9.]+)|nan)/g;
        // XXX: Assume min avg max stddev
        var m1 = regExp.exec(line);
        var m2 = regExp.exec(line);
        var m3 = regExp.exec(line);
        var m4 = regExp.exec(line);

        if (m1 && m2 && m3 && m4) {
            this._response.min = getFloatOrUnknown(m1[1]);
            this._response.avg = getFloatOrUnknown(m2[1]);
            this._response.max = getFloatOrUnknown(m3[1]);
            this._response.stddev = getFloatOrUnknown(m4[1]);
            this._changeState(base.STATES.END);
        }

        this._changeState(base.STATES.END);
    }
};

module.exports = MacParser;
