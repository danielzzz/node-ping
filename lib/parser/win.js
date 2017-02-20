'use strict';

var util = require('util');
var __ = require('underscore');

var base = require('./base');

/**
 * @constructor
 */
function WinParser() {
    base.call(this);
    this._ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
}

util.inherits(WinParser, base);

/**
 * Process output's header
 * @param {string} line - A line from system ping
 */
WinParser.prototype._processHeader = function (line) {
    // Get host and numeric_host
    var tokens = line.split(' ');

    this._response.host = tokens[1];
    if (this._ipv4Regex.test(this._response.host)) {
        this._response.numeric_host = tokens[1];
    } else {
        this._response.numeric_host = tokens[2].slice(1, -1);
    }

    this._changeState(this.STATES.BODY);
};

/**
 * Process output's body
 * @param {string} line - A line from system ping
 */
WinParser.prototype._processBody = function (line) {
    var tokens = line.split(' ');
    var kvps = __.filter(tokens, function (token) {
        // Sometime it shows <1ms
        return token.indexOf('=') >= 0 || token.indexOf('<') >= 0;
    });

    // kvps.length >= 3 means target is pingable
    if (kvps.length >= 3) {
        // XXX: Assume time will alaways get keyword ms for all language
        var timeKVP = __.find(kvps, function (kvp) {
            return kvp.indexOf('ms') >= 0;
        });
        var regExp = /([0-9\.]+)/;
        var match = regExp.exec(timeKVP);

        this._times.push(parseFloat(match[1], 10));
    }

    // Change state if it see a ':' at the end
    if (line.slice(-1) === ':') {
        this._changeState(this.STATES.FOOTER);
    }
};

/**
 * Process output's footer
 * @param {string} line - A line from system ping
 */
WinParser.prototype._processFooter = function (line) {
    // XXX: Assume there is a keyword ms
    if (line.indexOf('ms') >= 0) {
        // XXX: Assume the ordering is Min Max Avg
        var regExp = /([0-9\.]+)/g;
        var m1 = regExp.exec(line);
        var m2 = regExp.exec(line);
        var m3 = regExp.exec(line);

        if (__.all([m1, m2, m3])) {
            this._response.min = parseFloat(m1[1], 10);
            this._response.max = parseFloat(m2[1], 10);
            this._response.avg = parseFloat(m3[1], 10);
            this._changeState(this.STATES.END);
        }
    }
};

module.exports = WinParser;
