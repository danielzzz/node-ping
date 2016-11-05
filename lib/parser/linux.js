'use strict';

var util = require('util');
var base = require('./base');
var MacParser = require('./mac');

/**
 * @constructor
 */
function LinuxParser() {
    base.call(this);
}

util.inherits(LinuxParser, base);

/**
 * Process output's body
 * @param {string} line - A line from system ping
 */
LinuxParser.prototype._processHeader = function (line) {
    // Get host and numeric_host
    var tokens = line.split(' ');

    this._response.host = tokens[1];
    this._response.numeric_host = tokens[2].slice(1, -1);

    this._changeState(this.STATES.BODY);
};

/**
 * Process output's body
 * @param {string} line - A line from system ping
 */
LinuxParser.prototype._processBody = function (line) {
    // Reuse mac parser implementation
    MacParser.prototype._processBody.call(this, line);
};

/**
 * Process output's footer
 * @param {string} line - A line from system ping
 */
LinuxParser.prototype._processFooter = function (line) {
    // Reuse mac parser implementation
    MacParser.prototype._processFooter.call(this, line);
};

module.exports = LinuxParser;
