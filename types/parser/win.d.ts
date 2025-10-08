export = WinParser;
/**
 * @module ping/parser/win
 */
/**
 * @class WinParser
 * @param {string} addr - Hostname or ip addres
 * @param {import('../index').PingConfig} config - Config object in probe()
 */
declare function WinParser(addr: string, config: import("../index").PingConfig): void;
declare class WinParser {
    /**
     * @module ping/parser/win
     */
    /**
     * @class WinParser
     * @param {string} addr - Hostname or ip addres
     * @param {import('../index').PingConfig} config - Config object in probe()
     */
    constructor(addr: string, config: import("../index").PingConfig);
    _ipv4Regex: RegExp;
    /**
     * Process output's header
     * @param {string} line - A line from system ping
     */
    _processHeader(line: string): void;
    /**
     * Process ipv6 output's body
     * @param {string} line - A line from system ping
     */
    _processIPV6Body(line: string): void;
    /**
     * Process ipv4 output's body
     * @param {string} line - A line from system ping
     */
    _processIPV4Body(line: string): void;
    /**
     * Process output's body
     * @param {string} line - A line from system ping
     */
    _processBody(line: string): void;
    /**
     * Process output's footer
     * @param {string} line - A line from system ping
     */
    _processFooter(line: string): void;
}
//# sourceMappingURL=win.d.ts.map