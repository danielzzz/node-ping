'use strict';

/* eslint no-unused-vars: 0 */

/**
 * Parsed response
 * @typedef {object} PingResponse
 * @property  {string} inputHost - The input IP address or HOST
 * @property  {string} host - The input IP address or HOST
 * @property  {string} numeric_host - Target IP address
 * @property  {boolean} alive - True for existed host
 * @property  {string} output - Raw stdout from system ping
 * @property  {number} time - Time (float) in ms for first successful ping response
 * @property  {string} min - Minimum time for collection records
 * @property  {string} max - Maximum time for collection records
 * @property  {string} avg - Average time for collection records
 * @property  {number} packetLoss - Packet Losses in percent (number)
 * @property  {string} stddev - Standard deviation time for collected records
 */

/**
 * Base parser for ping output
 * @module ping/parser/base
 * @exports Parser
 */

/**
 * Parser constructor
 * @class Parser
 * @param {string} addr - Hostname or ip addres
 * @param {import('../index').PingConfig} config - Config object in probe()
 */
function Parser(addr, config) {
    // Initial state is 0
    this._state = 0;

    /**
     * Initial cache for response
     * @type {PingResponse}
     */
    this._response = {
        inputHost: addr,
        host: 'unknown',
        alive: false,
        output: 'unknown',
        time: 'unknown',
        times: [],
        min: 'unknown',
        max: 'unknown',
        avg: 'unknown',
        stddev: 'unknown',
        packetLoss: 'unknown',
    };

    // Initial times storage for ping time
    this._times = [];

    // Initial lines storage for ping output
    this._lines = [];

    // strip string regexp
    this._stripRegex = /[ ]*\r?\n?$/g;

    // Ping Config
    this._pingConfig = config || {};
}

/**
 * Enum for parser states
 * @readonly
 * @enum {number}
 */
Parser.STATES = {
    INIT: 0,
    HEADER: 1,
    BODY: 2,
    FOOTER: 3,
    END: 4,
};

/**
 * Change state of this parser
 * @param {number} state - parser.STATES
 * @return {Parser} - This instance
 */
Parser.prototype._changeState = function (state) {
    // var states = Object.values(Parser.STATES); // If minimum engine version can be raised to >=7.0.0 in package.json
    var states = Object.keys(Parser.STATES).map(function (key) { return Parser.STATES[key]; }, this);
    if (states.indexOf(state) < 0) {
        throw new Error('Unknown state');
    }

    this._state = state;

    return this;
};

/**
 * Process output's header
 * @param {string} line - A line from system ping
 */
Parser.prototype._processHeader = function (line) {
    throw new Error('Subclass should implement this method');
};

/**
 * Process output's body
 * @param {string} line - A line from system ping
 */
Parser.prototype._processBody = function (line) {
    throw new Error('Subclass should implement this method');
};

/**
 * Process output's footer
 * @param {string} line - A line from system ping
 */
Parser.prototype._processFooter = function (line) {
    throw new Error('Subclass should implement this method');
};

/**
 * Process a line from system ping
 * @param {string} line - A line from system ping
 * @return {Parser} - This instance
 */
Parser.prototype.eat = function (line) {
    var headerStates = [Parser.STATES.INIT, Parser.STATES.HEADER];

    // Store lines
    this._lines.push(line);

    // Strip all space \r\n at the end
    var _line = line.replace(this._stripRegex, '');

    if (_line.length === 0) {
        // Do nothing if this is an empty line
    } else if (headerStates.indexOf(this._state) >= 0) {
        this._processHeader(_line);
    } else if (this._state === Parser.STATES.BODY) {
        this._processBody(_line);
    } else if (this._state === Parser.STATES.FOOTER) {
        this._processFooter(_line);
    } else if (this._state === Parser.STATES.END) {
        // Do nothing
    } else {
        throw new Error('Unknown state');
    }

    return this;
};

/**
 * Get results after parsing certain lines from system ping
 * @return {PingResponse} - Response from parsing ping output
 */
Parser.prototype.getResult = function () {
    var ret = Object.assign({}, this._response);

    // Concat output
    ret.output = this._lines.join('\n');

    // Determine alive
    ret.alive = this._times.length > 0;

    // Update time at first successful line
    if (ret.alive) {
        this._response.time = this._times[0];
        ret.time = this._response.time;
        this._response.times = this._times;
        ret.times = this._response.times;
    }

    // Get stddev
    if (ret.stddev === 'unknown' && ret.alive) {
        var numberOfSamples = this._times.length;

        var sumOfAllSquareDifferences = this._times.reduce(
            function (memory, time) {
                var differenceFromMean = time - ret.avg;
                var squaredDifference = differenceFromMean * differenceFromMean;
                return memory + squaredDifference;
            },
            0,
        );
        var variances = sumOfAllSquareDifferences / numberOfSamples;

        ret.stddev = Math.round(Math.sqrt(variances) * 1000) / 1000;
    }

    // Fix min, avg, max, stddev up to 3 decimal points
    ['min', 'avg', 'max', 'stddev', 'packetLoss'].forEach(function (key) {
        var v = ret[key];
        if (typeof v === 'number') {
            ret[key] = v.toFixed(3);
        }
    });

    return ret;
};

module.exports = Parser;
