export = Parser;
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
declare function Parser(addr: string, config: import("../index").PingConfig): void;
declare class Parser {
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
    constructor(addr: string, config: import("../index").PingConfig);
    _state: number;
    /**
     * Initial cache for response
     * @type {PingResponse}
     */
    _response: PingResponse;
    _times: any[];
    _lines: any[];
    _stripRegex: RegExp;
    _pingConfig: import("../index").PingConfig;
    /**
     * Change state of this parser
     * @param {number} state - parser.STATES
     * @return {Parser} - This instance
     */
    _changeState(state: number): Parser;
    /**
     * Process output's header
     * @param {string} line - A line from system ping
     */
    _processHeader(line: string): never;
    /**
     * Process output's body
     * @param {string} line - A line from system ping
     */
    _processBody(line: string): never;
    /**
     * Process output's footer
     * @param {string} line - A line from system ping
     */
    _processFooter(line: string): never;
    /**
     * Process a line from system ping
     * @param {string} line - A line from system ping
     * @return {Parser} - This instance
     */
    eat(line: string): Parser;
    /**
     * Get results after parsing certain lines from system ping
     * @return {PingResponse} - Response from parsing ping output
     */
    getResult(): PingResponse;
}
declare namespace Parser {
    export { STATES, PingResponse };
}
declare namespace STATES {
    let INIT: number;
    let HEADER: number;
    let BODY: number;
    let FOOTER: number;
    let END: number;
}
/**
 * Enum for parser states
 */
type STATES = number;
/**
 * Parsed response
 */
type PingResponse = {
    /**
     * - The input IP address or HOST
     */
    inputHost: string;
    /**
     * - The input IP address or HOST
     */
    host: string;
    /**
     * - Target IP address
     */
    numeric_host: string;
    /**
     * - True for existed host
     */
    alive: boolean;
    /**
     * - Raw stdout from system ping
     */
    output: string;
    /**
     * - Time (float) in ms for first successful ping response
     */
    time: number;
    /**
     * - Minimum time for collection records
     */
    min: string;
    /**
     * - Maximum time for collection records
     */
    max: string;
    /**
     * - Average time for collection records
     */
    avg: string;
    /**
     * - Packet Losses in percent (number)
     */
    packetLoss: number;
    /**
     * - Standard deviation time for collected records
     */
    stddev: string;
};
//# sourceMappingURL=base.d.ts.map